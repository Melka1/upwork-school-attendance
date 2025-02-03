/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  CircularProgress,
  FormControl,
  Input,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Card from "./Card";
import {
  createStudents,
  setIsAddStudentModalOpen,
} from "../lib/feature/studentsSlice";
import Loading from "./Loading";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ProfileImage from "../assets/images/Profile.png";
import { uploadImage } from "@/firebase/storage";

interface StudentInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  classroom?: string;
  location?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhoneNumber?: string;
  emergencyContact?: string;
  medicalInfo?: string;
  profilePicUrl?: string;
}

function AddStudentFormModal() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const [studentInfo, setStudentInfo] = useState<StudentInput>({});
  const classrooms = useAppSelector((state) => state.classroomSlice.classrooms);
  const { isAddStudentModalOpen: isModalOpen, mutationStatus } = useAppSelector(
    (state) => state.studentSlice
  );
  const [isDisabled, setIsDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const isValidated = validateInput();
    console.log(isValidated);

    setIsDisabled(!isValidated);
  }, [
    studentInfo?.name,
    studentInfo?.email,
    studentInfo?.phoneNumber,
    studentInfo?.classroom,
    studentInfo?.location,
    studentInfo?.parentEmail,
    studentInfo?.parentName,
    studentInfo?.parentPhoneNumber,
    studentInfo?.medicalInfo,
    studentInfo?.emergencyContact,
  ]);

  const validateInput = () => {
    const {
      name,
      email,
      phoneNumber,
      classroom,
      location,
      parentName,
      parentEmail,
      parentPhoneNumber,
      emergencyContact,
      medicalInfo,
    } = studentInfo;

    console.log(studentInfo);

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !classroom ||
      !location ||
      !parentName ||
      !parentEmail ||
      !parentPhoneNumber ||
      !emergencyContact ||
      !medicalInfo
    ) {
      return false;
    }
    return true;
  };

  const handleAddStudent = async () => {
    const {
      name,
      email,
      phoneNumber,
      classroom,
      location,
      parentName,
      parentEmail,
      parentPhoneNumber,
      emergencyContact,
      medicalInfo,
    } = studentInfo;

    const isValid = validateInput();
    if (!isValid) return;

    const profileImageUrl = await uploadImage({ file });

    dispatch(
      createStudents({
        name,
        email,
        imageUrl: profileImageUrl as string,
        phoneNumber,
        location,
        classroom: classrooms.find((c) => c.name == classroom).id,
        parent: {
          name: parentName,
          email: parentEmail,
          phoneNumber: parentPhoneNumber,
        },
        emergencyContact: [emergencyContact],
        medicalInfo: [medicalInfo],
      })
    ).then(() => {
      dispatch(setIsAddStudentModalOpen(false));
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Card className="max-h-[90vh] min-h-[40vh] min-w-[50vw] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Typography component="h2" variant="h4">
          {t("addStudent")}
        </Typography>

        <div className="grid grid-cols-3 gap-4 py-2 items-center">
          {/* profile image */}
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src={preview || ProfileImage}
              alt="Preview"
              width={400}
              height={400}
              style={{
                maxWidth: "50%",
                aspectRatio: 1,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <label htmlFor="file-input">
              <Input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button variant="outlined" component="span" color="secondary">
                {t("chooseImage")}
              </Button>
            </label>
          </div>

          {/* name */}
          <div className="flex flex-col gap-2">
            <Typography>{t("fullName")}</Typography>
            <TextField
              value={studentInfo?.name || ""}
              placeholder={t("enterFullName")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({ ...prev, name: target.value }));
              }}
            />
          </div>
          {/* email */}
          <div className="flex flex-col gap-2">
            <Typography>{t("email")}</Typography>
            <TextField
              value={studentInfo?.email || ""}
              type="email"
              placeholder={t("enterEmail")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({ ...prev, email: target.value }));
              }}
            />
          </div>
          {/* phone number */}
          <div className="flex flex-col gap-2">
            <Typography>{t("phoneNumber")}</Typography>
            <TextField
              value={studentInfo?.phoneNumber || ""}
              placeholder={t("enterPhoneNumber")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({
                  ...prev,
                  phoneNumber: target.value,
                }));
              }}
            />
          </div>
          {/* Classroom */}
          <div className="flex flex-col gap-2">
            <Typography>{t("classroom")}</Typography>
            <FormControl fullWidth>
              <Select
                value={studentInfo.classroom || ""}
                onChange={({ target }) => {
                  setStudentInfo((prev) => ({
                    ...prev,
                    classroom: target.value,
                  }));
                }}
                inputProps={{ "aria-label": "Without label" }}
                label="Classroom"
                renderValue={(selected) => {
                  if (selected?.length == 0) {
                    return <em>{t("selectClassroom")}</em>;
                  }
                  return selected;
                }}
                displayEmpty
              >
                {classrooms.map((c) => (
                  <MenuItem key={c.id} value={c.name}>
                    {t("class")} {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {/* location */}
          <div className="flex flex-col gap-2">
            <Typography>{t("location")}</Typography>
            <TextField
              value={studentInfo?.location || ""}
              placeholder={t("location")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({
                  ...prev,
                  location: target.value,
                }));
              }}
            />
          </div>
        </div>
        {/* parent information */}
        <div className="grid grid-cols-3 gap-4">
          <Typography component="h2" variant="h6" className="col-span-3">
            {t("parentInformation")}
          </Typography>
          {/* parent name */}
          <div className="flex flex-col gap-2">
            <Typography>{t("name")}</Typography>
            <TextField
              value={studentInfo?.parentName || ""}
              placeholder={t("enterName")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({
                  ...prev,
                  parentName: target.value,
                }));
              }}
            />
          </div>
          {/* parent email */}
          <div className="flex flex-col gap-2">
            <Typography>{t("email")}</Typography>
            <TextField
              value={studentInfo?.parentEmail || ""}
              placeholder={t("enterEmail")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({
                  ...prev,
                  parentEmail: target.value,
                }));
              }}
            />
          </div>
          {/* parent name */}
          <div className="flex flex-col gap-2">
            <Typography>{t("phoneNumber")}</Typography>
            <TextField
              value={studentInfo?.parentPhoneNumber || ""}
              placeholder={t("enterPhoneNumber")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({
                  ...prev,
                  parentPhoneNumber: target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 items-center">
          <Typography component="h2" variant="h6" className="col-span-2">
            {t("emergencyInformation")}
          </Typography>{" "}
          {/* emergency contact */}
          <div className="flex flex-col gap-2">
            <Typography>{t("emergencyContact")}</Typography>
            <TextField
              value={studentInfo?.emergencyContact || ""}
              placeholder={t("enterEmergencyContact")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({
                  ...prev,
                  emergencyContact: target.value,
                }));
              }}
            />
          </div>
          {/* medical info */}
          <div className="flex flex-col gap-2">
            <Typography>{t("medicalInfo")}</Typography>
            <TextField
              value={studentInfo.medicalInfo}
              multiline
              placeholder={t("enterMedicalInformation")}
              onChange={({ target }) => {
                setStudentInfo((prev) => ({
                  ...prev,
                  medicalInfo: target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="flex w-full gap-2 justify-end pt-4">
          <Button
            variant="contained"
            color="error"
            onClick={handleAddStudent}
            disabled={isDisabled}
            loadingPosition="start"
            loading={mutationStatus == "saving"}
          >
            {t("addStudent")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setStudentInfo({});
              dispatch(setIsAddStudentModalOpen(false));
            }}
          >
            {t("cancel")}
          </Button>
        </div>
      </Card>
    </Modal>
  );
}

export default AddStudentFormModal;

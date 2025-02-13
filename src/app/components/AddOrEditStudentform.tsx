/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Card from "./Card";
import {
  createStudents,
  resetStudent,
  setIsAddStudentModalOpen,
  setIsEditing,
  updateStudents,
} from "../lib/feature/studentsSlice";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ProfileImage from "../assets/images/Profile.png";
import { fetchAttendances } from "../lib/feature/attendanceSlice";
import { getDate } from "../lib/utils";
import Loading from "./Loading";
import Error from "./Error";
import { Close } from "@mui/icons-material";
import ClassroomsDropdown from "./ClassroomsDropdown";
import { useUploadImage } from "../lib/hooks/useUploadImage";

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

function AddOrEditStudentFormModal() {
  const t = useTranslations("dashboard");
  const { uploadImage, loading, error, progress } = useUploadImage();
  const dispatch = useAppDispatch();
  const [studentInfo, setStudentInfo] = useState<StudentInput>({});
  const classrooms = useAppSelector((state) => state.classroomSlice.classrooms);
  const {
    isAddStudentModalOpen: isModalOpen,
    mutationStatus,
    status,
    student,
    isEditing,
  } = useAppSelector((state) => state.studentSlice);
  const [isDisabled, setIsDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const isValidated = isEditing ? validateEditInput() : validateInput();

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
    file,
  ]);

  useEffect(() => {
    if (status !== "success") return;

    setStudentInfo({
      name: student?.name,
      classroom: student?.classroom.name,
      phoneNumber: student?.phoneNumber,
      location: student?.location,
      parentName: student?.parent.name,
      parentPhoneNumber: student?.parent.phoneNumber,
      emergencyContact: student?.emergencyContact[0],
      medicalInfo: student?.medicalInfo[0],
      profilePicUrl: student?.imageUrl,
    });

    setPreview(student?.imageUrl);
  }, [status]);

  const validateInput = () => {
    const {
      name,
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

  const validateEditInput = () => {
    const {
      name,
      classroom,
      location,
      phoneNumber,
      emergencyContact,
      medicalInfo,
    } = studentInfo;

    console.log(file);

    if (
      student?.name == name &&
      student?.classroom.name == classroom &&
      student?.location == location &&
      student?.phoneNumber == phoneNumber &&
      student?.emergencyContact[0] == emergencyContact &&
      student?.medicalInfo[0] == medicalInfo &&
      file == null
    )
      return false;
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

    const profileImageUrl = await uploadImage(file);

    dispatch(
      createStudents({
        name,
        email,
        imageUrl: profileImageUrl as string,
        phoneNumber,
        location,
        classroom: classrooms.find((c) => c.name == classroom).id,
        parentName,
        parentEmail,
        parentPhoneNumber,
        emergencyContact: [emergencyContact],
        medicalInfo: [medicalInfo],
      })
    ).then(() => {
      setStudentInfo({});
      dispatch(setIsAddStudentModalOpen(false));
      const { date, month, year } = getDate();
      dispatch(fetchAttendances({ date, month, year }));
    });
  };

  const handleEditStudent = async () => {
    const {
      name,
      classroom,
      location,
      phoneNumber,
      emergencyContact,
      medicalInfo,
    } = studentInfo;

    const isValid = validateEditInput();
    if (!isValid) return;

    const profileImageUrl = await uploadImage(file);

    const editStudentInput = {};
    if (name != student?.name) editStudentInput["name"] = name;
    if (profileImageUrl != "") editStudentInput["imageUrl"] = profileImageUrl;
    if (classroom != student?.classroom?.name)
      editStudentInput["classroom"] = classrooms.find(
        (c) => c.name == classroom
      )?.id;
    if (location != student?.location) editStudentInput["location"] = location;
    if (phoneNumber != student?.phoneNumber)
      editStudentInput["phoneNumber"] = phoneNumber;
    if (emergencyContact != student?.emergencyContact[0])
      editStudentInput["emergencyContact"] = [emergencyContact];
    if (medicalInfo != student?.medicalInfo[0])
      editStudentInput["medicalInfo"] = [medicalInfo];

    if (Object.keys(editStudentInput).length == 0) return;

    console.log("Edit student input values: ", editStudentInput);

    dispatch(updateStudents({ id: student?.id, ...editStudentInput })).then(
      () => {
        setStudentInfo({});
        dispatch(resetStudent());
        dispatch(setIsAddStudentModalOpen(false));
        dispatch(setIsEditing(false));
      }
    );
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCloseModal = () => {
    setFile(null);
    setPreview(null);
    setStudentInfo({});
    dispatch(setIsAddStudentModalOpen(false));
    dispatch(setIsEditing(false));
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Card
          sx={{ maxHeight: "100vh", py: "2rem", px: "1.5rem" }}
          className="min-w-[400px] min-h-[40vh] md:max-w-[40vw] h-full md:h-auto absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        >
          {status == "loading" ? (
            <Loading />
          ) : status == "error" ? (
            <Error errorText={t("somethingWentWrong")} />
          ) : (
            <>
              <Typography component="h2" variant="h4" textAlign={"center"}>
                {isEditing ? t("editStudent") : t("addStudent")}
              </Typography>
              <div className="grid grid-cols-2 gap-4 py-2 items-center">
                {/* profile image */}
                <div className="flex flex-col col-span-2 md:col-span-1 justify-center items-center gap-2">
                  <Image
                    src={preview || ProfileImage}
                    alt="Preview"
                    width={400}
                    height={400}
                    style={{
                      aspectRatio: 1,
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    className="max-w-[25%]"
                  />
                  <label htmlFor="file-input">
                    <Input
                      id="file-input"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      color="secondary"
                    >
                      {t("chooseImage")}
                    </Button>
                  </label>
                </div>
                {/* Classroom */}
                <div className="flex flex-col gap-2">
                  <InputLabel label={t("classroom")} required />
                  <ClassroomsDropdown
                    fullWidth
                    value={studentInfo?.classroom || ""}
                    setValue={(e) => {
                      setStudentInfo((prev) => ({
                        ...prev,
                        classroom: e.target.value,
                      }));
                      console.log(e.target.value);
                    }}
                  />
                </div>
                {/* name */}
                <div className="flex flex-col gap-2">
                  <InputLabel label={t("fullName")} required />
                  <TextField
                    value={studentInfo?.name || ""}
                    placeholder={t("enterFullName")}
                    onChange={({ target }) => {
                      setStudentInfo((prev) => ({
                        ...prev,
                        name: target.value,
                      }));
                    }}
                  />
                </div>
                {/* email */}
                {!isEditing && (
                  <div className="flex flex-col gap-2">
                    <InputLabel label={t("email")} />
                    <TextField
                      value={studentInfo?.email || ""}
                      type="email"
                      placeholder={t("enterEmail")}
                      onChange={({ target }) => {
                        setStudentInfo((prev) => ({
                          ...prev,
                          email: target.value,
                        }));
                      }}
                    />
                  </div>
                )}
                {/* phone number */}
                <div className="flex flex-col gap-2">
                  <InputLabel label={t("phoneNumber")} />
                  <TextField
                    type="tel"
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
                {/* location */}
                <div className="flex flex-col gap-2">
                  <InputLabel label={t("location")} required />
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
              {!isEditing && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Typography
                    component="h2"
                    variant="h6"
                    className="col-span-2 md:col-span-3"
                  >
                    {t("parentInformation")}
                  </Typography>
                  {/* parent name */}
                  <div className="flex flex-col gap-2">
                    <InputLabel label={t("name")} required />
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
                    <InputLabel label={t("email")} required />
                    <TextField
                      type="email"
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
                  {/* parent phone number */}
                  <div className="flex flex-col gap-2">
                    <InputLabel label={t("phoneNumber")} required />
                    <TextField
                      type="tel"
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
              )}
              {/* emergency information */}
              <Typography component="h2" variant="h6" className="col-span-2">
                {t("emergencyInformation")}
              </Typography>{" "}
              <div className="grid col-span-2 grid-cols-2 gap-4 py-2 items-center">
                {/* emergency contact */}
                <div className="flex col-span-2 sm:col-span-1 flex-col items-start gap-2 sm:gap-4">
                  <InputLabel label={t("emergencyContact")} required />
                  <TextField
                    fullWidth
                    type={"tel"}
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
                <div className="flex col-span-2 sm:col-span-1 flex-col items-start gap-2 sm:gap-4">
                  <InputLabel label={t("medicalInfo")} required />
                  <TextField
                    value={studentInfo?.medicalInfo}
                    fullWidth
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
                  onClick={() => {
                    isEditing ? handleEditStudent() : handleAddStudent();
                  }}
                  disabled={isDisabled}
                  loadingPosition="start"
                  loading={mutationStatus == "saving" || loading == true}
                >
                  {isEditing ? t("editStudent") : t("addStudent")}
                </Button>
                <Button variant="outlined" onClick={() => handleCloseModal()}>
                  {t("cancel")}
                </Button>
              </div>
            </>
          )}
          <Button
            size="small"
            variant="outlined"
            fullWidth={false}
            className="top-6 md:top-4 right-4"
            sx={{
              position: "fixed",
              minWidth: "unset",
              lineHeight: 1,
            }}
            onClick={() => handleCloseModal()}
          >
            <Close fontSize={"small"} />
          </Button>
        </Card>
      </Modal>
      {(mutationStatus == "saving" || loading == true) &&
        isModalOpen == true && <Loading />}
    </>
  );
}

export default AddOrEditStudentFormModal;

const InputLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => {
  return (
    <Typography
      minWidth={"max-content"}
      sx={{
        position: "relative",
        alignSelf: "start",
        justifySelf: "start",
      }}
    >
      {label}
      {required && (
        <span
          style={{
            color: "red",
            position: "absolute",
            top: 0,
            right: -8,
          }}
        >
          *
        </span>
      )}
    </Typography>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Card from "./Card";
import {
  createTeachers,
  setIsAddTeacherModalOpen,
} from "../lib/feature/teacherSlice";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ProfileImage from "../assets/images/Profile.png";
import { uploadImage } from "@/firebase/storage";

interface TeacherInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  profilePicUrl?: string;
}

function AddTeacherFormModal() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInput>({});
  const classrooms = useAppSelector((state) => state.classroomSlice.classrooms);
  const { isAddTeacherModalOpen: isModalOpen, mutationStatus } = useAppSelector(
    (state) => state.teacherSlice
  );
  const [isDisabled, setIsDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const isValidated = validateInput();

    setIsDisabled(!isValidated);
  }, [teacherInfo?.name, teacherInfo?.email, teacherInfo?.phoneNumber]);

  const validateInput = () => {
    const { name, email, phoneNumber } = teacherInfo;

    console.log(teacherInfo);

    if (!name || !email || !phoneNumber) {
      return false;
    }
    return true;
  };

  const handleAddTeacher = async () => {
    const { name, email, phoneNumber } = teacherInfo;

    const isValid = validateInput();
    if (!isValid) return;

    const profileImageUrl = await uploadImage({ file });

    dispatch(
      createTeachers({
        name,
        email,
        phoneNumber,
        imageUrl: profileImageUrl as string,
      })
    ).then(() => {
      setTeacherInfo({});
      dispatch(setIsAddTeacherModalOpen(false));
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
      <Card
        sx={{ maxHeight: { xs: "95vh", md: "90vh" }, py: "2rem" }}
        className="min-h-[40vh] min-w-[20vw] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        <Typography component="h2" variant="h4" textAlign={"center"}>
          {t("addTeacher")}
        </Typography>
        <div className="grid grid-cols-1 gap-4 py-2 items-center">
          {/* profile image */}
          <div className="flex flex-col  justify-center items-center gap-2">
            <Image
              src={preview || ProfileImage}
              alt="Preview"
              width={300}
              height={300}
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
              <Button variant="outlined" component="span" color="secondary">
                {t("chooseImage")}
              </Button>
            </label>
          </div>
          {/* name */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <Typography>{t("fullName")}</Typography>
            <TextField
              value={teacherInfo?.name || ""}
              placeholder={t("enterFullName")}
              onChange={({ target }) => {
                setTeacherInfo((prev) => ({ ...prev, name: target.value }));
              }}
              className="col-span-2"
            />
          </div>
          {/* email */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <Typography>{t("email")}</Typography>
            <TextField
              value={teacherInfo?.email || ""}
              type="email"
              placeholder={t("enterEmail")}
              onChange={({ target }) => {
                setTeacherInfo((prev) => ({ ...prev, email: target.value }));
              }}
              className="col-span-2"
            />
          </div>
          {/* phone number */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <Typography>{t("phoneNumber")}</Typography>
            <TextField
              type="tel"
              value={teacherInfo?.phoneNumber || ""}
              placeholder={t("enterPhoneNumber")}
              onChange={({ target }) => {
                setTeacherInfo((prev) => ({
                  ...prev,
                  phoneNumber: target.value,
                }));
              }}
              className="col-span-2"
            />
          </div>
        </div>
        <div className="flex w-full gap-2 justify-end pt-4">
          <Button
            variant="contained"
            color="error"
            onClick={handleAddTeacher}
            disabled={isDisabled}
            loadingPosition="start"
            loading={mutationStatus == "saving"}
          >
            {t("addTeacher")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setTeacherInfo({});
              dispatch(setIsAddTeacherModalOpen(false));
            }}
          >
            {t("cancel")}
          </Button>
        </div>
      </Card>
    </Modal>
  );
}

export default AddTeacherFormModal;

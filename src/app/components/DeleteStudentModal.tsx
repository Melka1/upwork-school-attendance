/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Card from "./Card";
import { useTranslations } from "next-intl";
import {
  deleteStudents,
  resetDeletionStatus,
  setIsDeleteStudentModalOpen,
  setStudentIdToDelete,
} from "../lib/feature/studentsSlice";
import { setMessageAlert } from "../lib/feature/pageSlice";

function DeleteStudentModal() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const {
    isDeleteStudentModalOpen: isModalOpen,
    studentIdToDelete,
    students,
    deletionStatus,
  } = useAppSelector((state) => state.studentSlice);
  const student = students.find((s) => s.id == studentIdToDelete);

  useEffect(() => {
    if (deletionStatus == "success") {
      dispatch(
        setMessageAlert({
          message: t("dashboard.deletedSuccessfully", { name: student?.name }),
          alertType: "success",
        })
      );
      dispatch(resetDeletionStatus());
    }
  }, [deletionStatus]);

  const handleDeleteStudent = async () => {
    dispatch(deleteStudents({ id: studentIdToDelete })).then(() => {
      closeTheModal();
    });
  };

  const closeTheModal = () => {
    dispatch(setStudentIdToDelete(null));
    dispatch(setIsDeleteStudentModalOpen(false));
  };

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      onClose={() => closeTheModal()}
    >
      <Card
        sx={{
          maxHeight: { xs: "95vh", md: "90vh" },
          py: "1rem",
          minHeight: "unset",
          maxWidth: { xs: "80vw", md: "40vw" },
        }}
        className="min-w-[400px] min-h-[40vh] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        <Typography component="h2" variant="h4" textAlign={"center"}>
          {t("dashboard.deleteStudent")}
        </Typography>
        <Typography component="h4" variant="body1" textAlign={"center"}>
          {t("dashboard.areYouSureToDelete", { name: student?.name })}
        </Typography>
        <div className="flex w-full gap-2 justify-center pt-4">
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteStudent}
            loadingPosition="start"
            loading={deletionStatus == "saving"}
          >
            {t("common.yes")}
          </Button>
          <Button variant="outlined" onClick={() => closeTheModal()}>
            {t("common.no")}
          </Button>
        </div>
      </Card>
    </Modal>
  );
}

export default DeleteStudentModal;

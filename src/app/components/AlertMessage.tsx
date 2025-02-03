/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Alert, Snackbar } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setMessageAlert } from "../lib/feature/pageSlice";
import { useTranslations } from "next-intl";
//TODO - find a better way to handle the error alert
function AlertMessage() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const { messageAlert } = useAppSelector((state) => state.pageSlice);
  const {
    mutationStatus: attendanceMutationStatus,
    status: attendanceQueryStatus,
  } = useAppSelector((state) => state.attendanceSlice);
  const { mutationStatus: studentMutationStatus, status: studentQueryStatus } =
    useAppSelector((state) => state.studentSlice);
  const { mutationStatus: userMutationStatus, queryStatus: userQueryStatus } =
    useAppSelector((state) => state.userSlice);

  useEffect(() => {
    if (
      attendanceMutationStatus == "error" ||
      attendanceQueryStatus == "error" ||
      studentMutationStatus == "error" ||
      studentQueryStatus == "error" ||
      userMutationStatus == "error" ||
      userQueryStatus == "error"
    ) {
      dispatch(
        setMessageAlert({
          alertType: "error",
          message: t("somethingWentWrong"),
        })
      );
    }
  }, [
    attendanceMutationStatus,
    attendanceQueryStatus,
    studentMutationStatus,
    studentQueryStatus,
    userMutationStatus,
    userQueryStatus,
  ]);

  return (
    <Snackbar
      open={messageAlert !== null}
      autoHideDuration={4000}
      onClose={() => dispatch(setMessageAlert(null))}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={messageAlert?.alertType}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {messageAlert?.message}
      </Alert>
    </Snackbar>
  );
}

export default AlertMessage;

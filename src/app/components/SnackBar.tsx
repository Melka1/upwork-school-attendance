/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../lib/hooks";
import { useTranslations } from "next-intl";

function SnackBar() {
  const t = useTranslations("dashboard");
  const mutationStatus = useAppSelector(
    (state) => state.attendanceSlice.mutationStatus
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    if (mutationStatus == "success") {
      setIsOpen(true);
    }
  }, [mutationStatus]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isOpen}
      autoHideDuration={3000}
      onClose={() => setIsOpen(false)}
    >
      <Alert
        severity="success"
        variant="filled"
        color="success"
        sx={{ width: "100%" }}
      >
        {t("attendanceHasBeenUpdated")}
      </Alert>
    </Snackbar>
  );
}

export default SnackBar;

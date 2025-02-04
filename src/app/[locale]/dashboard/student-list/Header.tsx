"use client";
import Logo from "@/app/assets/svg/Logo";
import { setIsAddStudentModalOpen } from "@/app/lib/feature/studentsSlice";
import { setIsAddTeacherModalOpen } from "@/app/lib/feature/teacherSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { Add, ArrowBack, PersonAddAlt } from "@mui/icons-material";
import { Box, Button, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

function Header() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <IconButton
        sx={{ display: { xs: "flex", md: "none" } }}
        onClick={() => router.push("/dashboard")}
      >
        <ArrowBack />
      </IconButton>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
        startIcon={<Logo />}
      >
        <p className="text-lg font-bold leading-1">{t("schoolSystem")}</p>
      </Button>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBack />}
          onClick={() => router.push("/dashboard")}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {t("backToDashboard")}
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "black",
            color: "white",
            display: { xs: "none", md: "flex" },
          }}
          startIcon={<Add />}
          onClick={() => {
            dispatch(setIsAddStudentModalOpen(true));
          }}
        >
          {t("addNewStudent")}
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "black",
            color: "white",
            display: { xs: "none", md: "flex" },
          }}
          startIcon={<Add />}
          onClick={() => {
            dispatch(setIsAddTeacherModalOpen(true));
          }}
        >
          {t("addNewTeacher")}
        </Button>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ minWidth: "unset" }}
          >
            <PersonAddAlt />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{ pt: "0.5rem" }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                dispatch(setIsAddStudentModalOpen(true));
              }}
            >
              {t("addStudent")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                dispatch(setIsAddTeacherModalOpen(true));
              }}
            >
              {t("addTeacher")}
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Stack>
  );
}

export default Header;

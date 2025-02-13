/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import { LogoutOutlined, MoreVert } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, AppBar, Typography } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ColorModeSelect from "@/app/theme/ColorModeSelect";
import LocaleSwitcher from "@/app/components/LanguageSelect";
import { useAuth } from "@/app/provider/AuthContext";
import NavigationButton from "@/app/components/NavigationButton";
import Logo from "../assets/svg/Logo";
import NotificationModal from "./NotificationModal";
import MenuButton from "./MenuButton";
import {
  fetchNotifications,
  setIsNotificationModalOpen,
} from "../lib/feature/notificationSlice";
import { useAppDispatch, useAppSelector } from "../lib/hooks";

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notificationSlice.notifications
  );
  const user = useAppSelector((state) => state.userSlice.user);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (!user || user?.userType != "TEACHER") return;
    dispatch(fetchNotifications({ userId: user?.id, isRead: false }));
  }, [user]);

  return (
    <AppBar>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          width: { xs: "100%", lg: "80%" },
          maxWidth: { sm: "100%", md: "1700px" },
          py: 1.5,
          px: 2,
          margin: "auto",
        }}
        spacing={2}
      >
        <Stack direction="row" alignItems={"center"} gap={1}>
          <Logo />
          <Typography variant={"h5"} component={"h1"} lineHeight={1}>
            {t("dashboard.studentList")}
          </Typography>
        </Stack>

        <Stack direction="row" gap={2} alignItems={"center"}>
          {user?.userType == "TEACHER" && (
            <>
              <NavigationButton
                label={t("dashboard.self")}
                action={() => router.push("/dashboard")}
                isSelected={pathname === `/${locale}/dashboard`}
              />
              <NavigationButton
                label={t("dashboard.studentList")}
                action={() => router.push("/dashboard/student-list")}
                isSelected={pathname === `/${locale}/dashboard/student-list`}
              />
              <NavigationButton
                label={t("dashboard.studentsAbsenceList")}
                action={() => router.push("/dashboard/absence-list")}
                isSelected={pathname === `/${locale}/dashboard/absence-list`}
              />
            </>
          )}
          {user?.userType == "TEACHER" && (
            <MenuButton
              showBadge={notifications.length > 0}
              badgeContent={notifications.length.toString()}
              aria-label="Open notifications"
              onClick={() => dispatch(setIsNotificationModalOpen(true))}
            >
              <NotificationsRoundedIcon />
            </MenuButton>
          )}
          <Stack
            direction={"row"}
            gap={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <ColorModeSelect />
            <LocaleSwitcher />
          </Stack>
          {user !== null && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutOutlined />}
              onClick={() => logout()}
              sx={{
                display: { xs: "none", md: "flex" },
                minWidth: "max-content",
              }}
            >
              {t("auth.logOut")}
            </Button>
          )}

          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{ minWidth: "unset", "&>li": { minHeight: "unset" } }}
            >
              <MoreVert />
            </Button>
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
              {user?.userType == "TEACHER" && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    router.push("/dashboard/");
                  }}
                >
                  {t("dashboard.self")}
                </MenuItem>
              )}
              {user?.userType == "TEACHER" && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    router.push("/dashboard/student-list");
                  }}
                >
                  {t("dashboard.studentList")}
                </MenuItem>
              )}
              {user?.userType == "TEACHER" && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    router.push("/dashboard/absence-list");
                  }}
                >
                  {t("dashboard.studentsAbsenceList")}
                </MenuItem>
              )}
              <MenuItem sx={{ display: { xs: "flex", md: "none" } }}>
                <ColorModeSelect />
              </MenuItem>
              <MenuItem sx={{ display: { xs: "flex", md: "none" } }}>
                <LocaleSwitcher />
              </MenuItem>
              {user != null && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    logout();
                  }}
                >
                  {t("auth.logOut")}
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Stack>

        <NotificationModal />
      </Stack>
    </AppBar>
  );
}

import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "../../components/MenuButton";

import Logo from "../../assets/svg/Logo";
import {
  LogoutOutlined,
  MoreVert,
  SettingsOutlined,
} from "@mui/icons-material";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { logOut } from "@/firebase/auth";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import NotificationModal from "../../components/NotificationModal";
import { setIsNotificationModalOpen } from "../../lib/feature/notificationSlice";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ColorModeSelect from "@/app/theme/ColorModeSelect";

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notificationSlice.notifications
  );
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
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
        startIcon={<Logo />}
      >
        <p className="text-lg font-bold">{t("dashboard.schoolSystem")}</p>
      </Button>
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/dashboard/student-list")}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {t("dashboard.studentList")}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/dashboard/absence-list")}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {t("dashboard.studentsAbsenceList")}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SettingsOutlined />}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {t("dashboard.admin")}
        </Button>

        <MenuButton
          showBadge={notifications.length > 0}
          badgeContent={notifications.length.toString()}
          aria-label="Open notifications"
          onClick={() => dispatch(setIsNotificationModalOpen(true))}
        >
          <NotificationsRoundedIcon />
        </MenuButton>

        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutOutlined />}
          onClick={() => logOut()}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {t("auth.logOut")}
        </Button>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ minWidth: "unset" }}
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
            <MenuItem
              onClick={() => {
                handleClose();
                router.push("/dashboard/student-list");
              }}
            >
              {t("dashboard.studentList")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                router.push("/dashboard/absence-list");
              }}
            >
              {t("dashboard.studentsAbsenceList")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
              }}
            >
              {t("dashboard.admin")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                logOut();
              }}
            >
              {t("auth.logOut")}
            </MenuItem>
            <ColorModeSelect />
          </Menu>
        </Box>
      </Stack>

      <NotificationModal />
    </Stack>
  );
}

import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";

import Logo from "../assets/svg/Logo";
import { LogoutOutlined, SettingsOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { logOut } from "@/firebase/auth";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import NotificationModal from "./NotificationModal";
import { setIsNotificationModalOpen } from "../lib/feature/notificationSlice";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notificationSlice.notifications
  );

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
        className="flex items-center gap-4"
        onClick={() => router.push("/dashboard")}
      >
        <Logo />
        <p className="text-lg font-bold">{t("dashboard.schoolSystem")}</p>
      </Button>
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/dashboard/student-list")}
        >
          {t("dashboard.studentList")}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SettingsOutlined />}
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
        >
          {t("auth.signUp")}
        </Button>
      </Stack>

      <NotificationModal />
    </Stack>
  );
}

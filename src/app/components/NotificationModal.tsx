/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, CardContent, Modal, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  fetchNotifications,
  setIsNotificationModalOpen,
  TNotification,
  updateNotifications,
} from "../lib/feature/notificationSlice";
import Card from "./Card";
import { Close } from "@mui/icons-material";
import { getTimeAgo } from "../lib/utils";
import { useTranslations } from "next-intl";

function NotificationModal() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const {
    isNotificationModalOpen: isOpen,
    notifications,
    mutationStatus,
  } = useAppSelector((state) => state.notificationSlice);
  const id = useAppSelector((state) => state.userSlice.user?.id);

  useEffect(() => {
    if (mutationStatus !== "success") return;
    dispatch(fetchNotifications({ userId: id, isRead: false }));
  }, [mutationStatus]);

  const handleMarkNotificationAsRead = (notification: TNotification) => {
    dispatch(
      updateNotifications({
        recipientId: notification.recipientId,
        isRead: true,
      })
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => dispatch(setIsNotificationModalOpen(false))}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Card className="max-h-[90vh] min-h-24 max-w-[90vw] md:max-w-[450px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Typography component="h2" variant="h4">
          {t("notifications")}
        </Typography>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {notifications.length == 0 ? (
            <div className="flex min-h-20 min-w-full items-center justify-center">
              <Typography sx={{ fontSize: "1.1rem" }}>
                {t("noNewNotifications")}
              </Typography>
            </div>
          ) : (
            [...notifications]
              .sort((b, a) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              })
              .map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  action={() => handleMarkNotificationAsRead(n)}
                />
              ))
          )}
        </div>

        <Button
          size="small"
          variant="outlined"
          fullWidth={false}
          className="top-4 right-4"
          sx={{
            position: "absolute",
            minWidth: "unset",
            lineHeight: 1,
          }}
          onClick={() => dispatch(setIsNotificationModalOpen(false))}
        >
          <Close fontSize={"small"} />
        </Button>
      </Card>
    </Modal>
  );
}

export default NotificationModal;

const NotificationCard = ({
  notification,
  action,
}: {
  notification: TNotification;
  action: VoidFunction;
}) => {
  const t = useTranslations("dashboard");
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100% !important",
        padding: "1rem",
        minHeight: "max-content",
      }}
    >
      <CardContent sx={{}}>
        <div className="flex justify-between ">
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14, fontWeight: "bold" }}
          >
            {notification.title}
          </Typography>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 12 }}
          >
            {getTimeAgo(notification.date)}
          </Typography>
        </div>
        <Typography variant="body2" sx={{ fontSize: "12px" }}>
          {notification.message}
        </Typography>
        <div className="flex justify-end pt-2" onClick={action}>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200">
            {t("markAsRead")}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

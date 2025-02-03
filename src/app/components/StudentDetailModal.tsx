import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setIsStudentDetailModalOpen } from "../lib/feature/studentsSlice";
import Card from "./Card";
import {
  Close,
  FavoriteBorderOutlined,
  LocalPhoneOutlined,
  LocationOnOutlined,
  MailOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import HeartBeatLine from "../assets/svg/HeartBeatLine";
import Graduation from "../assets/svg/Graduation";
import Users from "../assets/svg/Users";
import User from "../assets/svg/User";
import Loading from "./Loading";
import Error from "./Error";
import { AttendanceStatus } from "@prisma/client";
import {
  createAttendance,
  updateAttendances,
} from "../lib/feature/attendanceSlice";
import { useTranslations } from "next-intl";
import ProfilePic from "@/app/assets/images/Profile.png";
import Image from "next/image";

function StudentDetailModal() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const {
    isStudentDetailModalOpen: isOpen,
    student,
    status,
  } = useAppSelector((state) => state.studentSlice);
  const attendances = useAppSelector(
    (state) => state.attendanceSlice.attendances
  );
  const startDate = useAppSelector(
    (state) => state.schoolSlice.semesterStartDate
  );

  const thisSemesterAttendance =
    student?.attendance.filter(
      (a) => new Date(a.createdAt).getTime() > new Date(startDate).getTime()
    ) || [];

  const totalPresentDays = thisSemesterAttendance.filter(
    (a) => a.status == AttendanceStatus.PRESENT
  ).length;

  const attendanceRate = totalPresentDays / thisSemesterAttendance.length;

  const orderedAbsentList =
    student?.attendance
      .filter((a) => a.status == AttendanceStatus.ABSENT)
      .sort(
        (b, a) =>
          new Date(a.year, a.month, a.date).getTime() -
          new Date(b.year, b.month, b.date).getTime()
      ) || [];
  const lastAbsentAttendance = orderedAbsentList[0];
  const todaysAttendance = attendances.find((a) => a.studentId == student?.id);

  return (
    <Modal
      open={isOpen}
      onClose={() => dispatch(setIsStudentDetailModalOpen(false))}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Card className="max-h-[90vh] min-h-[40vh] min-w-[60vw] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        {/* student details */}
        {status == "loading" ? (
          <Loading />
        ) : status == "error" ? (
          <Error errorText={t("somethingWentWrong")} />
        ) : (
          <>
            <Typography component="h2" variant="h4">
              {t("studentDetails")}
            </Typography>

            <ListItem className="gap-2">
              <ListItemAvatar>
                <Image
                  src={student?.imageUrl || ProfilePic}
                  width={200}
                  height={200}
                  className="w-14 h-14 rounded-full object-cover"
                  alt="profile pic"
                />
              </ListItemAvatar>
              <ListItemText
                primary={student?.name || "-"}
                secondary={`${t("class")} ${student?.classroom.name || ""}`}
              />
            </ListItem>

            <List dense>
              <ListItem disablePadding className="gap-2">
                <ListItemIcon>
                  <MailOutlined />
                </ListItemIcon>
                <ListItemText primary={student?.email || "-"} />
              </ListItem>
              <ListItem disablePadding className="gap-2">
                <ListItemIcon>
                  <LocalPhoneOutlined />
                </ListItemIcon>
                <ListItemText primary={student?.phoneNumber || "-"} />
              </ListItem>
              <ListItem disablePadding className="gap-2">
                <ListItemIcon>
                  <LocationOnOutlined />
                </ListItemIcon>
                <ListItemText primary={student?.location || "-"} />
              </ListItem>
            </List>

            <div className="flex flex-col gap-4">
              {/* attendance overview */}
              <Typography component="h3" variant="h6">
                {t("attendanceOverview")}
              </Typography>

              <div className="w-full flex gap-4">
                <Card className="p-2">
                  <ListItem dense className="gap-2" disablePadding>
                    <ListItemIcon>
                      <HeartBeatLine />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          component="h3"
                          variant="h6"
                          className="text-bold"
                        >
                          {t("attendanceRate")}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Typography component="h1" variant="h5">
                    {thisSemesterAttendance.length
                      ? (attendanceRate * 100).toFixed(0) + "%"
                      : "-"}
                  </Typography>
                </Card>

                <Card className="p-2">
                  <ListItem disablePadding className="gap-2">
                    <ListItemIcon>
                      <Graduation />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          component="h3"
                          variant="h6"
                          className="text-bold"
                        >
                          {t("lastAbsent")}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Typography component="h1" variant="h5">
                    {lastAbsentAttendance
                      ? `${lastAbsentAttendance.year}-${
                          lastAbsentAttendance.month + 1
                        }-${lastAbsentAttendance.date}`
                      : "-"}
                  </Typography>
                </Card>
              </div>
              {/* parent information  */}
              <Card className="p-6 min-w-full">
                <ListItem
                  disablePadding
                  className="gap-2"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ListItemIcon>
                    <Users />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography component="h3" variant="h6">
                        {t("parentInformation")}
                      </Typography>
                    }
                  />
                </ListItem>

                <List dense disablePadding className="p-0" sx={{ p: "0px" }}>
                  <ListItem disablePadding className="gap-2">
                    <ListItemIcon>
                      <User />
                    </ListItemIcon>
                    <ListItemText primary={student?.parent?.name || "-"} />
                  </ListItem>
                  <ListItem disablePadding className="gap-2">
                    <ListItemIcon>
                      <MailOutlined />
                    </ListItemIcon>
                    <ListItemText primary={student?.parent?.email || "-"} />
                  </ListItem>
                  <ListItem disablePadding className="gap-2">
                    <ListItemIcon>
                      <LocalPhoneOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={student?.parent?.phoneNumber || "-"}
                    />
                  </ListItem>
                </List>
              </Card>

              {/* emergency information  */}
              <Card className="p-6 min-w-full">
                <ListItem
                  disablePadding
                  className="gap-2"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ListItemIcon>
                    <WarningAmberOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography component="h3" variant="h6">
                        {t("emergencyInformation")}
                      </Typography>
                    }
                  />
                </ListItem>

                <List dense disablePadding className="p-0" sx={{ p: "0px" }}>
                  <ListItem disablePadding className="gap-2">
                    <ListItemIcon>
                      <LocalPhoneOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${t("emergencyContact")}: ${
                        student?.emergencyContact || "-"
                      }`}
                    />
                  </ListItem>
                  <ListItem disablePadding className="gap-2">
                    <ListItemIcon>
                      <FavoriteBorderOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${t("medicalInfo")}: ${
                        student?.medicalInfo?.join(", ") || "-"
                      }`}
                    />
                  </ListItem>
                </List>
              </Card>

              <div className="flex w-full gap-2 justify-end">
                <Button
                  variant="contained"
                  color="error"
                  disabled={
                    attendances.find((a) => a.studentId == student?.id)
                      ?.status == AttendanceStatus.ABSENT
                  }
                  onClick={() => {
                    if (todaysAttendance) {
                      dispatch(
                        updateAttendances({
                          id: todaysAttendance.id,
                          status: AttendanceStatus.ABSENT,
                        })
                      );
                      return;
                    }
                    dispatch(
                      createAttendance({
                        studentId: student.id,
                        status: AttendanceStatus.ABSENT,
                      })
                    );
                  }}
                >
                  {t("markAsAbsent")}
                </Button>
                <Button
                  variant="text"
                  onClick={() => dispatch(setIsStudentDetailModalOpen(false))}
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </>
        )}

        <Button
          size="small"
          variant="outlined"
          fullWidth={false}
          className="top-4 right-4"
          sx={{
            position: "fixed",
            minWidth: "unset",
            lineHeight: 1,
          }}
          onClick={() => dispatch(setIsStudentDetailModalOpen(false))}
        >
          <Close fontSize={"small"} />
        </Button>
      </Card>
    </Modal>
  );
}

export default StudentDetailModal;

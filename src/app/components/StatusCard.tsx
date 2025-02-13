import { Chip } from "@mui/material";
import { AttendanceStatus } from "@prisma/client";

function StatusCard({
  status,
  label,
}: {
  status?: AttendanceStatus;
  label: string;
}) {
  const colors: { [index: string]: "success" | "warning" | "error" } = {
    PRESENT: "success",
    MISSING: "warning",
    ABSENT: "error",
  };

  return status ? (
    <Chip label={label} color={colors[status]} size="small" />
  ) : (
    "-"
  );
}

export default StatusCard
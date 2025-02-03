import * as React from "react";
import Badge, { badgeClasses } from "@mui/material/Badge";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

export interface MenuButtonProps extends IconButtonProps {
  showBadge?: boolean;
  badgeContent?: string;
}

export default function MenuButton({
  showBadge = false,
  badgeContent = "",
  ...props
}: MenuButtonProps) {
  return (
    <Badge
      color="primary"
      badgeContent={badgeContent}
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
    >
      <IconButton size="small" {...props} />
    </Badge>
  );
}

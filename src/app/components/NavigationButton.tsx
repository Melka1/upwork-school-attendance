import { MenuItem, Typography, useTheme } from "@mui/material";
import React from "react";

interface NavigationBarProps {
  label: string;
  action: VoidFunction;
  isSelected?: boolean;
}

function NavigationButton({
  label,
  action,
  isSelected = false,
}: NavigationBarProps) {
  const theme = useTheme();
  return (
    <MenuItem
      sx={{
        display: { xs: "none", md: "flex" },
        py: "0.25px",
        position: "relative",
        "&>p::after": {
          position: "absolute",
          content: "''",
          width: isSelected ? "100%" : 0,
          height: " 2px",
          left: 0,
          bottom: "-5px",
          backgroundColor: theme.palette.mode == "dark" ? "white" : "black",
          transition: "width ease-in-out 0.3s",
        },
        "&:hover>p::after": {
          width: "100%",
        },
      }}
      onClick={action}
    >
      <Typography color="darker">{label}</Typography>
    </MenuItem>
  );
}

export default NavigationButton;

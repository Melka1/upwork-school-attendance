import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function User({
  fontSize = 24,
  color,
}: {
  fontSize?: number;
  color?: string;
}) {
  return (
    <SvgIcon sx={{ fontSize }}>
      {/* credit: cog icon from https://heroicons.com */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
      >
        <g
          fill="none"
          stroke={"currentColor"}
          strokeLinecap="round"
          strokeWidth="2"
        >
          <path d="M19.727 20.447c-.455-1.276-1.46-2.403-2.857-3.207S13.761 16 12 16s-3.473.436-4.87 1.24s-2.402 1.931-2.857 3.207" />
          <circle cx="12" cy="8" r="4" />
        </g>
      </svg>
    </SvgIcon>
  );
}

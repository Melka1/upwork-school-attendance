import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function Users({
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
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M18 21a8 8 0 0 0-16 0" />
          <circle cx="10" cy="8" r="5" />
          <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
        </g>
      </svg>
    </SvgIcon>
  );
}

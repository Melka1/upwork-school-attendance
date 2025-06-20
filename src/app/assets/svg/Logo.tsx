import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function Logo({
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
          <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
          <path d="m18 10l3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10m12-5v17M4 6l7.106-3.553a2 2 0 0 1 1.788 0L20 6M6 5v17" />
          <circle cx="12" cy="9" r="2" />
        </g>
      </svg>
    </SvgIcon>
  );
}

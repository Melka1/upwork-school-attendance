import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function Absent({ fontSize = 24 }: { fontSize?: number }) {
  return (
    <SvgIcon sx={{ fontSize }}>
      {/* credit: cog icon from https://heroicons.com */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19c0-2.21-2.686-4-6-4s-6 1.79-6 4m14-5l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M9 12a4 4 0 1 1 0-8a4 4 0 0 1 0 8"
        />
      </svg>
    </SvgIcon>
  );
}

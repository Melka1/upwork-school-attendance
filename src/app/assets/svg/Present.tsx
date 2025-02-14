import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function Present({ fontSize = 24 }: { fontSize?: number }) {
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
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="m16 11l2 2l4-4" />
        </g>
      </svg>
    </SvgIcon>
  );
}

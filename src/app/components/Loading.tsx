import { Box, CircularProgress } from "@mui/material";
import React from "react";

function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 10000,
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default Loading;

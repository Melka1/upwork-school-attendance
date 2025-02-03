import { Box, Typography } from "@mui/material";
import React from "react";

function Error({ errorText }: { errorText: string }) {
  return (
    <Box
      sx={{
        zIndex: 10000,
        position: "absolute",
        top: "50%",
        right: "50%",
        translate: "50% -50%",
      }}
    >
      <Typography color="error" variant={"h4"} sx={{ textAlign: "center" }}>
        {errorText}
      </Typography>
    </Box>
  );
}

export default Error;

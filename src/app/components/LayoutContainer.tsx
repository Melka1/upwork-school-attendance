"use client";

import React from "react";
import AppTheme from "../theme/AppTheme";
import { Box, CssBaseline, alpha, Theme } from "@mui/material";
import {
  dataGridCustomizations,
  datePickersCustomizations,
} from "./../theme/customizations";
import StoreProvider from "../provider/StoreProvider";
import { AuthProvider } from "../provider/AuthContext";

const xThemeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
};

function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          display: "flex",
          maxWidth: { sm: "95%", md: "80%" },
          margin: "auto",
        }}
      >
        <Box
          component="main"
          sx={(theme: Theme & { vars: any }) => ({
            flexGrow: 1,
            backgroundColor: theme?.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <StoreProvider>
            <AuthProvider>{children}</AuthProvider>
          </StoreProvider>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default LayoutContainer;

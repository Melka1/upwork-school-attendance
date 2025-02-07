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
import AlertMessage from "./AlertMessage";
import Header from "./Header";

const xThemeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
};

function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <StoreProvider>
        <AuthProvider>
          <Box
            sx={{
              display: "flex",
              minWidth: "100%",
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
              <Header />
              {children}
              <AlertMessage />
            </Box>
          </Box>
        </AuthProvider>
      </StoreProvider>
    </AppTheme>
  );
}

export default LayoutContainer;

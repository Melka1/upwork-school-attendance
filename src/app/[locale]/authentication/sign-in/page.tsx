"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Logo from "@/app/assets/svg/Logo";
import AuthContainer from "@/app/components/AuthContainer";
import Card from "@/app/components/Card";
import { signIn } from "@/firebase/auth";
import { useAuth } from "@/app/provider/AuthContext";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useTranslations } from "next-intl";

export default function SignIn() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user: authUser, loading } = useAuth();
  const { user, queryStatus } = useAppSelector((state) => state.userSlice);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handleSignIn = async () => {
    console.log({
      email,
      password,
    });

    try {
      await signIn(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <AuthContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <div className="flex justify-center items-center mx-auto gap-4">
            <Logo fontSize={32} />
            <Typography
              component="h3"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              {t("welcomeBack")}
            </Typography>
          </div>
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">{t("email")}</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                value={email}
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                onChange={({ target }) => setEmail(target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">{t("password")}</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder={t("enterPassword")}
                type="password"
                value={password}
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
                onChange={({ target }) => setPassword(target.value)}
              />
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (validateInputs()) {
                  handleSignIn();
                }
              }}
            >
              {t("signIn")}
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              {t("don_tHaveAccount")}{" "}
              <Link
                href="/authentication/sign-up/"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                {t("signUp")}
              </Link>
            </Typography>
          </Box>
        </Card>
      </AuthContainer>

      {loading && (
        <Box
          sx={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 10000,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}

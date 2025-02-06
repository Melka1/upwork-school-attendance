/* eslint-disable react-hooks/exhaustive-deps */
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
import Card from "@/app/components/Card";
import AuthContainer from "@/app/components/AuthContainer";
import { signUp } from "@/firebase/auth";
import { useAuth } from "@/app/provider/AuthContext";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { createUsers } from "@/app/lib/feature/userSlice";
import { UserType } from "@prisma/client";
import { useTranslations } from "next-intl";
import Loading from "@/app/components/Loading";
import { setMessageAlert } from "@/app/lib/feature/pageSlice";
import LocaleSwitcher from "@/app/components/LanguageSelect";

export default function SignUp() {
  const t = useTranslations("auth");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: authUser, loading, setLoading } = useAuth();
  const { user, mutationStatus } = useAppSelector((state) => state.userSlice);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

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

  const handleSignUp = async () => {
    console.log({
      email,
      password,
    });

    try {
      setLoading(true);
      await signUp(email, password);
      dispatch(
        setMessageAlert({
          alertType: "success",
          message: t("successfullyLoggedIn"),
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        setMessageAlert({
          alertType: "error",
          message: error?.message || error,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      dispatch(createUsers({ email: authUser.email }));
    }
  }, [authUser]);

  useEffect(() => {
    if (mutationStatus != "success") return;
    if (user.userType != UserType.TEACHER) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  }, [mutationStatus]);

  return (
    <AuthContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            textAlign: "center",
          }}
        >
          {t("welcome")}
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email">{t("email")}</FormLabel>
            <TextField
              type="email"
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              value={email}
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? "error" : "primary"}
              onChange={({ target }) => setEmail(target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">{t("password")}</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder={t("enterPassword")}
              value={password}
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? "error" : "primary"}
              onChange={({ target }) => setPassword(target.value)}
            />
          </FormControl>
          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={() => {
              if (validateInputs()) {
                handleSignUp();
              }
            }}
          >
            {t("signUp")}
          </Button>
        </Box>
        <Divider>
          <Typography sx={{ color: "text.secondary" }}>or</Typography>
        </Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "center" }}>
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/authentication/sign-in/"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              {t("signIn")}
            </Link>
          </Typography>
        </Box>
        <LocaleSwitcher />
      </Card>
      {(loading || mutationStatus == "saving") && <Loading />}
    </AuthContainer>
  );
}

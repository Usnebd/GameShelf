import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase-conf";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";
import { SnackBarContext } from "../App";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const { handleSnackbarOpen, handleSnackMessage } =
    useContext(SnackBarContext);
  const isValidEmail = (email: string) => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.indexOf(".", atIndex);

    // Verifica se "@" è presente e "." è dopo "@"
    return atIndex !== -1 && dotIndex !== -1 && dotIndex > atIndex;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (password.length >= 6) {
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
      if (isValidEmail(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
      if (password.length >= 6 && isValidEmail(email)) {
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser).then(() => {
            handleSnackMessage("Email Verification Sent!");
            handleSnackbarOpen();
          });
        }
        handleSnackMessage("Signed Up!");
        handleSnackbarOpen();
        navigate("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleSnackMessage("Error!");
        handleSnackbarOpen();
        return {
          message: `(${error.message})`,
        };
      }
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                error={emailError}
                helperText={emailError ? "Invalid mail format" : false}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                error={passwordError}
                helperText={passwordError ? "At least 6 characters" : false}
                autoComplete="new-password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, pt: 1.3, pb: 1.3 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/sign-in"
                style={{ textDecoration: "none", color: "primary.main" }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    color: "primary.contrastText",
                  }}
                >
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  setPersistence,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { FirebaseError } from "firebase/app";

export default function SignUp() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isValidEmail = (email: string) => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.indexOf(".", atIndex);

    // Verifica se "@" è presente e "." è dopo "@"
    return atIndex !== -1 && dotIndex !== -1 && dotIndex > atIndex;
  };
  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
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
      if (firstName.length == 0) {
        setFirstNameError(true);
      } else {
        setFirstNameError(false);
      }
      if (lastName.length == 0) {
        setLastNameError(true);
      } else {
        setLastNameError(false);
      }
      if (password.length >= 6 && isValidEmail(email)) {
        if (isChecked) {
          await setPersistence(auth, browserLocalPersistence);
          enqueueSnackbar("Saving User Credentials", { variant: "info" });
        }
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
            displayName: firstName.concat("." + lastName),
          })
            .then()
            .catch((error) => {
              console.log(error.message);
            });
          sendEmailVerification(auth.currentUser).then(() => {
            enqueueSnackbar("Email Verification Sent", { variant: "info" });
          });
        }
        enqueueSnackbar("Signed Up", { variant: "success" });
        navigate("/");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/network-request-failed") {
          enqueueSnackbar("Network error", { variant: "error" });
        } else {
          enqueueSnackbar("User already exists", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Unknown error", { variant: "error" });
        console.error("Unknown error:", error);
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
        <Box
          component="form"
          id="signUpForm"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                error={firstNameError}
                helperText={firstNameError ? "Empty" : false}
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
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
                error={lastNameError}
                helperText={lastNameError ? "Empty" : false}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
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
            aria-label="submit button"
            sx={{ mt: 3, mb: 2, pt: 1.3, pb: 1.3 }}
          >
            Sign Up
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={isChecked}
                onChange={handleCheckChange}
              />
            }
            label="Remember me"
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/sign-in"
                style={{
                  textDecoration: "none",
                  color:
                    theme.palette.mode == "dark"
                      ? "inherit"
                      : theme.palette.primary.main,
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    color: "inherit",
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

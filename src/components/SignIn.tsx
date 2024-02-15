import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import {
  Avatar,
  ButtonBase,
  Divider,
  IconButton,
  Paper,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FirebaseError } from "firebase/app";

export default function SignIn() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const theme = useTheme();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/"); // Reindirizzamento alla homepage se l'utente è già autenticato
      }
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (email.length == 0) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (email.length > 0 || password.length >= 6) {
      try {
        if (isChecked) {
          setPersistence(auth, browserSessionPersistence)
            .then(() => {
              enqueueSnackbar("Saving User Credentials", { variant: "info" });
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            enqueueSnackbar("Signed In", { variant: "success" });
            navigate("/");
          })
          .catch(() => {
            enqueueSnackbar("Wrong Credentials", { variant: "error" });
          });
      } catch (error) {
        if (error instanceof FirebaseError) {
          if (error.code === "auth/network-request-failed") {
            enqueueSnackbar("Network error", { variant: "error" });
          } else {
            enqueueSnackbar("Wrong Credentials", { variant: "error" });
          }
        } else {
          enqueueSnackbar("Unknown error", { variant: "error" });
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const handleGoogleSign = () => {
    const provider = new GoogleAuthProvider();
    setPersistence(auth, browserSessionPersistence)
      .then()
      .catch((error) => {
        console.log(error.message);
      });
    signInWithPopup(auth, provider)
      .then(() => {
        enqueueSnackbar("Signed In", { variant: "success" });
        navigate("/");
      })
      .catch(() => {
        enqueueSnackbar("Error", { variant: "error" });
      });
  };

  const GoogleButton = styled(ButtonBase)({
    backgroundColor: "white",
    color: "black",
    img: {
      marginRight: 32, // Margine a destra dell'icona
      marginLeft: 16,
    },
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 8,
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          autoComplete="on"
          id="signInForm"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            error={emailError}
            helperText={emailError ? "Empty" : false}
            onChange={(event) => setEmail(event.target.value)}
            InputProps={{
              autoComplete: "email", // Specify autocomplete type for email
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            error={passwordError}
            helperText={passwordError ? "At least 6 characters" : false}
            id="password"
            InputProps={{
              autoComplete: "current-password", // Specify autocomplete type for password
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
            onChange={(event) => setPassword(event.target.value)}
          />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2, pt: 1.3, pb: 1.3 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                to="/password-reset"
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
                  }}
                >
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/sign-up"
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
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Divider sx={{ marginBottom: 3 }}>Or</Divider>
      <Stack direction="column" spacing={2}>
        <Paper elevation={9} sx={{ borderRadius: 8 }}>
          <GoogleButton
            sx={{ justifyContent: "start", width: "100%" }}
            onClick={handleGoogleSign}
          >
            <img
              src="assets/google-icon.svg"
              alt="Google"
              width="30"
              height="30"
            />
            <Typography variant="h6">Sign in with Google</Typography>
          </GoogleButton>
        </Paper>
      </Stack>
    </Container>
  );
}

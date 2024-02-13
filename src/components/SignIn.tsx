import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import {
  ButtonBase,
  Divider,
  IconButton,
  Paper,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { auth } from "./firebase";
import {
  GithubAuthProvider,
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

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      signInWithEmailAndPassword(auth, email, password).then(() => {
        enqueueSnackbar("Signed In", { variant: "success" });
        navigate("/");
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
  };

  const handleGitHubSign = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        enqueueSnackbar("Signed In", { variant: "success" });
        navigate("/");
      })
      .catch(() => {
        enqueueSnackbar("Error", { variant: "error" });
      });
  };

  const handleGoogleSign = () => {
    const provider = new GoogleAuthProvider();
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
      marginRight: 30, // Margine a destra dell'icona
      marginLeft: 15,
    },
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 4,
  });

  const GitHubButton = styled(ButtonBase)({
    color: "white",
    backgroundColor: "black",
    "& .MuiSvgIcon-root": {
      marginRight: 30, // Margine a destra dell'icona
      marginLeft: 15,
    },
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 4,
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          marginBottom: 1,
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
                  color: theme.palette.primary.main,
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    color: theme.palette.primary.main,
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
                  color: theme.palette.primary.main,
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    color: theme.palette.primary.main,
                  }}
                >
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Divider sx={{ marginBottom: 2 }}>Or</Divider>
      <Stack direction="column" spacing={2}>
        <Paper elevation={5}>
          <GoogleButton
            sx={{ justifyContent: "start", width: "100%" }}
            onClick={handleGoogleSign}
          >
            <img
              src="assets/google-icon.svg"
              alt="Google"
              width="33"
              height="33"
            />
            <Typography variant="h6">Sign in with Google</Typography>
          </GoogleButton>
        </Paper>
        <Paper elevation={5}>
          <GitHubButton
            sx={{
              justifyContent: "start",
              width: "100%",
            }}
            onClick={handleGitHubSign}
          >
            <GitHubIcon fontSize="large" />
            <Typography variant="h6">Sign in with GitHub</Typography>
          </GitHubButton>
        </Paper>
      </Stack>
    </Container>
  );
}

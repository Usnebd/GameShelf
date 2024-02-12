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
import FacebookIcon from "@mui/icons-material/Facebook";
import { auth } from "./firebase";
import {
  FacebookAuthProvider,
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

  const handleFacebookSign = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };

  const handleGoogleSign = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
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

  // Componente Button personalizzato per Facebook
  const FacebookButton = styled(ButtonBase)({
    color: "white",
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
          marginBottom: 2,
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
            sx={{ my: 1, pt: 1.3, pb: 1.3 }}
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
              src="public/assets/google-icon.svg"
              alt="Google"
              width="33"
              height="33"
            />
            <Typography variant="h6">Sign in with Google</Typography>
          </GoogleButton>
        </Paper>
        <Paper elevation={5}>
          <FacebookButton
            sx={{
              bgcolor: "primary.main",
              justifyContent: "start",
              width: "100%",
            }}
            onClick={handleFacebookSign}
          >
            <FacebookIcon fontSize="large" />
            <Typography variant="h6">Sign in with Facebook</Typography>
          </FacebookButton>
        </Paper>
      </Stack>
    </Container>
  );
}

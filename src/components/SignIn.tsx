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
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth } from "./firebase-conf";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default function SignIn() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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
      await signInWithEmailAndPassword(auth, email, password);
      enqueueSnackbar("Signed In", { variant: "success" });
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        enqueueSnackbar("Wrong Credentials", { variant: "error" });
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
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
            sx={{ mt: 3, mb: 2, pt: 1.3, pb: 1.3 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                to="/password-reset"
                style={{ textDecoration: "none", color: "primary.main" }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    color: "primary.contrastText",
                  }}
                >
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/sign-up"
                style={{ textDecoration: "none", color: "primary.main" }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    color: "primary.contrastText",
                  }}
                >
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

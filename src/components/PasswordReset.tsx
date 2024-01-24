import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase-conf";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const isValidEmail = (email: string) => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.indexOf(".", atIndex);

    // Verifica se "@" è presente e "." è dopo "@"
    return atIndex !== -1 && dotIndex !== -1 && dotIndex > atIndex;
  };
  const handleSendPasswordResetEmail = async () => {
    if (isValidEmail(email)) {
      try {
        await sendPasswordResetEmail(auth, email);
        setError(false);
        setEmailSent(true);
      } catch (error) {
        setEmailSent(false);
      }
    } else {
      setError(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" mb={3}>
          Recupero Password
        </Typography>
        {emailSent ? (
          <Typography mb={3}>
            Un link di reset password è stato inviato all'indirizzo email
            specificato.
          </Typography>
        ) : (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Indirizzo Email"
              name="email"
              autoComplete="email"
              error={error}
              helperText={error ? "Invalid mail format" : false}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendPasswordResetEmail}
            >
              Invia Link di Reset Password
            </Button>
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </>
        )}
        <Button
          fullWidth
          onClick={() => navigate("/sign-in")}
          sx={{ fontWeigth: "bold" }}
        >
          Torna al Login
        </Button>
      </Box>
    </Container>
  );
}

export default PasswordReset;

import { useContext, useState } from "react";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import { UserContext } from "../App";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { useSnackbar } from "notistack";

function Account() {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(UserContext);
  const [changeName, setChangeName] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [modifiedProfile, setModifiedProfile] = useState("");

  const handleSaveChanges = () => {
    if (auth.currentUser) {
      if (changePassword) {
        if (newPassword.length >= 6) {
          setPasswordError(false);
          updatePassword(auth.currentUser, newPassword)
            .then(() => {
              enqueueSnackbar("Password Updated", { variant: "success" });
            })
            .catch(() => {
              enqueueSnackbar("Error", { variant: "error" });
            });
        } else {
          setPasswordError(true);
        }
      } else {
        if (newFirstName.length == 0) {
          setFirstNameError(true);
        } else {
          setFirstNameError(false);
        }
        if (newLastName.length == 0) {
          setLastNameError(true);
        } else {
          setLastNameError(false);
        }
        if (newFirstName.length > 0 && newLastName.length > 0) {
          updateProfile(auth.currentUser, {
            displayName: newFirstName.concat("." + newLastName),
          })
            .then(() => {
              setModifiedProfile(newFirstName.concat("." + newLastName));
              enqueueSnackbar("Profile Updated", { variant: "success" });
            })
            .catch(() => {
              enqueueSnackbar("Error", { variant: "error" });
            });
        }
      }
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        mx={isSmScreen ? 5 : 5}
        mb={5}
        textAlign={isSmScreen ? "start" : "center"}
      >
        {!user ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={20}
          >
            <Typography variant="h5">
              Effettua l'accesso per visualizzare/modificare le informazioni sul
              tuo profilo.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack
              mt={4}
              direction={isSmScreen ? "row" : "column"}
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Typography
                variant="h3"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Account
              </Typography>
              {/* Aggiungi eventuali altri elementi nella barra superiore */}
            </Stack>
            <Stack
              direction={isSmScreen ? "row" : "column"}
              mt={isSmScreen ? 10 : 5}
              mx={isSmScreen ? 0 : 5}
              spacing={2}
            >
              {/* Informazioni sull'utente */}
              <Stack direction={"column"} spacing={2}>
                <Typography variant={isSmScreen ? "h5" : "body1"} mt={2}>
                  Username:{" "}
                  {modifiedProfile !== "" ? modifiedProfile : user?.displayName}
                </Typography>
                <Typography variant={isSmScreen ? "h5" : "body1"}>
                  Email: {user?.email}
                </Typography>
              </Stack>

              {/* Altri elementi, ad esempio: */}
              <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />

              {/* Lista delle opzioni/account */}
              <List sx={{ mt: isMdScreen ? 0 : 5 }}>
                <ListItemButton
                  sx={{ borderRadius: 1 }}
                  onClick={() => {
                    setChangePassword(false);
                    setChangeName(true);
                  }}
                >
                  <ListItemText primary="Change First Name/Last Name" />
                </ListItemButton>
                <ListItemButton
                  sx={{ borderRadius: 1 }}
                  onClick={() => {
                    setChangePassword(true);
                    setChangeName(false);
                  }}
                >
                  <ListItemText primary="Change Password" />
                </ListItemButton>
                {/* Aggiungi altre opzioni in base alle necessità */}
              </List>
            </Stack>
            <Box width={"100%"} display={"flex"} justifyContent={"center"}>
              {/* Form per il cambio del nome utente */}
              {changeName && (
                <Box mt={2}>
                  <TextField
                    label="New First Name"
                    variant="outlined"
                    fullWidth
                    value={newFirstName}
                    error={firstNameError}
                    helperText={firstNameError ? "Empty" : false}
                    onChange={(e) => setNewFirstName(e.target.value)}
                  />
                  <TextField
                    label="New Last Name"
                    variant="outlined"
                    fullWidth
                    value={newLastName}
                    error={lastNameError}
                    helperText={lastNameError ? "Empty" : false}
                    onChange={(e) => setNewLastName(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}

              {/* Form per il cambio della password */}
              {changePassword && (
                <Box mt={5}>
                  <TextField
                    label="New Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={newPassword}
                    error={passwordError}
                    helperText={passwordError ? "At least 6 characters" : false}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default Account;

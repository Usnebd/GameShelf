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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { UserContext } from "../App";
import {
  AuthCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  query,
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";

function Account() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const { enqueueSnackbar } = useSnackbar();
  const { user, handleDeleteCart } = useContext(UserContext);
  const [changeName, setChangeName] = useState(false);
  const [credential, setCredential] = useState<AuthCredential | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [Password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [modifiedProfile, setModifiedProfile] = useState("");
  const handleChangeName = () => {
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
    if (newFirstName.length > 0 && newLastName.length > 0 && auth.currentUser) {
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
  };

  const handleDelete = async () => {
    handleDeleteCart();
    if (user) {
      try {
        const q = query(collection(db, `users/${user.email}/orders`));
        const querySnapshot = await getDocs(q);
        const totalOrders = querySnapshot.size;
        const batchSize = 500; // Numero massimo di eliminazioni per batch

        // Calcola il numero di batch necessari
        const numBatches = Math.ceil(totalOrders / batchSize);
        // Elimina documenti in batch più piccoli
        for (let i = 0; i < numBatches; i++) {
          const batch = writeBatch(db);
          const batchStart = i * batchSize;
          const batchEnd = Math.min(batchStart + batchSize, totalOrders);
          querySnapshot.docs
            .slice(batchStart, batchEnd)
            .forEach((docSnapshot) => {
              let docRef;
              if (user) {
                docRef = doc(db, `users/${user.email}/orders`, docSnapshot.id);
              }
              if (docRef) {
                batch.delete(docRef);
              }
            });

          // Commit del batch
          await batch.commit();
        }

        enqueueSnackbar("Order History Deleted", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      }
    }
  };

  const handleDeleteAccount = () => {
    if (auth.currentUser) {
      if (credential) {
        reauthenticateWithCredential(auth.currentUser, credential)
          .then(() => {
            if (auth.currentUser) {
              deleteUser(auth.currentUser).then(() => {
                handleDelete();
                navigate("/");
                enqueueSnackbar("Account Deleted", {
                  variant: "success",
                });
              });
            }
          })
          .catch((error) => {
            if (error.code == "auth/invalid-credential") {
              enqueueSnackbar("Wrong Password", {
                variant: "error",
              });
            } else {
              enqueueSnackbar("Error", {
                variant: "error",
              });
            }
          });
      } else if (auth.currentUser.email) {
        const credentials: AuthCredential = EmailAuthProvider.credential(
          auth?.currentUser?.email,
          Password
        );
        reauthenticateWithCredential(auth.currentUser, credentials)
          .then(() => {
            if (auth.currentUser) {
              deleteUser(auth.currentUser).then(() => {
                handleDelete();
                navigate("/");
                enqueueSnackbar("Account Deleted", {
                  variant: "success",
                });
              });
            }
          })
          .catch((error) => {
            if (error.code == "auth/invalid-credential") {
              enqueueSnackbar("Wrong Password", {
                variant: "error",
              });
            } else {
              enqueueSnackbar("Error", {
                variant: "error",
              });
            }
          });
      }
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setNewPasswordError(true);
    } else {
      setNewPasswordError(false);
    }
    if (Password.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (
      newPassword.length >= 6 &&
      Password.length >= 6 &&
      auth?.currentUser?.email
    ) {
      const credential: AuthCredential = EmailAuthProvider.credential(
        auth?.currentUser?.email,
        Password
      );
      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          if (auth.currentUser) {
            updatePassword(auth.currentUser, newPassword)
              .then(() => {
                if (auth.currentUser?.email) {
                  setCredential(
                    EmailAuthProvider.credential(
                      auth?.currentUser?.email,
                      newPassword
                    )
                  );
                }
                enqueueSnackbar("Password Updated", { variant: "success" });
              })
              .catch(() => {
                enqueueSnackbar("Error", { variant: "error" });
              });
          }
        })
        .catch((error) => {
          if (error.code == "auth/invalid-credential") {
            enqueueSnackbar("Wrong Password", { variant: "error" });
          } else {
            enqueueSnackbar("Error", { variant: "error" });
          }
        });
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
            </Stack>
            <Stack
              direction={isSmScreen ? "row" : "column"}
              mt={isSmScreen ? 10 : 5}
              spacing={2}
            >
              <Stack direction={"column"} spacing={2}>
                <Stack
                  direction={isSmScreen ? "row" : "column"}
                  spacing={1}
                  alignItems={"center"}
                >
                  <Typography
                    variant={isSmScreen ? "h6" : "body1"}
                    fontWeight={"bold"}
                  >
                    Username:
                  </Typography>
                  <Typography variant={isSmScreen ? "h6" : "body1"}>
                    {modifiedProfile !== ""
                      ? modifiedProfile
                      : user?.displayName}
                  </Typography>
                </Stack>
                <Stack
                  direction={isSmScreen ? "row" : "column"}
                  spacing={1}
                  alignItems={"center"}
                >
                  <Typography
                    variant={isSmScreen ? "h6" : "body1"}
                    fontWeight={"bold"}
                  >
                    Email:
                  </Typography>
                  <Typography variant={isSmScreen ? "h6" : "body1"}>
                    {user?.email}
                  </Typography>
                </Stack>
              </Stack>
              <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
              <List sx={{ mt: isMdScreen ? 0 : 5, mx: isSmScreen ? 0 : 5 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.secondary.main
                          : theme.palette.primary.main,
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.secondary.contrastText
                          : theme.palette.primary.contrastText,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.secondary.main
                          : theme.palette.primary.main,
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.secondary.contrastText
                          : theme.palette.primary.contrastText,
                    },
                  }}
                  onClick={() => {
                    setChangePassword(false);
                    setShowDelete(false);
                    setPassword("");
                    setNewPassword("");
                    setChangeName((prev) => !prev);
                  }}
                >
                  <ListItemText primary="Change First Name/Last Name" />
                </ListItemButton>
                {auth?.currentUser?.providerData.find(
                  (provider) => provider?.providerId === "password"
                ) && (
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? theme.palette.secondary.main
                            : theme.palette.primary.main,
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.secondary.contrastText
                            : theme.palette.primary.contrastText,
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? theme.palette.secondary.main
                            : theme.palette.primary.main,
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.secondary.contrastText
                            : theme.palette.primary.contrastText,
                      },
                    }}
                    onClick={() => {
                      setChangeName(false);
                      setShowDelete(false);
                      setPassword("");
                      setNewPassword("");
                      setChangePassword((prev) => !prev);
                    }}
                  >
                    <ListItemText primary="Change Password" />
                  </ListItemButton>
                )}
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
                    },
                  }}
                  onClick={() => {
                    setChangePassword(false);
                    setChangeName(false);
                    setShowDelete(!showDelete);
                    if (
                      user.providerData.find(
                        (data) => data.providerId == "google.com"
                      )
                    ) {
                      reauthenticateWithPopup(user, new GoogleAuthProvider())
                        .then(() => {
                          if (auth.currentUser) {
                            deleteUser(auth.currentUser).then(() => {
                              handleDelete();
                              navigate("/");
                              enqueueSnackbar("Account Deleted", {
                                variant: "success",
                              });
                            });
                          }
                        })
                        .catch((error) => {
                          if (error.code == "auth/invalid-credential") {
                            enqueueSnackbar("Wrong Password", {
                              variant: "error",
                            });
                          } else {
                            enqueueSnackbar("Error", {
                              variant: "error",
                            });
                          }
                        });
                    }
                  }}
                >
                  <ListItemText primary="Delete Account" />
                </ListItemButton>
              </List>
            </Stack>
            <Box width={"100%"} display={"flex"} justifyContent={"center"}>
              {changeName && (
                <Box mt={2}>
                  <TextField
                    margin="normal"
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
                    onClick={handleChangeName}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
              {changePassword && (
                <Box mt={2}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    variant="outlined"
                    value={Password}
                    error={passwordError}
                    InputProps={{
                      autoComplete: "current-password", // Specify autocomplete type for password
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText={passwordError ? "At least 6 characters" : false}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="NewPassword"
                    label="NewPassword"
                    type={showNewPassword ? "text" : "password"}
                    id="NewPassword"
                    variant="outlined"
                    value={newPassword}
                    error={newPasswordError}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setShowNewPassword(!showNewPassword);
                            }}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      newPasswordError ? "At least 6 characters" : false
                    }
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleChangePassword}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
              {user.providerData.find(
                (data) => data.providerId == "google.com"
              ) == undefined &&
                showDelete && (
                  <Box mt={2}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      variant="outlined"
                      value={Password}
                      error={passwordError}
                      InputProps={{
                        autoComplete: "current-password", // Specify autocomplete type for password
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={
                        passwordError ? "At least 6 characters" : false
                      }
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDeleteAccount}
                      sx={{ mt: 2 }}
                    >
                      Delete
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

import {
  Backdrop,
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-conf";
import { signOut } from "firebase/auth";
import { AuthContext, SnackBarContext } from "../App";

interface DialProps {
  mode: boolean;
  toggleMode: () => void;
  setItem: (value: boolean) => void;
}

export const Dial: React.FC<DialProps> = ({ mode, toggleMode, setItem }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { handleSnackbarOpen, handleSnackMessage } =
    useContext(SnackBarContext);
  const actions = [
    { icon: <HomeIcon />, name: "Home", link: "/" },
    { icon: <MenuBookIcon />, name: "Menu", link: "/Menu" },
    { icon: <ShoppingCartIcon />, name: "Orders", link: "/Orders" },
    {
      icon: mode ? <ModeNightIcon /> : <LightModeIcon />,
      name: "Theme",
    },
    {
      icon: user !== null ? <LogoutIcon /> : <LoginIcon />,
      name: user !== null ? "Logout" : "Login",
      onClick: () => {
        if (user !== null) {
          signOut(auth)
            .then(() => {
              handleSnackMessage("Signed Out!");
              handleSnackbarOpen();
              navigate("/");
            })
            .catch((error) => {
              console.error("Sign out error:", error);
            });
        } else {
          navigate("/sign-in");
        }
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      position="fixed"
      sx={{
        bottom: "16px",
        right: "16px",
        display: { xs: "block", md: "none" },
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            FabProps={{
              sx: {
                color: mode ? "primary.contrastText" : "secondary.contrastText",
              },
            }}
            onClick={() => {
              if (action.name !== "Theme") {
                if (action.link !== undefined) {
                  navigate(action.link);
                }
                if (action.onClick !== undefined) {
                  action.onClick();
                }
              } else {
                toggleMode();
                setItem(!mode);
              }
            }}
            tooltipOpen
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default Dial;

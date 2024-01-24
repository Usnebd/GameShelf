import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  styled,
} from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Navbar.css";
import { AppBar, Button } from "@mui/material";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { auth } from "./firebase-conf";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AuthContext, SnackBarContext } from "../App";

interface NavbarProps {
  mode: boolean;
  toggleMode: () => void;
  setItem: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  toggleMode,
  setItem,
}) => {
  const { user } = useContext(AuthContext);
  const { handleSnackbarOpen, handleSnackMessage } =
    useContext(SnackBarContext);
  const navigate = useNavigate();
  const pages = ["Home", "Menu", "Orders"];
  const LogoText = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    marginRight: theme.spacing(0.7),
    whiteSpace: "nowrap",
    color: "inherit",
  }));
  const [value, setValue] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        handleSnackMessage("Signed Out!");
        handleSnackbarOpen();
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenMenu = (event: {
    currentTarget: React.SetStateAction<HTMLElement | null>;
  }) => {
    if (window.innerWidth < 900) {
      navigate("/account");
    }
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          top: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Box
            component={Link}
            to="/"
            sx={{
              color: "inherit",
              textDecoration: "none",
              display: { xs: "none", md: "flex" },
            }}
          >
            <LogoText>MyChiosco</LogoText>
            <LunchDiningIcon fontSize="large"></LunchDiningIcon>
          </Box>
          <Box
            component={Link}
            to="/"
            pl={6}
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1, // Fai espandere questo elemento per occupare lo spazio rimanente
              alignItems: "center",
              textDecoration: "none",
              justifyContent: "center",
              color: "inherit",
            }}
          >
            <LogoText>MyChiosco</LogoText>
            <LunchDiningIcon fontSize="large"></LunchDiningIcon>
          </Box>
          <Box
            ml={3}
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Tabs
              value={useLocation().pathname.includes("/account") ? null : value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              {pages.map((page) => (
                <Tab
                  key={page}
                  label={page}
                  component={Link}
                  to={page != "Home" ? page : "/"}
                  sx={{
                    p: 1,
                    fontSize: 17,
                    color: "white",
                  }}
                />
              ))}
            </Tabs>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Opzionale, per allineare verticalmente
              justifyContent: "space-between",
              // Altre proprietà di stile necessarie
            }}
          >
            <Tooltip
              title="Dark Mode"
              sx={{ mr: 1, display: { xs: "none", md: "block" } }}
            >
              <Box>
                {mode ? (
                  <ModeNightIcon sx={{ verticalAlign: "middle" }} />
                ) : (
                  <LightModeIcon sx={{ verticalAlign: "middle" }} />
                )}
                <Switch
                  color="secondary"
                  checked={mode}
                  onChange={() => {
                    toggleMode();
                    setItem(!mode);
                  }}
                />
              </Box>
            </Tooltip>
            {user !== null ? (
              <>
                <IconButton
                  onClick={handleOpenMenu}
                  sx={{
                    textTransform: "none",
                    color: "inherit",
                  }}
                >
                  <Avatar>{user?.displayName?.charAt(0)}</Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/account");
                      handleCloseMenu();
                    }}
                    sx={{ display: { xs: "none", md: "flex" } }}
                  >
                    Account
                  </MenuItem>
                  <MenuItem
                    sx={{ display: { xs: "none", md: "flex" } }}
                    onClick={() => {
                      handleCloseMenu();
                      handleSignOut();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => {
                  navigate("/sign-in");
                }}
                variant="outlined"
                color="secondary"
                sx={{
                  display: { xs: "none", md: "flex" },
                  textTransform: "none",
                }}
              >
                <Typography>Sign In</Typography>
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

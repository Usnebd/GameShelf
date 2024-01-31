import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Navbar.css";
import { AppBar, Button } from "@mui/material";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { UserContext } from "../App";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { enqueueSnackbar } from "notistack";

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
  const { user } = useContext(UserContext);
  const { selectedItems } = useContext(UserContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const pages = ["Home", "Menu", "Orders"];
  const LogoText = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    marginRight: theme.spacing(0.7),
    whiteSpace: "nowrap",
    userSelect: "none",
    color: "inherit",
  }));
  const StyledBadge = styled(Badge)(() => ({
    "& .MuiBadge-badge": {
      top: 5,
      padding: "0 4px",
    },
  }));
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        enqueueSnackbar("Signed Out", { variant: "info" });
        navigate("/");
      })
      .catch(() => {
        enqueueSnackbar("Error while Sign Out", { variant: "error" });
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
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1, // Fai espandere questo elemento per occupare lo spazio rimanente
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <LogoText>MyChiosco</LogoText>
            <LunchDiningIcon fontSize="large"></LunchDiningIcon>
          </Box>
          <Box
            ml={2}
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={page != "Home" ? page : "/"}
                sx={{
                  mx: 0.5,
                  py: 1.1,
                  px: 2.5,
                  fontSize: 17,
                  color:
                    theme.palette.mode == "dark" ? "secondary.main" : "white",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Stack
            direction={"row"}
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tooltip
              title="Dark Mode"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box>
                {mode ? (
                  <ModeNightIcon sx={{ verticalAlign: "middle" }} />
                ) : (
                  <LightModeIcon sx={{ verticalAlign: "middle" }} />
                )}
                <Switch
                  aria-label="toggleMode"
                  color="secondary"
                  checked={mode}
                  onChange={() => {
                    toggleMode();
                    setItem(!mode);
                  }}
                />
              </Box>
            </Tooltip>
            <Tooltip title="Go to Cart">
              <IconButton color="inherit" onClick={() => navigate("/checkout")}>
                <StyledBadge
                  badgeContent={selectedItems.length}
                  color="secondary"
                >
                  <ShoppingCartIcon fontSize="large" />
                </StyledBadge>
              </IconButton>
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
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      color: "black",
                    }}
                  >
                    {user ? user.displayName?.charAt(0) : null}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/account");
                      handleCloseMenu();
                    }}
                  >
                    Account
                  </MenuItem>
                  <MenuItem
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
                color={theme.palette.mode == "dark" ? "secondary" : "inherit"}
                sx={{
                  textTransform: "none",
                }}
              >
                <Typography>Sign In</Typography>
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

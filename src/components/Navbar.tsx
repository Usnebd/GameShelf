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
  useMediaQuery,
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
  const { user, selectedItems } = useContext(UserContext);
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
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
          py: isSmScreen ? 0 : 0.5,
        }}
      >
        <Toolbar>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              flexGrow: isMdScreen ? "inherit" : 1, // Fai espandere questo elemento per occupare lo spazio rimanente
              alignItems: isSmScreen ? "inherit" : "center",
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
                  inputProps={{ "aria-label": "toggleMode" }}
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
              <IconButton
                color="inherit"
                onClick={() => navigate("/checkout")}
                size="large"
              >
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
                    {user ? user.displayName?.charAt(0).toUpperCase() : null}
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
                    <Typography variant="h6">Account</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      handleSignOut();
                    }}
                  >
                    <Typography variant="h6">Logout</Typography>
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

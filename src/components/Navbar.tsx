import {
  Box,
  Divider,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import { Toolbar } from "@mui/material";
import { List } from "@mui/material";
import { Typography } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Navbar.css";
import { AppBar, Button, IconButton, Stack } from "@mui/material";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import React from "react";
import { Link } from "react-router-dom";

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
  const pages = ["Home", "Menu", "Orders"];
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorPosition, setAnchor] = useState<"left" | "bottom" | undefined>(
    "left"
  );
  const [drawerWidth, setDrawerWidth] = useState("180px");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setDrawerOpen(false);
      }
      if (window.innerWidth >= 600) {
        setAnchor("left");
        setDrawerWidth("180px");
      } else {
        setAnchor("bottom");
        setDrawerWidth("100%");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  const LogoText = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    marginRight: theme.spacing(0.7),
    whiteSpace: "nowrap",
    color: "inherit",
  }));
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
          <Box position="fixed" sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              edge="start"
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={() =>
                setDrawerOpen((prevIsDrawerOpen) => !prevIsDrawerOpen)
              }
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1, // Fai espandere questo elemento per occupare lo spazio rimanente
              justifyContent: "center",
              alignItems: "center",
              textDecoration: "none",
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
              value={value}
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
                    fontSize: 16,
                    color: "white",
                  }}
                />
              ))}
            </Tabs>
          </Box>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <Tooltip title="Dark Mode">
              <Box sx={{ display: "inline" }}>
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
                    setItem(!mode); // Chiamata a setItem con il nuovo valore di mode
                  }}
                />
              </Box>
            </Tooltip>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                textTransform: "none",
              }}
            >
              <Typography>Sign In</Typography>
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={anchorPosition}
        open={isDrawerOpen}
        transitionDuration={130}
        onClose={() => setDrawerOpen(false)}
        sx={{
          transitionTimingFunction: "ease-in-out",
          display: { xs: "flex", md: "none" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <Toolbar sx={{ display: { xs: "none", sm: "block" } }} />
        <List disablePadding>
          {pages.map((page) => (
            <React.Fragment key={page + "-list"}>
              <ListItem
                disablePadding
                onClick={() => setDrawerOpen(false)}
                sx={{ width: drawerWidth }}
              >
                <ListItemButton
                  component={Link}
                  to={page != "Home" ? page : "/"}
                >
                  <ListItemText>
                    <Typography variant="h6" align="center">
                      {page}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider key={page + "-divider"} />
            </React.Fragment>
          ))}
          <ListItem key={"DarkModeSwitch"}>
            <Box
              sx={{
                width: drawerWidth,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
                  setItem(!mode); // Chiamata a setItem con il nuovo valore di mode
                }}
              />
            </Box>
          </ListItem>
          <Divider key={"DarkModeSwitch-divider"} />
          <ListItem
            disablePadding
            onClick={() => setDrawerOpen(false)}
            sx={{
              width: drawerWidth,
              justifyContent: "center",
              backgroundColor: "secondary.main",
            }}
          >
            <ListItemButton>
              <ListItemText sx={{ width: drawerWidth }}>
                <Typography
                  color="secondary.contrastText"
                  variant="h6"
                  align="center"
                >
                  Sign In
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
      </Drawer>
    </>
  );
};

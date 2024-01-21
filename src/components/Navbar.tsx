import { Box, Divider, Switch, Tooltip, styled } from "@mui/material";
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
}

export const Navbar: React.FC<NavbarProps> = ({ mode, toggleMode }) => {
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
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              edge="start"
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
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
              color: "inherit",
              textDecoration: "none",
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            <LogoText>MyChiosco</LogoText>
            <LunchDiningIcon fontSize="large"></LunchDiningIcon>
          </Box>
          <Box ml={2} sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                component={Link}
                to={page != "Home" ? page : "/"}
                key={page}
                color="inherit"
                variant="text"
                sx={{ display: "block" }}
              >
                <Typography pl={1} pr={1} py={0.8}>
                  {page}
                </Typography>
              </Button>
            ))}
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
                  onChange={() => toggleMode()}
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
        transitionDuration={300}
        onClose={() => setDrawerOpen(false)}
        sx={{
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
                onChange={() => toggleMode()}
              />
            </Box>
          </ListItem>
          <Divider key={"DarkModeSwitch-divider"} />
          <ListItem
            key={"signButton"}
            onClick={() => setDrawerOpen(false)}
            sx={{
              width: drawerWidth,
              justifyContent: "center",
              mt: 1.5,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              sx={{ textTransform: "none" }}
            >
              <Typography>Sign in</Typography>
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

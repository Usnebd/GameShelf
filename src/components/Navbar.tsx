import { Box, Switch, Tab, Tabs, Tooltip, styled } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Navbar.css";
import { AppBar, Button, Stack } from "@mui/material";
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

  const LogoText = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    marginRight: theme.spacing(0.7),
    whiteSpace: "nowrap",
    color: "inherit",
  }));
  const [value, setValue] = React.useState(0);

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
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
                    fontSize: 17,
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
    </>
  );
};

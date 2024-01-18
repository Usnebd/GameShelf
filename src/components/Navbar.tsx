import { Box, Divider, Switch } from "@mui/material";
import { useState } from "react";
import { Drawer } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Toolbar } from "@mui/material";
import { List } from "@mui/material";
import { Typography } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import "./Navbar.css";
import { AppBar, Button, IconButton, Stack } from "@mui/material";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import Content from "./Content";

export default function Navbar() {
  const pages = ["Home", "Menu", "Orders"];
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Box
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              color: "inherit",
              textDecoration: "none",
              display: { xs: "none", md: "flex" },
            }}
          >
            <Typography
              variant="h5"
              mr={0.7}
              noWrap
              sx={{
                color: "inherit",
              }}
            >
              MyChiosco
            </Typography>
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
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              color: "inherit",
              textDecoration: "none",
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h5"
              mr={0.7}
              noWrap
              sx={{
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              MyChiosco
            </Typography>
            <LunchDiningIcon fontSize="large"></LunchDiningIcon>
          </Box>

          <Box ml={2} sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                color="secondary"
                sx={{ my: 2, display: "block" }}
              >
                <Typography pl={1} pr={1}>
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
            <Box sx={{ display: "inline" }}>
              <ModeNightIcon sx={{ verticalAlign: "middle" }}></ModeNightIcon>
              <Switch></Switch>
            </Box>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ textTransform: "none" }}
            >
              <Typography>Sign in</Typography>
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ textTransform: "none" }}
            >
              <Typography>Sign Up</Typography>
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: "flex", md: "none" },
          width: "200px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "200px",
          },
        }}
      >
        <Toolbar />
        <List>
          {pages.map((page) => (
            <ListItem
              disablePadding
              onClick={() => setDrawerOpen(false)}
              sx={{ width: "200px" }}
            >
              <ListItemButton>
                <ListItemText>
                  <Typography variant="h6">{page}</Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

import { Box, Divider, Switch } from "@mui/material";
import { useEffect, useState } from "react";
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

export default function Navbar() {
  const pages = ["Home", "Menu", "Orders"];
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorPosition, setAnchor] = useState<"left" | "bottom" | undefined>(
    "left"
  );
  const [drawerWidth, setDrawerWidth] = useState("180px");

  useEffect(() => {
    const handleResize = () => {
      // Chiudi il Drawer se la dimensione della finestra è "md"
      if (window.innerWidth >= 900) {
        //900 = md
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

    // Aggiungi l'evento di ridimensionamento
    window.addEventListener("resize", handleResize);

    // Pulisci l'evento di ridimensionamento al momento del cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
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
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: "flex", md: "none" },
          zIndex: (theme) => theme.zIndex.appBar + 1,
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <List>
          {pages.map((page) => (
            <>
              <ListItem
                disablePadding
                onClick={() => setDrawerOpen(false)}
                sx={{ width: drawerWidth }}
              >
                <ListItemButton>
                  <ListItemText>
                    <Typography variant="h6" align="center">
                      {page}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
            </>
          ))}
          <ListItem>
            <Box
              sx={{
                width: drawerWidth,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ModeNightIcon sx={{ verticalAlign: "middle" }}></ModeNightIcon>
              <Switch></Switch>
            </Box>
          </ListItem>
          <Divider />
          <ListItem
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
    </Box>
  );
}

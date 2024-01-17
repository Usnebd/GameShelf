import { Box, Divider, Switch, useMediaQuery } from "@mui/material";
import { Drawer } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Toolbar } from "@mui/material";
import { List } from "@mui/material";
import { Typography } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import "./Navbar.css";
import { AppBar, Button, IconButton, Stack } from "@mui/material";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import Content from "./Content";

const drawerWidth = 230;

export default function Navbar() {
  const pages = ["Home", "Menu", "Orders"];
  const sidelist = ["Home", "Menu", "Orders"];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          opacity: "0.95",
        }}
      >
        <Toolbar>
          <Stack spacing={0} direction="row" sx={{ flexGrow: 1 }}>
            {pages.map((page) => (
              <Button
                key={page}
                variant="text"
                color="secondary"
                sx={{ textTransform: "none" }}
              >
                <Typography variant="h6" pl={1.5} pr={1.5}>
                  {page}
                </Typography>
              </Button>
            ))}
          </Stack>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              display: { xs: "none", sm: "block" },
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
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            borderRight: "none",
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" noWrap component="div" mr={0.5}>
            MyChiosco
          </Typography>
          <LunchDiningIcon fontSize="large"></LunchDiningIcon>
        </Toolbar>
        <Box id="sidebar">
          <List>
            {sidelist.map((text) => (
              <>
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    sx={{
                      paddingBottom: 1.5,
                      paddingTop: 1.5,
                    }}
                  >
                    <ListItemText
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">{text}</Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Box>
      </Drawer>
      <Content></Content>
    </Box>
  );
}

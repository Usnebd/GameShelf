import { Box } from "@mui/material";
import { Drawer } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Toolbar } from "@mui/material";
import { List } from "@mui/material";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import "./Navbar.css";
import { AppBar, Button, IconButton, Stack } from "@mui/material";
import Content from "./Content";

const drawerWidth = 240;

export default function Navbar() {
  const pages = ["Home", "Menu", "Orders"];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Stack spacing={2} direction="row" sx={{ flexGrow: 1 }}>
            {pages.map((page) => (
              <Button key={page} variant="text" color="secondary">
                <Typography>{page}</Typography>
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
            <Button variant="outlined" color="secondary">
              Sign in
            </Button>
            <Button variant="contained" color="secondary">
              Sign Up
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
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            pr={1}
            sx={{ fontWeight: "bold" }}
          >
            MyChiosco
          </Typography>
          <LunchDiningIcon></LunchDiningIcon>
        </Toolbar>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Content></Content>
    </Box>
  );
}

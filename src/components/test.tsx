import { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { Box, Typography } from "@mui/material";

function Test() {
  const { sendNotification } = useContext(UserContext);
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      sendNotification("This is a Test Notification");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendNotification("This is a Test Notification");
        }
      });
    }
  }, []);

  return (
    <Box
      width={"100%"}
      justifyContent={"center"}
      display={"flex"}
      alignItems={"center"}
    >
      <Typography variant="h2" mt={20}>
        Test Page
      </Typography>
    </Box>
  );
}

export default Test;

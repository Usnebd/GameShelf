import { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { Box, Typography } from "@mui/material";

function Test() {
  const { sendNotification } = useContext(UserContext);
  useEffect(() => {
    sendNotification("This is a Test Notification");
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

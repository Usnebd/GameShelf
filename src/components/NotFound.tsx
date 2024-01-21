import { Box, Typography } from "@mui/material";

function NotFound() {
  return (
    <Box
      sx={{
        marginTop: 21,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography fontWeight="Bold" sx={{ fontSize: "3vw" }}>
        404 - Pagina non trovata
      </Typography>
      <Typography fontWeight="Bold" mt={2} sx={{ fontSize: "3vw" }}>
        ¯\_(ツ)_/¯
      </Typography>
    </Box>
  );
}

export default NotFound;

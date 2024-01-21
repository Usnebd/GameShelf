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
      <Typography
        fontWeight="Bold"
        variant="h5"
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Cambiato da justifyItems a justifyContent
            alignItems: "center", // Aggiunto per centrare verticalmente
          }}
        >
          <Box>404 - Pagina non trovata</Box>
          <Box mt={2}>¯\_(ツ)_/¯</Box>
        </Box>
      </Typography>
      <Typography
        fontWeight="Bold"
        variant="h4"
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Cambiato da justifyItems a justifyContent
            alignItems: "center", // Aggiunto per centrare verticalmente
          }}
        >
          <Box>404 - Pagina non trovata</Box>
          <Box mt={2}>¯\_(ツ)_/¯</Box>
        </Box>
      </Typography>
    </Box>
  );
}

export default NotFound;

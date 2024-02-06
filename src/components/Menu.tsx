import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { UserContext } from "../App";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
import getMenuData, { MenuData } from "./getMenuData.ts";

export function loader() {
  return getMenuData("/assets/data.json");
}

function Menu() {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  let { category, id } = useParams();
  const { products } = useContext(UserContext);
  const menuData: MenuData = useLoaderData() as MenuData;
  if (category !== undefined) {
    category =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }
  const [categorySelected, setCategory] = useState(
    category ? category : "Antipasti"
  );
  const isValidCategory =
    categorySelected && Object.keys(products).includes(categorySelected);
  // Se la categoria non è valida, reindirizza a "/page-not-found"
  if (!isValidCategory) {
    navigate("/page-not-found");
  }
  const [loading, setLoading] = useState(products[categorySelected].length);

  const handleChange = (
    event: SelectChangeEvent<String>,
    _child: ReactNode
  ) => {
    setCategory(event.target.value as string);
    navigate(`/menu/${event.target.value.toLowerCase()}`);
  };
  useEffect(() => {
    const resetLoad = () => {
      if (id) {
        setLoading(1);
      } else {
        setLoading(products[categorySelected].length);
      }
    };
    return () => resetLoad();
  }, [categorySelected]);

  const handleLoad = () => {
    setLoading((prev) => prev - 1);
  };

  return (
    <Box mx={isSmScreen ? 5 : 2} textAlign={isSmScreen ? "start" : "center"}>
      <Stack mt={3} direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h3">Menu</Typography>
        <FormControl sx={{ minWidth: "180px" }}>
          <InputLabel id="Category">Category</InputLabel>
          <Select
            labelId="select-category"
            id="select-category"
            value={categorySelected}
            label="Category"
            onChange={handleChange}
          >
            <MenuItem value={"Antipasti"}>
              <Typography variant="h6">Antipasti</Typography>
            </MenuItem>
            <MenuItem value={"Primi"}>
              <Typography variant="h6">Primi</Typography>
            </MenuItem>
            <MenuItem value={"Secondi"}>
              <Typography variant="h6">Secondi</Typography>
            </MenuItem>
            <MenuItem value={"Desserts"}>
              <Typography variant="h6">Desserts</Typography>
            </MenuItem>
            <MenuItem value={"Bevande"}>
              <Typography variant="h6">Bevande</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack
        direction={isSmScreen ? "row" : "column"}
        spacing={5}
        mt={2.4}
        mx={isSmScreen ? 0 : 2}
      >
        <Box flexGrow={1} display="flex" justifyContent={"center"}>
          <Grid container spacing={2.5}>
            {id !== undefined ? (
              products[categorySelected].filter((x) => x.id == id).length ==
              0 ? (
                <Box
                  display="flex"
                  justifyContent={"center"}
                  width="100%"
                  alignContent={"center"}
                  mt={10}
                >
                  <Typography variant="h4">Product Not Found</Typography>
                </Box>
              ) : (
                products[categorySelected]
                  .filter((x) => x.id == id)
                  .map((item) => (
                    <Grid
                      item
                      key={item.id}
                      xs={12}
                      sm={4}
                      md={4}
                      lg={2.8}
                      xl={2.4}
                    >
                      <Card elevation={6} sx={{ borderRadius: 3 }}>
                        {loading > 0 ? (
                          <Skeleton width={"100%"} height={140} />
                        ) : (
                          <CardMedia
                            component="img"
                            loading="lazy"
                            alt={item.nome}
                            onLoad={handleLoad}
                            height="140"
                            src={
                              "/assets/images/" +
                              `${categorySelected}/` +
                              menuData[categorySelected].find(
                                (x) => x.name == item.nome
                              )?.src
                            }
                            sx={{ userSelect: "none" }}
                          />
                        )}
                        <CardContent>
                          {loading > 0 ? (
                            <>
                              <Typography variant="h5">
                                <Skeleton width={"100%"} />
                              </Typography>
                              <Typography variant="h6" mt={0.5}>
                                <Skeleton width={"40%"} />
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="h5">{item.nome}</Typography>
                              <Typography variant="h6" mt={0.5}>
                                {item.prezzo}€
                              </Typography>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
              )
            ) : (
              products[categorySelected].map((item) => (
                <Grid
                  item
                  key={item.id}
                  xs={12}
                  sm={4}
                  md={4}
                  lg={2.8}
                  xl={2.4}
                >
                  <Card elevation={6} sx={{ borderRadius: 3 }}>
                    {loading > 0 ? (
                      <Skeleton width={"100%"} height={140} />
                    ) : (
                      <CardMedia
                        component="img"
                        loading="lazy"
                        alt={item.nome}
                        onLoad={handleLoad}
                        height="140"
                        src={
                          "/assets/images/" +
                          `${categorySelected}/` +
                          menuData[categorySelected].find(
                            (x) => x.name == item.nome
                          )?.src
                        }
                        sx={{ userSelect: "none" }}
                      />
                    )}
                    <CardContent>
                      {loading > 0 ? (
                        <>
                          <Typography variant="h5">
                            <Skeleton width={"100%"} />
                          </Typography>
                          <Typography variant="h6" mt={0.5}>
                            <Skeleton width={"40%"} />
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h5">{item.nome}</Typography>
                          <Typography variant="h6" mt={0.5}>
                            {item.prezzo}€
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}

export default Menu;

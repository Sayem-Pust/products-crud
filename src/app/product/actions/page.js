'use client'
import { Alert, Box, Button, Container, CssBaseline, Grid, Snackbar, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation";
import RedoIcon from "@mui/icons-material/Redo";

async function getSingleProducts(id) {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

const ProductCreateEdit = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [category, setCategory] = useState("");
  const [edited, setEdited] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = {
      title,
      description,
      price,
      discountPercentage,
      category,
    };
    const baseUrl = "https://dummyjson.com";
    try {
      if (edited) {
        const response = await fetch(
          baseUrl + `/products/${searchParams?.get("productId")}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        const response = await fetch(baseUrl + "/products/add", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      setTitle("")
      setDescription("")
      setPrice("")
      setDiscountPercentage("")
      setCategory("")
      setOpen(true);
      
    } catch (e) {
      console.log(e);
    }
        
  };
   const handleClose = (event, reason) => {
     if (reason === "clickaway") {
       return;
     }

     setOpen(false);
  };
  useEffect(() => {
    if (searchParams?.get("productId")) {
      const fetchProductData = async () => {
        const data = await getSingleProducts(searchParams?.get("productId"));
        console.log(data);
        // setProducts(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category)
        setDiscountPercentage(data.discountPercentage)
        setPrice(data.price)
        setEdited(true)
      };
      fetchProductData();
    }
  }, [searchParams]);
  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 4, mb: 4 }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success">
          Product has been {edited ? "edited" : "created"} successfully
        </Alert>
      </Snackbar>
      <CssBaseline />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            onClick={() => router.push("/product/actions")}
            endIcon={<RedoIcon />}
            variant="contained"
            sx={{
              marginLeft: "auto",
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Back to Home
          </Button>

          <Box
            component="span"
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Product {edited ? "Edit" : "Create"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
              id="create-course-form"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="title"
                name="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={title === ""}
                helperText={title === "" ? "title field is required!" : " "}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="description"
                label="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={description === ""}
                helperText={
                  description === "" ? "description field is required!" : " "
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="price"
                label="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={price === ""}
                helperText={price === "" ? "price field is required!" : " "}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="discountPercentage"
                label="discount percentage"
                id="discountPercentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                error={discountPercentage === ""}
                helperText={
                  discountPercentage === ""
                    ? "discount percentage field is required!"
                    : " "
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="category"
                label="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                error={category === ""}
                helperText={
                  category === "" ? "category field is required!" : " "
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductCreateEdit
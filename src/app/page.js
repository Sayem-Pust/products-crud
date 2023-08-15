'use client'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Button,
  Container,
  Grid,
  Paper,
  TableContainer,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import styled from "@emotion/styled";
import CreateIcon from "@mui/icons-material/Create";
import { useRouter } from "next/navigation";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

async function getData(skip=0, limit=10) {
  try {
    const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export default function Home() {
  const [products, setProducts] = useState({})
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      console.log(data);
      setProducts(data)
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
      });
      console.log(id);
      let tempProd = products?.products?.filter(item => item.id !== id);
      console.log({...products, products: tempProd});
      setProducts({ ...products, products: tempProd });
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangePage = async (event, newPage) => {
    const data = await getData(newPage * rowsPerPage, rowsPerPage);
    console.log(data);
    setProducts(data);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const data = await getData(
      page * event.target.value,
      event.target.value
    );
    console.log(data);
    setProducts(data);
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            onClick={() => router.push("/product/actions")}
            startIcon={<CreateIcon />}
            variant="contained"
            sx={{ marginLeft: "auto", marginBottom: 2, alignItems: "center", display:"flex", flexWrap:"wrap" }}
          >
            Create Product
          </Button>
          {products?.products?.length > 0 ? (
            <Paper
              sx={{ p: 2, display: "flex", flexDirection: "column" }}
              style={{ overflowX: "auto" }}
            >
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table
                  size="medium"
                  style={{ minWidth: "340px" }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Title</StyledTableCell>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell>Price</StyledTableCell>
                      <StyledTableCell>Discount percentage</StyledTableCell>
                      <StyledTableCell>Category</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products?.products?.map((item) => (
                      <TableRow key={item?.id}>
                        <TableCell>{item?.title}</TableCell>
                        <TableCell
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "11rem",
                          }}
                        >
                          {item?.description}
                        </TableCell>
                        <TableCell>{item?.price}</TableCell>
                        <TableCell>{item?.discountPercentage}</TableCell>
                        <TableCell>{item?.category}</TableCell>
                        <TableCell>
                          <Tooltip title="edit" placement="top">
                            <Link
                              href={`/product/actions?productId=${item?.id}`}
                            >
                              <IconButton>
                                <EditCalendarOutlinedIcon />
                              </IconButton>
                            </Link>
                          </Tooltip>
                          <Tooltip title="delete" placement="top">
                            <IconButton onClick={() => handleDelete(item?.id)}>
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={products?.total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          ) : (
            <Typography component="h1" variant="h5">
              Loading...
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

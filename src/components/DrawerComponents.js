"use client";
import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const DrawerComponents = ({ toggleDrawer }) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
       router.push("/login");
      // The user is not authenticated, handle it here.
    },
  });
  console.log(session);
  
  const handleSignout = () => {
    signOut({ callbackUrl: "http://localhost:3000/login" });
  };
  // useEffect(() => {
  //   console.log("wwwwwww", status);
  //   if (status !== "authenticated") {
  //     router.push("/login");
  //   }
  // }, [status]);
  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {session?.user?.id ? (
          <>
            <Link href={"/"}>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </Link>
            <ListItemButton onClick={handleSignout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItemButton>
          </>
        ) : (
          <Link href={"/login"}>
            <ListItemButton>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </Link>
        )}
      </List>
    </>
  );
};

export default DrawerComponents;

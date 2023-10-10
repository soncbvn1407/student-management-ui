import { Drawer, Box, Fab } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CampusAdmin from "./components/campus/campus";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import UsersAdmin from "./components/user/user";
import SubjectsAdmin from "./components/subject/subjects";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import FGWClass from "./components/class_group/class";
import ScheduleAdmin from "./components/schedules/schedule";
import GradeAdmin from "./components/grades/grade";
import DocumentsAdmin from "./components/documents/documents";
import RequestAdmin from "./components/requests/request";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function AdminHome() {
  const _container = window !== undefined ? () => window.document.body : undefined;

  const [mobileOpen, setMobileOpen] = useState(true);
  const [current, setCurrent] = useState(3);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const nav_tabs = [
    {
      title: "Facilities",
      tabs: [
        {
          name: "Rooms",
          id: 0,
          icon: <TableRestaurantIcon />,
        },
        {
          name: "Users",
          id: 1,
          icon: <AccountCircleIcon />,
        },
      ],
    },
    {
      title: "Scheduling",
      tabs: [
        {
          name: "Groups",
          id: 2,
          icon: <CalendarMonthIcon />,
        },
        {
          name: "Schedules",
          id: 3,
          icon: <CalendarMonthIcon />,
        },
        {
          name: "Grades",
          id: 4,
          icon: <CalendarMonthIcon />,
        },
      ],
    },
    {
      title: "Courses",
      tabs: [
        {
          name: "Subjects",
          id: 5,
          icon: <BookmarksIcon />,
        },
      ],
    },
    {
      title: "Others",
      tabs: [
        {
          name: "Regulations & Forms",
          id: 6,
          icon: <BookmarksIcon />,
        },
        {
          name: "Requests",
          id: 7,
          icon: <InboxIcon />,
        },
      ],
    },
  ];

  const components = [<CampusAdmin />, <UsersAdmin />, <FGWClass />, <ScheduleAdmin />, <GradeAdmin />, <SubjectsAdmin />, <DocumentsAdmin />, <RequestAdmin />];

  const drawer = (
    <div className="drawer">
      <Toolbar />
      {nav_tabs.map((tab) => {
        return (
          <>
            <h3>{tab.title}</h3>
            {tab.tabs.map((tab) => (
              <>
                <ListItem
                  sx={{
                    padding: "5px 10px",
                  }}
                  key={tab.name}
                  onClick={() => {
                    setCurrent(tab.id);
                  }}
                >
                  <ListItemButton
                    sx={{
                      backgroundColor: tab.id === current ? "#F0F7FF" : "white",
                      borderRadius: "5px",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: tab.id === current ? "#1976d2" : "#757575",
                        padding: 0,
                      }}
                    >
                      {tab.icon}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        color: tab.id === current ? "#1976d2" : "#757575",
                      }}
                      primary={tab.name}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            ))}
          </>
        );
      })}
    </div>
  );

  return (
    <>
      <Box sx={{ display: "flex" }} style={{ zIndex: -1 }}>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            zIndex: 10,
          }}
          aria-label="mailbox folders"
        >
          <Drawer
            elevation={0}
            container={_container}
            open={mobileOpen}
            sx={{
              width: drawerWidth,
              flexShrink: 0,

              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                borderWidth: 0,
                marginTop: "60px",
              },
              border: "none",
            }}
            variant="persistent"
            anchor="left"
          >
            {drawer}
          </Drawer>
        </Box>
        <Main open={mobileOpen}>
          <div
            className="admin-container"
            style={{
              marginTop: "120px",
            }}
          >
            {components[current]}
          </div>
        </Main>
      </Box>
      <div className={"fab"}>
        <Fab onClick={handleDrawerToggle}>
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <g id="Menu / Hamburger_MD">
              <path id="Vector" d="M5 17H19M5 12H19M5 7H19" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </Fab>
      </div>
    </>
  );
}

import { useState, useRef, useEffect } from "react";
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Grid,
} from "@mui/material";
import CustomTable from "../../../../../common/table/table";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CampusForm from "./campusForm";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getAllHeaderColumns } from "../../../../../utils/utils";
import { cacheData, getArrayCache, items } from "../../../../../utils/dataOptimizer";

const headCells = [
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Room Id",
    },
    {
        id: "campus",
        numeric: true,
        disablePadding: false,
        label: "Campus",
    },
    {
        id: "number",
        numeric: true,
        disablePadding: false,
        label: "Room Number",
    },
    {
        id: "building",
        numeric: true,
        disablePadding: false,
        label: "Building",
    },
    {
        id: "capacity",
        numeric: true,
        disablePadding: false,
        label: "Capacity",
    },
    {
        id: "test",
        numeric: true,
        disablePadding: false,
        label: "Test",
    },
];

export default function CampusAdmin(props) {
    const tableRef = useRef(null);

    let campuses = [
        {
            id: "HN",
            name: "Ha Noi",
        },
        {
            id: "HCM",
            name: "Ho Chi Minh",
        },
        {
            id: "DN",
            name: "Da Nang",
        },
        {
            id: "CT",
            name: "Can Tho",
        },
    ];

    const [campus, setCampus] = useState("HN");

    // Campus room data
    const [rowData, setRowData] = useState([]);
    const [rows, setRows] = useState([]);

    //
    const [number, setNumber] = useState("");

    // Selected room state for editing
    const [room, setRoom] = useState({});

    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");

    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [selected, setSelected] = useState([]);

    const [tableTitle, setTableTitle] = useState("All Rooms");

    useEffect(() => {
        let rooms = getArrayCache(items.Rooms)
        if (rooms.length > 0) {
            setRows(rooms)
            setRowData(rooms)
        } else {
            fetchRows();
        }

    }, []);

    // Get all rooms from "room" table in database
    const fetchRows = () => {
        let result = [];
        try {
            axios
                .get(process.env.REACT_APP_HOST_URL + "/campus/rooms")
                .then((res) => {
                    if (!res.data.status) {
                        props.sendToast("error", res.data.data);
                    }

                    res.data.data.forEach((room) => {
                        result.push(room);
                    });

                    setRows(result);
                    setRowData(result);
                    cacheData(items.Rooms, result)
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const fetchRoom = (id) => {
        try {
            return rows.find((row) => row.id === id);
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const handleRefreshEntry = () => {
        console.log("Fetch rows!");
        fetchRows();
    };

    const handleEdit = (id) => {
        try {
            let room = fetchRoom(id);
            setRoom({
                id: room.id,
                campus: room.campus,
                building: room.building,
                number: room.number,
                capacity: room.capacity,
            });
            setOpenModal(true);
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const handleDelete = (index) => {
        try {
            setDialogTitle("Delete Room");
            setDialogContent(
                "This room will be deleted, are you sure? This change cannot be undone"
            );
            setOpen(true);
            setSelected(index);
            console.log(index);
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const handleDeleteRequest = () => {
        try {
            let query = [];
            if (Array.isArray(selected)) {
                query = selected.join("@");
            } else {
                query = selected;
            }

            console.log(query);
            axios
                .delete(
                    process.env.REACT_APP_HOST_URL + "/campus/room?q=" + query
                )
                .then((res) => {
                    console.log(res);
                    if (res.data.status) {
                        props.sendToast(
                            "success",
                            "Selected rooms deleted successfully"
                        );
                        fetchRows();
                    } else {
                        props.sendToast(
                            "error",
                            "Failed to delete selected rooms"
                        );
                    }
                    setOpen(false);
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const handleSearch = () => {
        try {
            tableRef.current.clearSelected();
            let query = "Campus: ";
            let searchResult = rowData.filter((r) => r.campus === campus);
            query += campus;

            if (number !== "") {
                query += " / Room number: " + number;
                searchResult = rowData.filter(
                    (r) => r.campus === campus && r.number.startsWith(number)
                );
            }

            if (!Array.isArray(searchResult)) {
                searchResult = [];
            }

            setRows(searchResult);
            setTableTitle(query);
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const handleClearSearch = (e) => {
        e.preventDefault();
        setRows(rowData);
        setCampus("HN");
        setNumber("");
        setTableTitle("All Rooms");
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenModal = () => {
        setRoom({});
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <Grid container spacing={4}>
                <Grid item sm={12} md={8} xl={6}>
                    <div
                        className="big-widget"
                        style={{ paddingBottom: "25px" }}>
                        <h2>Room Control</h2>
                        <p>Search for your room</p>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="campus-select-label">
                                        Campus
                                    </InputLabel>
                                    <Select
                                        id="form-campus"
                                        labelId="campus-select-label"
                                        value={campus}
                                        label="Campus"
                                        onChange={(e) => {
                                            setCampus(e.target.value);
                                        }}>
                                        {campuses.map((campus) => (
                                            <MenuItem
                                                key={campus.id}
                                                value={campus.id}>
                                                {campus.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    value={number}
                                    onChange={(e) => {
                                        setNumber(e.target.value);
                                    }}
                                    id="form-number"
                                    fullWidth
                                    label="Room Number"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleSearch(e)}>
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    color="error"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleClearSearch(e)}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item sm={12} md={4} xl={6}>
                    <div
                        style={{
                            backgroundImage:
                                `url(${process.env.PUBLIC_URL}/banner/banner` +
                                5 +
                                ".jpg)",
                            width: "100%",
                            height: "225px",
                            borderRadius: "10px",
                            backgroundSize: "contain",
                        }}></div>
                </Grid>
                <Grid item xs={12}>
                    <div className="big-widget">
                        <div className="campus-list">
                            <CustomTable
                                ref={tableRef}
                                handleAddEntry={() => {
                                    handleOpenModal();
                                }}
                                title={tableTitle}
                                rows={rows}
                                headCells={headCells}
                                colNames={getAllHeaderColumns(headCells)}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleRefreshEntry={handleRefreshEntry}
                            />
                        </div>
                    </div>
                </Grid>
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{
                    zIndex: 100000,
                }}>
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteRequest}>Accept</Button>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                className="modal"
                fullWidth={true}
                open={openModal}
                onClose={() => setOpenModal(false)}>
                <DialogContent
                    sx={{
                        bgcolor: "background.paper",
                        boxShadow: 12,
                    }}>
                    <CampusForm
                        sendToast={props.sendToast}
                        closeHandler={handleCloseModal}
                        room={room}
                        refresh={fetchRows}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

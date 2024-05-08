import { useState, useRef, useEffect } from "react";
import { TextField, Button, Grid, Dialog, DialogContent } from "@mui/material";
import CustomTable from "../../../../../common/table/table";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { fetchDocuments, getAllHeaderColumns } from "../../../../../utils/utils";
import AttendanceForm from "./attendanceForm";
import { cacheData, getArrayCache, items } from "../../../../../utils/dataOptimizer";

const headCells = [
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Id",
    },

    {
        id: "group_id",
        numeric: true,
        disablePadding: false,
        label: "Class ID",
    },
    {
        id: "student_id",
        numeric: true,
        disablePadding: false,
        label: "Student ID",
    },
    {
        id: "dob",
        numeric: true,
        disablePadding: false,
        label: "Date of Birth",
    },
    {
        id: "date",
        numeric: true,
        disablePadding: false,
        label: "Date",
    },
    {
        id: "session",
        numeric: true,
        disablePadding: false,
        label: "Session",
    },
    {
        id: "remark",
        numeric: true,
        disablePadding: false,
        label: "Remark",
    },
];

export default function AttendanceAdmin(props) {
    const tableRef = useRef(null);

    const [rowData, setRowData] = useState([]);
    const [rows, setRows] = useState([]);

    const [attendance, setAttendance] = useState({})

    const [attendanceId, setAttendanceId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [session, setSession] = useState("");

    const [tableTitle, setTableTitle] = useState("All Attendances");

    const [open, setOpen] = useState(false);

    useEffect(() => {
        let attendances = getArrayCache(items.Attendances)
        if (attendances.length > 0) {
            setRowData(attendances)
            setRows(attendances)
        }
        else {
            fetchRows();
        }

    }, []);

    const fetchRows = () => {
        let result = [];
        try {
            axios
                .get(
                    process.env.REACT_APP_HOST_URL + "/schedule/attendance/all"
                )
                .then((res) => {
                    if (!res.data.status) {
                        props.sendToast("error", res.data.data);
                    }

                    res.data.data.forEach((room) => {
                        result.push(room);
                    });

                    setRows(result);
                    setRowData(result);

                    cacheData(items.Attendances, result)
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const handleRefreshEntry = () => {
        fetchRows();
    };

    const handleEdit = (id) => {
        let attendance = fetchDocuments(rowData, id)
        setAttendance(attendance)
        setOpen(true);
    };

    const handleDelete = (id) => {
        let attendance = fetchDocuments(rowData, id)
        let confirm = window.confirm("Are you sure? This action cannot be reversed!")
        if (confirm) {
            try {
                axios
                    .delete(
                        process.env.REACT_APP_HOST_URL + "/attendance", {
                        params: {
                            id: attendance.id
                        }
                    }
                    )
                    .then((res) => {
                        if (!res.data.status) {
                            props.sendToast("error", res.data.data);
                        } else {
                            props.sendToast("success", "Attendance deleted: " + id);
                            fetchRows();
                        }
                    });
            } catch (e) {
                props.sendToast("error", e.toString());
            }
        }
    };

    const handleSearch = () => {
        try {
            tableRef.current.clearSelected();
            let query = "Attendance: ";
            let searchResult = rowData;
            if (attendanceId !== "") {
                searchResult = searchResult.filter((r) =>
                    r.id.startsWith(attendanceId)
                );
            }

            if (session !== "") {
                searchResult = searchResult.filter(
                    (r) => r.session === parseInt(session)
                );
            }

            if (groupId !== "") {
                searchResult = searchResult.filter((r) =>
                    r.group_id.startsWith(groupId)
                );
            }

            if (studentId !== "") {
                searchResult = searchResult.filter((r) =>
                    r.student_id.startsWith(studentId)
                );
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
        setAttendanceId("");
        setStudentId("");
        setGroupId("");
        setSession("");
        setTableTitle("All Attendances");
    };

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <>
            <Grid container spacing={4}>
                <Grid item sm={12} md={8} xl={6}>
                    <div
                        className="big-widget"
                        style={{ paddingBottom: "25px" }}>
                        <h2>Attendance Search</h2>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    value={attendanceId}
                                    onChange={(e) => {
                                        setAttendanceId(e.target.value);
                                    }}
                                    id="form-attendanceId"
                                    fullWidth
                                    label="Attendance Id"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    value={groupId}
                                    onChange={(e) => {
                                        setGroupId(e.target.value);
                                    }}
                                    id="form-groupId"
                                    fullWidth
                                    label="Course Id"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    value={studentId}
                                    onChange={(e) => {
                                        setStudentId(e.target.value);
                                    }}
                                    id="form-studentId"
                                    fullWidth
                                    label="Student Id"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    value={session}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (value === "") return;
                                        setSession(
                                            isNaN(parseInt(value)) ? 0 : value
                                        );
                                    }}
                                    id="form-session"
                                    fullWidth
                                    label="Session"
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleSearch(e)}>
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
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
                            height: "240px",
                            borderRadius: "10px",
                            backgroundSize: "contain",
                        }}></div>
                </Grid>
                <Grid item xs={12}>
                    <div className="big-widget">
                        <div className="attendance-list">
                            <CustomTable
                                ref={tableRef}
                                title={tableTitle}
                                rows={rows}
                                headCells={headCells}
                                colNames={getAllHeaderColumns(headCells)}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleRefreshEntry={handleRefreshEntry}
                                handleAddEntry={() => {
                                    setAttendance({})
                                    handleOpen();
                                }}
                            />
                        </div>
                    </div>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={handleClose}
                className="modal"
                style={{
                    zIndex: 100000,
                }}>
                <DialogContent>
                    <AttendanceForm
                        refresh={fetchRows}
                        handleClose={handleClose}
                        sendToast={props.sendToast}
                        attendance={attendance} />
                </DialogContent>
            </Dialog>
        </>
    );
}

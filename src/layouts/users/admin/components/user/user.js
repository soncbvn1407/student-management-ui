import { useState, useEffect, useRef } from "react";
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
import UserForm from "./userForm";
import axios from "axios";
import Constants from "../../../../../utils/constants";
import {
    fetchDocuments,
    filterByAttribute,
    getAllHeaderColumns,
    objectToMap,
} from "../../../../../utils/utils";
import address_tree from "../../../../../utils/address_tree.json";
import { cacheData, getArrayCache, items } from "../../../../../utils/dataOptimizer";

const headCells = [
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Username",
    },
    {
        id: "department_id",
        numeric: true,
        disablePadding: false,
        label: "Dept",
    },
    {
        id: "email",
        numeric: true,
        disablePadding: false,
        label: "Email",
    },
    {
        id: "role",
        numeric: true,
        disablePadding: false,
        label: "Auth Level",
    },
    {
        id: "firstName",
        numeric: true,
        disablePadding: false,
        label: "F. Name",
    },
    {
        id: "lastName",
        numeric: true,
        disablePadding: false,
        label: "L. Name",
    },
    {
        id: "dob",
        numeric: true,
        disablePadding: false,
        label: "Dob",
    },
    {
        id: "phone",
        numeric: true,
        disablePadding: false,
        label: "Phone",
    },
    {
        id: "city",
        numeric: true,
        disablePadding: false,
        label: "City",
    },

    {
        id: "district",
        numeric: true,
        disablePadding: false,
        label: "District",
    },

    {
        id: "ward",
        numeric: true,
        disablePadding: false,
        label: "Ward",
    },

    {
        id: "address",
        numeric: true,
        disablePadding: false,
        label: "Address",
    },
];

export default function UsersAdmin(props) {
    const tableRef = useRef();

    const constants = new Constants();
    const [user, setUser] = useState({});

    const [auth, setAuth] = useState("");

    const [username, setUsername] = useState("");
    const [department, setDepartment] = useState("");

    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");

    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let data = getArrayCache(items.Users)
        if (data.length > 0) {
            setUsers(data)
        } else {
            fetchRows();
        }

        try {
            let citiesMap = objectToMap(address_tree);
            setCities(citiesMap);
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    }, []);

    const handleSearch = () => {
        tableRef.current.clearSelected();
        let users = JSON.parse(localStorage.getItem(items.Users));
        if (auth !== "") {
            users = users.filter(function (u) {
                return u.role === auth;
            });
        }
        if (department !== "") {
            users = users.filter(function (u) {
                return u.department_id === department;
            });
        }
        if (username !== "") {
            users = users.filter(function (u) {
                return u.id.startsWith(username);
            });
        }
        if (city !== "") {
            users = users.filter(function (u) {
                return u.city === city;
            });
        }
        if (district !== "") {
            users = users.filter(function (u) {
                return u.district === district;
            });
        }
        if (ward !== "") {
            users = users.filter(function (u) {
                return u.ward === ward;
            });
        }
        setUsers(users);
    };

    const fetchRows = () => {
        try {
            axios
                .get(process.env.REACT_APP_HOST_URL + "/user/all")
                .then((res) => {
                    if (!res.data.status) {
                        props.sendToast("error", res.data.data);
                    } else {
                        let result = [];
                        res.data.data.forEach((user) => {
                            result.push(user);
                        });
                        cacheData(items.Users, result)
                        setUsers(result);
                    }
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const findDataById = (data, id) => {
        return data.find((row) => row.id === id);
    };

    const handleEditUser = (id) => {
        let user = findDataById(users, id);
        console.log(user);
        setUser(user);
        setOpenModal(true);
    };

    const handleDelete = (id) => {
        let user = fetchDocuments(users, id)
        axios.delete(process.env.REACT_APP_HOST_URL + "/user", {
            params: {
                id: user.id,
                role: user.role
            }
        }).then((res) => {
            if (res.data.status) {
                fetchRows();
            } else {
                props.sendToast("error", res.data.data);
            }
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClear = (e) => {
        e.preventDefault();
        setAuth("");
        setDepartment("");
        setUsername("");
        setCity("");
        setDistrict("");
        setWard("");
        let users = JSON.parse(localStorage.getItem(items.Users));
        setUsers(users);
    };

    const handleOpenModal = () => {
        setUser({});
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <Grid container spacing={4}>
                <Grid item sm={12} md={8}>
                    <div
                        className="big-widget"
                        style={{ paddingBottom: "15px" }}>
                        <h2>Users Control</h2>
                        <p>Search for an user using the following fields</p>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="auth-select-label">
                                        Auth Level
                                    </InputLabel>
                                    <Select
                                        id="form-role"
                                        labelId="auth-select-label"
                                        value={auth}
                                        label="Auth Level"
                                        onChange={(e) => {
                                            setAuth(e.target.value);
                                        }}>
                                        <MenuItem value={1}>Student</MenuItem>
                                        <MenuItem value={2}>Lecturer</MenuItem>
                                        <MenuItem value={3}>Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="department-select-label">
                                        Department
                                    </InputLabel>
                                    <Select
                                        value={department ?? ""}
                                        id="form-campus"
                                        labelId="department-select-label"
                                        label="Department"
                                        onChange={(e) => {
                                            setDepartment(e.target.value);
                                        }}>
                                        {constants.departments.map(
                                            (department) => (
                                                <MenuItem
                                                    key={department.id}
                                                    value={department.id}>
                                                    {department.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    value={username}
                                    id="form-firstName"
                                    fullWidth
                                    label="Username"
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="city-select-label-form">
                                        City
                                    </InputLabel>
                                    <Select
                                        name="city"
                                        defaultValue={city ?? "01"}
                                        value={city ?? "01"}
                                        label="Campus"
                                        MenuProps={{
                                            disablePortal: true, // <--- HERE
                                            onClick: (e) => {
                                                e.preventDefault();
                                            },
                                        }}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            let districtsMap =
                                                filterByAttribute(
                                                    cities,
                                                    "code",
                                                    e.target.value
                                                );
                                            setDistricts(
                                                objectToMap(
                                                    districtsMap[0][
                                                    "quan-huyen"
                                                    ]
                                                )
                                            );
                                            setWards([]);
                                        }}>
                                        <MenuItem value={"default"} disabled>
                                            Please select a City
                                        </MenuItem>
                                        {cities.map((item) => (
                                            <MenuItem
                                                key={"Cities-" + item.code}
                                                value={item.code}>
                                                {item.name} - {item.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="city-select-label-form">
                                        District
                                    </InputLabel>
                                    <Select
                                        name="district"
                                        defaultValue={district ?? "001"}
                                        value={district ?? "001"}
                                        label="District"
                                        MenuProps={{
                                            disablePortal: true, // <--- HERE
                                            onClick: (e) => {
                                                e.preventDefault();
                                            },
                                        }}
                                        onChange={(e) => {
                                            setDistrict(e.target.value);
                                            let wardsMap = filterByAttribute(
                                                districts,
                                                "code",
                                                e.target.value
                                            );
                                            setWards(
                                                objectToMap(
                                                    wardsMap[0]["xa-phuong"]
                                                )
                                            );
                                        }}>
                                        <MenuItem value={"default"} disabled>
                                            Please select a District
                                        </MenuItem>
                                        {districts.map((item) => (
                                            <MenuItem
                                                key={"District-" + item.cod}
                                                value={item.code}>
                                                {item.name} - {item.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="city-select-label-form">
                                        Ward
                                    </InputLabel>
                                    <Select
                                        name="ward"
                                        defaultValue={ward ?? "0001"}
                                        value={ward ?? "0001"}
                                        label="Ward"
                                        MenuProps={{
                                            disablePortal: true, // <--- HERE
                                            onClick: (e) => {
                                                e.preventDefault();
                                            },
                                        }}
                                        onChange={(e) => {
                                            setWard(e.target.value);
                                        }}>
                                        <MenuItem value={"default"} disabled>
                                            Please select a Ward
                                        </MenuItem>
                                        {wards.map((item) => (
                                            <MenuItem
                                                key={"Ward-" + item.code}
                                                value={item.code}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleSearch()}>
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleClear(e)}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item sm={12} md={4}>
                    <div
                        style={{
                            backgroundImage:
                                `url(${process.env.PUBLIC_URL}/banner/banner` +
                                3 +
                                ".jpg)",
                            width: "100%",
                            height: "270px",
                            borderRadius: "10px",
                            backgroundSize: "contain",
                        }}></div>
                </Grid>
                <Grid item xs={12}>
                    <div className="big-widget">
                        <div className="campus-list">
                            <CustomTable
                                isUserTable={true}
                                ref={tableRef}
                                handleAddEntry={() => {
                                    handleOpenModal();
                                }}
                                init_count={20}
                                title="Users"
                                rows={users}
                                headCells={headCells}
                                colNames={getAllHeaderColumns(headCells)}
                                handleEdit={handleEditUser}
                                handleDelete={handleDelete}
                                handleRefreshEntry={fetchRows}
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
                    zIndex: 10000,
                }}>
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Accept</Button>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                maxWidth="lg"
                className="modal"
                fullWidth={true}
                open={openModal}
                onClose={() => setOpenModal(false)}>
                <DialogContent
                    sx={{
                        bgcolor: "background.paper",
                        boxShadow: 12,
                    }}>
                    <UserForm
                        closeHandler={handleCloseModal}
                        user={user}
                        refresh={fetchRows}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

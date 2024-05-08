import { Grid, FormControl, Button, TextField, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { fetchDocuments } from "../../../../../utils/utils";
import { getArrayCache, items } from "../../../../../utils/dataOptimizer";

export default function AttendanceForm(props) {

    const [formData, setFormData] = useState({
        group_id: props.attendance.group_id ?? "",
        student_id: props.attendance.student_id ?? "",
        dob: props.attendance.dob ?? "",
        session: props.attendance.session ?? 0,
        date: props.attendance.date ?? new Date(),
        remark: props.attendance.remark ?? -1,
    })

    const [groups, setGroups] = useState([])
    const [students, setStudents] = useState([]);

    useEffect(() => {
        setGroups(getArrayCache(items.Groups))
        console.log(getArrayCache(items.Groups))
    }, [])

    function validateForm() {

        if (formData.session < 0) {
            // success / error / default
            props.sendToast("error", "Invalid session number")
            return false;
        }


        return true;
    }

    const handleConfirm = () => {

        if (!validateForm()) {
            return
        }

        if (formData.group_id) {
            if (props.attendance.id) {
                formData.id = props.attendance.id;
                axios.put(process.env.REACT_APP_HOST_URL + "/attendance", formData).then((res) => {
                    console.log(res)
                    if (res.data.status) {
                        props.handleClose()
                        props.sendToast("success", "Attendance edited!")
                        props.refresh()
                    } else {
                        props.sendToast("error", res.data.data)
                    }
                })
            } else {

                axios.post(process.env.REACT_APP_HOST_URL + "/attendance", formData).then((res) => {
                    console.log(res)
                    if (res.data.status) {
                        props.handleClose()
                        props.sendToast("success", "Attendance adedd!")
                        props.refresh()
                    } else {
                        props.sendToast("error", res.data.data)
                    }
                })
            }
        } else {
            props.sendToast("error", "Missing fields!")
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((feedback) => ({
            ...feedback,
            [name]: name === "slot" ? parseInt(value) : value,
        }));

        if (name === "group_id") {
            let group = fetchDocuments(groups, value)
            axios.get(process.env.REACT_APP_HOST_URL + "/course/participants", {
                params: {
                    id: group.id
                }
            }).then((res) => {
                if (res.data.status) {
                    setStudents(res.data.data)
                }
            })
        }
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <h2 style={{ margin: 0 }}>
                        Manage attendance form
                    </h2>
                </Grid>
                <Divider />
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <InputLabel id="room-select-label-form">Course</InputLabel>
                        <Select
                            disabled={props.attendance.id !== undefined}
                            defaultValue={formData.group_id ?? ""}
                            value={formData.group_id ?? ""}
                            label="Class"
                            name="group_id"
                            MenuProps={{
                                disablePortal: true, // <--- HERE
                                onClick: (e) => {
                                    e.preventDefault();
                                },
                            }}
                            onChange={handleChange}
                        >
                            <MenuItem value={"default"} disabled>
                                Please select a class
                            </MenuItem>
                            {groups.map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                    {course.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {
                    students.length > 0 ?
                        <Grid item xs={12} md={12}>
                            <FormControl fullWidth>
                                <InputLabel id="room-select-label-form">Student</InputLabel>
                                <Select
                                    defaultValue={formData.student_id ?? ""}
                                    value={formData.student_id ?? ""}
                                    label="Student"
                                    name="student_id"
                                    MenuProps={{
                                        disablePortal: true, // <--- HERE
                                        onClick: (e) => {
                                            e.preventDefault();
                                        },
                                    }}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"default"} disabled>
                                        Please select a class
                                    </MenuItem>
                                    {students.map((student) => (
                                        <MenuItem key={student.student_id} value={student.student_id}>
                                            {student.student_id} / {student.dob}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        : <></>
                }
                <Grid item xs={12} md={12}>
                    <TextField type="number" onChange={handleChange} name="session" value={formData.session} id="form-session" fullWidth label="Session" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={12}>
                    <DesktopDatePicker
                        value={dayjs(formData.date)}
                        id="form-date"
                        name="date"
                        label="Date"
                        variant="outlined"
                        onChange={(value) => {
                            setFormData((feedback) => ({
                                ...feedback,
                                date: value
                            }));
                        }}
                        sx={{
                            width: "100%",
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <InputLabel id="room-select-label-form">Remark</InputLabel>
                        <Select
                            defaultValue={formData.remark ?? -1}
                            value={formData.remark ?? -1}
                            label="Remark"
                            name="remark"
                            MenuProps={{
                                disablePortal: true, // <--- HERE
                                onClick: (e) => {
                                    e.preventDefault();
                                },
                            }}
                            onChange={handleChange}
                        >
                            <MenuItem value={"default"} disabled>
                                Please select a room
                            </MenuItem>
                            <MenuItem value={-1}>
                                Not yet
                            </MenuItem>
                            <MenuItem value={0}>
                                Not Attended
                            </MenuItem>
                            <MenuItem value={1}>
                                Attended
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button fullWidth variant="contained" sx={{ padding: "15px 30px" }} onClick={(e) => handleConfirm(e)}>
                        Save
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button color="error" fullWidth variant="outlined" sx={{ padding: "15px 30px" }} onClick={props.handleClose}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}

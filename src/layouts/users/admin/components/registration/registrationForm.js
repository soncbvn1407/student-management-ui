import { useEffect, useState } from "react"
import { getArrayCache, items, cacheData, getCache } from "../../../../../utils/dataOptimizer";
import axios from "axios";
import { Grid, FormControl, Button, TextField, InputLabel, Select, MenuItem, Divider } from "@mui/material";


export default function RegistrationForm(props) {

    const [groups, setGroups] = useState([])

    const [formData, setFormData] = useState({
        group_id: props.registration.group_id ?? "",
        student_id: props.registration.student_id ?? "",
        dob: props.registration.dob ?? "",
        firstName: props.registration.firstName ?? "",
        lastName: props.registration.lastName ?? "",
    })

    const [users, setUsers] = useState([])
    const [students, setStudents] = useState([])

    useEffect(() => {
        const groups = getArrayCache(items.Groups)
        if (groups.length > 0) {
            setGroups(groups)
        } else {
            fetchGroups();
        }

        const users = getArrayCache(items.Users)
        if (users.length > 0) {
            setUsers(users)
        } else {
            fetchUsers();
        }
    }, [])

    const fetchUsers = async () => {
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

        }
    }

    const fetchGroups = async () => {
        try {
            await axios
                .get(process.env.REACT_APP_HOST_URL + "/semester/groups")
                .then((res) => {
                    if (res.data.status) {
                        setGroups(res.data.data);
                        cacheData(items.Groups, res.data.data)
                    } else {
                        props.sendToast("error", res.data.data);
                    }
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((registration) => ({
            ...registration,
            [name]: value,
        }));

        if (name === "group_id") {
            const segments = value.split("-"); // [F2G, SU, 23, GCH, Final Project 3]
            const registrations = getCache(items.Registration);

            // Filter user co role student & same department as the course
            let students = users.filter((u) => u.role === 1 && u.department_id === segments[3])
            students = students.filter((user) => {
                return registrations.filter(
                    // this course registered student in registration table
                    (r) => r.student_id === user.id && r.group_id === value).length === 0
            })

            setStudents(students);
        }

        if (name === "student_id") {
            const student = users.filter((u) => u.id === value)
            setFormData((registration) => ({
                ...registration,
                firstName: student[0].firstName,
                lastName: student[0].lastName,
                dob: student[0].dob
            }))
        }
    }

    const handleConfirm = () => {
        axios.post(process.env.REACT_APP_HOST_URL + "/schedule/participant", {
            group: {
                id: formData.group_id
            },
            participants: [
                {
                    id: formData.student_id,
                    dob: formData.dob,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                }
            ]
        }).then((res) => {
            console.log(res)
            if (res.data.status) {
                props.refresh()
                props.sendToast("success", "New course registration added!")
                props.closeHandler()
            } else {
                props.sendToast("error", "Failed to add course registration");
            }
        })
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <h2 style={{ margin: 0 }}>Manage Registration</h2>
                    <p>You can manage the course registration using this form</p>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <InputLabel id="group-select-label-form">Group</InputLabel>
                        <Select
                            defaultValue={formData.group_id ?? ""}
                            value={formData.group_id ?? ""}
                            label="Group"
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
                                Please select a group
                            </MenuItem>
                            {groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                    {group.id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {
                    students.length > 0 ? <>
                        <Grid item xs={12} md={12}>
                            <FormControl fullWidth>
                                <InputLabel id="group-select-label-form">Student</InputLabel>
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
                                        Please select a student
                                    </MenuItem>
                                    {students.map((student) => (
                                        <MenuItem key={student.id} value={student.id}>
                                            {student.id} - {student.dob}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField label="First Name" fullWidth disabled={true} value={formData.firstName} />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField label="Last Name" fullWidth disabled={true} value={formData.lastName} />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField label="Date of Birth" fullWidth disabled={true} value={formData.dob} />
                        </Grid>
                    </> : <></>
                }

                <Grid item xs={12} md={6}>
                    <Button fullWidth variant="contained" sx={{ padding: "15px 30px" }} onClick={(e) => handleConfirm(e)}>
                        Save
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button color="error" fullWidth variant="outlined" sx={{ padding: "15px 30px" }} onClick={props.closeHandler}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}
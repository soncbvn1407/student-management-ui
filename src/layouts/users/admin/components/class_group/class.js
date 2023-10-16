import { useState } from "react";
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Grid,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import GroupWidget from "./widgets/groupWidget";
import axios from "axios";
import GroupForm from "./forms/groupForm";
import ParticipantsWidget from "./widgets/participantsWidget";
import ScheduleWidget from "./widgets/scheduleWidget";
import ScheduleListForm from "./forms/scheduleForm";
import ParticipantsForm from "./forms/participantsForm";

export default function FGWClass() {

    let departments = [
        {
            id: "GBH",
            name: "Business",
        },
        {
            id: "GCH",
            name: "Computing",
        },
        {
            id: "GDH",
            name: "Graphic Design",
        },
        {
            id: "GFH",
            name: "Finance",
        },
    ]

    let programmes = [
        {
            id: "ENG",
            name: "English Programme",
        },
        {
            id: "F2G",
            name: "F2G",
        },
        {
            id: "SUP",
            name: "Supplementary Courses",
        },
        {
            id: "UOG",
            name: "Top-Up",
        },
    ];

    const [programme, setProgramme] = useState("");
    const [term, setTerm] = useState("");

    const [participants, setParticipants] = useState([]);
    const [schedules, setSchedules] = useState([{ id: 1 }]);

    const [participant, setParticipant] = useState({})
    const [schedule, setSchedule] = useState({})

    const terms = [
        {
            id: -1,
            name: "Please select a term",
        },
        {
            id: "SP",
            name: "Spring",
        },
        {
            id: "SU",
            name: "Summer",
        },
        {
            id: "FA",
            name: "Fall",
        },
    ];

    const [openGroupModal, setOpenGroupModal] = useState(false);
    const [openParticipantsModal, setOpenParticipantsModal] = useState(false)
    const [openScheduleModal, setOpenScheduleModal] = useState(false)

    const [group, setGroup] = useState(null)
    const [groups, setGroups] = useState([
        {
            id: 'TCH2011',
            slots: '42',
            subject: 'COMP1786',
            lecturer: 'TungDT',
            programme: 'UOG',
            term: 'SU-23',
            department: 'GCH'
        },
        {
            id: 'TCH2101',
            slots: 42,
            subject: '2',
            lecturer: 'quandh',
            programme: 'UOG',
            term: 'SU-23',
            department: 'GCH'
        },
        {
            id: 'Testing',
            slots: '2',
            subject: '1',
            lecturer: '1',
            programme: 'UOG',
            term: 'SU-23',
            department: 'GCH'
        }
    ]);

    const [year, setYear] = useState(2023)
    const [department, setDepartment] = useState("");

    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");

    const [firstClick, setFirstClick] = useState(true);

    const [open, setOpen] = useState(false);

    const handleSearchGroup = async () => {
        if (programme && term && year && department) {
            await axios.get(process.env.REACT_APP_HOST_URL + "/schedule?programme=" + programme + "&term=" + (term + "-" + year.toString().substr(2, 2)) + "&department=" + department).then((res) => {
                setGroups(res.data.data ?? []);
            })
        }
    };

    const handleClearSearchGroup = () => {
        setProgramme("")
        setTerm("")
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenGroupModal = (e) => {
        setOpenGroupModal(true)
    }

    const handleCloseGroupFormModal = () => {
        setOpenGroupModal(false)
    }

    const handleCloseScheduleFormModal = () => {
        setOpenScheduleModal(false)
    }

    const handleCloseParticipantFormModal = () => {
        setOpenParticipantsModal(false)
    }

    const fetchDataFromArrayUsingId = (data, id) => {
        return data.find((row) => row.id === id)
    }

    const handleEditGroup = (id) => {

    }

    const handleAddParticipants = async (id) => {

    }

    const handleSearchParticipants = async (id) => {
        let data = fetchDataFromArrayUsingId(groups, id)
        console.log(data)
        await axios.get(process.env.REACT_APP_HOST_URL + "/semester/participants?id=" + id + "&programme=" + data.programme + "&term=" + data.term + "&department=" + data.department).then((res) => {
            console.log(res.data)
            if (res.data.status) {
                setParticipants(res.data.data ?? [])
            }
        })
        setFirstClick(true);
    }

    const handleSearchSchedules = async (id) => {
        let data = fetchDataFromArrayUsingId(groups, id)
        console.log(data)
        await axios.get(process.env.REACT_APP_HOST_URL + "/semester/participants?id=" + id + "&programme=" + data.programme + "&term=" + data.term + "&department=" + data.department).then((res) => {
            console.log(res.data)
            if (res.data.status) {
                setSchedules(res.data.data ?? [])
            }
        })
        setFirstClick(true);
    }

    return (
        <>
            <Grid container spacing={4} >
                <Grid item sm={12} md={9}>
                    <div
                        className="big-widget"
                        style={{ paddingBottom: "25px" }}>
                        <h2>Class Group Control</h2>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="programme-select-label">
                                        Programme
                                    </InputLabel>
                                    <Select
                                        id="form-programme"
                                        labelId="programme-select-label"
                                        value={programme}
                                        label="Programme"
                                        onChange={(e) => {
                                            setProgramme(e.target.value);
                                        }}>
                                        {programmes.map((programme) =>
                                            programme.id === -1 ? (
                                                <MenuItem
                                                    disabled={true}
                                                    key={programme.id}
                                                    value={programme.id}>
                                                    {programme.name}
                                                </MenuItem>
                                            ) : (
                                                <MenuItem
                                                    key={programme.id}
                                                    value={programme.id}>
                                                    {programme.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="term-select-label">
                                        Term
                                    </InputLabel>
                                    <Select
                                        id="form-term"
                                        labelId="term-select-label"
                                        value={term}
                                        label="Term"
                                        onChange={(e) => {
                                            setTerm(e.target.value);
                                        }}>
                                        {terms.map((term) =>
                                            term.id === -1 ? (
                                                <MenuItem
                                                    disabled={true}
                                                    key={term.id}
                                                    value={term.id}>
                                                    {term.name}
                                                </MenuItem>
                                            ) : (
                                                <MenuItem
                                                    key={term.id}
                                                    value={term.id}>
                                                    {term.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    onChange={(e) => setYear(e.target.value)}
                                    value={year}
                                    id="year"
                                    fullWidth
                                    label="Year"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="department-select-label">
                                        Department
                                    </InputLabel>
                                    <Select
                                        id="form-department"
                                        labelId="department-select-label"
                                        value={department}
                                        label="Department"
                                        onChange={(e) => {
                                            setDepartment(e.target.value);
                                        }}>
                                        {departments.map((term) =>
                                            term.id === -1 ? (
                                                <MenuItem
                                                    disabled={true}
                                                    key={term.id}
                                                    value={term.id}>
                                                    {term.name}
                                                </MenuItem>
                                            ) : (
                                                <MenuItem
                                                    key={term.id}
                                                    value={term.id}>
                                                    {term.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleSearchGroup(e)}>
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleSearchGroup(e)}>
                                    Schedule
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleSearchGroup(e)}>
                                    Participants
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    color="error"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ padding: "15px 30px" }}
                                    onClick={(e) => handleClearSearchGroup(e)}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item sm={12} md={3}>
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
                <Grid item sm={12} md={12}>
                    <GroupWidget
                        handleSearchSchedule={handleSearchSchedules}
                        handleSearchStudents={handleSearchParticipants}
                        handleAddEntry={() => { handleOpenGroupModal(); }}
                        groups={groups}
                        programme={programme}
                        department={department}
                        term={term + "-" + year.toString().substr(2, 2)} />
                </Grid>
                <Grid item sm={12} md={12}>
                    <ScheduleWidget
                        handleAddEntry={() => { setOpenScheduleModal(true) }}
                        firstClick={firstClick}
                        schedules={schedules} />
                </Grid>
                <Grid item sm={12} md={12}>
                    <ParticipantsWidget
                        firstClick={firstClick}
                        handleAddEntry={() => { setOpenParticipantsModal(true) }}
                        participants={participants} />
                </Grid>
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{
                    zIndex: 100000000000,
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
                maxWidth="md"
                className="modal"
                fullWidth={true}
                open={openGroupModal}
                onClose={() => setOpenGroupModal(false)}>
                <DialogContent sx={{
                    bgcolor: "background.paper",
                    boxShadow: 12,
                }}>
                    <GroupForm closeHandler={handleCloseGroupFormModal} group={group} />
                </DialogContent>
            </Dialog>

            <Dialog
                className="modal"
                fullWidth={true}
                open={openScheduleModal}
                onClose={() => setOpenScheduleModal(false)}>
                <DialogContent sx={{
                    bgcolor: "background.paper",
                    boxShadow: 12,
                }}>
                    <ScheduleListForm closeHandler={handleCloseScheduleFormModal} schedule={schedule} />
                </DialogContent>
            </Dialog>

            <Dialog
                maxWidth="md"
                className="modal"
                fullWidth={true}
                open={openParticipantsModal}
                onClose={() => setOpenParticipantsModal(false)}>
                <DialogContent sx={{
                    bgcolor: "background.paper",
                    boxShadow: 12,
                }}>
                    <ParticipantsForm closeHandler={handleCloseParticipantFormModal} participant={participant} />
                </DialogContent>
            </Dialog>
        </ >
    );
}

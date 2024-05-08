import { Grid, Button, FormControl, Select, MenuItem, InputLabel, TextField, Alert, AlertTitle, Divider, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import Constants from "../../../../../../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { getDayByNumber } from "../../../../../../utils/utils";
import { departments } from "../../../mockData/mock";

export default function GroupForm(props) {
  const constants = new Constants();

  const [term, setTerm] = useState(props.group.term ? props.group.term.slice(0, 2) : "");
  const [programme, setProgramme] = useState(props.group.programme ?? "");
  const [year, setYear] = useState(2023);
  const [name, setName] = useState(props.group.name ?? "");
  const [lecturer, setLecturer] = useState(props.group.lecturer ?? "");
  const [subject, setSubject] = useState(props.group.subject ?? "");
  const [slots, setSlots] = useState(props.group.slots ?? 0);
  const [department, setDepartment] = useState(props.group.department ?? "");

  const [lecturers, setLecturers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [error, setError] = useState("");

  const [slot, setSlot] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dayOfTheWeek, setDayOfTheWeek] = useState(0);
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));

  useLayoutEffect(() => {
    if (props.group.department) {
      handleFetchSubjects(props.group.department);
    }

    if (props.group.lecturer) {
      handleFetchLecturers(props.group.department);
    }
  }, []);

  const handleConfirm = () => {
    try {
      if (programme && term && name) {
        let data = {
          programme: programme,
          term: term + "-" + year.toString().substr(2, 2),
          department: department,
          name: name,
          lecturer: lecturer,
          subject: subject,
          slots: slots,
          dayOfTheWeek: dayOfTheWeek,
          slot: selectedSlots,
          startDate: dayjs(startDate).valueOf(),
          endDate: dayjs(endDate).valueOf(),
          status: true,
        };
        if (props.group.id) {
          axios.put(process.env.REACT_APP_HOST_URL + "/schedule/group?id=" + props.group.id, data).then((res) => {
            console.log(res);
            if (res.data.status) {
              toast.success("Group edited!", {
                position: "bottom-left",
              });
              props.closeHandler();
              props.refresh();
            } else {
              toast.error(res.data.data, {
                position: "bottom-left",
              });
            }
          });
        } else {

          axios.post(process.env.REACT_APP_HOST_URL + "/schedule/group", data).then((res) => {
            console.log(res);
            if (res.data.status) {
              toast.success("New group added!", {
                position: "bottom-left",
              });
              props.closeHandler();
              props.refresh();
            } else {
              toast.error(res.data.data, {
                position: "bottom-left",
              });
            }
          });
        }
      }
    } catch (e) {
      toast.error(e.toString(), {
        position: "bottom-left",
      });
    }
  };

  const handleFetchLecturers = (department) => {
    try {
      axios.get(process.env.REACT_APP_HOST_URL + "/user/lecturers?department=" + department).then((res) => {
        if (res.data.status) {
          let data = [];
          for (let i = 0; i < res.data.data.length; i++) {
            data.push(res.data.data[i]);
          }
          console.log(data)
          setLecturers(data);
        } else {
          toast.error(res.data.data, {
            position: "bottom-left",
          });
        }
      });
    } catch (e) {
      toast.error(e.toString(), {
        position: "bottom-left",
      });
    }
  };

  const handleFetchSubjects = (department) => {
    try {
      axios.get(process.env.REACT_APP_HOST_URL + "/subject?department=" + department).then((res) => {
        if (res.data.status) {
          let data = [];
          for (let i = 0; i < res.data.data.length; i++) {
            data.push(res.data.data[i]);
          }
          setSubjects(data);
          console.log(data)
        } else {
          toast.error(res.data.data, {
            position: "bottom-left",
          });
        }
      });
    } catch (e) {
      toast.error(e.toString(), {
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <h2 style={{ margin: 0 }}>Manage Group</h2>
          <p>You can manage the group using this form</p>
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={props.group.id ? 12 : 6}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="programme-select-label">Programme</InputLabel>
                    <Select
                      id="form-programme"
                      labelId="programme-select-label"
                      value={programme}
                      label="Programme"
                      onChange={(e) => {
                        setProgramme(e.target.value);
                      }}
                    >
                      {constants.programmes.map((programme) =>
                        programme.id === -1 ? (
                          <MenuItem disabled={true} key={programme.id} value={programme.id}>
                            {programme.name}
                          </MenuItem>
                        ) : (
                          <MenuItem key={programme.id} value={programme.id}>
                            {programme.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="department-select-label">Department</InputLabel>
                    <Select
                      id="form-department"
                      labelId="department-select-label"
                      value={department}
                      label="Department"
                      onChange={(e) => {
                        handleFetchSubjects(e.target.value);
                        handleFetchLecturers(e.target.value);
                        setDepartment(e.target.value);
                      }}
                    >
                      {constants.departments.map((term) =>
                        term.id === -1 ? (
                          <MenuItem disabled={true} key={term.id} value={term.id}>
                            {term.name}
                          </MenuItem>
                        ) : (
                          <MenuItem key={term.id} value={term.id}>
                            {term.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="term-select-label">Select a Term</InputLabel>
                    <Select
                      labelId="term-select-label"
                      value={term}
                      label="Select a Term"
                      onChange={(e) => {
                        setTerm(e.target.value);
                      }}
                    >
                      {constants.terms.map((term) => (
                        <MenuItem key={"option-term-" + term.id} value={term.id}>
                          {term.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField onChange={(e) => setYear(e.target.value)} value={year} id="form-year" fullWidth label="Year" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField onChange={(e) => setName(e.target.value)} value={name} id="form-name" fullWidth label="Group Name" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                      <InputLabel id="lecturer-select-label-form">Lecturer</InputLabel>
                      <Select
                        defaultValue={lecturer}
                        value={lecturer}
                        label="Lecturer"
                        MenuProps={{
                          disablePortal: true, // <--- HERE
                          onClick: (e) => {
                            e.preventDefault();
                          },
                        }}
                        onChange={(e) => {
                          setLecturer(e.target.value);
                        }}
                      >
                        {lecturers.map((lecturer, index) => (
                          <MenuItem key={"Lecturer-number-" + (index + 1)} value={lecturer.id}>
                            {lecturer.id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="lecturer-select-label-form">Subject</InputLabel>
                    <Select
                      defaultValue={subject}
                      value={subject}
                      label="Subject"
                      MenuProps={{
                        disablePortal: true, // <--- HERE
                        onClick: (e) => {
                          e.preventDefault();
                        },
                      }}
                      onChange={(e) => {
                        setSubject(e.target.value);
                      }}
                    >
                      {subjects.map((subject, index) => (
                        <MenuItem key={"Lecturer-number-" + (index + 1)} value={subject.id}>
                          {subject.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField type="number" onChange={(e) => setSlots(e.target.value)} value={slots} id="form-slots" fullWidth label="Slots" variant="outlined" />
                </Grid>
              </Grid>
            </Grid>
            {props.group.id ? (
              <></>
            ) : (
              <Grid item xs={12} md={6}>
                <Grid container spacing={4}>
                  <Grid item xs={4} md={4}>
                    <FormControl fullWidth>
                      <InputLabel id="day-of-the-week--select-label">Day of the Week</InputLabel>
                      <Select
                        id="form-day-of-the-week"
                        labelId="day-of-the-week--select-label"
                        value={dayOfTheWeek}
                        label="Day of the Week"
                        onChange={(e) => {
                          setDayOfTheWeek(e.target.value);
                        }}
                      >
                        {constants.daysOfTheWeekForm.map((s, index) => (
                          <MenuItem key={"day-of-the-week-" + index} value={s.index}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <FormControl fullWidth>
                      <InputLabel id="slot-select-label">Slot</InputLabel>
                      <Select
                        id="form-slot"
                        labelId="slot-select-label"
                        value={slot}
                        label="Slot Number"
                        onChange={(e) => {
                          setSlot(e.target.value);
                        }}
                      >
                        {constants.slot.map((s, index) => (
                          <MenuItem key={"slot-" + index} value={index + 1}>
                            Slot {index + 1} - {s.time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ padding: "15px 30px" }}
                      onClick={(e) => {
                        let newSlot = {
                          title: getDayByNumber(dayOfTheWeek),
                          number: dayOfTheWeek,
                          slot: slot,
                        };
                        if (!selectedSlots.some((obj) => obj.number == newSlot.number && obj.slot == newSlot.slot)) {
                          setSelectedSlots([...selectedSlots, newSlot]);
                        } else {
                          toast.error("Already included this slot", {
                            position: "bottom-left",
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <List sx={{ maxHeight: 127, height: 127, border: '1px solid #EEE2DE', borderRadius: '5px', overflow: 'scroll' }}>
                      {selectedSlots.map((selectedSlot, index) => {
                        return (
                          <ListItem
                            key={"selected-slot-" + index}
                            disableGutters
                            secondaryAction={
                              <IconButton
                                aria-label="selected"
                                onClick={() => {
                                  let newSelectedSlots = selectedSlots.filter(item => item !== selectedSlot)
                                  setSelectedSlots(newSelectedSlots);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            <ListItemText>
                              {selectedSlot.title} - Slot {selectedSlot.slot}
                            </ListItemText>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DesktopDatePicker
                      value={dayjs(startDate)}
                      label="Start Date"
                      onChange={(e) => {
                        setStartDate(e);
                      }}
                      sx={{
                        width: "100%",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DesktopDatePicker
                      value={dayjs(endDate)}
                      label="End Date"
                      onChange={(e) => {
                        setEndDate(e);
                      }}
                      sx={{
                        width: "100%",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid >

        {error && error !== "" ? (
          <Grid item xs={12} md={12}>
            <Alert severity="error">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          </Grid>
        ) : (
          <></>
        )
        }

        <Divider />
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
      </Grid >
      <ToastContainer />
    </>
  );
}

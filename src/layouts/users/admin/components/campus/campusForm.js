import { Grid, FormControl, Button, TextField, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Constants from "../../../../../utils/constants";
import { getArrayCache } from "../../../../../utils/dataOptimizer";

export default function CampusForm(props) {
  const [roomId, setRoomId] = useState(props.room.id);
  const [campus, setCampus] = useState(props.room.campus);
  const [building, setBuilding] = useState(props.room.building);
  const [number, setNumber] = useState(props.room.number);
  const [capacity, setCapacity] = useState(props.room.capacity);
  const [test, setTest] = useState(props.room.test);

  const constants = new Constants();

  const validateFormData = () => {
    if (building.trim() === "" || !building) {
      props.sendToast("error", "Invalid building");
      return false;
      
    }

    let rooms = getArrayCache("roomsData");
    let existingRoom = rooms.find((r) => r.number === number);
    if (existingRoom) {
    props.sendToast("error", "already exists");
    return false;
  }

  if (number.trim() === "" || !number || number === props.room.number) {
      console.log(number)
      
      props.sendToast("error", "Invalid number");
      return false;
    }

    if (capacity <= 0 || isNaN(capacity)) {
      props.sendToast("error", "Invalid capcity");
      return false;
    }

    return true;
  }

  const handleConfirm = () => {

    const room = {
      campus: campus,
      building: building,
      number: number,
      capacity: capacity,
      test: test,
    };

    if (!validateFormData()) {

      return;
    }

    if (campus && building && number && capacity) {
      if (roomId) {
        axios.put(process.env.REACT_APP_HOST_URL + "/campus/room?id=" + roomId, room).then((res) => {
          if (res.status === 200) {
            props.sendToast("success", "Room edited")
            props.closeHandler();
            props.refresh();
          }
        });
      } else {
        axios.post(process.env.REACT_APP_HOST_URL + "/campus/room", room).then((res) => {
          if (res.status === 200) {
            props.sendToast("success", "Room added")
            props.closeHandler();
            props.refresh();
          }
        });
      }
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <h2 style={{ margin: 0 }}>Manage room</h2>
          <p>You can manage your room using this form</p>
        </Grid>
        <Divider />
        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="campus-select-label-form">Campus</InputLabel>
            <Select
              defaultValue={campus ?? "HN"}
              value={campus ?? "default"}
              label="Campus"
              MenuProps={{
                disablePortal: true, // <--- HERE
                onClick: (e) => {
                  e.preventDefault();
                },
              }}
              onChange={(e) => {
                setCampus(e.target.value);
              }}
            >
              <MenuItem value={"default"} disabled>
                Please select a Campus
              </MenuItem>
              {constants.campuses.map((campus) => (
                <MenuItem key={campus.id} value={campus.id}>
                  {campus.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField onChange={(e) => setBuilding(e.target.value)} value={building} id="form-building" fullWidth label="Building" variant="outlined" />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField value={number} onChange={(e) => setNumber(e.target.value)} id="form-number" fullWidth label="Room Number" variant="outlined" />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} id="form-capacity" fullWidth label="Maximum Capacity" variant="outlined" />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField  value={test} onChange={(e) => setTest(e.target.value)} id="form-test" fullWidth label="Test" variant="outlined" />
        </Grid>
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
  );
}

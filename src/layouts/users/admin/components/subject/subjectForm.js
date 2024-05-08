import { Grid, FormControl, Button, TextField, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Constants from "../../../../../utils/constants";

export default function SubjectForm(props) {
  const constants = new Constants();

  const _id = props.subject.id;

  const [formData, setFormData] = useState({
    department: props.subject.department ?? "",
    subjectId: props.subject.id ?? "",
    name: props.subject.name ?? "",
    description: props.subject.description ?? "",
    prequisites: props.subject.prequisites ?? "",
    level: props.subject.level ?? "",
    slots: props.subject.slots ?? 40,
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateFormData = () => {

  }


  const handleConfirm = (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    if (formData.name && formData.department && formData.subjectId && formData.level && formData.slots) {
      if (_id) {
        axios
          .put(process.env.REACT_APP_HOST_URL + "/subject?id=" + _id, formData)
          .then((res) => {
            if (res.data.status) {
              props.closeHandler();
              props.refresh();
              toast.success("Subject updated successfully!", {
                position: "bottom-left",
              })
            } else {
              toast.error(res.data.data, {
                position: "bottom-left",
              });
            }
          });
      } else {
        axios
          .post(process.env.REACT_APP_HOST_URL + "/subject", formData)
          .then((res) => {
            if (res.data.status) {
              toast.success("Subject added successfully!", {
                position: "bottom-left",
              })
              props.closeHandler();
              props.refresh();
            } else {
              toast.error(res.data.data,);
            }
          });
      }
    } else {
      toast.error("Please fill all fields", {
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <h2 style={{ margin: 0 }}>Manage Subject</h2>
          <p>You can manage the subject using this form</p>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="department-select-label">Department</InputLabel>
            <Select
              name="department"
              id="form-department"
              labelId="department-select-label"
              defaultValue={formData.department}
              value={formData.department}
              label="Department"
              MenuProps={{
                disablePortal: true, // <--- HERE
                onClick: (e) => {
                  e.preventDefault();
                },
              }}
              onChange={handleChange}
            >
              {constants.departments.map((term) =>
                <MenuItem key={term.id} value={term.id}>
                  {term.name}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField name="subjectId" disabled={_id ? true : false} onChange={handleChange} value={formData.subjectId} id="form-name" fullWidth label="Subject Code" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField name="name" onChange={handleChange} value={formData.name} id="form-name" fullWidth label="Name" variant="outlined" />
        </Grid>

        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="level-select-label">Level</InputLabel>
            <Select
              name="level"
              id="form-level"
              labelId="level-select-label"
              value={formData.level}
              label="Level"
              onChange={handleChange}
            >
              {constants.programmes.map((level) => (
                <MenuItem key={"level-" + level.name} value={level.id}>
                  {level.name}
                </MenuItem>
              )
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField name="prequisites" fullWidth value={formData.prequisites} onChange={handleChange} id="form-prequisites" label="Prequisites" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField name="description" fullWidth onChange={handleChange} value={formData.description} id="form-description" label="Description" variant="outlined" rows={3} multiline />
        </Grid>

        <Grid item xs={12}>
          <TextField type="number" fullWidth value={formData.slots} onChange={handleChange} id="form-slots" label="Slot Number" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" sx={{ padding: "15px 30px" }} onClick={(e) => handleConfirm(e)}>
            Save
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="outlined" sx={{ padding: "15px 30px" }} onClick={props.closeHandler}>
            Cancel
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
}

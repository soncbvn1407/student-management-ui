import { Grid, Select, MenuItem, FormControl, Divider, Button, InputLabel, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import address_tree from "../../../../../utils/address_tree.json";
import { MuiTelInput } from "mui-tel-input";
import { toast } from "react-toastify";
import { filterByAttribute, stringRegex } from "../../../../../utils/utils";

export default function UserForm(props) {
  const id = props.user.id;

  const [formData, setFormData] = useState({
    auth: props.user.role ?? 1,
    firstName: props.user.firstName ?? "",
    lastName: props.user.lastName ?? "",
    dob: dayjs(props.user.dob) ?? dayjs(new Date()),
    phone: props.user.phone ?? "+84",
    email: props.user.email ?? "",
    department: props.user.department ?? "GCH",
    city: props.user.city ?? "",
    district: props.user.district ?? "",
    ward: props.user.ward ?? "",
    address: props.user.address ?? "",
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const departments = [
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
      name: "Design",
    },
    {
      id: "GFH",
      name: "Finance",
    },
    {
      id: "GMH",
      name: "Marketing",
    },
  ];

  useEffect(() => {
    try {
      let citiesMap = objectToMap(address_tree);
      setCities(citiesMap);
      if (props.user.id) {
        if (props.user.city) {
          let districtsMap = filterByAttribute(citiesMap, "code", props.user.city);
          setDistricts(objectToMap(districtsMap[0]['quan-huyen']));

          if (props.user.district) {
            let wardsMap = filterByAttribute(objectToMap(districtsMap[0]['quan-huyen']), "code", props.user.district);
            setWards(objectToMap(wardsMap[0]["xa-phuong"]))
          }
        }
      }
    } catch (e) { }
  }, []);

  function objectToMap(obj) {
    return Object.keys(obj).map(key => obj[key]);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleDeactivate = (e) => {
    axios.get(process.env.REACT_APP_HOST_URL + "/user/deactivate?id=" + id).then((res) => {
      if (res.status === 200) {
        props.closeHandler();
        props.refresh();
      }
    });
  };

  const validateFormData = () => {
    console.log(formData)
    if (!stringRegex.test(formData.firstName)) {
      toast.error("Invalid first name! Must only contain characters from A to Z", {
        position: "bottom-left",
      });
      return false;
    }

    if (!stringRegex.test(formData.lastName)) {
      toast.error("Invalid last name! Must only contain characters from A to Z", {
        position: "bottom-left",
      });
      return false;
    }

    if (formData.phone === "+84" || formData.phone.length !== 15) {
      console.log(formData.phone.length)
      toast.error("Must have valid phone number", {
        position: "bottom-left",
      });
      return false;
    }

    if (formData.city === "" || !formData.city) {
      toast.error("Must select city", {
        position: "bottom-left",
      });
      return false;
    }

    if (formData.district === "" || !formData.district) {
      toast.error("Must select district", {
        position: "bottom-left",
      });
      return false;
    }

    if (formData.ward === "" || !formData.ward) {
      toast.error("Must select ward", {
        position: "bottom-left",
      });
      return false;
    }

    return true;
  }

  const handleConfirm = (e) => {
    e.preventDefault();
    let user = {
      id: id,
      role: formData.auth,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: dayjs(formData.dob).format("YYYY-MM-DD"),
      phone: formData.phone,
      status: true,
      department_id: formData.department,
      password: formData.password,
      city: formData.city,
      district: formData.district,
      ward: formData.ward,
      address: formData.address,
    };

    if (!validateFormData()) {
      return;
    }

    if (formData.auth && formData.firstName && formData.lastName && formData.dob && formData.phone && formData.department) {
      if (id) {
        axios.put(process.env.REACT_APP_HOST_URL + "/user?id=" + id, user).then((res) => {
          console.log(res);
          if (res.data.status) {
            toast.success("User edited", {
              position: "bottom-left",
            });
            props.refresh();
            props.closeHandler();
          } else {
            toast.error(res.data.data, {
              position: "bottom-left",
            });
          }
        });
      } else {
        axios.post(process.env.REACT_APP_HOST_URL + "/user", user).then((res) => {
          if (res.data.status) {
            toast.success("User added", {
              position: "bottom-left",
            });
            props.refresh();
            props.closeHandler();
          } else {
            toast.error(res.data.data, {
              position: "bottom-left",
            });
          }
        });
      }
    } else {
      toast.error("Please fill all fields!", {
        position: "bottom-left",
      });
    }
  };

  const handleResetPassword = () => {
    try {
      axios.put(process.env.REACT_APP_HOST_URL + "/user/password?id=" + id + "&role=" + formData.auth).then((res) => {
        if (res.data.status) {
          props.closeHandler();
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
  }

  const handlePhoneChange = (newValue) => {
    setFormData((prevFormData) => ({ ...prevFormData, ["phone"]: newValue }));
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <h2 style={{ margin: 0 }}>Manage user</h2>
          <p>You can manage the user data using this form</p>
        </Grid>
        <Divider />
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel id="auth-select-label">Auth Level</InputLabel>
                <Select
                  required
                  disabled={id ? true : false}
                  name="auth"
                  id="form-role"
                  labelId="auth-select-label"
                  value={formData.auth}
                  label="Auth Level"
                  onChange={handleChange}
                >
                  <MenuItem value={1}>Student</MenuItem>
                  <MenuItem value={2}>Lecturer</MenuItem>
                  <MenuItem value={3}>Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                  required
                  name="department"
                  id="form-campus"
                  labelId="department-select-label"
                  value={formData.department}
                  label="Department"
                  onChange={handleChange}
                >
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField required name="firstName" onChange={(e) => handleChange(e)} value={formData.firstName} id="form-firstName" fullWidth label="First Name" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField required name="lastName" onChange={(e) => handleChange(e)} value={formData.lastName} id="form-lastName" fullWidth label="Last Name" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
              <DesktopDatePicker
                name="dob"
                onChange={(value) => {
                  setFormData((data) => ({
                    ...data,
                    dob: value
                  }));
                }}
                value={dayjs(formData.dob)}
                id="form-dob"
                label="Date of Birth"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MuiTelInput onlyCountries={["VN"]} name="phone" fullWidth value={formData.phone} onChange={handlePhoneChange} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={3}>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="city-select-label-form">City</InputLabel>
                <Select
                  name="city"
                  defaultValue={formData.city ?? "01"}
                  value={formData.city ?? "01"}
                  label="Campus"
                  MenuProps={{
                    disablePortal: true, // <--- HERE
                    onClick: (e) => {
                      e.preventDefault();
                    },
                  }}
                  onChange={(e) => {
                    handleChange(e);
                    let districtsMap = filterByAttribute(cities, "code", e.target.value);
                    setDistricts(objectToMap(districtsMap[0]['quan-huyen']));
                    setWards([]);
                  }}
                >
                  <MenuItem value={"default"} disabled>
                    Please select a City
                  </MenuItem>
                  {cities.map((item) => (
                    <MenuItem key={"Cities-" + item.code} value={item.code}>
                      {item.name} -  {item.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="city-select-label-form">District</InputLabel>
                <Select
                  name="district"
                  defaultValue={formData.district ?? "001"}
                  value={formData.district ?? "001"}
                  label="District"
                  MenuProps={{
                    disablePortal: true, // <--- HERE
                    onClick: (e) => {
                      e.preventDefault();
                    },
                  }}
                  onChange={(e) => {
                    handleChange(e);
                    let wardsMap = filterByAttribute(districts, "code", e.target.value);
                    setWards(objectToMap(wardsMap[0]["xa-phuong"]));
                  }}
                >
                  <MenuItem value={"default"} disabled>
                    Please select a District
                  </MenuItem>
                  {districts.map((item) => (
                    <MenuItem key={"District-" + item.cod} value={item.code}>
                      {item.name} -  {item.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="city-select-label-form">Ward</InputLabel>
                <Select
                  name="ward"
                  defaultValue={formData.ward ?? "0001"}
                  value={formData.ward ?? "0001"}
                  label="Ward"
                  MenuProps={{
                    disablePortal: true, // <--- HERE
                    onClick: (e) => {
                      e.preventDefault();
                    },
                  }}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                >
                  <MenuItem value={"default"} disabled>
                    Please select a Ward
                  </MenuItem>
                  {wards.map((item) => (
                    <MenuItem key={"Ward-" + item.code} value={item.code}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField name="address" onChange={(e) => handleChange(e)} value={formData.address} id="form-address" fullWidth label="Address" variant="outlined" />
            </Grid>
          </Grid>
        </Grid>

        {id && (
          <>
            <Grid item xs={6} md={3}>
              <Button fullWidth variant="contained" sx={{ padding: "15px 30px" }} color="error" onClick={(e) => handleResetPassword(e)}>
                Reset Password
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button fullWidth variant="contained" sx={{ padding: "15px 30px" }} color="error" onClick={(e) => handleDeactivate(e)}>
                Deactivate
              </Button>
            </Grid>
          </>
        )}
        <Grid item xs={id ? 3 : 6}>
          <Button fullWidth variant="contained" sx={{ padding: "15px 30px" }} onClick={(e) => handleConfirm(e)}>
            Save
          </Button>
        </Grid>
        <Grid item xs={id ? 3 : 6}>
          <Button fullWidth color="error" variant="outlined" sx={{ padding: "15px 30px" }} onClick={props.closeHandler}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

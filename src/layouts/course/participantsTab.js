import { useEffect, useState } from "react";
import { Grid, Box, Card, IconButton } from "@mui/material";
import axios from "axios";
import { cacheData, getArrayCache, lecturerItems } from "../../utils/dataOptimizer";

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh'
import { decodeToken } from "../../utils/utils";

export default function ParticipantsTab(props) {
    const course = props.course;

    const token = localStorage.getItem("access_token");
    const decodedToken = decodeToken(token);

    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        let data = getArrayCache(lecturerItems.Participants);
        if (data.length > 0) {
            setParticipants(data)
        } else {
            fetchParticipants();
        }

    }, []);

    function fetchParticipants() {
        try {
            axios.get(process.env.REACT_APP_HOST_URL + "/course/participants?id=" + course.id).then((res) => {
                if (res.data.status) {
                    setParticipants(res.data.data);
                    cacheData(lecturerItems.Participants, res.data.data)
                } else {
                    props.sendToast("error", res.data.data)
                }
            });
        } catch (e) {
            props.sendToast("error", e.toString())
        }
    }

    return (
        <div>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 'fit-content',
                paddingTop: '20px'
            }}>
                <div>
                    <h2
                        className="bold"
                        style={{
                            marginTop: '0px',
                            fontSize: "1.75rem",
                        }}
                    >
                        Participants
                    </h2>
                </div>
                <div>
                    <IconButton style={{
                        height: '40px'
                    }} >
                        <RefreshIcon onClick={fetchParticipants} />
                    </IconButton>
                </div>

            </div>

            <Grid container spacing={4}>
                {participants.map((participant, index) => {
                    console.log(participant)
                    return (
                        <Grid item sm={decodedToken.role === 1 ? 4 : 12}>
                            <Card sx={{ padding: '15px' }}>
                                <Grid container alignItems="center">
                                    <Grid item xs={decodedToken.role === 1 ? 2 : 1}>
                                        No. {index + 1}
                                    </Grid>
                                    <Grid item xs={decodedToken.role === 1 ? 4 : 2}>
                                        {participant.student_id}
                                    </Grid>
                                    <Grid item xs={decodedToken.role === 1 ? 4 : 2}>
                                        {participant.dob}
                                    </Grid>
                                    {
                                        decodedToken.role === 1 ? <></> : <><Grid item xs={2}>
                                            <strong>Grade:{" "}</strong>{participant.grade === "" ? "Not yet" : <strong style={{ color: 'red' }}>
                                                {participant.grade}</strong>}
                                        </Grid>
                                            <Grid item xs={2}>
                                                <strong>Grade Text:{" "}</strong>{<strong style={{ color: 'red' }}>
                                                    {participant.gradeText}</strong> ?? ""}
                                            </Grid>
                                            <Grid item xs={3} style={{
                                                justifyContent: 'end',
                                                textAlign: 'end'
                                            }}>
                                                <strong>Status:{" "}</strong>{participant.status === true ? "Activated" : "Disabled"}
                                            </Grid></>
                                    }

                                </Grid>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

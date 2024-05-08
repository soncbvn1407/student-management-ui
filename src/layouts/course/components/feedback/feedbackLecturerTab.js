import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

export default function FeedbackLecturerTab(props) {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    function fetchFeedbacks() {
        axios
            .get(process.env.REACT_APP_HOST_URL + "/feedback/course", {
                params: {
                    course_id: props.course.id,
                },
            })
            .then((res) => {
                if (res.status) {
                    setFeedbacks(res.data.data);
                } else {
                    props.sendToast("error", res.data);
                }
            });
    }

    return (
        <>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3>Feedbacks</h3>
                <Tooltip title="Refresh" arrow>
                    <IconButton onClick={fetchFeedbacks} sx={{ marginTop: '-5px' }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </div >
            <div
                style={{
                    marginTop: '-20px',
                    padding: '0px 30px 0 0',
                    position: "relative",
                    minWidth: '1200px'
                }}>
                {feedbacks.length > 0 ? (
                    <>
                        <Grid className="black" sx={{
                            fontWeight: 500,
                            borderBottom: "1px solid black",
                            margin: "10px 0",
                        }} container spacing={2}>
                            <Grid item xs={1}>No</Grid>
                            <Grid item xs={2}>Student ID</Grid>
                            {[...Array(8).keys()].map((i) => {
                                return (
                                    <Grid item xs={1}>
                                        Question {i + 1}
                                    </Grid>
                                );
                            })}
                            <Grid item xs={1} sx={{
                                justifyContent: 'end',
                                textAlign: 'right',
                                alignItems: 'right',

                            }}>
                                Total
                            </Grid>
                        </Grid>
                        {feedbacks.map((feedback, index) => {
                            return (
                                <Grid
                                    sx={{
                                        borderBottom: "1px solid black",
                                        margin: "5px 0",
                                    }}
                                    container
                                    spacing={2}
                                    key={
                                        "feedback-item-" +
                                        feedback.student_id +
                                        "-" +
                                        index
                                    }>
                                    <Grid item sx={{ padding: '0px 0 10px 0' }} xs={1}>{index + 1}</Grid>
                                    <Grid item sx={{ padding: '0px 0 10px 0' }} xs={2}>{feedback.student_id}</Grid>
                                    {[...Array(8).keys()].map((i) => {
                                        return (
                                            <Grid item xs={1} sx={{
                                                padding: '0px 0 10px 0',
                                            }}>
                                                {feedback["q" + i] ?? 0}
                                            </Grid>
                                        );
                                    })}
                                    <Grid item xs={1} sx={{
                                        padding: '0px 0 10px 0',
                                        justifyContent: 'end',
                                        textAlign: 'right',
                                        alignItems: 'right'
                                    }}>{feedback.total ?? "Not yet"}</Grid>
                                    {feedback.comment ? (
                                        <Grid sx={{ padding: '0px 0 10px 0' }} item xs={12}>
                                            Additional comment: <br />
                                            {feedback.comment}
                                        </Grid>
                                    ) : (
                                        <></>
                                    )}
                                </Grid>
                            );
                        })}
                    </>
                ) : (
                    <div style={{
                        marginTop: '20px'
                    }}>Currently no students have submitted their feedback yet</div>
                )}
            </div>
        </>
    );
}

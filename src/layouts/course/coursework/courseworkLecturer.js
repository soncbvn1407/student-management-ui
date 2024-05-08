import { Grid, Box, Button, Modal, Tooltip, IconButton, Icon, Divider } from "@mui/material";
import axios from "axios";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import AssignmentGradingModal from "../components/modal/assignment_grading_modal";
import { downloadFile, formatSecondsToDate } from "../../../utils/utils";
import lodash from "lodash";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getArrayCache, lecturerItems } from "../../../utils/dataOptimizer";
import SummarizeIcon from '@mui/icons-material/Summarize';
import Delete from "@mui/icons-material/Delete";
import Refresh from "@mui/icons-material/Refresh";
import MaterialItem from "../components/material_item";

export default forwardRef((props, ref) => {
    const [submission, setSubmission] = useState({});
    const [submissions, setSubmissions] = useState([]);
    const [participants, setParticipants] = useState([]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [assignment, setAssignment] = useState({})
    const [current, setCurrent] = useState(-1)

    const [assignmentId, setAssignmentId] = useState("");

    const [material, setMaterial] = useState({})
    const [materials, setMaterials] = useState([]);

    useImperativeHandle(ref, () => ({
        refreshMaterials() {
            fetchMaterials();
        }
    }))

    useEffect(() => {
        fetchMaterials();
    }, [props.course])

    function fetchParticipants(id) {
        axios
            .get(process.env.REACT_APP_HOST_URL + "/course/participants", {
                params: {
                    id: id,
                },
            })
            .then((res) => {
                if (res.data.status) {
                    console.log(res.data.data)
                    setParticipants(res.data.data);
                }
            });
    }

    function fetchMaterials() {
        try {
            axios
                .get(
                    process.env.REACT_APP_HOST_URL +
                    "/course/materials?id=" +
                    props.course.id
                )
                .then((res) => {
                    if (res.data.status) {
                        setMaterials(res.data.data);
                    } else {
                        props.sendToast("error", res.data.data);
                    }
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    }

    function fetchAssignments(id) {
        setAssignmentId(id)
        axios
            .get(process.env.REACT_APP_HOST_URL + "/submission/course", {
                params: {
                    id: id,
                },
            })
            .then((res) => {
                if (res.data.status) {
                    setSubmissions(res.data.data);

                    let data = getArrayCache(lecturerItems.Participants)
                    if (data.length > 0) {
                        setParticipants(data)
                    } else {
                        fetchParticipants(props.course.id);
                    }

                }
            });
    }

    function getRemainingSubmissions() {
        let remains = lodash.differenceWith(
            participants,
            submissions,
            function (o1, o2) {
                return o1["student_id"] == o2["user_id"];
            }
        );
        console.log(remains);
        return remains ?? [];
    }

    function deleteAssignment() {
        let confirm = window.confirm("Are you sure? This action cannot be undone!");
        if (confirm) {
            axios.delete(process.env.REACT_APP_HOST_URL + "/course/coursework", {
                params: {
                    id: assignment.id,
                    course_id: assignment.course_id
                }
            }).then((res) => {
                if (res.data.status) {
                    window.location.reload();
                } else {
                    props.sendToast("error", "Failed to delete coursework")
                }
            })
        }
    }

    function summarizeAllGrades() {
        axios.get(process.env.REACT_APP_HOST_URL + "/course/summarize", {
            params: {
                id: assignment.course_id
            }
        }).then((res) => {
            if (res.data.status) {
                props.sendToast("success", "Summarized grades for all students")
            } else {
                props.sendToast("error", "Failed to delete coursework")
            }
        })
    }

    return (
        <>
            <div className="curriculum-container">
                <div
                    style={{
                        height: "40px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "20px 0 5px 0",
                    }}>

                    <h3
                        className="bold"
                        style={{
                            lineHeight: "1.5rem",
                            fontSize: "1.75rem",
                        }}>
                        Materials
                    </h3>
                    <div>
                        <Tooltip arrow title="Refresh material">
                            <IconButton
                                onClick={fetchMaterials}>
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow title="Add new material">
                            <IconButton
                                onClick={props.handleOpenMaterialModal}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>

                    </div>
                </div>
                <div style={{
                    justifyContent: 'start',
                    alignContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '10px'
                }}>
                    <SaveAltIcon /><div style={{
                        marginLeft: '10px',
                        marginRight: '40px'
                    }}>: File</div>
                    <InsertLinkIcon /><div style={{
                        marginLeft: '10px',
                    }}>: URL Link</div>
                </div>
                <Divider />
                <div
                    style={{
                        marginTop: '20px',
                        marginBottom: "20px",
                        paddingBottom: "10px",
                        width: '100%'
                    }}>
                    {
                        materials.length > 0 ?
                            <>{
                                materials.map((material) => {
                                    console.log(material)
                                    return (
                                        <MaterialItem sendToast={props.sendToast} material={material} refresh={fetchMaterials} isLecturer={true} />
                                    )
                                })
                            }
                            </>
                            : <p>Currently not any materials available</p>
                    }
                </div>

                <div
                    style={{
                        height: "40px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "20px 0 10px 0",
                    }}>

                    <h3
                        className="bold"
                        style={{
                            lineHeight: "1.5rem",
                            fontSize: "1.75rem",
                        }}>
                        Submissions
                    </h3>
                    <div>
                        <Tooltip arrow title="Summarize all grades">
                            <IconButton
                                onClick={summarizeAllGrades}>
                                <SummarizeIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow title="Add new coursework assignment">
                            <IconButton
                                onClick={props.handleOpenCourseworkModal}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>

                        {
                            assignment.id ? <>
                                <IconButton
                                    sx={{
                                        margin: '0 10px'
                                    }}
                                    onClick={
                                        () => {
                                            props.handleOpenCourseworkModal(assignment)
                                        }
                                    }>
                                    <EditIcon />
                                </IconButton><IconButton
                                    onClick={
                                        () => {
                                            deleteAssignment();
                                        }
                                    }>
                                    <DeleteIcon />
                                </IconButton>
                            </> : <></>
                        }
                    </div>
                </div>
                <Divider />
                <div
                    style={{
                        marginTop: '20px',
                        marginBottom: "10px",
                        paddingBottom: "10px",
                    }}>
                    {props.course.assignments ? (
                        props.course.assignments.length > 0 ? (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                    }}>
                                    <div
                                        style={{
                                            marginRight: "10px",
                                            paddingTop: "5px",
                                        }}>
                                        Select an assignment:
                                    </div>
                                    {props.course.assignments.map(
                                        (assignment, index) => {
                                            return (
                                                <Button
                                                    sx={{
                                                        marginRight: '10px',
                                                    }}
                                                    variant={current === index ? "contained" : "outlined"}
                                                    onClick={() => {
                                                        setCurrent(index)
                                                        setAssignment(assignment)
                                                        fetchAssignments(
                                                            assignment.id
                                                        );
                                                    }}>
                                                    {assignment.name}
                                                </Button>
                                            );
                                        }
                                    )}
                                </div>
                            </>
                        ) : (
                            <></>
                        )
                    ) : (
                        <>This course has no assignment yet</>
                    )}
                </div>
                {(
                    <>
                        <div
                            className="curriculum-row"
                            style={{
                                fontSize: "13px",
                            }}>
                            <Grid container>
                                <Grid item xs={1}>
                                    Index
                                </Grid>
                                <Grid item xs={1}>
                                    Student
                                </Grid>
                                <Grid item xs={2}>
                                    Submission Time
                                </Grid>
                                <Grid item xs={2}>
                                    File
                                </Grid>
                                <Grid item xs={1}>
                                    Grade Number
                                </Grid>
                                <Grid item xs={1}>
                                    Grade Text
                                </Grid>
                                <Grid item xs={3}>
                                    Comments
                                </Grid>
                                <Grid item xs={1}>
                                    <Box
                                        display="flex"
                                        justifyContent="flex-end">
                                        Action
                                    </Box>
                                </Grid>
                            </Grid>
                        </div>
                        {submissions.map((submission, index) => {
                            return (
                                <GradingRow
                                    disabled={false}
                                    submission={submission}
                                    index={index}
                                    handleOpen={handleOpen}
                                    handleSetSubmission={() => {
                                        setSubmission(submissions[index]);
                                    }}
                                />
                            );
                        })}
                        <>
                            {getRemainingSubmissions().map(
                                (submission, index) => {
                                    return (
                                        <>
                                            <GradingRow
                                                disabled={true}
                                                index={
                                                    submissions.length + index
                                                }
                                                submission={{
                                                    user_id:
                                                        submission.student_id,
                                                    grade: 0,
                                                    gradeText: "N/A",
                                                    comments: "",
                                                    fileNames: [],
                                                }}
                                                handleOpen={handleOpen}
                                                handleSetSubmission={() => {
                                                    setSubmission({
                                                        user_id: submission.id,
                                                        grade: 0,
                                                        gradeText: "N/A",
                                                        comments: "",
                                                        fileNames: [],
                                                    });
                                                }}
                                            />
                                        </>
                                    );
                                }
                            )}
                        </>
                    </>
                )}
                <Modal open={open} onClose={handleClose} sx={{}}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 800,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                        }}>
                        <AssignmentGradingModal
                            closeHandler={handleClose}
                            assignment={submission}
                            sendToast={props.sendToast}
                            refresh={() => {
                                fetchAssignments(assignmentId)
                            }}
                        />
                    </Box>
                </Modal>
            </div>
        </>
    );
})


function GradingRow(props) {
    const { submission, index } = props;

    const handleDownloadFile = (path, fileName) => {
        downloadFile(process.env.REACT_APP_HOST_URL + path + fileName, fileName)
    }

    return (
        <div className="curriculum-row">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <Grid container spacing={0}>
                        <Grid item xs={1}>
                            {index + 1}
                        </Grid>
                        <Grid item xs={1}>
                            {submission.user_id}
                        </Grid>
                        <Grid item xs={2}>
                            {submission.date
                                ? formatSecondsToDate(submission.date)
                                : "Not yet submitted"}
                        </Grid>
                        <Grid item xs={2}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                {submission.fileNames.map((fileName) => {
                                    return (
                                        <Tooltip arrow title="Click to download file">
                                            <Button sx={{
                                                width: 'fit-content',
                                                fontSize: '12px'
                                            }} variant="contained" onClick={() => {
                                                handleDownloadFile(submission.path, fileName)
                                            }}>
                                                {fileName}
                                            </Button>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </Grid>
                        <Grid item xs={1}>
                            {submission.grade}
                        </Grid>
                        <Grid item xs={1}>
                            {submission.gradeText}
                        </Grid>

                        <Grid item xs={2}>
                            {submission.comments}
                        </Grid>
                        <Grid item xs={2}>
                            <Box display="flex" justifyContent="flex-end">
                                {
                                    props.disabled ? <Button
                                        disabled={true}>
                                        Not yet Submitted
                                    </Button> : <Button
                                        variant="contained"
                                        onClick={() => {
                                            props.handleSetSubmission(index);
                                            props.handleOpen();
                                        }}>
                                        Grade
                                    </Button>
                                }

                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

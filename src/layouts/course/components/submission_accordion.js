import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    TableContainer,
    TableRow,
    TableCell,
    Table,
    Button,
    Grid,
    Stack,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import {
    downloadFile,
    fromMilisecondsToDateString,
    subtractTime,
} from "../../../utils/utils";
import axios from "axios";
import { MuiFileInput } from "mui-file-input";

export default function SubmmissionAccordion(props) {
    const [submission, setSubmission] = useState({});
    const [files, setFiles] = useState([]);

    const remainingTime = subtractTime(
        new Date() / 1000,
        props.assignment.deadline
    );

    const remainingTimeMiliseconds = (props.assignment.deadline - new Date() / 1000)
    const openTime = props.assignment.start - new Date() / 1000;

    useEffect(() => {
        fetchAssignment();
    }, []);

    function fetchAssignment() {
        try {
            axios
                .get(
                    process.env.REACT_APP_HOST_URL +
                    "/submission?id=" +
                    props.course.id +
                    "-" +
                    props.assignment.id +
                    "-" +
                    props.decoded.id
                )
                .then((res) => {
                    if (res.data.status) {
                        console.log(res.data.data);
                        setSubmission(res.data.data);
                    } else {
                        props.sendToast("error", res.data.data);
                    }
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    }

    function handleSubmit() {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
                if (file.size > 20000000)
                    throw "File size could not be more than 20mbs";
            });
            formData.append("programme", props.course.programme);
            formData.append("user_id", props.decoded.id);
            formData.append("course_id", props.course.id);
            formData.append("assignment_id", props.assignment.id);

            axios
                .post(
                    process.env.REACT_APP_HOST_URL + "/submission/submit",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((res) => {
                    if (res.data.status) {
                        fetchAssignment();
                        props.sendToast("success", "Submit successfully");
                        setFiles(null);
                    } else {
                        props.sendToast("error", res.data.data);
                    }
                });
        } catch (e) {
            props.sendToast("error", e.toString());
        }
    }

    function handleDownloadFile(index) {
        console.log(submission)
        downloadFile(
            process.env.REACT_APP_HOST_URL + submission.path + submission.fileNames[index],
            submission.fileNames[index]
        );
    }

    function handleDeleteFile(selected) {
        const confirm = window.confirm("Are you sure? This action cannot be undone!")

        if (confirm) {
            try {
                const path =
                    "\\assets" + submission.path + submission.fileNames[selected];
                axios
                    .delete(process.env.REACT_APP_HOST_URL + "/submission/file", {
                        params: {
                            course_id: props.course.id,
                            assignment_id: props.assignment.id,
                            user_id: props.decoded.id,
                            fileIndex: selected,
                            filePath: path,
                        },
                    })
                    .then((res) => {
                        if (res.data.status) {
                            props.sendToast("success", "Submission deleted")
                            fetchAssignment();
                        } else {
                            props.sendToast("error", res.data.data);
                        }
                    });
            } catch (e) {
                props.sendToast("error", e.toString());
            }
        }
    }


    return (
        <>
            <Accordion defaultExpanded={false}>
                <AccordionSummary
                    sx={{
                        borderBottom: "3px solid #F11A7B",
                    }}
                    expandIcon={<ExpandMoreIcon />}>
                    <Grid container>
                        <Grid item sm={2} md={2}>
                            <h3 style={{ margin: 0, lineHeight: 1 }}>{props.assignment.name}</h3>
                        </Grid>
                        <Grid item sm={3} md={3}>
                            {" "}
                            <b>Deadline: </b>{" "}
                            {fromMilisecondsToDateString(
                                props.assignment.deadline * 1000
                            )}
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <h4>Submission Status</h4>
                    <TableContainer
                        component={Paper}
                        className="submission-table"
                        elevation={0}>
                        <Table fullWidth>
                            <TableRow>
                                <TableCell className="col-1">
                                    Submission Status
                                </TableCell>
                                <TableCell className="col-2">
                                    {submission !== -1
                                        ? "Submitted"
                                        : "Not submitted"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="col-1">
                                    Grading Status
                                </TableCell>
                                <TableCell className="col-2">
                                    {submission.grade ?? "Not graded"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="col-1">
                                    Open time
                                </TableCell>
                                <TableCell className="col-2">
                                    {fromMilisecondsToDateString(
                                        props.assignment.start * 1000
                                    )}
                                </TableCell>
                            </TableRow>

                            {submission !== -1 ? (
                                <>
                                    <TableRow>
                                        <TableCell className="col-1">
                                            Last Modified
                                        </TableCell>
                                        <TableCell className="col-2">
                                            {fromMilisecondsToDateString(
                                                submission.date
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="col-1">
                                            File Submissions
                                        </TableCell>
                                        <TableCell
                                            className="col-2">
                                            <Stack direction="row" spacing={1}>
                                                {submission.fileNames &&
                                                    submission.fileNames.map(
                                                        (fileName, index) => {
                                                            return (
                                                                <Chip

                                                                    key={
                                                                        "submission-" +
                                                                        index
                                                                    }
                                                                    label={
                                                                        fileName
                                                                    }
                                                                    onClick={() =>
                                                                        handleDownloadFile(
                                                                            index
                                                                        )
                                                                    }
                                                                    onDelete={() => {
                                                                        if (remainingTimeMiliseconds < 0) {
                                                                            props.sendToast("error", "Submission is locked");
                                                                        } else {
                                                                            handleDeleteFile(
                                                                                index
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            );
                                                        }
                                                    )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ) : (
                                <>
                                    <TableRow>
                                        <TableCell className="col-1">
                                            Time Remaining
                                        </TableCell>
                                        <TableCell className="col-2">
                                            {remainingTime}
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                            <TableRow>
                                <TableCell className="col-1">
                                    Submission
                                </TableCell>
                                <TableCell className="col-2">
                                    <MuiFileInput
                                        disabled={remainingTimeMiliseconds < 0}
                                        value={files}
                                        multiple={true}
                                        onChange={(newValue) => {
                                            setFiles(newValue);
                                        }}
                                    />
                                    <p>
                                        Maximum 10 files with no more than 20mb
                                        size
                                    </p>
                                    {
                                        remainingTimeMiliseconds < 0 ? <p style={{ color: 'red' }}>File submission is locked</p> : <></>
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="col-1"></TableCell>
                                <TableCell className="col-2">
                                    {
                                        remainingTimeMiliseconds < 0 ? <></> : openTime < 0 ? (
                                            <Button
                                                variant="contained"
                                                onClick={handleSubmit}>
                                                Submit
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                disabled={true}>
                                                Not yet open for submission
                                            </Button>
                                        )

                                    }
                                </TableCell>
                            </TableRow>
                        </Table>
                    </TableContainer>
                    <br />
                    <p>
                        <span className="alert">*Note: </span> Any submission
                        beyond the deadline for under 12 hours will be penalized
                        and those that are later are not accepted.
                    </p>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

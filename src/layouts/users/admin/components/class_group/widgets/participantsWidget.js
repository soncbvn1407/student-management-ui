import CustomTable from "../../../../../../common/table/table";
import { Grid } from "@mui/material";
import { getAllHeaderColumns } from "../../../../../../utils/utils";

const headCells = [
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Id",
    },
    {
        id: "username",
        numeric: true,
        disablePadding: false,
        label: "Student Code",
    },
    {
        id: "lastName",
        numeric: true,
        disablePadding: false,
        label: "Last Name",
    },
    {
        id: "firstName",
        numeric: true,
        disablePadding: false,
        label: "First Name",
    },
    {
        id: "dob",
        numeric: true,
        disablePadding: false,
        label: "Date of Birth",
    },
];

export default function ParticipantsWidget(props) {
    return (
        <Grid
            container>
            <Grid item xs={12}>
                <div className="big-widget">
                    <div className="programme-list">
                        {
                            props.firstClick ? <CustomTable
                                handleAddEntry={props.handleAddEntry}
                                title={"Participants List"}
                                rows={props.participants}
                                headCells={headCells}
                                colNames={getAllHeaderColumns(headCells)}
                                handleEdit={props.handleEdit}
                                handleDelete={props.handleDelete}
                            /> : <><h3>Please select a group to see its participants</h3></>
                        }

                    </div>
                </div>
            </Grid>
        </Grid>
    )
}
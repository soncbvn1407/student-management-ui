import { Grid } from "@mui/material";
import CustomTable from "../../../../../../common/table/table";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Id",
  },
  {
    id: "programme",
    numeric: true,
    disablePadding: false,
    label: "Programme",
  },
  {
    id: "department",
    numeric: true,
    disablePadding: false,
    label: "Department",
  },
  {
    id: "term",
    numeric: true,
    disablePadding: false,
    label: "Term",
  },
  {
    id: "slots",
    numeric: true,
    disablePadding: false,
    label: "Slots",
  },
  {
    id: "subject",
    numeric: true,
    disablePadding: false,
    label: "Subject",
  },
  {
    id: "lecturer",
    numeric: true,
    disablePadding: false,
    label: "Lecturer",
  },
];

export default function GroupWidget(props) {
  let data = [];
  props.groups.forEach((row) => {
    data.push(row);
  });

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <div className="big-widget">
          <CustomTable
            handleRefreshEntry={props.handleRefreshEntry}
            handleSearchInfo={props.handleSearchInfo}
            handleGetSelected={props.handleGetSelected}
            getSelectedId={props.getSelectedId}
            additionalTools={props.additionalTools}
            handleAddEntry={props.handleAddEntry}
            title={"Groups"}
            rows={data}
            headCells={headCells}
            colNames={["id", "programme", "department", "term", "slots", "subject", "lecturer"]}
            handleEdit={props.handleEdit}
            handleDelete={props.handleDelete}
          />
        </div>
      </Grid>
    </Grid>
  );
}

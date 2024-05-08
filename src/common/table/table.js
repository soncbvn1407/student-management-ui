import {
    useState,
    useMemo,
    forwardRef,
    useImperativeHandle,
} from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import {
    formatSecondsToDate,
    getComparator,
    stableSort,
} from "../../utils/utils";
import EnhancedTableToolbar from "./tableToolbar";
import EnhancedTableHead from "./tableHead";

export default forwardRef(function CustomTable(props, ref) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(props.init_count ?? 8);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    useImperativeHandle(ref, () => ({
        clearSelected() {
            setSelected([]);
        },
    }));

    const clearSelected = () => {
        setSelected([]);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = props.rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.

    const visibleRows = useMemo(
        () =>
            stableSort(props.rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [props.rows, order, orderBy, page, rowsPerPage]
    );

    return (
        <Box sx={{ width: "100%", paddingTop: "20px", overflow: "auto" }}>
            <Box
                sx={{
                    width: "100%",
                    mb: 2,
                    display: "table",
                    tableLayout: "fixed",
                }}>
                <EnhancedTableToolbar
                    clearSelected={clearSelected}
                    isDownloadable={props.isDownloadable}
                    isCampusControl={props.isCampusControl}
                    handleRefreshEntry={props.handleRefreshEntry}
                    handleSearchInfo={props.handleSearchInfo}
                    handleGetSelected={props.handleGetSelected}
                    additionalTools={props.additionalTools}
                    handleAddEntry={props.handleAddEntry}
                    title={props.title}
                    handleEdit={props.handleEdit}
                    handleDelete={props.handleDelete}
                    handleDownload={props.handleDownload}
                    numSelected={selected.length}
                    selected={selected}
                />
                {visibleRows.length > -1 ? (
                    <>
                        <TableContainer
                            sx={{
                                maxHeight: props.tableHeight ?? "300px",
                                minHeight: props.tableHeight ?? "300px",
                            }}>
                            <Table
                                stickyHeader
                                wrapperStyle={{
                                    maxHeight: "30vh",
                                }}
                                aria-labelledby="tableTitle"
                                size={"medium"}>
                                <EnhancedTableHead
                                    headCells={props.headCells}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={props.rows.length}
                                />
                                <TableBody>
                                    {visibleRows.map((row, i) => {
                                        const isItemSelected = isSelected(
                                            row.id
                                        );
                                        const labelId = `enhanced-table-checkbox-${i}`;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) =>
                                                    handleClick(event, row.id)
                                                }
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                                sx={{
                                                    cursor: "pointer",
                                                    maxHeight: "20px",
                                                    overflowY: "auto",
                                                }}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            "aria-labelledby":
                                                                labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                {props.colNames.map(
                                                    (col, index) => {
                                                        return index === 0 ? (
                                                            <TableCell
                                                                key={
                                                                    "row-" +
                                                                    props
                                                                        .colNames[
                                                                    index
                                                                    ]
                                                                }
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none">
                                                                {col ===
                                                                    "status"
                                                                    ? row[
                                                                        props
                                                                            .colNames[
                                                                        index
                                                                        ]
                                                                    ]
                                                                        ? "Activated"
                                                                        : "Deactivated"
                                                                    : row[
                                                                    props
                                                                        .colNames[
                                                                    index
                                                                    ]
                                                                    ]}
                                                            </TableCell>
                                                        ) : props.colNames[
                                                            index
                                                        ] === "date" ? (
                                                            <TableCell
                                                                key={
                                                                    "row-" +
                                                                    props
                                                                        .colNames[
                                                                    index
                                                                    ]
                                                                }
                                                                align="right">
                                                                {formatSecondsToDate(
                                                                    row[
                                                                    props
                                                                        .colNames[
                                                                    index
                                                                    ]
                                                                    ]
                                                                ) ?? "N/A"}
                                                            </TableCell>
                                                        )
                                                            : (
                                                                <TableCell
                                                                    key={
                                                                        "row-" +
                                                                        props
                                                                            .colNames[
                                                                        index
                                                                        ]
                                                                    }
                                                                    align="right">
                                                                    {row[
                                                                        props
                                                                            .colNames[
                                                                        index
                                                                        ]
                                                                    ] ?? "N/A"}
                                                                </TableCell>
                                                            );
                                                    }
                                                )}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[4, 8, 12, 20, 30]}
                            component="div"
                            count={props.rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                ) : (
                    <div
                        style={{
                            marginLeft: "15px",
                        }}>
                        <h3>Empty data, please add some!</h3>
                    </div>
                )}
            </Box>
        </Box>
    );
});

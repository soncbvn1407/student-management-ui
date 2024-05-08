import { Button, Tooltip, IconButton } from "@mui/material";
import axios from "axios";
import { downloadFile } from "../../../utils/utils";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import Delete from "@mui/icons-material/Delete";


export default function MaterialItem(props) {

    const handleDelete = () => {
        const confirm = window.confirm("Are you sure? This action cannot be undone!")
        if (confirm) {
            axios.delete(process.env.REACT_APP_HOST_URL + "/course/materials", {
                params: {
                    id: props.material.id,
                    course_id: props.material.course_id,
                    path: props.material.path + props.material.name
                }
            }).then((res) => {
                props.refresh();
            })
        }
    }

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            marginBottom: '10px'
        }}>
            <div style={{
                marginTop: '7.5px',
                marginRight: '10px'
            }}>
                {
                    props.material.type === "1" ? <SaveAltIcon /> : <InsertLinkIcon />
                }
            </div>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Button style={{
                    marginRight: '10px'
                }} onClick={() => {
                    props.material.type === "1" ?
                        downloadFile(process.env.REACT_APP_HOST_URL + props.material.path + props.material.name, props.material.name) : window.open(props.material.url)
                }} variant="outlined">{
                        props.material.type === "1" ? props.material.name : props.material.url}
                </Button>
                {
                    props.isLecturer ? <Tooltip arrow title="Delete Material">
                        <IconButton onClick={handleDelete}>
                            <Delete />
                        </IconButton>
                    </Tooltip> : <></>
                }
            </div>
        </div>

    )
}
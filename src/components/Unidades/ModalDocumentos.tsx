import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SaveAltIcon from '@mui/icons-material/SaveAlt';


import { IconButton } from '@mui/material';

export interface Props{
    open: boolean
}

const ModalDocumentos = ({open}: Props) => {
    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Documentos de la unidad"}
            </DialogTitle>
            <DialogContent>
                <div className='row container-fluid'>
                    <div className='col-12'>
                        <p className='card-title'>1.- Tarjeta de Circulación
                        <IconButton aria-label="delete" size="small" className='ml-3'>
                            <SaveAltIcon fontSize="inherit" />
                        </IconButton></p>
                    </div>
                    <div className='col-12'>
                        <p className='card-title'>1.- Tarjeta de Circulación
                        <IconButton aria-label="delete" size="small">
                            <SaveAltIcon fontSize="inherit" />
                        </IconButton></p>
                    </div>
                    <div className='col-12'>
                        <p className='card-title'>1.- Tarjeta de Circulación
                        <IconButton aria-label="delete" size="small">
                            <SaveAltIcon fontSize="inherit" />
                        </IconButton></p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    )
}

export default ModalDocumentos
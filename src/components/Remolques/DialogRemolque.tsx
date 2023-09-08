import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { Fragment } from 'react';
import RemolqueForm from '../../pages/Remolques/Form/RemolqueForm';


export interface Props {
    open: boolean,
    returnCloseDialog: (close: boolean) => void,
    returnRemolque: (success: boolean) => void
}

const DialogRemolque = ({open, returnCloseDialog, returnRemolque}: Props) => {

    const returnFunction = (e: boolean) => {
        //retornamos la respuesta del formulario de unidad
        returnRemolque(e);
        //cerramos el modal dle formulario d ela unidad
        returnCloseDialog(false);
    }

    return (
        <Fragment>
            <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
                <DialogContent>
                    <RemolqueForm  returnFormRemolque={(e) => returnFunction(e)} />
                </DialogContent>
                <DialogActions>
                    <button className='btn btn-danger' onClick={() => returnCloseDialog(false)}>Salir sin guardar</button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default DialogRemolque
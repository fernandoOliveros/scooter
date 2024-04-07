import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Fragment } from 'react';
import FormRemolque from '../../pages/Remolques/Form/FormRemolque';


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
                    <FormRemolque  returnFormRemolque={(e) => returnFunction(e)} />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='warning'  onClick={() => returnCloseDialog(false)}>Salir sin guardar</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default DialogRemolque
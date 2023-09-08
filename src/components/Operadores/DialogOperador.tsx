import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Fragment } from 'react';
import OperadorForm from '../../pages/Operadores/Form/OperadorForm';


export interface Props {
    open: boolean,
    returnCloseDialog: (close: boolean) => void,
    returnOperador: (success: boolean) => void
}

const DialogOperador = ({open, returnCloseDialog, returnOperador}: Props) => {

    const returnFunction = (e: boolean) => {
        //retornamos la respuesta del formulario de unidad
        returnOperador(e);
        //cerramos el modal dle formulario d ela unidad
        returnCloseDialog(false);
    }

    return (
        <Fragment>
            <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
                <DialogContent>
                    <OperadorForm  returnFormOperador={(e) => returnFunction(e)} />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='warning'  onClick={() => returnCloseDialog(false)}>Salir sin guardar</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default DialogOperador
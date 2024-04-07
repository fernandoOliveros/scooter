import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Fragment } from 'react'
import ClienteForm from '../../pages/Clientes/Form/ClienteForm';


export interface Props {
    open: boolean,
    returnCloseDialog: (close: boolean) => void,
    returnCliente: (success: boolean) => void
}


function DialogCliente({open, returnCloseDialog, returnCliente}: Props) {
    const returnFunction = (e: boolean) => {
        //retornamos la respuesta del formulario de unidad
        returnCliente(e);
        //cerramos el modal dle formulario d ela unidad
        returnCloseDialog(false);
    }

    return (
        <Fragment>
            <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
                <DialogContent>
                    <ClienteForm  returnFormCliente={(e) => returnFunction(e)} />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='warning'  onClick={() => returnCloseDialog(false)}>Salir sin guardar</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default DialogCliente
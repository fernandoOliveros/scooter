import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Fragment } from 'react';
import UnidadForm from '../../pages/Unidades/Form/UnidadForm';


export interface Props {
    open: boolean,
    returnCloseDialog: (close: boolean) => void,
    returnUnidad: (success: boolean) => void
}

const DialogUnidad = ({open, returnCloseDialog, returnUnidad}: Props) => {

    const returnFunction = (e: boolean) => {
        //retornamos la respuesta del formulario de unidad
        returnUnidad(e);
        //cerramos el modal dle formulario d ela unidad
        returnCloseDialog(false);
    }

    return (
        <Fragment>
            <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
                <DialogContent>
                    <UnidadForm  returnFormUnidad={(e) => returnFunction(e)} />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='warning' onClick={() => returnCloseDialog(false)}>Salir sin guardar</Button>                
                </DialogActions>
            </Dialog>
            
        </Fragment>
    );
}

export default DialogUnidad
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { Fragment } from 'react'
import CartaPorteForm from '../../pages/CartaPortes/Form/CartaPorteForm'

export interface Props {
    open: boolean,
    idViaje?: any,
    returnCloseDialog: (close: boolean) => void,
    returnCartaPorte: (success: boolean) => void
}

function DialogFormCartaPorte({open, returnCartaPorte, returnCloseDialog}: Props) {
    return (
        <Fragment>
            <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
                <DialogContent>
                    <CartaPorteForm returnFormCartaPorte={returnCartaPorte} />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='warning' onClick={() => returnCloseDialog(false)}>Salir sin guardar</Button>                
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default DialogFormCartaPorte
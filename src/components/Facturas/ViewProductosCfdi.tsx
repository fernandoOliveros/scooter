import { Fragment } from 'react'
import { IProducServicioCfdiForm } from '../../models/cfdis/cfdi-form.model'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'

export interface Props {
    open: boolean,
    params?: IProducServicioCfdiForm[],
    returnCloseDialog: (close: boolean) => void,
}

const ViewProductosCfdi = ({open, params, returnCloseDialog}: Props) => {
  return (
    <Fragment>
        <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='warning'  onClick={() => returnCloseDialog(false)}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    </Fragment>
  )
}

export default ViewProductosCfdi
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import OrigenForm from './OrigenForm'
import { ICartaPorteDirOrigenForm } from '../../../../models/cartaportes/cartaPorte-dirOrigen-form.model';


interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (data: ICartaPorteDirOrigenForm) => void;
    defaultValues?: Partial<ICartaPorteDirOrigenForm>;
  }
  
function OrigenModal({ open, onClose, onSave, defaultValues }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{defaultValues ? "Editar Origen" : "Agregar Origen"}</DialogTitle>
        <DialogContent>
            <div className="row">
                <OrigenForm
                defaultValues={defaultValues}
                onCancel={onClose}
                onSubmit={onSave}
                />
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default OrigenModal
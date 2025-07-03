import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ICartaPorteDirDestinoForm } from '../../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import DestinoForm from './DestinoForm';


interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ICartaPorteDirDestinoForm) => void;
  defaultValues?: Partial<ICartaPorteDirDestinoForm>;
}
  
function DestinoModal({ open, onClose, onSave, defaultValues }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>{defaultValues ? "Editar Destino" : "Agregar Destino"}</DialogTitle>
        <DialogContent>
            <div className="row">
                <DestinoForm
                  defaultValues={defaultValues}
                  onCancel={onClose}
                  onSubmit={onSave}
                />
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DestinoModal
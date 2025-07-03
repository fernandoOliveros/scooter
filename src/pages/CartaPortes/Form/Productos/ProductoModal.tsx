import { ICartaPorteProductoServicioForm } from '../../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import ProductoForm from './ProductoForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ICartaPorteProductoServicioForm) => void;
  defaultValues?: Partial<ICartaPorteProductoServicioForm>;
}

function ProductoModal({ open, onClose, onSave, defaultValues }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>{defaultValues ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
        <DialogContent>
            <div className="row">
                <ProductoForm
                  defaultValues={defaultValues}
                  onCancel={onClose}
                  onSubmit={onSave}
                />
            </div>
        </DialogContent>
    </Dialog>  
  );
}

export default ProductoModal
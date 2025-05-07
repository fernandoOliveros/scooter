import { ICartaPorteCfdiForm, IProducServicioCartaPorteCfdiForm } from "./cartaPorte-cfdi.model";
import { ICartaPorteDirDestinoForm } from "./cartaPorte-dirDestino-form.model";
import { ICartaPorteDirOrigenForm } from "./cartaPorte-dirOrigen-form.model";
import { ICartaPorteForm } from "./cartaPorte-form.model";
import { ICartaPorteProductoServicioForm } from "./cartaPorte-produtoServicio-form.model";

export interface ICartaPorteFormData {
    general: ICartaPorteForm;
    cfdi: ICartaPorteCfdiForm;
    productCfdi: IProducServicioCartaPorteCfdiForm;
    arrOrigenes: ICartaPorteDirOrigenForm[];
    arrDestinos: ICartaPorteDirDestinoForm[];
    productoServicio: ICartaPorteProductoServicioForm[];
    
}
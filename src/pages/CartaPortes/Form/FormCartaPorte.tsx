import { Button } from '@mui/material'
import { Fragment, memo, useState } from 'react'
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import SectionCfdiCartaPorte from './Sections/SectionCfdiCartaPorte';
import { ICartaPorteFormData } from '../../../models/cartaportes/cartaporte-formData';
import SectionProductoServicio from './Sections/SectionProductoServicio';
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import OrigenList from './Origenes/OrigenList';
import OrigenModal from './Origenes/OrigenModal';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import DestinoList from './Destinos/DestinoList';
import DestinoModal from './Destinos/DestinoModal';

const FormCartaPorte = memo( () => {
    const isEditMode = false;
    const methods = useForm<ICartaPorteFormData>({
        defaultValues: {
        general: {},
        cfdi: {
            id_Moneda : null,
            id_FormaPago : null,
            id_MetodoPago: null,
            id_UsoCFDI : null,
            id_TipoComprobante : null,
            id_Viaje : null,
            id_Cliente : null,
            dec_SubTotal: null,
            dec_Total: null,
            dec_TotalImpuestosRetenidos: null,
            dec_TotalImpuestosTrasladados: null
        },
        productCfdi: {
            id_CFDI: null,
            id_ClaveProdServCFDI: null,
            id_ClaveUnidadPesoCFDI: null,
            id_ObjetoImp: null,
            dec_ImporteConcepto: 1,
            dec_ValorUnitarioConcepto: 1,
            st_DescripcionConcepto: null,
            id_ImpuestoTraslado: null,
            id_ImpuestoRetencion: null,
            id_TipoFactorTraslado: null,
            id_TipoFactorRetencion: null,
            dec_BaseTraslado: 0,
            dec_BaseRetencion: 0,
            dec_ImporteTraslado: 0,
            dec_ImporteRetencion: 0,
            dec_TasaOCuotaTraslado: 0,
            dec_TasaOCuotaRetencion: 0,
            i_Cantidad: 1,
        },
        arrOrigenes: [],
        arrDestinos: [],
        productoServicio: [],
        },
    });

    // =========================== ORIGENES ==================================
    const {control} = methods;
    const {
        fields: origenes,
        append: appendOrigen,
        remove: removeOrigen,
        update: updateOrigen,
    } = useFieldArray({
    control,
    name: "arrOrigenes",
    });

    const [openModalOrigen, setOpenModalOrigen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleAddOrigen = () => {
        setEditIndex(null);
        setOpenModalOrigen(true);
    };

    const handleEditOrigen = (index: number) => {
        setEditIndex(index);
        setOpenModalOrigen(true);
    };

    const handleSaveOrigen = (data: ICartaPorteDirOrigenForm) => {
    if (editIndex !== null) {
        updateOrigen(editIndex, data);
    } else {
        appendOrigen(data);
    }
    setOpenModalOrigen(false);
    };

    const handleRemoveOrigen = (index: number) => {
        removeOrigen(index);
    };

    // =========================== DESTINOS ==================================
    const {
        fields: destinos,
        append: appendDestino,
        remove: removeDestino,
        update: updateDestino,
    } = useFieldArray({
    control,
    name: "arrDestinos",
    });

    const [openModalDestino, setOpenModalDestino] = useState(false);
    const [editIndexDestinos, setEditIndexDestinos] = useState<number | null>(null);

    const handleAddDestino = () => {
        setEditIndexDestinos(null);
        setOpenModalDestino(true);
    };

    const handleEditDestino = (index: number) => {
        setEditIndexDestinos(index);
        setOpenModalDestino(true);
    };

    const handleSaveDestino = (data: ICartaPorteDirDestinoForm) => {
    if (editIndexDestinos !== null) {
        updateDestino(editIndexDestinos, data);
    } else {
        appendDestino(data);
    }
    setOpenModalDestino(false);
    };

    const handleRemoveDestino = (index: number) => {
        removeDestino(index);
    };

    


    // ================ OPERACIONES UTILS =======================
    const onSubmit: SubmitHandler<ICartaPorteFormData> = async (data, e) => {
        e?.preventDefault();
        console.log(data);
    }
  return (
    <Fragment>
        <FormProvider {...methods}>
            <form className='form-horizontal'  onSubmit={methods.handleSubmit(onSubmit)} autoComplete="off">
                <div className="form-body">
                    <SectionCfdiCartaPorte />
                    {/* Lista de Orígenes */}
                    <OrigenList
                        origenes={origenes}
                        onAdd={handleAddOrigen}
                        onEdit={handleEditOrigen}
                        onRemove={handleRemoveOrigen}
                    />
                    {/* Modal para agregar/editar Origen*/}
                    <OrigenModal
                        open={openModalOrigen}
                        onClose={() => setOpenModalOrigen(false)}
                        onSave={handleSaveOrigen}
                        defaultValues={editIndex !== null ? origenes[editIndex] : undefined}
                    />
                    {/* Lista de Destinos */}
                    <DestinoList
                        destinos={destinos}
                        onAdd={handleAddDestino}
                        onEdit={handleEditDestino}
                        onRemove={handleRemoveDestino}
                    />
                    {/* Modal para agregar/editar Destino */}
                    <DestinoModal
                        open={openModalDestino}
                        onClose={() => setOpenModalDestino(false)}
                        onSave={handleSaveDestino}
                        defaultValues={editIndexDestinos !== null ? destinos[editIndexDestinos] : undefined}
                    />
                    <SectionProductoServicio />
                </div>
                <div className="row mt-4">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <Button variant='contained' color='success' size='medium' type="submit">
                                { isEditMode ? 'Actualizar' : 'Guardar' }
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    </Fragment>
  )
});

export default FormCartaPorte
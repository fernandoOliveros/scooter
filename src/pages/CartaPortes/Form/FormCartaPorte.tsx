import { Button } from '@mui/material'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import SectionCfdiCartaPorte from './Sections/SectionCfdiCartaPorte';
import { ICartaPorteFormData } from '../../../models/cartaportes/cartaporte-formData';
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import OrigenList from './Origenes/OrigenList';
import OrigenModal from './Origenes/OrigenModal';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import DestinoList from './Destinos/DestinoList';
import DestinoModal from './Destinos/DestinoModal';
import ProductoList from './Productos/ProductoList';
import ProductoModal from './Productos/ProductoModal';
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { createCartsPorteV2, getCartaPorteById } from '../../../services/cartaPorte/cartaPorte.service';


interface FormCartaPorteProps {
  idCartaPorte?: number | null;
}

const FormCartaPorte = ({ idCartaPorte }: FormCartaPorteProps) => {
    const isEditMode = !!idCartaPorte;
    const methods = useForm<ICartaPorteFormData>({
        defaultValues: {
        general: {
            id_Viaje: null,
            id_CFDI: null,
            folio_int_cp: null,
            i_NumTotalMercancias: 0,
            dec_PesoBrutoVehicular: 0,
            st_LugarExpedicion: null,
            dec_TotalDistRec: 0,
            dec_PesoBrutoTotalMercancias: 0,
            id_AseguraMedAmbiente: null,
            id_AseguraCarga: null,
            st_PolizaMedAmbiente: null,
            st_PolizaAseguraCarga: null,
        },
        cfdi: {
            id_Moneda : null,
            id_FormaPago : null,
            id_MetodoPago: null,
            id_UsoCFDI : null,
            id_TipoComprobante : null,
            id_Viaje : null,
            id_Cliente : null,
            dec_SubTotal: 0,
            dec_Total: 0,
            dec_TotalImpuestosRetenidos: 0,
            dec_TotalImpuestosTrasladados: 0
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
        arrProductos: [],
        },
    });
    const {control, getValues, reset} = methods;
    const { callEndpoint } = useFetchAndLoad();

    // ========================= FETCH DATA IF EDIT ============================
    useEffect(() => {
        const fetchData = async () => {
        if (idCartaPorte) {
            try {
            const response = await getCartaPorteById(idCartaPorte);
            response.call
            .then((result) => {
                    console.log(result);
                }).catch(error => console.log(error));
            // if (response) {
            //     reset(response); // Asumimos que el API devuelve el formato que espera el form
            // }
            } catch (error) {
            console.error("Error cargando datos del Carta Porte:", error);
            }
        }
        };

        fetchData();
    }, [idCartaPorte, reset]);


    // =========================== ORIGENES ==================================
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

    const handleAddOrigen = useCallback(() => {
        setEditIndex(null);
        setOpenModalOrigen(true);
    },[]);

    const handleEditOrigen = useCallback((index: number) => {
        setEditIndex(index);
        setOpenModalOrigen(true);
    },[]);

    const handleSaveOrigen = useCallback((data: ICartaPorteDirOrigenForm) => {
        if (editIndex !== null) {
            updateOrigen(editIndex, data);
        } else {
            appendOrigen(data);
        }
        setOpenModalOrigen(false);
    },[editIndex, updateOrigen, appendOrigen]);

    const handleRemoveOrigen = useCallback((index: number) => {
        removeOrigen(index);
    },[removeOrigen]);

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

    const handleAddDestino = useCallback(() => {
        setEditIndexDestinos(null);
        setOpenModalDestino(true);
    },[]);

    const handleEditDestino = useCallback((index: number) => {
        setEditIndexDestinos(index);
        setOpenModalDestino(true);
    },[]);

    const handleSaveDestino = useCallback((data: ICartaPorteDirDestinoForm) => {
        if (editIndexDestinos !== null) {
            updateDestino(editIndexDestinos, data);
        } else {
            appendDestino(data);
        }
        setOpenModalDestino(false);
    },[editIndexDestinos, updateDestino, appendDestino]);

    const handleRemoveDestino = useCallback((index: number) => {
        removeDestino(index);
    },[removeDestino]);

    // ================ PRODUCTOS =======================
    const {
        fields: productos,
        append: appendProducto,
        remove: removeProducto,
        update: updateProducto,
    } = useFieldArray({
        control,
        name: "arrProductos",
    });

    //const wArrProductos = methods.watch("arrProductos");
    const [openModalProducto, setOpenModalProducto] = useState(false);
    const [editIndexProducto, setEditIndexProducto] = useState<number | null>(null);

    const handleAddProducto = useCallback(() => {
        setEditIndexProducto(null);
        setOpenModalProducto(true);
    }, []);

    const handleEditProducto = useCallback((index: number) => {
        setEditIndexProducto(index);
        setOpenModalProducto(true);
    }, []);

    const handleSaveProducto = useCallback((data: ICartaPorteProductoServicioForm) => {
        if (editIndexProducto !== null) {
            updateProducto(editIndexProducto, data);
        } else {
            appendProducto(data);
        }
        setOpenModalProducto(false);
    }, [editIndexProducto, updateProducto, appendProducto]);

    const handleRemoveProducto = useCallback((index: number) => {
        removeProducto(index);
    }, [removeProducto]);

    // Se ejecuta cada que se inserta un producto
    /*
        useEffect(() => {
            if (!wArrProductos || wArrProductos.length === 0) return;
            let findProductoPeligroso = wArrProductos.find( x => x.i_MaterialPeligroso == 1 );
            if(findProductoPeligroso != undefined){

            }
        }, [wArrProductos]);
    */

    const onSubmit: SubmitHandler<ICartaPorteFormData> = async (data, e) => {
        e?.preventDefault();
        try {
            let createCP = await callEndpoint(createCartsPorteV2(data));
            console.log(createCP);
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Fragment>
        <FormProvider {...methods}>
            {/* Modal para agregar/editar Origen*/}
            <OrigenModal
                open={openModalOrigen}
                onClose={() => setOpenModalOrigen(false)}
                onSave={handleSaveOrigen}
                defaultValues={editIndex !== null ? origenes[editIndex] : undefined}
            />
            {/* Modal para agregar/editar Destino */}
            <DestinoModal
                open={openModalDestino}
                onClose={() => setOpenModalDestino(false)}
                onSave={handleSaveDestino}
                defaultValues={editIndexDestinos !== null ? destinos[editIndexDestinos] : undefined}
            />
            <ProductoModal
                open={openModalProducto}
                onClose={() => setOpenModalProducto(false)}
                onSave={handleSaveProducto}
                defaultValues={editIndexProducto !== null ? productos[editIndexProducto] : undefined}
            />

            <form className='form-horizontal'  onSubmit={methods.handleSubmit(onSubmit)} autoComplete="off">
                <div className="form-body">
                    {/* Sección del CFDI en la CP */}
                    <SectionCfdiCartaPorte />
                    {/* Lista de Orígenes */}
                    <OrigenList
                        origenes={origenes}
                        onAdd={handleAddOrigen}
                        onEdit={handleEditOrigen}
                        onRemove={handleRemoveOrigen}
                    />
                    {/* Lista de Destinos */}
                    <DestinoList
                        destinos={destinos}
                        onAdd={handleAddDestino}
                        onEdit={handleEditDestino}
                        onRemove={handleRemoveDestino}
                    />
                    {/* Lista de Productos */}
                    <ProductoList
                        productos={productos}
                        onAdd={handleAddProducto}
                        onEdit={handleEditProducto}
                        onRemove={handleRemoveProducto}
                    />
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
};

export default FormCartaPorte;
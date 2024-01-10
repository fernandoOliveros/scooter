import { Fragment, useEffect, useRef, useState } from 'react'
import MenuBar from "../../components/shared/Menu"
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid, esES,GridActionsCellItem,GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { getViajesEmpresa } from '../../services/viajes/viajes.service';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/store';
import { IViajeModel } from '../../models/viajes/viaje.model';
import DateFormatFix from '../../utils/DateFormatFix';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Swal from 'sweetalert2';

const Viajes = () => {
    //todo: variables
    const userState = useSelector((store: RootStore) => store.user);
    const [ viajes, setViajes ] = useState<IViajeModel[]>([])
    let navigate = useNavigate();
    const id_viaje_create_cp = useRef(null);

    
    //todo: Inital function
    useEffect(() => {
        const loadViajes = getViajesEmpresa(userState.user.id_Empresa);
        const getViajes = async () => {
            let response = await loadViajes.call;
            setViajes(response.data.data);
        }
        // Call function
        getViajes();
        return () => { loadViajes.controller.abort(); }
    },[]);

    const crearViaje = () => navigate("crear");

    const formatDate = (value: string) => {
        let date = new Date(value);
        let response = new DateFormatFix(date).getFormatMin();
        return response;
    }

    const viewFormCartaPorte = (idViaje: any) => {
        id_viaje_create_cp.current = idViaje;
        console.log(id_viaje_create_cp.current);
    }

    function returnFormCartaPorte (success: boolean) {
        if(!success){
            Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'No se pudo dar de alta la carta porte, verifica que esten todos los campos con (*) llenos', showConfirmButton: true });
        }
    }

    const columns: GridColDef[] = 
    [
        {
            field: 'actions',
            headerName: 'ACC',
            type: 'actions',
            width: 40,
            getActions: (params) => [
              <GridActionsCellItem
                icon={<SecurityIcon />}
                label="Generar carta porte del viaje"
                onClick={() => viewFormCartaPorte(params.id)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<FileCopyIcon />}
                label="Generar Factura del viaje"
                onClick={() => console.log("copy")}
                showInMenu
              />,
            ],
        },
        { field: 'folio_int_viaje', headerName: 'Folio viaje', width: 200,},
        { field: 'i_km_totales', headerName: 'KM Recorridos', width: 200, sortable: false},
        { field: 'createdAt', headerName: 'Creado', width: 200, valueGetter: (params: GridValueGetterParams) => formatDate(params.row.createdAt), sortable: true },
        { field: 'st_EconomicoUnidad', headerName: 'Unidad', width: 200, sortable: false},
        { field: 'st_EconomicoRemolque', headerName: 'Remolque', width: 200, sortable: false},
        { field: 'st_Nombre', headerName: 'Operador', 
            valueGetter: (params: GridValueGetterParams) => `${params.row.st_Nombre || ''} ${params.row.st_ApellidoP || ''}`,
            width: 200,
            sortable: false
        },
    ];

    return (
        <Fragment>
        <div className="container-fluid">
            <div className="row page-titles">
                <div className="col-md-5 col-sm-12 col-xs-12">
                    <h2 className="card-title">Unidades</h2>
                </div>
                <div className="col-md-7 col-sm-12 col-xs-12">
                    <div className="d-flex justify-content-end align-items-center">
                        <ol className="breadcrumb justify-content-end">
                            <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                            <li className="breadcrumb-item active">Unidades</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className="card-body">
                    <div className="row" >
                        <div className='col-md-5 col-sm-12 col-xs-12'>
                            <h4 className="card-title">Viajes Registrados</h4>
                        </div>
                        <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                            <button onClick={crearViaje} className="btn btn-primary btn-rounded" type="button"><i className="fa fa-plus-circle"></i> Viaje</button>
                        </div>
                        <div className="col-12 mt-3">
                            <DataGrid
                                autoHeight
                                columns={columns}
                                rows={viajes}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                getRowId={(row: IViajeModel) =>  row.id_Viaje}
                                initialState={{
                                    pagination: {
                                      paginationModel: {
                                        pageSize: 25,
                                      },
                                    },
                                }}
                                pageSizeOptions={[25]}
                                disableRowSelectionOnClick
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <MenuBar />
        </Fragment>
    )
}

export default Viajes;
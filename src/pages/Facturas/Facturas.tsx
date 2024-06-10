import  { Fragment, useEffect, useState } from 'react'
import MenuBar from "../../components/shared/Menu";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/store';
import { ICfdi } from '../../models/cfdis/cfdi-form.model';
import { createXmlCfdi, getCfdiByEmpresa } from '../../services/cfdi/cfdi.service';
import { DataGrid, GridActionsCellItem, GridColDef, esES } from '@mui/x-data-grid';
import CodeIcon from '@mui/icons-material/Code';
import { timbrarXmlAndCreate } from '../../services/public.service';

function Facturas() {
    //todo: variables
    const userState = useSelector((store: RootStore) => store.user);
    const [ facturas, setFacturas ] = useState<ICfdi[]>([])


    useEffect(() => {
        const _getFacturas = () => {
            const loadCartasPorte = getCfdiByEmpresa(userState.user.id_Empresa);
            loadCartasPorte.call
            .then((result) => {
                let filterData = result.data;
                setFacturas(filterData.data);
            }).catch((error) => console.log(error));
        }
        _getFacturas();
    },[]);

    let navigate = useNavigate();


    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Acc',
            type: 'actions',
            width: 40,
            getActions: (params) => {
                return [
                    <GridActionsCellItem
                        icon={<CodeIcon />}
                        label="Timbrar"
                        onClick={() => generateXml(params.row)}
                        showInMenu />,
                    <GridActionsCellItem
                        icon={<CodeIcon />}
                        label="Editar"
                        onClick={() => console.log(params.id)}
                        showInMenu />,
                ];
            },
        },
        { field: 'id_CFDI', headerName: 'Folio interno', width: 200}
    ];

    //todo: funcion para generar xml
    const generateXml = (row: any) => {
        console.log(row);
        const loadXmlCP = createXmlCfdi(row.id_CFDI);
        loadXmlCP.call
        .then( result => {
            console.log(result);
            timbrarXmlCfdi(row.id_CFDI);
        }).catch((error) => {
            console.log(error);
        });
    }


    const timbrarXmlCfdi = (id_cfdi: number) => {
        console.log(id_cfdi);
        const loadTimbrarXml = timbrarXmlAndCreate(id_cfdi, userState?.token);
        loadTimbrarXml.call
        .then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        })
    }


    const createFactura = () => navigate("crear");
     return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <h2 className="card-title">Facturas</h2>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Facturas</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-5 col-sm-12 col-xs-12'>
                                <h4 className="card-title">Facturas generadas</h4>
                            </div>
                            <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                                <button onClick={createFactura} className="btn btn-primary btn-rounded" type="button"><i className="fa fa-plus-circle"></i> Factura</button>
                            </div>
                            <div className="col-12 mt-3">
                                <DataGrid
                                    autoHeight
                                    columns={columns}
                                    rows={facturas}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    getRowId={(row: any) =>  row.id_CFDI}
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

export default Facturas
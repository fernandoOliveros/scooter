import { Fragment, useEffect, useState } from 'react'
import { ICartaPorteFormData } from '../../../../models/cartaportes/cartaporte-formData';
import { useFormContext } from 'react-hook-form';
import { IViajesActivos } from '../../../../models/viajes/viaje.model';
import { getViajesActivos } from '../../../../services/public.service';
import { AutocompleteField } from '../../../../components/shared/AutoCompleteField';
import { IAutoComplete } from '../../../../models/shared/autocomplete.model';

function SectionGeneralCartaPorte() {

  const { control } = useFormContext<ICartaPorteFormData>();
  //todo: catalogos para Cfdi
  const [catViajesActivos, setCatViajesActivos] = useState<IAutoComplete[]>([]);

  useEffect( () => {
    // services
    const loadViajesActivos = getViajesActivos();

    //obtenemos los viajes activos por empresa
    const _getViajesActivos = () => {
      loadViajesActivos.call
      .then((resp) => {
        let response = resp.data;
        //todo: Parse format colonias
        let dataParse = response.data.map( (item: IViajesActivos) => ({
            id: item.id_Viaje,
            label: item.folio_int_viaje + " - " + item.st_EconomicoUnidad
        }));
        setCatViajesActivos(dataParse);
      }).catch((error: any) => {
        console.log(error);
      });
    }

    _getViajesActivos();
  },[]);
  return (
    <Fragment>
      <div className="form-horizontal">
        <div className="form-body">
          <h4 className="card-title mt-5">Configuración general del CFDI</h4>
          <div className='row'>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                <AutocompleteField
                    options={catViajesActivos}
                    control={control}
                    name='general.id_Viaje'
                    placeholder='Selecciona el tipo de permiso sct'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default SectionGeneralCartaPorte
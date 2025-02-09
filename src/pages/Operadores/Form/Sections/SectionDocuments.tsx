import { Fragment, useState } from "react";
import { Button } from "@mui/material";
import { IOperadorDocumentos } from "../../../../models/operadores/operador-docs.model";
import { useDocuments } from "./useDocuments";

function SectionDocuments() {
    const { register, errors, handleFileChange } = useDocuments();
    const documentFields = ["url_RFC", "url_CURP", "url_ComprobanteDom"] as const;
    const [uploadSuccess, setUploadSuccess] = useState<{ [key in keyof IOperadorDocumentos]?: boolean }>({});
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IOperadorDocumentos) => {
        handleFileChange(e, field); // Guardamos el archivo en React Hook Form
        setUploadSuccess((prev) => ({ ...prev, [field]: true })); // Mostramos mensaje de éxito
    };
    return (
        <Fragment>
            <div className="row">
                <h4 className="card-title mt-4">Documentación del Operador</h4>
                <hr />

                {documentFields.map((field) => (
                <div key={field} className="col-md-4 col-lg-4 col-sm-6 col-xs-12"> 
                    <Button variant="contained" component="label">
                        {field.replace("url_", "").toUpperCase()}
                        <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            {...register(`documentos.${field}`)}
                            onChange={(e) => handleFileUpload(e, field as keyof IOperadorDocumentos)}
                        />
                    </Button>
                    {/* Mensaje de éxito en color verde */}
                    {uploadSuccess[field] && (
                        <span style={{ color: "green", marginLeft: "10px" }}>Archivo cargado correctamente</span>
                    )}

                    {/* Error si el archivo no es válido */}
                    {errors.documentos?.[field] && (
                        <span style={{ color: "red", marginLeft: "10px" }}>{errors.documentos[field]?.message}</span>
                    )}
                </div>
            ))}
            </div>
        </Fragment>
    );
}

export default SectionDocuments;

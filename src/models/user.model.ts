export interface userModel {
    token: string,
    user: {
        id_User: number,
        id_Empresa: number,
        st_Nombre: string,
        st_Email: string,
        st_Password?: string,
        updatedAt?: string
    },
    id_Empresa: number
}
export interface userModel {
    token: string | null,
    user: {
        id_User: number | null,
        id_Empresa: number |null,
        st_Nombre: string | null,
        st_Email: string | null,
        st_Password?: string | null,
        updatedAt?: string |null
    }
}
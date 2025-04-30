export interface Book {
    id?: string;
    titulo: string;
    descripcion: string;
    anio: number;
    idAutor: string;
    publicado: boolean;
    fechaRegistro?: string;
}

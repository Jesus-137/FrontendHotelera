export interface ReservaRequest {
    huesped: string,
    habitacion: number,
    fechaEntrada: Date,
    fechaSalida: Date,
    noches: number,
    total: number,
    estado: string
}

export interface ReservaResponse {
    id: number,
    huesped: string,
    habitacion: number,
    fechaEntrada: Date,
    fechaSalida: Date,
    noches: number,
    total: number,
    estado: string

}
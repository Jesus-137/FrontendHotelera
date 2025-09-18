export interface HabitacionRequest {
    numeroHabitacion: number,
    tipo: string,
    descripcion: string,
    precio: number,
    capacidad: number,
    estado: string
}

export interface HabitacionResponse{
    id: number,
    numeroHabitacion: number,
    tipo: string,
    descripcion: string,
    precio: number,
    capacidad: number,
    estado: string
}
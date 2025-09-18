import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import { HabitacionRequest, HabitacionResponse } from "../models/Habitacion.model";
import { error } from "console";

@Injectable({
    providedIn: 'root'
})
export class HabitacionesService {

    private apiUrl: string = environment.apiUrl + 'habitaciones/';

    constructor(private http: HttpClient) { }

    getHabitaciones(): Observable<HabitacionResponse[]> {
        return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
            map(habitaciones => habitaciones.sort()),
            catchError(error => {
                console.log('Error al obtener la habitacion', error);
                return of([]);
            })
        )
    }

    postHabitaciones(habitacion: HabitacionRequest): Observable<HabitacionResponse> {
        return this.http.post<HabitacionResponse>(this.apiUrl, habitacion).pipe(
            catchError(error => {
                console.log('Error al registrar la habitacion', error);
                throw error;
            })
        )
    }

    putHabitaciones(habitacion: HabitacionRequest, habitacionId: number): Observable<HabitacionResponse> {
        return this.http.put<HabitacionResponse>(`${this.apiUrl}${habitacionId}`, habitacion).pipe(
            catchError(error => {
                console.log('Error al actualizar la habitacion', error);
                throw error;
            })
        )
    }

    deleteHabitaciones(habitacionId: number): Observable<HabitacionResponse> {
        return this.http.delete<HabitacionResponse>(`${this.apiUrl}${habitacionId}`).pipe(
            catchError(error => {
                console.log('Error al eliminar la habitacion', error);
                throw error;
            })
        )
    }

} 
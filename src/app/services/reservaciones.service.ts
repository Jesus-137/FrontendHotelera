import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import { ReservaRequest, ReservaResponse } from "../models/Reserva.model";

@Injectable({
    providedIn: 'root'
})
export class ReservacionesServices {

    private apiUrl: string = environment.apiUrl + 'reservaciones/';

    constructor(private http: HttpClient) { }

    getReservaciones(): Observable<ReservaResponse[]> {
        return this.http.get<ReservaResponse[]>(this.apiUrl).pipe(
            map(reservaciones => reservaciones.sort()),
            catchError(error => {
                console.log('Error al obtener la reservacion', error);
                return of([]);
            })
        )
    }

    postReservaciones(reservacion: ReservaRequest): Observable<ReservaResponse> {
        return this.http.post<ReservaResponse>(this.apiUrl, reservacion).pipe(
            catchError(error => {
                console.log('Error al registrar la habitacion', error);
                throw error;
            })
        )
    }

    putReservaciones(reservacion: ReservaRequest, reservaId: number): Observable<ReservaResponse> {
        return this.http.put<ReservaResponse>(`${this.apiUrl}${reservaId}`, reservacion).pipe(
            catchError(error => {
                console.log('Error al actualizar la reservacion', error);
                throw error;
            })
        )
    }

    deleteResevaciones(reservaId: number): Observable<ReservaResponse> {
        return this.http.delete<ReservaResponse>(`${this.apiUrl}${reservaId}`).pipe(
            catchError(error => {
                console.log('Error al eliminar la reservacion', error);
                throw error;
            })
        )
    }

}
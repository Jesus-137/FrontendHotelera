import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from 'rxjs';
import { HuespedResponse, HuespedRequest } from "../models/Huesped.model";


@Injectable({
  providedIn: 'root'
})
export class HuespedService {

  private apiUrl: string = environment.apiUrl + 'huespedes/';

  constructor(private http: HttpClient) { }

  getHuesped(): Observable<HuespedResponse[]> {
    return this.http.get<HuespedResponse[]>(this.apiUrl).pipe(
      map(huesped => huesped.sort()),
      catchError(error => {
        console.log('Error al obtener el huesped', error);
        return of([]);
      })
    );
  }

postHuesped(huesped: HuespedRequest): Observable<HuespedResponse>{
  return this.http.post<HuespedResponse>(this.apiUrl, huesped).pipe(
catchError(error => {
  console.log('Error al registrar el huesped', error);
  throw error;
})
  );
}

putHuesped(huesped: HuespedRequest, huespedId: number): Observable<HuespedResponse>{
  return this.http.put<HuespedResponse>(`${this.apiUrl}${huespedId}`, huesped).pipe(
catchError(error => {
  console.log('Error al actualizar el huesped', error);
  throw error;
})
  );
}

deleteHuesped(huespedId: number): Observable<HuespedResponse>{
  return this.http.delete<HuespedResponse>(`${this.apiUrl}${huespedId}`).pipe(
catchError(error => {
  console.log('Error al eliminar el huesped', error);
  throw error;
})
  );
}

}

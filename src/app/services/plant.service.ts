import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PlantListResponse } from '../models/plant-list-response';
import { HttpClient } from '@angular/common/http';
import { Plant } from '../models/plant';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private apiUrl = "https://sg666zbdmf.execute-api.us-east-1.amazonaws.com/dev";
  private offset = 0;
  private limit = 10;

  constructor(private http: HttpClient) {
  }

  getPlantList(): Observable<PlantListResponse> {

    const url = `${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`;

    this.offset += this.limit;

    return this.http.get<{ results: Plant[], next: string | null, count: number }>(url).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getPlantById(id: any): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  resetPagination(): void {
    this.offset = 0;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.USER_URL)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ndodhi një gabim! Ju lutem provoni perseri më vone.';

    if (error.error instanceof ErrorEvent) {
      message = 'Gabim rrjeti. Kontrolloni lidhjen tuaj.';
    } else {
      switch (error.status) {
        case 0:
          message = 'Nuk mund të lidhemi me serverin.';
          break;
        case 404:
          message = 'Burimi nuk u gjet.';
          break;
        case 500:
          message = 'Gabim i brendshem në server.';
          break;
        default:
        message = `${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(message));
  }
}

// src/app/core/interceptors/error.interceptor.ts
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';
            if (error.status === 404) {
                errorMessage = 'Plant not found';
            } else if (error.status === 500) {
                errorMessage = 'Server error, please try again later';
            }
            console.error(`HTTP Error: ${error.status} - ${errorMessage}`);
            return throwError(() => new Error(errorMessage));
        })
    );
};
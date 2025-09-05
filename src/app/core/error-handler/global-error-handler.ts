// src/app/core/global-error-handler.ts
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        console.error('Unhandled error:', error);
        // Optionally update a global error state or show a toast
        // Example: window.alert('An unexpected error occurred. Please try again.');
    }
}
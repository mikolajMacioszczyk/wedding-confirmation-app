import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export interface ApiErrorResponse {
  message?: string;
  title?: string;
  errors?: { [key: string]: string[] };
  detail?: string;
  status?: number;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Wystąpił nieoczekiwany błąd';
    let errorTitle = 'Błąd';

    // Don't show toast for authentication errors (handled by auth interceptor)
    if (error.status === 401) {
      return;
    }

    // Try to extract error message from different possible response formats
    if (error.error) {
      const apiError = error.error as ApiErrorResponse;

      // Check for custom error message
      if (apiError.message) {
        errorMessage = apiError.message;
      }
      // Check for detail message (common in ASP.NET Core)
      else if (apiError.detail) {
        errorMessage = apiError.detail;
      }
      // Check for validation errors
      else if (apiError.errors && typeof apiError.errors === 'object') {
        const validationMessages: string[] = [];
        Object.keys(apiError.errors).forEach(key => {
          if (Array.isArray(apiError.errors![key])) {
            validationMessages.push(...apiError.errors![key]);
          }
        });
        if (validationMessages.length > 0) {
          errorMessage = validationMessages.join('. ');
          errorTitle = 'Błąd walidacji';
        }
      }
      // Check if error.error is a string
      else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }

      // Use custom title if provided
      if (apiError.title) {
        errorTitle = apiError.title;
      }
    }

    // Fallback to status-based messages
    if (errorMessage === 'Wystąpił nieoczekiwany błąd') {
      switch (error.status) {
        case 400:
          errorMessage = 'Nieprawidłowe dane żądania';
          errorTitle = 'Błąd żądania';
          break;
        case 403:
          errorMessage = 'Brak uprawnień do wykonania tej operacji';
          errorTitle = 'Brak uprawnień';
          break;
        case 404:
          errorMessage = 'Nie znaleziono zasobu';
          errorTitle = 'Nie znaleziono';
          break;
        case 409:
          errorMessage = 'Konflikt danych - zasób już istnieje lub jest w użyciu';
          errorTitle = 'Konflikt';
          break;
        case 422:
          errorMessage = 'Dane nie mogą być przetworzone';
          errorTitle = 'Błąd przetwarzania';
          break;
        case 500:
          errorMessage = 'Wewnętrzny błąd serwera';
          errorTitle = 'Błąd serwera';
          break;
        case 502:
          errorMessage = 'Serwer jest tymczasowo niedostępny';
          errorTitle = 'Serwer niedostępny';
          break;
        case 503:
          errorMessage = 'Usługa tymczasowo niedostępna';
          errorTitle = 'Usługa niedostępna';
          break;
        case 0:
          errorMessage = 'Brak połączenia z serwerem';
          errorTitle = 'Błąd połączenia';
          break;
        default:
          if (error.status >= 500) {
            errorMessage = 'Błąd serwera';
            errorTitle = 'Błąd serwera';
          } else if (error.status >= 400) {
            errorMessage = 'Błąd żądania';
            errorTitle = 'Błąd żądania';
          }
      }
    }

    // Show error toast
    this.toastService.showError(errorMessage, errorTitle);
  }
}

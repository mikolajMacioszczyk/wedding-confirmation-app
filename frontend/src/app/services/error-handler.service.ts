import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Service for handling HTTP errors in a consistent way across the application.
 * This service provides methods to extract meaningful error messages from backend responses
 * and display them using the toast service.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastService: ToastService) {}

  /**
   * Handles HTTP errors and shows appropriate toast messages
   * @param error The HTTP error response
   * @param defaultMessage Default message to show if no specific error message is found
   * @param showToast Whether to show toast notification (default: true)
   * @returns The extracted error message
   */
  handleHttpError(error: HttpErrorResponse, defaultMessage = 'Wystąpił nieoczekiwany błąd', showToast = true): string {
    let errorMessage = defaultMessage;
    let errorTitle = 'Błąd';

    // Try to extract error message from different possible response formats
    if (error.error) {
      const apiError = error.error;

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
          if (Array.isArray(apiError.errors[key])) {
            validationMessages.push(...apiError.errors[key]);
          }
        });
        if (validationMessages.length > 0) {
          errorMessage = validationMessages.join('. ');
          errorTitle = 'Błąd walidacji';
        }
      }
      // Check if error.error is a string
      else if (typeof apiError === 'string') {
        errorMessage = apiError;
      }

      // Use custom title if provided
      if (apiError.title) {
        errorTitle = apiError.title;
      }
    }

    // Show toast if requested
    if (showToast) {
      this.toastService.showError(errorMessage, errorTitle);
    }

    return errorMessage;
  }

  /**
   * Shows a success message using toast
   * @param message Success message
   * @param title Optional title
   */
  showSuccess(message: string, title?: string): void {
    this.toastService.showSuccess(message, title);
  }

  /**
   * Shows a warning message using toast
   * @param message Warning message
   * @param title Optional title
   */
  showWarning(message: string, title?: string): void {
    this.toastService.showWarning(message, title);
  }

  /**
   * Shows an info message using toast
   * @param message Info message
   * @param title Optional title
   */
  showInfo(message: string, title?: string): void {
    this.toastService.showInfo(message, title);
  }

  /**
   * Shows an error message using toast
   * @param message Error message
   * @param title Optional title
   */
  showError(message: string, title?: string): void {
    this.toastService.showError(message, title);
  }
}

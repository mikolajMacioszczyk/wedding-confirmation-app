import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);
  private idCounter = 0;

  getToasts() {
    return this.toasts.asReadonly();
  }

  showSuccess(message: string, title?: string, duration = 4000) {
    this.addToast('success', message, title, duration);
  }

  showError(message: string, title?: string, duration = 6000) {
    this.addToast('error', message, title, duration);
  }

  showWarning(message: string, title?: string, duration = 5000) {
    this.addToast('warning', message, title, duration);
  }

  showInfo(message: string, title?: string, duration = 4000) {
    this.addToast('info', message, title, duration);
  }

  removeToast(id: string) {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clearAll() {
    this.toasts.set([]);
  }

  private addToast(type: ToastMessage['type'], message: string, title?: string, duration = 4000) {
    const id = `toast-${++this.idCounter}`;
    const toast: ToastMessage = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    this.toasts.update(toasts => [...toasts, toast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }
}

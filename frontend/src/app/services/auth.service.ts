import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'wedding_auth_token';
  private readonly USER_KEY = 'wedding_auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signals for reactive UI
  private _currentUser = signal<User | null>(null);
  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => !!this._currentUser());
  public isAdmin = computed(() => this._currentUser()?.role === 'Administrator');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        user.expiresAt = new Date(user.expiresAt);

        // Check if token is expired
        if (user.expiresAt > new Date()) {
          this.setCurrentUser(user);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            username: response.username,
            role: response.role,
            token: response.token,
            expiresAt: new Date(response.expiresAt)
          };

          this.setCurrentUser(user);
          this.storeUserData(user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.setCurrentUser(null);
    this.router.navigate(['/']);
  }

  private setCurrentUser(user: User | null): void {
    this._currentUser.set(user);
    this.currentUserSubject.next(user);
  }

  private storeUserData(user: User): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const user = this._currentUser();
    if (!user) return true;

    return user.expiresAt <= new Date();
  }

  refreshAuthState(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    
    // Extract and save user role from token
    const role = this.getUserRoleFromToken(token);
    localStorage.setItem('userRole', role);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || 'customer';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  private getUserRoleFromToken(token: string): string {
    try {
      // Decode JWT payload to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'customer';
    } catch {
      return 'customer';
    }
  }
}

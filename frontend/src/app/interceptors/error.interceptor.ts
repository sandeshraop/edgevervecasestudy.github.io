import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    // Handle 401 Unauthorized - Auto logout
    catchError((error) => {
      if (error.status === 401) {
        // Token expired or invalid - logout user
        authService.logout();
        router.navigate(['/login']);
        
        // Show user-friendly message
        console.log('Session expired. Please login again.');
        
        return throwError(() => new Error('Session expired. Please login again.'));
      }
      
      // Handle other HTTP errors
      if (error.status >= 500) {
        console.log('Server error. Please try again later.');
        return throwError(() => new Error('Server error. Please try again later.'));
      }
      
      if (error.status === 403) {
        console.log('Access denied. You do not have permission to perform this action.');
        return throwError(() => new Error('Access denied.'));
      }
      
      // For other errors, pass through the original error
      return throwError(() => error);
    })
  );
};

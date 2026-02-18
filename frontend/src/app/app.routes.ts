import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { BookingComponent } from './pages/booking/booking';
import { MenuComponent } from './pages/menu/menu';
import { CartComponent } from './pages/cart/cart';
import { FeedbackComponent } from './pages/feedback/feedback';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AuthGuard } from './guards/auth.guard';
// import { AdminGuard } from './guards/admin.guard'; // TODO: Uncomment when admin module is created

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Profile Management Routes
  { 
    path: 'profile', 
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'change-password', 
    loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard] 
  },
  
  // TODO: Add admin routes when admin module is created
  // { 
  //   path: 'admin', 
  //   loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes),
  //   canActivate: [AdminGuard] 
  // },
  
  // Catch-all redirect
  { path: '**', redirectTo: '' }
];

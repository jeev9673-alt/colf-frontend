import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./home/home').then(m => m.Home) },
	{ path: 'services', loadComponent: () => import('./services/services.component').then(m => m.ServicesComponent) },
	{ path: 'booking', loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent) },
	{ path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
	{ path: '**', redirectTo: '' }
];

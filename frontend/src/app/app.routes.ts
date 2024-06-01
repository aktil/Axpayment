import { Routes, provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { PaymentListComponent } from './payments/payment-list/payment-list.component';
import { PaymentDetailComponent } from './payments/payment-detail/payment-detail.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { PaymentComponent } from './payment/payment.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'payments', component: PaymentListComponent },
    { path: 'payments/:id', component: PaymentDetailComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'admin', component: AdminPanelComponent },
    { path: 'pay/:id', component: PaymentComponent },
    { path: 'profile', component: UserProfileComponent },
    { path: 'payment/:id', component: PaymentComponent },
    { path: 'user', component: UserProfileComponent },
    // 404
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];
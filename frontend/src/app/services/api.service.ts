import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {
    this.csrfToken = this.getCookie('csrftoken');  // Получение CSRF токена из куки
  }

  createPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/`, paymentData, this.getAuthHeaders(true));
  }

  getPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/`, this.getAuthHeaders());
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/payments/${id}/`, this.getAuthHeaders(true));
  }
  
  getPayment(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payments/${id}/`, this.getAuthHeaders());
  }

  cancelPayment(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/payments/${id}/cancel/`, {}, this.getAuthHeaders(true));
  }

  getFilteredPayments(filters: any): Observable<any> {
    const params = new HttpParams()
      .set('status', filters.status || '')
      .set('date', filters.date || '')
      .set('amount', filters.amount || '');
    return this.http.get(`${this.apiUrl}/payments/filter_sort/`, { params, ...this.getAuthHeaders() });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/`, this.getAuthHeaders());
  }

  resetPassword(email: string): Observable<any> {
    const body = { email };
    return this.http.post('http://localhost:8000/password_reset/', body, this.getAuthHeaders(true));
  }

  private getAuthHeaders(includeCsrfToken: boolean = false) {
    const token = localStorage.getItem('token');
    const headersConfig: { [key: string]: string } = {};
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    if (includeCsrfToken && this.csrfToken) {
      headersConfig['X-CSRFToken'] = this.csrfToken;
    }
    return {
      headers: new HttpHeaders(headersConfig),
      withCredentials: true  // Включаем отправку куки с запросами
    };
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()!.split(';').shift() || null;
    }
    return null;
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/`, this.getAuthHeaders());
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/`, this.getAuthHeaders());
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/`, this.getAuthHeaders(true));
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/`, this.getAuthHeaders());
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/`, this.getAuthHeaders());
  }
  processPayment(paymentId: number, paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/${paymentId}/process_payment/`, paymentData, this.getAuthHeaders(true));
  }
  getApiKeys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api-keys/`, this.getAuthHeaders());
  }
  
  createApiKey(apiKeyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api-keys/`, apiKeyData, this.getAuthHeaders(true));
  }
  
  deleteApiKey(apiKeyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api-keys/${apiKeyId}/`, this.getAuthHeaders(true));
  }
  
}

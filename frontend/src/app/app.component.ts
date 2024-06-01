import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "Axpayment";
  isAdmin = false;
  isAuthenticated = false;

  constructor(private http: HttpClient, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Выполняем GET запрос для установки CSRF токена
    this.http.get('http://localhost:8000/csrf/', { withCredentials: true }).subscribe(() => {
      const token = localStorage.getItem('token');
      if (token) {
        this.apiService.getUserProfile().subscribe(user => {
          this.isAuthenticated = true;
          this.isAdmin = user.username === 'admin';
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}

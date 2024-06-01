import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';

interface AuthResponse {
  access: string;
  refresh: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private appComponent: AppComponent
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit() {
    this.http.post<AuthResponse>('http://localhost:8000/api/login/', this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.access);
        this.appComponent.isAuthenticated = true;
        this.appComponent.isAdmin = this.loginForm.value.username === 'admin';
        this.router.navigate(['/']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Неверный пароль или имя пользователя';
        } else {
          this.errorMessage = 'Произошла ошибка. Пожалуйста, попробуйте снова.';
        }
      }
    });
  }
}

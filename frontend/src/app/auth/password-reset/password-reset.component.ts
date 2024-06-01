import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.resetForm = this.fb.group({
      email: ['']
    });
  }

  onSubmit() {
    this.apiService.resetPassword(this.resetForm.value.email).subscribe({
      next: () => {
        this.successMessage = 'Письмо для сброса пароля отправлено на вашу почту.';
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Произошла ошибка. Пожалуйста, попробуйте снова.';
        this.successMessage = null;
        console.error(error);  // Логгирование ошибки
      }
    });
  }
}

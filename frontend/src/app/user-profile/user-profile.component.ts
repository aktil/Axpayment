import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  apiKeyForm: FormGroup;
  apiKeys: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.apiKeyForm = this.fb.group({
      shopName: ['']
    });
  }

  ngOnInit() {
    this.apiService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        this.errorMessage = 'Не удалось загрузить данные пользователя.';
      }
    });

    this.loadApiKeys();
  }

  loadApiKeys() {
    this.apiService.getApiKeys().subscribe({
      next: (keys) => {
        this.apiKeys = keys;
      },
      error: (error) => {
        this.errorMessage = 'Не удалось загрузить API ключи.';
      }
    });
  }

  onSubmit() {
    if (this.apiKeyForm.valid) {
      const shopName = this.apiKeyForm.value.shopName;
      this.apiService.createApiKey({ shopName }).subscribe({
        next: (apiKey) => {
          this.apiKeys.push(apiKey);
          this.apiKeyForm.reset();
        },
        error: (error) => {
          this.errorMessage = 'Не удалось создать API ключ.';
        }
      });
    }
  }
}

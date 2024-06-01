import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Payment } from '../models/payment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentId: number | null = null;
  paymentForm: FormGroup;
  payment: Payment | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
  }

  ngOnInit() {
    this.paymentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.paymentId) {
      this.apiService.getPayment(this.paymentId.toString()).subscribe({
        next: (payment) => {
          this.payment = payment;
        },
        error: (error) => {
          this.errorMessage = 'Не удалось загрузить детали платежа.';
        }
      });
    }
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      console.log('Payment data submitted:', paymentData);
      // Тут можно добавить логику для отправки платежных данных на сервер
    }
  }

  onCancel() {
    if (this.payment) {
      this.apiService.cancelPayment(this.payment.id.toString()).subscribe({
        next: () => {
          this.payment!.status = 'cancelled';
        },
        error: (error) => {
          this.errorMessage = 'Не удалось отменить платеж.';
        }
      });
    }
  }
}

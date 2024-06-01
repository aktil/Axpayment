import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Payment } from '../../models/payment';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {
  payment: Payment | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const paymentId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Payment ID:', paymentId); // Debug log
    if (paymentId) {
      this.apiService.getPayment(paymentId.toString()).subscribe({
        next: (payment) => {
          console.log('Payment data:', payment); // Debug log
          this.payment = payment;
        },
        error: (error) => {
          this.errorMessage = 'Не удалось загрузить детали платежа.';
          console.error('Error loading payment details:', error);
        }
      });
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
          console.error('Error cancelling payment:', error);
        }
      });
    }
  }
}

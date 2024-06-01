import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  payments: any[] = [];
  filterForm: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      date: [''],
      amount: ['']
    });
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.apiService.getPayments().subscribe(data => {
      this.payments = data;
    });
  }

  onFilter(): void {
    const filters = this.filterForm.value;
    this.apiService.getFilteredPayments(filters).subscribe(data => {
      this.payments = data;
    });
  }
}

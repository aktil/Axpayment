import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { Payment } from '../models/payment';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  payments: Payment[] = [];
  isAdmin = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getUserDetails().subscribe(user => {
      this.isAdmin = user.username === 'admin';
      if (this.isAdmin) {
        this.loadUsers();
        this.loadPayments();
      }
    });
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  loadPayments() {
    this.apiService.getAllPayments().subscribe((data: Payment[]) => {
      this.payments = data;
    });
  }

  deleteUser(userId: number) {
    this.apiService.deleteUser(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  deletePayment(paymentId: number) {
    this.apiService.deletePayment(paymentId).subscribe(() => {
      this.loadPayments();
    });
  }
}

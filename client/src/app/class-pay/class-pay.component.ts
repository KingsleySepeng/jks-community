import {Component, OnInit} from '@angular/core';
import {MockDataService} from '../mock-service/mock-data.service';
import {Payment} from '../model/payment';
import {FormsModule} from '@angular/forms';
import {User} from '../model/user';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-class-pay',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe
  ],
  templateUrl: './class-pay.component.html',
  styleUrl: './class-pay.component.scss'
})
export class ClassPayComponent implements OnInit{
  currentUser: User | null = null;
  payments: Payment[] = []; // Holds payment history

  // Payment form fields
  amount: number = 0;
  paymentMethod: string = 'Credit Card';
  paymentType: string = 'Class Fee';
  description: string = '';
  notify: boolean = false;

  // Payment success message
  message: string = '';

  paymentTypes: string[] = ['Class Fee', 'Affiliation', 'Other'];

  constructor(private mockService: MockDataService) { }

  ngOnInit(): void {
    // Retrieve the currently logged-in user
    this.currentUser = this.mockService.getLoggedInUser() ?? null;

    if (this.currentUser) {
      // Fetch payment history for the logged-in user
      this.payments = this.mockService.getPayments().filter(p => p.userId === this.currentUser?.id);
    }
  }

  onSubmitPayment(): void {
    if (this.amount <= 0) {
      this.message = 'Please enter a valid amount.';
      return;
    }
    if (!this.paymentType) {
      this.message = 'Please select a payment type.';
      return;
    }
    if (!this.description.trim()) {
      this.message = 'Please provide a description for the payment.';
      return;
    }

    if (!this.currentUser) {
      this.message = 'Error: No logged-in user detected.';
      return;
    }

    const reference = `${this.currentUser.firstName} ${this.currentUser.lastName} [ID: ${this.currentUser.id}]`;

    // Create a new payment record
    const newPayment: Payment = {
      id: this.generatePaymentId(),
      userId: this.currentUser.id,
      amount: this.amount,
      paymentDate: new Date(),
      method: this.paymentMethod,
      status: 'PAID',
      reference: reference,
      paymentType: this.paymentType,
      description: this.description
    };

    // Add the payment and refresh the history
    this.mockService.addPayment(newPayment);
    this.payments.push(newPayment); // Dynamically update the UI

    this.message = `Payment of $${this.amount} for ${this.paymentType} was successful!`;

    if (this.notify) {
      this.sendNotification();
    }

    // Reset form fields
    this.amount = 0;
    this.paymentMethod = 'Credit Card';
    this.paymentType = 'Class Fee';
    this.description = '';
    this.notify = false;
  }

  private generatePaymentId(): string {
    return 'PAY-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  }

  private sendNotification(): void {
    console.log(`Notification sent to ${this.currentUser?.email} for payment of $${this.amount}`);
  }
}

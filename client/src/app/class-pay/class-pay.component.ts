import {Component, OnInit} from '@angular/core';
import {MockDataService} from '../mock-service/mock-data.service';
import {Payment} from '../model/payment';
import {FormsModule} from '@angular/forms';
import {User} from '../model/user';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-class-pay',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './class-pay.component.html',
  styleUrl: './class-pay.component.scss'
})
export class ClassPayComponent implements OnInit{
  // For the sake of this demo, we assume the logged-in user (child/parent) has ID 'S001'
  currentUserId: string = 'S001';
  currentUser?: User;

  // Payment form fields
  amount: number = 0;
  paymentMethod: string = 'Credit Card'; // default option
  paymentType: string = 'Class Fee';       // default, can be changed to other values such as "Affiliation"
  description: string = '';                // e.g., "Class fees for Jan and Feb"

  // Payment success message
  message: string = '';

  // Optionally, set available payment types (could be static or fetched from service)
  paymentTypes: string[] = ['Class Fee', 'Affiliation', 'Other'];

  constructor(private mockService: MockDataService) { }

  ngOnInit(): void {
    // Retrieve current user details from the mock service
    this.currentUser = this.mockService.getUsers().find(u => u.id === this.currentUserId);
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

    const userFullName = this.currentUser?.firstName + ' ' + this.currentUser?.lastName;
    // Build a reference string from the current user's details
    const reference = this.currentUser ? `${userFullName} [ID: ${this.currentUser.id}]` : '';

    // Create a new payment record
    const newPayment: Payment = {
      id: this.generatePaymentId(),
      userId: this.currentUserId,
      amount: this.amount,
      paymentDate: new Date(),
      method: this.paymentMethod,
      status: 'PAID', // For MVP purposes, we mark it as paid directly
      reference: reference,
      paymentType: this.paymentType,
      description: this.description
    };

    // Use the mock service to add the payment
    this.mockService.addPayment(newPayment);

    this.message = `Payment of $${this.amount} for ${this.paymentType} was successful!`;

    // Reset form fields if desired
    this.amount = 0;
    this.paymentMethod = 'Credit Card';
    this.paymentType = 'Class Fee';
    this.description = '';
  }

  private generatePaymentId(): string {
    // A simple unique ID generator for MVP purposes
    return 'PAY-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  }
}

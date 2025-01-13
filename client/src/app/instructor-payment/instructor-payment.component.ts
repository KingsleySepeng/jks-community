import {Component, OnInit} from '@angular/core';
import {MockDataService} from '../mock-service/mock-data.service';
import {Student} from '../model/user';
import {Payment} from '../model/payment';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-instructor-payment',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './instructor-payment.component.html',
  styleUrl: './instructor-payment.component.scss'
})
export class InstructorPaymentComponent implements OnInit{
  // Assuming instructor is already logged in. This component is only for instructors.
  currentInstructorId: string = 'I001'; // Example: instructor's ID (logged in instructor)

  // List of students to choose from (could be fetched based on instructor's club)
  students: Student[] = [];

  // Selected student for whom the payment is being logged
  selectedStudentId: string = '';

  // Payment form fields
  amount: number = 0;
  paymentMethod: string = 'Cash';  // In manual logging, you usually mark as "Cash"
  paymentType: string = 'Class Fee'; // Could also be "Affiliation" etc.
  description: string = '';         // e.g., "Cash payment for class fees for Jan and Feb"

  // Payment confirmation message
  message: string = '';

  constructor(private mockService: MockDataService) { }

  ngOnInit(): void {
    // For simplicity, we assume that students are users with the role "STUDENT"
    // In your actual implementation, you might filter by clubId etc.
    this.students = this.mockService.getUsers().filter(user => user.role === 'STUDENT') as Student[];
  }

  onSubmitPayment(): void {
    if (this.amount <= 0 || !this.selectedStudentId || !this.description.trim()) {
      this.message = 'Please complete all fields with valid values.';
      return;
    }

    // Create a reference string from the student's details
    const student = this.students.find(s => s.id === this.selectedStudentId);
    const reference = student ? `${student.firstName} ${student.lastName} [ID: ${student.id}]` : '';

    // Build a new payment record
    const newPayment: Payment = {
      id: this.generatePaymentId(),
      userId: this.selectedStudentId,
      amount: this.amount,
      paymentDate: new Date(),
      method: this.paymentMethod,
      status: 'PAID', // For MVP we mark as paid on logging a cash payment
      reference: reference,
      paymentType: this.paymentType,
      description: this.description
    };

    // Save the payment using the mock service
    this.mockService.addPayment(newPayment);

    this.message = `Payment of $${this.amount} for ${this.paymentType} successfully logged for ${reference}.`;
    // Reset form fields
    this.amount = 0;
    this.paymentMethod = 'Cash';
    this.paymentType = 'Class Fee';
    this.description = '';
    this.selectedStudentId = '';
  }

  private generatePaymentId(): string {
    // Simple unique ID generator for demonstration
    return 'PAY-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  }
}

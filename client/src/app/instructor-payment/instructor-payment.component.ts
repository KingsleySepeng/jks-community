import {Component, OnInit} from '@angular/core';
import {Student, User} from '../model/user';
import {Payment} from '../model/payment';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MockDataService} from '../mock-service/mock-data.service';
import {Event} from '../model/event';

@Component({
  selector: 'app-instructor-payment',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe
  ],
  templateUrl: './instructor-payment.component.html',
  styleUrl: './instructor-payment.component.scss'
})
export class InstructorPaymentComponent implements OnInit{
  currentInstructor?: User; // Logged-in instructor
  students: Student[] = []; // Students from instructor's club
  events: Event[] = []; // Available events for payment

  selectedStudentId: string = '';
  selectedEventId: string = '';
  amount: number = 0;
  paymentMethod: string = 'Cash';
  paymentType: string = 'Class Fee';
  description: string = '';

  message: string = ''; // Feedback message
  notify: boolean = false; // Send notification toggle
  paymentHistory: Payment[] = [];

  constructor(private mockService: MockDataService) {}

  ngOnInit(): void {
    this.currentInstructor = this.mockService.getLoggedInUser();

    if (this.currentInstructor && this.currentInstructor.role === 'INSTRUCTOR') {
      // Load students belonging to this instructor's club
      this.students = this.mockService.getUsers().filter(
        (user:User) => user.role === 'STUDENT' && user.clubId === this.currentInstructor?.clubId
      ) as Student[];

      // Load available events
      this.events = this.mockService.getEvents();
    }

    this.loadPaymentHistory();
  }

  /** 🔹 Update amount when an event is selected */
  onEventChange(): void {
    const event = this.events.find((e) => e.id === this.selectedEventId);
    this.amount = event ? event.cost : 0;
    this.paymentType = event ? 'Event Registration' : 'Class Fee';
  }

  /** 🔹 Handle Payment Submission */
  onSubmitPayment(): void {
    if (!this.selectedStudentId || this.amount <= 0 || !this.description.trim()) {
      this.message = 'Please complete all required fields.';
      return;
    }

    // Get selected student details
    const student = this.students.find((s) => s.id === this.selectedStudentId);
    const reference = student ? `${student.firstName} ${student.lastName} [ID: ${student.id}]` : '';

    // Create a new payment record
    const newPayment: Payment = {
      id: this.generatePaymentId(),
      userId: this.selectedStudentId,
      amount: this.amount,
      paymentDate: new Date(),
      method: this.paymentMethod,
      status: 'PAID',
      reference: reference,
      paymentType: this.paymentType,
      description: this.description
    };

    // Save payment
    this.mockService.addPayment(newPayment);
    this.message = `Payment of $${this.amount} for ${this.paymentType} successfully logged for ${reference}.`;

    if (this.notify) {
      this.sendNotification();
    }

    // Reset form fields
    this.amount = 0;
    this.paymentMethod = 'Cash';
    this.paymentType = 'Class Fee';
    this.description = '';
    this.selectedStudentId = '';
    this.selectedEventId = '';

    this.loadPaymentHistory();
  }

  /** 🔹 Generate Payment ID */
  private generatePaymentId(): string {
    return 'PAY-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  }

  /** 🔹 Send Notification */
  private sendNotification(): void {
    console.log(`Notification sent for payment of $${this.amount}`);
  }

  /** 🔹 Load Payment History */
  private loadPaymentHistory(): void {
    this.paymentHistory = this.mockService.getPayments().filter(payment =>
      this.students.some(student => student.id === payment.userId)
    );
  }

  /** 🔹 Download Invoice (Placeholder) */
  downloadInvoice(payment: Payment): void {
    console.log(`Invoice downloaded for payment ID: ${payment.id}`);
  }
}

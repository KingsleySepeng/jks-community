import {Component, OnInit} from '@angular/core';
import {MockDataService} from '../mock-service/mock-data.service';
import {Payment} from '../model/payment';
import {FormsModule} from '@angular/forms';
import {User} from '../model/user';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Events} from '../model/events';
import {ActivatedRoute} from '@angular/router';
import { loadGapiInsideDOM } from 'gapi-script';

@Component({
  selector: 'app-class-pay',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './class-pay.component.html',
  styleUrl: './class-pay.component.scss'
})
export class ClassPayComponent implements OnInit{
  currentUser: User | null = null;
  payments: Payment[] = []; // Holds payment history
  users:User[] =[];
  events: Events[] = []; // Available events for payment
  selectedEventId: string = '';
  // Payment form fields
  amount: number = 0;
  paymentMethod: string = 'Credit Card';
  paymentType: string = 'Class Fee';
  description: string = '';
  notify: boolean = false;
  proofOfPayment?: File;
  payOnBehalfId: string = ''; // For paying on behalf of someone
  recipient: string = 'Admin'; // Default to admin

  // Payment success message
  message: string = '';

  paymentTypes: string[] = ['Class Fee', 'Affiliation', 'Other'];

  constructor(private mockService: MockDataService,private route:ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    // Retrieve the currently logged-in user
    this.currentUser = this.mockService.getLoggedInUser() ?? null;
    this.users = this.mockService.getUsers();
    this.events = this.mockService.getEvents();

    this.route.queryParams.subscribe(params => {
      this.selectedEventId = params['eventId'] || '';
      this.amount = +params['eventCost'] || 0;
      this.paymentType = 'Event Registration';
      this.recipient = params['eventCreator'] || 'Admin';
      this.payOnBehalfId = params['selectedStudents'] || '';
      this.description = params['eventDescription'] || '';

      const student = this.users.find((user=>user.id === this.payOnBehalfId));
      if(student){
        this.payOnBehalfId = `${student.firstName} ${student.lastName}`;
      }
    });

    if (this.currentUser) {
      this.payments = this.mockService.getPayments().filter(p => p.userId === this.currentUser?.id);
    }

    await this.initializeGapiClient();
  }

  async initializeGapiClient(): Promise<void> {
    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/forms/v1/rest'],
        scope: 'https://www.googleapis.com/auth/forms'
      });
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.proofOfPayment = input.files[0];
    }
  }

  /** 🔹 Update amount when an event is selected */
  onEventChange(): void {
    const event = this.events.find((e) => e.id === this.selectedEventId);
    this.amount = event ? event.cost : 0;
    this.paymentType = event ? 'Event Registration' : 'Class Fee';
  }

  async submitPaymentToGoogleForm(payment: Payment): Promise<void> {
    const formId = 'YOUR_GOOGLE_FORM_ID';
    const formResponse = {
      responses: [
        {
          questionId: 'QUESTION_ID_FOR_AMOUNT',
          answer: payment.amount.toString()
        },
        {
          questionId: 'QUESTION_ID_FOR_PAYMENT_METHOD',
          answer: payment.paymentMethod
        },
        {
          questionId: 'QUESTION_ID_FOR_PAYMENT_TYPE',
          answer: payment.paymentType
        },
        {
          questionId: 'QUESTION_ID_FOR_DESCRIPTION',
          answer: payment.description
        },
        {
          questionId: 'QUESTION_ID_FOR_PROOF_OF_PAYMENT',
          answer: payment.proofOfPaymentUrl || ''
        },
        {
          questionId: 'QUESTION_ID_FOR_PAID_BY',
          answer: payment.paidBy
        },
        {
          questionId: 'QUESTION_ID_FOR_RECIPIENT',
          answer: payment.recipient
        }
      ]
    };

    try {
      const response = await gapi.client.forms.responses.create({
        formId: formId,
        resource: formResponse
      });
      console.log('Form response submitted: ', response);
    } catch (error) {
      console.error('Error submitting form response: ', error);
    }
  }

  async onSubmitPayment(): Promise<void> {
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
    const payer = this.payOnBehalfId ? this.users.find(u => u.id === this.payOnBehalfId) : this.currentUser;
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
      description: this.description,
      proofOfPaymentUrl: this.proofOfPayment ? URL.createObjectURL(this.proofOfPayment) : null,
      paidBy: this.currentUser?.firstName + ' ' + this.currentUser?.lastName || 'Anonymous',
      recipient: this.recipient,
    };

    // Add the payment and refresh the history
    this.mockService.addPayment(newPayment);
    this.payments.push(newPayment); // Dynamically update the UI

    this.message = `Payment of $${this.amount} for ${this.paymentType} was successful!`;

    if (this.notify) {
      this.sendNotification();
    }

    await this.submitPaymentToGoogleForm(newPayment);

    // Reset form fields
    this.amount = 0;
    this.paymentMethod = 'Credit Card';
    this.paymentType = 'Class Fee';
    this.description = '';
    this.notify = false;
    this.proofOfPayment = undefined;
    this.payOnBehalfId = '';
  }

  private generatePaymentId(): string {
    return 'PAY-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  }

  private sendNotification(): void {
    console.log(`Notification sent to ${this.currentUser?.email} for payment of $${this.amount}`);
  }
}

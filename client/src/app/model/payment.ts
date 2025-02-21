// src/app/models/payment.model.ts
export interface Payment {
  id: string;
  userId: string;          // The child (or member) paying the fee.
  amount: number;
  paymentDate: Date;
  method: string;          // e.g., "Credit Card", "Bank Transfer", etc.
  status: 'PENDING' | 'PAID' | 'FAILED';
  reference?: string;      // e.g., student's full name and/or ID
  paymentType?: string;    // e.g., "Class Fee", "Affiliation"
  description?: string;    // description (e.g., "Class fees for Jan & Feb")
  proofOfPaymentUrl?: string | null; // Optional file upload
  paidBy: string; // Name of the payer
  recipient: string; // Who receives the payment (Admin, Instructor, etc.)
}

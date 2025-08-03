export interface Club {
  id: string;
  clubCode: string;
  name: string;
  address: string;
  contactNumber?: string;
  establishedDate?: string; // ISO format for Instant
  description?: string;
  instructorId?: string;
  martialArtsType:string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

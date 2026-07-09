export interface IContactUsMessages {
  rows: IContactUsMessage[];
}

export interface IContactUsMessage {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  service_name: string;
  service_id: number;
  message: string;
  created_at: string;
  updated_at: string;
}

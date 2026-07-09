export interface IWhyUsSection {
  rows: IWhyUs[];
}

export interface IWhyUs {
  id: number;
  why_us_number: string;
  en_why_us_title: string;
  ar_why_us_title: string;
  en_why_us_text: string;
  ar_why_us_text: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

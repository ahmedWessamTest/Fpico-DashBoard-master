export interface IArrSystems {
  rows: IArrSystem[];
}

export interface IArrSystem {
  id: number;
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

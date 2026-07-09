export interface IMessageMaster {
  rows: Row[];
}

export interface Row {
  id: number;
  main_image: string;
  en_name: string;
  ar_name: string;
  en_small_title: string;
  ar_small_title: string;
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
  created_at: null;
  updated_at: string;
}

export interface IMasterMessageUpdate {
  id: number;
  main_image: string;
  en_name: string;
  ar_name: string;
  en_small_title: string;
  ar_small_title: string;
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
}

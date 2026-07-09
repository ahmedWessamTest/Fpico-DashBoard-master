export interface IClients {
  rows: IClient[];
}

export interface IClient {
  id: number;
  main_image: string;
  en_partner_title: string;
  ar_partner_title: string;
  url_link: string;
  partner_type: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

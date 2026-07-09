export interface IFeatures {
  rows: IFeature[];
}

export interface IFeature {
  id: number;
  icon_image: string;
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

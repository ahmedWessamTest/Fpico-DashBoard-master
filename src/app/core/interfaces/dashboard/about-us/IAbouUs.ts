export interface IAboutUs {
  rows: Rows;
}

export interface Rows {
  id: number;
  en_stand_for_title: string;
  ar_stand_for_title: string;
  en_stand_for_text: string;
  ar_stand_for_text: string;
  en_mission_title: string;
  ar_mission_title: string;
  en_mission_text: string;
  ar_mission_text: string;
  en_vision_title: string;
  ar_vision_title: string;
  en_vision_text: string;
  ar_vision_text: string;
  en_main_text: string;
  ar_main_text: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  created_at: null;
  updated_at: string;
}

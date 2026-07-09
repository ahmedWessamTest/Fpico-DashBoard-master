export interface IContactUs {
  rows: Rows;
}

export interface Rows {
  id: number;
  contat_first_phone: string;
  contact_second_phone: string;
  en_address: string;
  ar_address: string;
  face_link: string;
  insta_link: string;
  tweet_link: string;
  snap_link: string;
  watus_link: string;
  linked_link: string;
  main_email: string;
  map_link: string;
  youtube_link: string;
  contact_text: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  created_at: null;
  updated_at: string;
}

export interface IUpdateSocialLinks {
  id: number | null;
  contat_first_phone: string | null;
  contact_second_phone: string | null;
  en_address: string | null;
  ar_address: string | null;
  face_link: string | null;
  insta_link: string | null;
  tweet_link: string | null;
  snap_link: string | null;
  watus_link: string | null;
  linked_link: string | null;
  youtube_link: string | null;
  main_email: string | null;
  map_link: string | null;
  contact_text: string | null;
  en_meta_title: string | null;
  ar_meta_title: string | null;
  en_meta_text: string | null;
  ar_meta_text: string | null;
  created_at: string | null;
  updated_at: string | null;
}

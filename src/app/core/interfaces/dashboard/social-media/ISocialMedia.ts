export interface ISocialMedia {
  contact: Contact;
}

export interface Contact {
  id?: any;
  tweet_url?: any;
  snapchat_url?: any;
  instgram_url?: any;
  watus_number?: any;
  face_url?: any;
  youtube_url?: any;
  tiktok_url?: any;
  phone_number?: any;
  location?: any;
  youtube_embedded?: any;
  main_email?: any;
  telegram_url?: any;
  created_at?: any;
  updated_at?: any;
}

export interface IUpdateSocialLinks {
  id: number | null;
  tweet_url: number | null;
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
}

export interface IUpdateSocialLinksResponse {
  success: string;
}

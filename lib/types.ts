export type Dealer = {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string | null;
  country: string; // ISO-3166 alpha-2, bijv. NL, DE, BE, AT
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  active: boolean;
  created_at: string;
};

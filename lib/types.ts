export type StockistLead = {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  message: string | null;
  status: "new" | "contacted" | "done";
  created_at: string;
};

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

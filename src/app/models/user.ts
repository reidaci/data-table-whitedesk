export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Adress;
  company: Company;
}
export interface Adress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
export interface Geo {
  lat: string;
  lng: string;
}

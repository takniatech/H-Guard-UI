export interface HeadLabel {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  products: number;
}
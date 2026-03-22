export interface DeliverySlot {
  id: string;
  delivery_date: string;
  order_deadline: string;
  egg_limit: number;
  eggs_reserved: number;
  active: boolean;
  zone_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  slot_id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  eggs_quantity: number;
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderFormData {
  slot_id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  eggs_quantity: number;
  rodo_accepted: boolean;
}

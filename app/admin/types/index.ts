export interface StreamUser {
  id: string;
  name: string;
  upi: string;
  joinedAt: string;
  avatar?: string;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'suspended' | 'completed';
  participants: StreamUser[];
  createdAt: string;
  host: string;
}

export interface CreateStreamForm {
  title: string;
  description: string;
  price: string;
  host: string;
}
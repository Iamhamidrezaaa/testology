export interface MentalAlert {
  id: string;
  userId: string;
  level: string;
  title: string;
  message: string;
  source: string;
  relatedTest?: string;
  status: string;
  actions?: any;
  createdAt: Date;
  resolvedAt?: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export type User = {
  id: string;
  name?: string;
  email: string;
}; 
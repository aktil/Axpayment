export interface Payment {
    id: number;
    amount: string;
    status: string;
    created_at: string;
    qr_code: string;
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  }
  
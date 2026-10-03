const USERS_KEY = 'auctionhub_users';
const SESSION_KEY = 'auctionhub_session';
const AUCTIONS_KEY = 'auctionhub_auctions';

export interface LocalUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'buyer' | 'seller';
}

export const initMockDB = () => {
  if (!localStorage.getItem(AUCTIONS_KEY)) {
    const mockAuctions = [
      {
        id: '1',
        title: 'MacBook Pro 14 inch M1 Pro 2021',
        condition: 'Đã qua sử dụng',
        currentPrice: 18500000,
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        bids: [
          { name: 'ngantran', price: 18500000, time: '12:03' },
          { name: 'hieupm', price: 18300000, time: '12:01' },
        ]
      }
    ];
    localStorage.setItem(AUCTIONS_KEY, JSON.stringify(mockAuctions));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
};

export const localDB = {
  register: (email: string, password: string, name: string, role: 'buyer' | 'seller') => {
    const users: LocalUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const cleanEmail = email.toLowerCase().trim();

    if (users.find((u: LocalUser) => u.email === cleanEmail)) {
      return { success: false, message: 'Email này đã được sử dụng.' };
    }
    
    const newUser: LocalUser = { id: Date.now().toString(), email: cleanEmail, password, name: name.trim(), role };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    localStorage.setItem(SESSION_KEY, JSON.stringify({ 
      id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role 
    }));
    
    return { success: true, user: newUser };
  },

  login: (email: string, password: string) => {
    const users: LocalUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const cleanEmail = email.toLowerCase().trim();

    const user = users.find((u: LocalUser) => u.email === cleanEmail && u.password === password);
    if (!user) return { success: false, message: 'Sai email hoặc mật khẩu.' };
    
    // Lưu phiên đăng nhập
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    return { success: true, user };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) as LocalUser : null;
  }
};

initMockDB();
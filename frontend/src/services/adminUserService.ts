import { AdminUser, CreateAdminUserPayload, UserStatus } from '@/types/admin';

const mockUsers: AdminUser[] = [
  {
    id: 1,
    username: 'admin_master',
    fullName: 'Nguyễn Văn Quản Trị',
    role: 'Admin',
    status: 'Active',
    createdAt: '01/09/2025',
    lastLogin: '26/09/2025 08:30',
  },
  {
    id: 2,
    username: 'evm_staff01',
    fullName: 'Trần Thị Thu Hà',
    role: 'EVM Staff',
    status: 'Active',
    createdAt: '12/08/2025',
    lastLogin: '24/09/2025 13:45',
  },
  {
    id: 3,
    username: 'sc_staff_hoang',
    fullName: 'Hoàng Minh Tấn',
    role: 'SC Staff',
    status: 'Inactive',
    createdAt: '03/07/2025',
    lastLogin: '15/09/2025 09:10',
  },
];

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  return Promise.resolve(mockUsers.map((user) => ({ ...user })));
};

export const createAdminUser = async (
  payload: CreateAdminUserPayload,
): Promise<AdminUser> => {
  const newUser: AdminUser = {
    id: mockUsers.length ? Math.max(...mockUsers.map((user) => user.id)) + 1 : 1,
    username: payload.username,
    fullName: payload.fullName,
    role: payload.role,
    status: 'Pending',
    createdAt: formatDate(new Date()),
    lastLogin: formatDateTime(new Date()),
  };

  mockUsers.push(newUser);
  return Promise.resolve({ ...newUser });
};

export const toggleAdminUserStatus = async (
  id: number,
): Promise<AdminUser | null> => {
  const target = mockUsers.find((user) => user.id === id);
  if (!target) {
    return Promise.resolve(null);
  }

  let nextStatus: UserStatus;
  switch (target.status) {
    case 'Active':
      nextStatus = 'Inactive';
      break;
    case 'Inactive':
      nextStatus = 'Active';
      break;
    default:
      nextStatus = 'Active';
      break;
  }

  target.status = nextStatus;
  if (nextStatus === 'Active') {
    target.lastLogin = formatDateTime(new Date());
  }

  return Promise.resolve({ ...target });
};

export const deleteAdminUser = async (id: number): Promise<void> => {
  const index = mockUsers.findIndex((user) => user.id === id);
  if (index >= 0) {
    mockUsers.splice(index, 1);
  }
  return Promise.resolve();
};
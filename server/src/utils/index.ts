export const generateScholarId = (studentId: string): string => {
  return `SCHOLAR-${studentId}`;
};

export const generateRandomPassword = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const paginate = (page: number, limit: number) => {
  return {
    offset: (page - 1) * limit,
    limit
  };
};

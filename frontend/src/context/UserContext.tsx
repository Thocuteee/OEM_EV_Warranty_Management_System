import React, { createContext, useContext } from 'react';

const UserContext = createContext({ role: 'user' });

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const user = { role: 'admin' }; // Lấy role từ hệ thống xác thực hoặc API

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
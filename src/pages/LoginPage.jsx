import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('adminUser');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const value = useMemo(
    () => ({
      user,

      isAuthed: !!user,

      login: async (username, password) => {
        const ADMIN_USERNAME = 'Admin@123';
        const ADMIN_PASSWORD = 'Ajjp@123';

        if (
          username === ADMIN_USERNAME &&
          password === ADMIN_PASSWORD
        ) {
          const adminUser = {
            username: ADMIN_USERNAME,
            role: 'admin',
          };

          localStorage.setItem(
            'adminUser',
            JSON.stringify(adminUser)
          );

          setUser(adminUser);

          return true;
        }

        throw new Error('Invalid username or password');
      },

      logout: () => {
        localStorage.removeItem('adminUser');
        setUser(null);
      },
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

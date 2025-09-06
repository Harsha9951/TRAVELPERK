import { useState, useEffect } from 'react';

export type UserRole = 'employee' | 'manager' | 'finance' | 'admin';

interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}

export const useUserRole = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Alex Johnson',
    role: 'manager',
    department: 'Operations'
  });

  const switchRole = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
  };

  const hasPermission = (requiredRole: UserRole) => {
    const roleHierarchy: Record<UserRole, number> = {
      employee: 1,
      manager: 2,
      finance: 3,
      admin: 4
    };
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  return {
    currentUser,
    switchRole,
    hasPermission,
    isManager: currentUser.role === 'manager',
    isFinance: currentUser.role === 'finance',
    isAdmin: currentUser.role === 'admin'
  };
};
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;

  return user.permissions[permission] === true;
};

export const isAdmin = (user) => {
  return user?.role === "admin";
};

export const isManager = (user) => {
  return user?.role === "manager";
};
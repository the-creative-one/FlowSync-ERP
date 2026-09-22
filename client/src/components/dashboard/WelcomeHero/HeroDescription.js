export const getHeroDescription = (permissions = {}) => {
  const {
    canCreateOrders,
    canUpdateOrders,
    canDeleteOrders,
    canManageEmployees,
    canViewAdvancedAnalytics,
    canExportReports,
    canAccessSettings,
  } = permissions;

  const hasOrders =
    canCreateOrders ||
    canUpdateOrders ||
    canDeleteOrders;

  // Full Access (Admin)
  if (
    hasOrders &&
    canManageEmployees &&
    canViewAdvancedAnalytics &&
    canExportReports &&
    canAccessSettings
  ) {
    return "Monitor business performance, oversee your workforce, streamline daily operations, and make confident, data-driven decisions from one centralized workspace.";
  }

  // Manager
  if (
    hasOrders &&
    canManageEmployees &&
    canViewAdvancedAnalytics
  ) {
    return "Manage customer orders, collaborate with your team, and track business performance to keep operations running efficiently.";
  }

  // Operations + Analytics
  if (
    hasOrders &&
    canViewAdvancedAnalytics &&
    canExportReports
  ) {
    return "Manage customer orders, monitor operational performance, and generate reports to stay informed every step of the way.";
  }

  // Operations
  if (hasOrders && !canManageEmployees) {
    return "Create, update and manage customer orders while keeping day-to-day operations organized and running smoothly.";
  }

  // HR / Team
  if (
    canManageEmployees &&
    !hasOrders &&
    !canViewAdvancedAnalytics
  ) {
    return "Manage employee information, organize your workforce, and keep your team connected from one centralized dashboard.";
  }

  // Analyst
  if (
    canViewAdvancedAnalytics &&
    canExportReports
  ) {
    return "Explore business trends, visualize performance metrics and export insightful reports that support better business decisions.";
  }

  if (canViewAdvancedAnalytics) {
    return "Monitor key business metrics through interactive analytics and uncover valuable insights to improve performance.";
  }

  // Settings
  if (canAccessSettings) {
    return "Configure your workspace, manage system preferences and keep your environment running exactly the way you need.";
  }

  return "Welcome back to FlowSync. Stay productive and keep your work organized from one centralized dashboard.";
};
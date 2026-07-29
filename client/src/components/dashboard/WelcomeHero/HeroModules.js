import {
  ShoppingBag,
  Users,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

export const getHeroModules = (permissions = {}) => {
  const modules = [];

  const hasOrders =
    permissions.canCreateOrders ||
    permissions.canUpdateOrders ||
    permissions.canDeleteOrders;

  if (hasOrders) {
    modules.push({
      id: "orders",
      title: "Orders",
      icon: ShoppingBag,
      size: "large",
    });
  }

  if (permissions.canViewAdvancedAnalytics) {
    modules.push({
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      size: "medium",
    });
  }

  if (permissions.canManageEmployees) {
    modules.push({
      id: "employees",
      title: "Team",
      icon: Users,
      size: "medium",
    });
  }

  if (permissions.canExportReports) {
    modules.push({
      id: "reports",
      title: "Reports",
      icon: FileText,
      size: "small",
    });
  }

  if (permissions.canAccessSettings) {
    modules.push({
      id: "settings",
      title: "Settings",
      icon: Settings,
      size: "small",
    });
  }

  return modules;
};
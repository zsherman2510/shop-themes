export const PERMISSIONS = {
  // Store Management
  MANAGE_STORE: "manage_store",
  VIEW_ANALYTICS: "view_analytics",

  // Product Management
  MANAGE_PRODUCTS: "manage_products",
  VIEW_PRODUCTS: "view_products",

  // Order Management
  MANAGE_ORDERS: "manage_orders",
  VIEW_ORDERS: "view_orders",

  // Customer Management
  MANAGE_CUSTOMERS: "manage_customers",
  VIEW_CUSTOMERS: "view_customers",

  // Settings
  MANAGE_SETTINGS: "manage_settings",
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Default permissions for different admin roles
export const DEFAULT_ADMIN_PERMISSIONS = Object.values(PERMISSIONS);

export const DEFAULT_STAFF_PERMISSIONS = [
  PERMISSIONS.VIEW_PRODUCTS,
  PERMISSIONS.VIEW_ORDERS,
  PERMISSIONS.VIEW_CUSTOMERS,
  PERMISSIONS.VIEW_ANALYTICS,
];

export function hasPermission(
  userPermissions: string[],
  permission: Permission
): boolean {
  return userPermissions.includes(PERMISSIONS[permission]);
}

export function hasAnyPermission(
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  return permissions.some((permission) =>
    hasPermission(userPermissions, permission)
  );
}

export function hasAllPermissions(
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  return permissions.every((permission) =>
    hasPermission(userPermissions, permission)
  );
}

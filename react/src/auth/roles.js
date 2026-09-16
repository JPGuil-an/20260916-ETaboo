export const USER_TYPES = {
  BUYER: 0,
  SELLER: 1,
  BUYER_SELLER: 2,
  ADMIN: 3,
};

export const PORTALS = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
};

export const PORTAL_LABELS = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "DA Admin",
};

export function toUserType(value) {
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export function portalAllowedForUser(portal, userType) {
  const type = toUserType(userType);
  if (type === null) return false;
  if (portal === PORTALS.ADMIN) return type === USER_TYPES.ADMIN;
  if (portal === PORTALS.BUYER) {
    return type === USER_TYPES.BUYER || type === USER_TYPES.BUYER_SELLER;
  }
  if (portal === PORTALS.SELLER) {
    return type === USER_TYPES.SELLER || type === USER_TYPES.BUYER_SELLER;
  }
  return false;
}

export function canUseBuyerMode(userType) {
  const type = toUserType(userType);
  return type === USER_TYPES.BUYER || type === USER_TYPES.BUYER_SELLER;
}

export function canUseSellerMode(userType) {
  const type = toUserType(userType);
  return type === USER_TYPES.SELLER || type === USER_TYPES.BUYER_SELLER;
}

export function isAdmin(userType) {
  return toUserType(userType) === USER_TYPES.ADMIN;
}

export function canSwitchTradeRoles(userType) {
  return toUserType(userType) === USER_TYPES.BUYER_SELLER;
}

export function roleLabel(userType) {
  const type = toUserType(userType);
  if (type === USER_TYPES.ADMIN) return "DA Admin";
  if (type === USER_TYPES.SELLER) return "Seller";
  if (type === USER_TYPES.BUYER_SELLER) return "Buyer & Seller";
  if (type === USER_TYPES.BUYER) return "Buyer";
  return "Guest";
}

export function homePath(userType, portal) {
  const type = toUserType(userType);
  if (portal && portalAllowedForUser(portal, type)) {
    if (portal === PORTALS.ADMIN) return "/admin/dashboard";
    if (portal === PORTALS.SELLER) return "/buyer-seller/dashboard";
    if (type === USER_TYPES.BUYER_SELLER) return "/buyer-seller/role/buyer";
    return "/buyer/home";
  }
  if (type === USER_TYPES.ADMIN) return "/admin/dashboard";
  if (type === USER_TYPES.SELLER || type === USER_TYPES.BUYER_SELLER) {
    return "/buyer-seller/dashboard";
  }
  if (type === USER_TYPES.BUYER) return "/buyer/home";
  return "/login";
}

export function typesForPortal(portal) {
  if (portal === PORTALS.ADMIN) return [USER_TYPES.ADMIN];
  if (portal === PORTALS.SELLER) return [USER_TYPES.SELLER, USER_TYPES.BUYER_SELLER];
  if (portal === PORTALS.BUYER) return [USER_TYPES.BUYER, USER_TYPES.BUYER_SELLER];
  return [];
}

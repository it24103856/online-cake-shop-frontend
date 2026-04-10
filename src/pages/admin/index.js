/**
 * Admin Pages Index
 * 
 * Import all admin pages from here for cleaner imports in your router
 * 
 * Usage:
 * import { AdminDriverPage, AdminDeliveryPage, ... } from "./pages/admin";
 */

// Core Admin Pages
export { default as AdminCakePage } from "./adminCakePage";
export { default as adminCakeAddPage } from "./adminCakeAddPage";
export { default as adminCakeUpadate } from "./adminCakeUpadate";

export { default as AdminUserPage } from "./adminUserPage";
export { default as AdminOrderPage } from "./AdminOrderPage";
export { default as AdminPaymentDashboard } from "./AdminPaymentDashboard";
export { default as AdminFeedbackPage } from "./AdminFeedbackPage";

// Accessories Pages
export { default as AdminAccesoriesPage } from "./adminAccesoriespage";
export { default as AdminAceesororiesUpadtepage } from "./adminAceesororiesUpadtepage";
export { default as AdminAcessoriesAddpage } from "./adminAcessoriesAddpage";

// NEW - Delivery & Driver Management
export { default as AdminDeliveryPage } from "./AdminDeliveryPage";
export { default as AdminDriverPage } from "./adminDriverPage";

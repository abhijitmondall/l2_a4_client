// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = "customer" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  isBanned?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// ============================================
// MEDICINE TYPES
// ============================================

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
  manufacturer: string;
  image?: string;
  sellerId: string;
  sellerName?: string;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  manufacturer: string;
  imageUrl?: string;
}

export interface MedicineFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface OrderItem {
  id?: string;
  medicineId: string;
  medicineName: string;
  medicineImage?: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentMethod?: "COD" | "CARD" | "WALLET";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Array<{
    medicineId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
}

export interface OrderFilters {
  status?: OrderStatus;
  customerId?: string;
  sellerId?: string;
  page?: number;
  limit?: number;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  medicineId: string;
  medicineName?: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewFormData {
  medicineId: string;
  rating: number;
  comment: string;
}

export interface MedicineRating {
  averageRating: number;
  totalReviews: number;
  ratings?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ============================================
// AUTH STORE TYPES
// ============================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// FORM VALIDATION TYPES
// ============================================

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | undefined;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

// ============================================
// DASHBOARD STATISTICS TYPES
// ============================================

export interface SellerDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalMedicines: number;
  pendingOrders: number;
  recentOrders: Order[];
  topMedicines?: Array<{
    medicine: Medicine;
    totalSold: number;
    revenue: number;
  }>;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  totalMedicines: number;
  recentOrders: Order[];
  topSellers: User[];
  revenueByMonth?: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface CustomerDashboardStats {
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  recentOrders: Order[];
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart?: (medicine: Medicine) => void;
}

export interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

// ============================================
// FILTER & SORT TYPES
// ============================================

export type SortOrder = "asc" | "desc";

export type MedicineSortBy = "name" | "price" | "createdAt" | "stock";

export interface SortOptions {
  sortBy: MedicineSortBy;
  sortOrder: SortOrder;
}

export interface PriceRange {
  min: string | number;
  max: string | number;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

// ============================================
// MODAL TYPES
// ============================================

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string | number;

export type Timestamp = string | Date;

// For async operations
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// For form state
export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================
// ROUTE TYPES
// ============================================

export interface RouteConfig {
  path: string;
  label: string;
  icon?: React.ComponentType;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

// ============================================
// TABLE TYPES
// ============================================

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

// ============================================
// PAYMENT TYPES (Future Use)
// ============================================

export type PaymentMethod = "COD" | "CARD" | "WALLET" | "UPI";

export interface PaymentInfo {
  method: PaymentMethod;
  transactionId?: string;
  status?: "pending" | "completed" | "failed";
  amount: number;
  paidAt?: string;
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchFilters {
  query: string;
  category?: string;
  priceRange?: PriceRange;
  inStock?: boolean;
  rating?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: SearchFilters;
}

// ============================================
// EXPORT ALL TYPES
// ============================================

// Re-export everything for convenience
export type * from "./index";

import { User, AuthResponse, Medicine, Category, Order, Review } from "@/types";

// API Base URL from environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Helper function to make fetch requests with authentication
 */
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<any> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  // merge incoming headers (if any)
  if (options.headers) {
    const incoming = new Headers(options.headers);
    incoming.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  // Handle error responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
};

/**
 * Unified API object with dot notation access
 * Usage: api.auth.signup(), api.medicines.getAll(), etc.
 */
export const api = {
  // ============================================
  // AUTHENTICATION
  // ============================================
  auth: {
    /**
     * Register a new user
     * @example api.auth.signup({ name: 'John', email: 'john@example.com', password: '123456', role: 'customer' })
     */
    signup: async (data: {
      name: string;
      email: string;
      password: string;
      role: "customer" | "seller";
    }): Promise<AuthResponse> => {
      const response = await fetchWithAuth("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.data;
    },

    /**
     * Login user
     * @example api.auth.signin({ email: 'john@example.com', password: '123456' })
     */
    signin: async (credentials: {
      email: string;
      password: string;
    }): Promise<AuthResponse> => {
      const response = await fetchWithAuth("/auth/signin", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return response.data;
    },

    /**
     * Get current authenticated user
     * @example api.auth.me()
     */
    me: async (): Promise<User> => {
      const response = await fetchWithAuth("/auth/me");
      return response.data;
    },
  },

  // ============================================
  // MEDICINES
  // ============================================
  medicines: {
    /**
     * Get all medicines with optional filters
     * @example api.medicines.getAll({ search: 'aspirin', category: 'Pain Relief' })
     */
    getAll: async (params?: {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    }): Promise<Medicine[]> => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      const queryString = queryParams.toString();
      const url = queryString ? `/medicines?${queryString}` : "/medicines";
      const response = await fetchWithAuth(url);
      return response.data;
    },

    /**
     * Get a single medicine by ID
     * @example api.medicines.getById('medicine-id-123')
     */
    getById: async (id: string): Promise<Medicine> => {
      const response = await fetchWithAuth(`/medicines/${id}`);
      return response.data;
    },

    /**
     * Get all medicine categories
     * @example api.medicines.getCategories()
     */
    getCategories: async (): Promise<Category[]> => {
      const response = await fetchWithAuth("/medicines/categories");
      return response.data;
    },

    /**
     * Search medicines
     * @example api.medicines.search('headache')
     */
    search: async (query: string): Promise<Medicine[]> => {
      const response = await fetchWithAuth(
        `/medicines?search=${encodeURIComponent(query)}`,
      );
      return response.data;
    },
  },

  // ============================================
  // ORDERS (Customer)
  // ============================================
  orders: {
    /**
     * Create a new order
     * @example api.orders.create({ items: [...], shippingAddress: {...} })
     */
    create: async (orderData: {
      items: Array<{
        medicineId: string;
        quantity: number;
      }>;
      shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
      };
    }): Promise<Order> => {
      const response = await fetchWithAuth("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      return response.data;
    },

    /**
     * Get all orders for authenticated customer
     * @example api.orders.getAll()
     */
    getAll: async (): Promise<Order[]> => {
      const response = await fetchWithAuth("/orders");
      return response.data;
    },

    /**
     * Get a specific order by ID
     * @example api.orders.getById('order-id-123')
     */
    getById: async (id: string): Promise<Order> => {
      const response = await fetchWithAuth(`/orders/${id}`);
      return response.data;
    },

    /**
     * Get orders by status
     * @example api.orders.getByStatus('SHIPPED')
     */
    getByStatus: async (
      status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
    ): Promise<Order[]> => {
      const response = await fetchWithAuth(`/orders?status=${status}`);
      return response.data;
    },
  },

  // ============================================
  // SELLER
  // ============================================
  seller: {
    medicines: {
      /**
       * Add a new medicine (Seller only)
       * @example api.seller.medicines.add({ name: 'Aspirin', price: 9.99, ... })
       */
      add: async (medicineData: {
        name: string;
        description: string;
        price: number;
        stock: number;
        category: string;
        manufacturer: string;
        imageUrl?: string;
      }): Promise<Medicine> => {
        const response = await fetchWithAuth("/seller/medicines", {
          method: "POST",
          body: JSON.stringify(medicineData),
        });
        return response.data;
      },

      /**
       * Update a medicine (Seller only)
       * @example api.seller.medicines.update('med-id-123', { price: 8.99, stock: 150 })
       */
      update: async (
        id: string,
        medicineData: Partial<{
          name: string;
          description: string;
          price: number;
          stock: number;
          category: string;
          manufacturer: string;
          imageUrl?: string;
        }>,
      ): Promise<Medicine> => {
        const response = await fetchWithAuth(`/seller/medicines/${id}`, {
          method: "PUT",
          body: JSON.stringify(medicineData),
        });
        return response.data;
      },

      /**
       * Delete a medicine (Seller only)
       * @example api.seller.medicines.delete('med-id-123')
       */
      delete: async (id: string): Promise<{ message: string }> => {
        const response = await fetchWithAuth(`/seller/medicines/${id}`, {
          method: "DELETE",
        });
        return response;
      },

      /**
       * Get all medicines for authenticated seller
       * @example api.seller.medicines.getAll()
       */
      getAll: async (): Promise<Medicine[]> => {
        const response = await fetchWithAuth("/medicines?seller=me");
        return response.data;
      },

      /**
       * Update stock for a medicine
       * @example api.seller.medicines.updateStock('med-id-123', 75)
       */
      updateStock: async (id: string, stock: number): Promise<Medicine> => {
        const response = await fetchWithAuth(`/seller/medicines/${id}`, {
          method: "PUT",
          body: JSON.stringify({ stock }),
        });
        return response.data;
      },
    },

    orders: {
      /**
       * Get all orders for authenticated seller
       * @example api.seller.orders.getAll()
       */
      getAll: async (): Promise<Order[]> => {
        const response = await fetchWithAuth("/seller/orders");
        return response.data;
      },

      /**
       * Update order status (Seller only)
       * @example api.seller.orders.updateStatus('order-id-123', 'SHIPPED')
       */
      updateStatus: async (
        id: string,
        status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      ): Promise<Order> => {
        const response = await fetchWithAuth(`/seller/orders/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
        return response.data;
      },

      /**
       * Get orders by status for seller
       * @example api.seller.orders.getByStatus('PLACED')
       */
      getByStatus: async (
        status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      ): Promise<Order[]> => {
        const response = await fetchWithAuth(`/seller/orders?status=${status}`);
        return response.data;
      },
    },

    /**
     * Get seller dashboard statistics
     * @example api.seller.getDashboardStats()
     */
    getDashboardStats: async (): Promise<{
      totalOrders: number;
      totalRevenue: number;
      totalMedicines: number;
      pendingOrders: number;
      recentOrders: Order[];
    }> => {
      const response = await fetchWithAuth("/seller/orders");
      const orderData = response.data;

      return {
        totalOrders: orderData.length,
        totalRevenue: orderData.reduce(
          (sum: number, order: Order) => sum + order.totalAmount,
          0,
        ),
        totalMedicines: 0,
        pendingOrders: orderData.filter(
          (order: Order) => order.status === "placed",
        ).length,
        recentOrders: orderData.slice(0, 5),
      };
    },
  },

  // ============================================
  // REVIEWS
  // ============================================
  reviews: {
    /**
     * Get all reviews for a medicine
     * @example api.reviews.getByMedicine('med-id-123')
     */
    getByMedicine: async (medicineId: string): Promise<Review[]> => {
      const response = await fetchWithAuth(`/reviews/medicine/${medicineId}`);
      return response.data;
    },

    /**
     * Create a new review
     * @example api.reviews.create({ medicineId: 'med-id', rating: 5, comment: 'Great!' })
     */
    create: async (reviewData: {
      medicineId: string;
      rating: number;
      comment: string;
    }): Promise<Review> => {
      const response = await fetchWithAuth("/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
      });
      return response.data;
    },

    /**
     * Update a review
     * @example api.reviews.update('review-id-123', { rating: 4, comment: 'Updated' })
     */
    update: async (
      id: string,
      reviewData: {
        rating?: number;
        comment?: string;
      },
    ): Promise<Review> => {
      const response = await fetchWithAuth(`/reviews/${id}`, {
        method: "PUT",
        body: JSON.stringify(reviewData),
      });
      return response.data;
    },

    /**
     * Delete a review
     * @example api.reviews.delete('review-id-123')
     */
    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetchWithAuth(`/reviews/${id}`, {
        method: "DELETE",
      });
      return response;
    },

    /**
     * Get reviews by authenticated user
     * @example api.reviews.getMine()
     */
    getMine: async (): Promise<Review[]> => {
      const response = await fetchWithAuth("/reviews/my-reviews");
      return response.data;
    },

    /**
     * Get average rating for a medicine
     * @example api.reviews.getRating('med-id-123')
     */
    getRating: async (
      medicineId: string,
    ): Promise<{ averageRating: number; totalReviews: number }> => {
      const response = await fetchWithAuth(
        `/reviews/medicine/${medicineId}/rating`,
      );
      return response.data;
    },
  },

  // ============================================
  // ADMIN
  // ============================================
  admin: {
    users: {
      /**
       * Get all users (Admin only)
       * @example api.admin.users.getAll({ role: 'customer' })
       */
      getAll: async (params?: {
        role?: "customer" | "seller" | "admin";
        page?: number;
        limit?: number;
      }): Promise<User[]> => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });
        }
        const queryString = queryParams.toString();
        const url = queryString
          ? `/admin/users?${queryString}`
          : "/admin/users";
        const response = await fetchWithAuth(url);
        return response.data;
      },

      /**
       * Get a user by ID (Admin only)
       * @example api.admin.users.getById('user-id-123')
       */
      getById: async (id: string): Promise<User> => {
        const response = await fetchWithAuth(`/admin/users/${id}`);
        return response.data;
      },

      /**
       * Update user status (Admin only)
       * @example api.admin.users.updateStatus('user-id', { isBanned: true })
       */
      updateStatus: async (
        id: string,
        status: { isBanned?: boolean; isActive?: boolean },
      ): Promise<User> => {
        const response = await fetchWithAuth(`/admin/users/${id}`, {
          method: "PATCH",
          body: JSON.stringify(status),
        });
        return response.data;
      },

      /**
       * Delete a user (Admin only)
       * @example api.admin.users.delete('user-id-123')
       */
      delete: async (id: string): Promise<{ message: string }> => {
        const response = await fetchWithAuth(`/admin/users/${id}`, {
          method: "DELETE",
        });
        return response;
      },
    },

    medicines: {
      /**
       * Get all medicines (Admin only)
       * @example api.admin.medicines.getAll()
       */
      getAll: async (): Promise<Medicine[]> => {
        const response = await fetchWithAuth("/admin/medicines");
        return response.data;
      },

      /**
       * Approve a medicine (Admin only)
       * @example api.admin.medicines.approve('med-id-123', true)
       */
      approve: async (id: string, approved: boolean): Promise<Medicine> => {
        const response = await fetchWithAuth(`/admin/medicines/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ approved }),
        });
        return response.data;
      },

      /**
       * Delete a medicine (Admin only)
       * @example api.admin.medicines.delete('med-id-123')
       */
      delete: async (id: string): Promise<{ message: string }> => {
        const response = await fetchWithAuth(`/admin/medicines/${id}`, {
          method: "DELETE",
        });
        return response;
      },
    },

    orders: {
      /**
       * Get all orders (Admin only)
       * @example api.admin.orders.getAll({ status: 'PLACED' })
       */
      getAll: async (params?: {
        status?:
          | "PLACED"
          | "PROCESSING"
          | "SHIPPED"
          | "DELIVERED"
          | "CANCELLED";
        page?: number;
        limit?: number;
      }): Promise<Order[]> => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });
        }
        const queryString = queryParams.toString();
        const url = queryString
          ? `/admin/orders?${queryString}`
          : "/admin/orders";
        const response = await fetchWithAuth(url);
        return response.data;
      },

      /**
       * Get an order by ID (Admin only)
       * @example api.admin.orders.getById('order-id-123')
       */
      getById: async (id: string): Promise<Order> => {
        const response = await fetchWithAuth(`/admin/orders/${id}`);
        return response.data;
      },

      /**
       * Update order status (Admin only)
       * @example api.admin.orders.updateStatus('order-id', 'DELIVERED')
       */
      updateStatus: async (
        id: string,
        status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      ): Promise<Order> => {
        const response = await fetchWithAuth(`/admin/orders/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
        return response.data;
      },
    },

    categories: {
      /**
       * Get all categories (Admin only)
       * @example api.admin.categories.getAll()
       */
      getAll: async (): Promise<Category[]> => {
        const response = await fetchWithAuth("/admin/categories");
        return response.data;
      },

      /**
       * Create a category (Admin only)
       * @example api.admin.categories.create({ name: 'Antibiotics', description: '...' })
       */
      create: async (categoryData: {
        name: string;
        description?: string;
      }): Promise<Category> => {
        const response = await fetchWithAuth("/medicines/category", {
          method: "POST",
          body: JSON.stringify(categoryData),
        });
        return response.data;
      },

      /**
       * Update a category (Admin only)
       * @example api.admin.categories.update('cat-id', { name: 'New Name' })
       */
      update: async (
        id: string,
        categoryData: {
          name?: string;
          description?: string;
        },
      ): Promise<Category> => {
        const response = await fetchWithAuth(`/admin/categories/${id}`, {
          method: "PUT",
          body: JSON.stringify(categoryData),
        });
        return response.data;
      },

      /**
       * Delete a category (Admin only)
       * @example api.admin.categories.delete('cat-id-123')
       */
      delete: async (id: string): Promise<{ message: string }> => {
        const response = await fetchWithAuth(`/admin/categories/${id}`, {
          method: "DELETE",
        });
        return response;
      },
    },

    /**
     * Get admin dashboard statistics
     * @example api.admin.getDashboardStats()
     */
    getDashboardStats: async (): Promise<{
      totalUsers: number;
      totalCustomers: number;
      totalSellers: number;
      totalOrders: number;
      totalRevenue: number;
      totalMedicines: number;
      recentOrders: Order[];
      topSellers: User[];
    }> => {
      const response = await fetchWithAuth("/admin/dashboard/stats");
      return response.data;
    },
  },
};

export default api;

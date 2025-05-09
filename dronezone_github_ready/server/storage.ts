import { db } from "@db";
import { 
  products, 
  categories, 
  customers, 
  orders, 
  orderItems, 
  cartItems, 
  blogPosts, 
  testimonials,
  users
} from "@shared/schema";
import { eq, and, like, desc, inArray } from "drizzle-orm";
import type { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  OrderItem, 
  Customer,
  User,
  UserInsert
} from "@shared/schema";

// Products
export async function getProducts(limit?: number, categoryId?: number, featured?: boolean) {
  let query = db.select().from(products);
  
  if (categoryId) {
    query = query.where(eq(products.categoryId, categoryId));
  }
  
  if (featured) {
    query = query.where(eq(products.featured, featured));
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  return await query;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const result = await db.select().from(products).where(eq(products.slug, slug));
  return result[0];
}

export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
  return await db.select()
    .from(products)
    .where(like(products.name, `%${query}%`))
    .limit(limit);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return await db.select().from(categories);
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  const result = await db.select().from(categories).where(eq(categories.id, id));
  return result[0];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const result = await db.select().from(categories).where(eq(categories.slug, slug));
  return result[0];
}

// Cart
export async function getCartItems(sessionId: string): Promise<CartItem[]> {
  return await db.select()
    .from(cartItems)
    .where(eq(cartItems.sessionId, sessionId));
}

export async function addCartItem(item: Omit<CartItem, 'id' | 'createdAt'>) {
  return await db.insert(cartItems).values(item).returning();
}

export async function updateCartItem(id: number, quantity: number) {
  return await db.update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, id))
    .returning();
}

export async function removeCartItem(id: number) {
  return await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(sessionId: string) {
  return await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}

// Customers
export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const result = await db.select().from(customers).where(eq(customers.email, email));
  return result[0];
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
  return await db.insert(customers).values(customer).returning();
}

// Orders
export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
  return await db.insert(orders).values(order).returning();
}

export async function addOrderItems(items: Omit<OrderItem, 'id'>[]) {
  return await db.insert(orderItems).values(items).returning();
}

export async function getOrderById(id: number) {
  return await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      customer: true,
      items: {
        with: {
          product: true
        }
      }
    }
  });
}

export async function getCustomerOrders(customerId: number) {
  return await db.query.orders.findMany({
    where: eq(orders.customerId, customerId),
    orderBy: desc(orders.createdAt),
    with: {
      items: {
        with: {
          product: true
        }
      }
    }
  });
}

// Blog posts
export async function getBlogPosts(limit = 3) {
  return await db.select()
    .from(blogPosts)
    .limit(limit)
    .orderBy(desc(blogPosts.createdAt));
}

// Testimonials
export async function getTestimonials(limit = 3) {
  return await db.select()
    .from(testimonials)
    .where(eq(testimonials.isVerified, true))
    .limit(limit);
}

// User authentication
export async function getUserById(id: number): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.username, username));
  return result[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function createUser(userData: Omit<UserInsert, 'id'>): Promise<User> {
  const [user] = await db.insert(users).values(userData).returning();
  return user;
}

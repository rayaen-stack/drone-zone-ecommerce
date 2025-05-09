import { pgTable, text, serial, integer, boolean, decimal, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Product categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url")
});

// Product table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  numReviews: integer("num_reviews").default(0),
  stock: integer("stock").default(0),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  featured: boolean("featured").default(false),
  specifications: text("specifications"),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Customer profiles
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Order status enum
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

// Payment status enum
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  status: text("status").notNull().$type<OrderStatus>().default("pending"),
  shippingAddress: text("shipping_address").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").default("unknown"),
  paymentStatus: text("payment_status").$type<PaymentStatus>().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Order items join table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // Tutorial, News, Review, etc.
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  isVerified: boolean("is_verified").default(false)
});

// Define relations
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  })
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id]
  }),
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));

// Schemas for validation
export const categoriesInsertSchema = createInsertSchema(categories, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  description: (schema) => schema.optional(),
  slug: (schema) => schema.min(2, "Slug must be at least 2 characters"),
  imageUrl: (schema) => schema.optional()
});

export const productsInsertSchema = createInsertSchema(products, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
  price: (schema) => schema.min(0.01, "Price must be positive"),
  compareAtPrice: (schema) => schema.optional().nullable(),
  imageUrl: (schema) => schema.url("Image URL must be a valid URL"),
  stock: (schema) => schema.int().min(0, "Stock cannot be negative"),
  specifications: (schema) => schema.optional()
});

export const customersInsertSchema = createInsertSchema(customers, {
  email: (schema) => schema.email("Must provide a valid email"),
  name: (schema) => schema.min(2, "Name must be at least 2 characters")
});

export const usersInsertSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters")
});

export const ordersInsertSchema = createInsertSchema(orders);
export const orderItemsInsertSchema = createInsertSchema(orderItems);
export const cartItemsInsertSchema = createInsertSchema(cartItems);
export const blogPostsInsertSchema = createInsertSchema(blogPosts);
export const testimonialsInsertSchema = createInsertSchema(testimonials);

// Types
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;

export type UserInsert = z.infer<typeof usersInsertSchema>;
export type CategoryInsert = z.infer<typeof categoriesInsertSchema>;
export type ProductInsert = z.infer<typeof productsInsertSchema>;
export type CustomerInsert = z.infer<typeof customersInsertSchema>;
export type OrderInsert = z.infer<typeof ordersInsertSchema>;
export type OrderItemInsert = z.infer<typeof orderItemsInsertSchema>;
export type CartItemInsert = z.infer<typeof cartItemsInsertSchema>;
export type BlogPostInsert = z.infer<typeof blogPostsInsertSchema>;
export type TestimonialInsert = z.infer<typeof testimonialsInsertSchema>;

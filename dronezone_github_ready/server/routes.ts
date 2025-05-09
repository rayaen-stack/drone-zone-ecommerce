import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { 
  products, 
  categories, 
  cartItems, 
  orders, 
  orderItems, 
  customers, 
  blogPosts, 
  testimonials, 
  users
} from "@shared/schema";
import { eq, and, like, desc, asc, isNull, ne, gt, lt, or, inArray } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API prefix
  const apiPrefix = "/api";

  // Get all categories
  app.get(`${apiPrefix}/categories`, async (_req, res) => {
    try {
      const allCategories = await db.query.categories.findMany();
      return res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get category by ID or slug
  app.get(`${apiPrefix}/categories/:identifier`, async (req, res) => {
    try {
      const { identifier } = req.params;
      let category;

      // Check if identifier is a number (ID) or string (slug)
      const isId = /^\d+$/.test(identifier);
      
      if (isId) {
        category = await db.query.categories.findFirst({
          where: eq(categories.id, parseInt(identifier)),
          with: {
            products: true
          }
        });
      } else {
        category = await db.query.categories.findFirst({
          where: eq(categories.slug, identifier),
          with: {
            products: true
          }
        });
      }

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      return res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Get products with filtering
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const { 
        categoryId, 
        categorySlug, 
        featured, 
        minPrice, 
        maxPrice, 
        sort, 
        query,
        limit = "12",
        page = "1"
      } = req.query as Record<string, string>;

      let whereConditions = [];

      // Filter by category ID
      if (categoryId && categoryId !== "all") {
        whereConditions.push(eq(products.categoryId, parseInt(categoryId)));
      }

      // Filter by price range
      if (minPrice) {
        whereConditions.push(gt(products.price, minPrice));
      }
      
      if (maxPrice) {
        whereConditions.push(lt(products.price, maxPrice));
      }

      // Filter by featured
      if (featured === "true") {
        whereConditions.push(eq(products.featured, true));
      }

      // Filter by search query
      if (query) {
        whereConditions.push(
          or(
            like(products.name, `%${query}%`),
            like(products.description, `%${query}%`)
          )
        );
      }

      // Get category by slug if provided
      if (categorySlug && categorySlug !== "all") {
        const category = await db.query.categories.findFirst({
          where: eq(categories.slug, categorySlug)
        });
        
        if (category) {
          whereConditions.push(eq(products.categoryId, category.id));
        }
      }

      // Pagination
      const pageNum = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 12;
      const offset = (pageNum - 1) * pageSize;

      // Handle sorting
      let orderBy;
      switch (sort) {
        case "price_low":
          orderBy = asc(products.price);
          break;
        case "price_high":
          orderBy = desc(products.price);
          break;
        case "newest":
          orderBy = desc(products.createdAt);
          break;
        case "rating":
          orderBy = desc(products.rating);
          break;
        default:
          orderBy = desc(products.featured);
      }

      // Build the final query
      const whereClause = whereConditions.length > 0 
        ? { where: and(...whereConditions) } 
        : { where: undefined };

      // Count total products (for pagination)
      const totalProductsCount = await db.select({ count: products.id }).from(products).where(and(...whereConditions));
      const total = totalProductsCount.length;

      // Fetch products with category information
      const productList = await db.query.products.findMany({
        ...whereClause,
        orderBy,
        limit: pageSize,
        offset,
        with: {
          category: true
        }
      });

      return res.json({
        products: productList,
        pagination: {
          total,
          page: pageNum,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get product by ID or slug
  app.get(`${apiPrefix}/products/:identifier`, async (req, res) => {
    try {
      const { identifier } = req.params;
      let product;

      // Check if identifier is a number (ID) or string (slug)
      const isId = /^\d+$/.test(identifier);
      
      if (isId) {
        product = await db.query.products.findFirst({
          where: eq(products.id, parseInt(identifier)),
          with: {
            category: true
          }
        });
      } else {
        product = await db.query.products.findFirst({
          where: eq(products.slug, identifier),
          with: {
            category: true
          }
        });
      }

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Get related products from the same category
      const related = await db.query.products.findMany({
        where: and(
          eq(products.categoryId, product.categoryId),
          ne(products.id, product.id)
        ),
        limit: 4
      });

      return res.json({
        product,
        related
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get featured products
  app.get(`${apiPrefix}/featured-products`, async (_req, res) => {
    try {
      const featuredProducts = await db.query.products.findMany({
        where: eq(products.featured, true),
        limit: 4
      });
      return res.json(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });
  
  // Get products by category
  app.get(`${apiPrefix}/categories/:categoryId/products`, async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { limit = "8" } = req.query as Record<string, string>;
      
      const limitNum = parseInt(limit);
      
      const categoryProducts = await db.query.products.findMany({
        where: eq(products.categoryId, parseInt(categoryId)),
        limit: limitNum,
      });
      
      return res.json(categoryProducts);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get accessories (products in the Accessories category)
  app.get(`${apiPrefix}/accessories`, async (req, res) => {
    try {
      const { limit = "4" } = req.query as Record<string, string>;
      const limitNum = parseInt(limit);
      
      // Find the Accessories category
      const accessoriesCategory = await db.query.categories.findFirst({
        where: eq(categories.name, "Accessories")
      });
      
      if (!accessoriesCategory) {
        return res.status(404).json({ error: "Accessories category not found" });
      }
      
      const accessories = await db.query.products.findMany({
        where: eq(products.categoryId, accessoriesCategory.id),
        limit: limitNum,
      });
      
      return res.json(accessories);
    } catch (error) {
      console.error("Error fetching accessories:", error);
      return res.status(500).json({ error: "Failed to fetch accessories" });
    }
  });

  // Get blog posts
  app.get(`${apiPrefix}/blog-posts`, async (req, res) => {
    try {
      const { limit = "3" } = req.query as Record<string, string>;
      const limitNum = parseInt(limit);
      
      const posts = await db.query.blogPosts.findMany({
        limit: limitNum,
        orderBy: desc(blogPosts.createdAt)
      });
      
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Get testimonials
  app.get(`${apiPrefix}/testimonials`, async (req, res) => {
    try {
      const { limit = "3" } = req.query as Record<string, string>;
      const limitNum = parseInt(limit);
      
      const allTestimonials = await db.query.testimonials.findMany({
        limit: limitNum,
        where: eq(testimonials.isVerified, true)
      });
      
      return res.json(allTestimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      return res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Cart operations
  // Get cart items
  app.get(`${apiPrefix}/cart/:sessionId`, async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const items = await db.select({
        id: cartItems.id,
        sessionId: cartItems.sessionId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: products
      }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId));
      
      return res.json(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  // Add item to cart
  app.post(`${apiPrefix}/cart`, async (req, res) => {
    try {
      const cartItemSchema = z.object({
        sessionId: z.string().min(1),
        productId: z.number().positive(),
        quantity: z.number().positive()
      });
      
      const validatedData = cartItemSchema.parse(req.body);
      
      // Check if product exists
      const product = await db.query.products.findFirst({
        where: eq(products.id, validatedData.productId)
      });
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Check if the item is already in the cart
      const existingItem = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.sessionId, validatedData.sessionId),
          eq(cartItems.productId, validatedData.productId)
        )
      });
      
      let result;
      
      if (existingItem) {
        // Update quantity
        result = await db.update(cartItems)
          .set({ quantity: existingItem.quantity + validatedData.quantity })
          .where(eq(cartItems.id, existingItem.id))
          .returning();
      } else {
        // Add new item to cart
        result = await db.insert(cartItems)
          .values(validatedData)
          .returning();
      }
      
      // Get the updated cart with product details
      const updatedCart = await db.select({
        id: cartItems.id,
        sessionId: cartItems.sessionId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: products
      }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, validatedData.sessionId));
      
      return res.status(201).json(updatedCart);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart data", details: fromZodError(error).message });
      }
      console.error("Error adding to cart:", error);
      return res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  // Update cart item quantity
  app.put(`${apiPrefix}/cart/:itemId`, async (req, res) => {
    try {
      const { itemId } = req.params;
      const updateSchema = z.object({
        quantity: z.number().positive()
      });
      
      const validatedData = updateSchema.parse(req.body);
      
      const updated = await db.update(cartItems)
        .set({ quantity: validatedData.quantity })
        .where(eq(cartItems.id, parseInt(itemId)))
        .returning();
      
      if (updated.length === 0) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      // Get the updated cart with product details
      const updatedItem = await db.select({
        id: cartItems.id,
        sessionId: cartItems.sessionId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: products
      }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.id, parseInt(itemId)));
      
      return res.json(updatedItem[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: fromZodError(error).message });
      }
      console.error("Error updating cart item:", error);
      return res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.delete(`${apiPrefix}/cart/:itemId`, async (req, res) => {
    try {
      const { itemId } = req.params;
      
      // Get the session ID first for later response
      const itemToDelete = await db.query.cartItems.findFirst({
        where: eq(cartItems.id, parseInt(itemId))
      });
      
      if (!itemToDelete) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      const sessionId = itemToDelete.sessionId;
      
      await db.delete(cartItems)
        .where(eq(cartItems.id, parseInt(itemId)));
      
      // Get the updated cart with product details
      const updatedCart = await db.select({
        id: cartItems.id,
        sessionId: cartItems.sessionId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: products
      }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId));
      
      return res.json(updatedCart);
    } catch (error) {
      console.error("Error removing cart item:", error);
      return res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });

  // Create a checkout session
  app.post(`${apiPrefix}/checkout`, async (req, res) => {
    try {
      const checkoutSchema = z.object({
        sessionId: z.string().min(1),
        customerInfo: z.object({
          name: z.string().min(2),
          email: z.string().email(),
          address: z.string().min(5),
          city: z.string().min(2),
          state: z.string().min(2),
          zipCode: z.string().min(5),
          phone: z.string().optional()
        }),
        paymentInfo: z.object({
          method: z.enum(["card", "mpesa", "bank", "paypal"]),
          cardDetails: z.object({
            cardNumber: z.string(),
            cardName: z.string(),
            expiry: z.string(),
            cvv: z.string()
          }).optional(),
          mpesaDetails: z.object({
            mpesaNumber: z.string()
          }).optional()
        }).optional(),
        totalAmount: z.number().optional(),
        currency: z.string().optional()
      });
      
      const validatedData = checkoutSchema.parse(req.body);
      
      // Get cart items
      const cartList = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: products
      }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, validatedData.sessionId));
      
      if (cartList.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
      
      // Calculate total
      const total = cartList.reduce((sum, item) => {
        return sum + (parseFloat(item.product.price.toString()) * item.quantity);
      }, 0);
      
      // Create or get customer
      let customer = await db.query.customers.findFirst({
        where: eq(customers.email, validatedData.customerInfo.email)
      });
      
      if (!customer) {
        const [newCustomer] = await db.insert(customers)
          .values(validatedData.customerInfo)
          .returning();
        customer = newCustomer;
      } else {
        // Update customer info
        const [updatedCustomer] = await db.update(customers)
          .set(validatedData.customerInfo)
          .where(eq(customers.id, customer.id))
          .returning();
        customer = updatedCustomer;
      }
      
      // Process payment
      let paymentStatus = "pending";
      let paymentMethod = "unknown";
      let paymentDetails = {};
      
      // If payment info is provided, process it
      if (validatedData.paymentInfo) {
        paymentMethod = validatedData.paymentInfo.method;
        
        // Process different payment methods
        switch (paymentMethod) {
          case "card":
            // Simulate card payment processing
            if (validatedData.paymentInfo.cardDetails) {
              console.log(`Processing card payment: ${validatedData.paymentInfo.cardDetails.cardNumber.slice(-4)}`);
              paymentStatus = "completed";
              paymentDetails = {
                last4: validatedData.paymentInfo.cardDetails.cardNumber.slice(-4),
                expiry: validatedData.paymentInfo.cardDetails.expiry
              };
            }
            break;
          case "mpesa":
            // Simulate M-Pesa payment processing
            if (validatedData.paymentInfo.mpesaDetails) {
              console.log(`Processing M-Pesa payment: ${validatedData.paymentInfo.mpesaDetails.mpesaNumber}`);
              paymentStatus = "completed";
              paymentDetails = {
                phone: validatedData.paymentInfo.mpesaDetails.mpesaNumber
              };
            }
            break;
          case "bank":
            // For bank transfers, we keep the status as pending since it requires manual verification
            console.log("Bank transfer initiated");
            paymentStatus = "completed"; // For demonstration, we'll mark it as completed
            
            // Generate a reference number for the bank transaction
            const referenceNumber = "BT-" + Math.random().toString(36).substring(2, 10).toUpperCase();
            
            paymentDetails = {
              bankName: "Kenya Commercial Bank (KCB)",
              accountNumber: "1234567890",
              accountName: "DroneZone Kenya Ltd",
              branch: "Nairobi Main Branch",
              swiftCode: "KCBLKENX",
              referenceNumber: referenceNumber,
              instructions: "Please use the reference number when making your transfer."
            };
            break;
          case "paypal":
            // Simulate PayPal payment - would connect to PayPal API in production
            console.log("PayPal payment processing");
            paymentStatus = "completed";
            paymentDetails = {
              transaction: "PP-" + Math.random().toString(36).substring(2, 10).toUpperCase()
            };
            break;
          default:
            paymentStatus = "pending";
        }
      }
      
      // Create order with payment information
      const [order] = await db.insert(orders)
        .values({
          customerId: customer.id,
          status: paymentStatus === "completed" ? "processing" : "pending",
          shippingAddress: `${validatedData.customerInfo.address}, ${validatedData.customerInfo.city}, ${validatedData.customerInfo.state} ${validatedData.customerInfo.zipCode}`,
          total: total.toString(),
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus
        })
        .returning();
      
      // Create order items
      for (const item of cartList) {
        await db.insert(orderItems)
          .values({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price.toString()
          });
      }
      
      // Clear cart after successful order
      await db.delete(cartItems)
        .where(eq(cartItems.sessionId, validatedData.sessionId));
      
      // Return order details with payment information
      return res.status(201).json({
        orderId: order.id,
        status: order.status,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentDetails: paymentDetails
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid checkout data", details: fromZodError(error).message });
      }
      console.error("Error processing checkout:", error);
      return res.status(500).json({ error: "Failed to process checkout" });
    }
  });

  // Get order details
  app.get(`${apiPrefix}/orders/:orderId`, async (req, res) => {
    try {
      const { orderId } = req.params;
      
      const order = await db.query.orders.findFirst({
        where: eq(orders.id, parseInt(orderId)),
        with: {
          customer: true,
          items: {
            with: {
              product: true
            }
          }
        }
      });
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      return res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get customer orders
  app.get(`${apiPrefix}/customers/:email/orders`, async (req, res) => {
    try {
      const { email } = req.params;
      
      const customer = await db.query.customers.findFirst({
        where: eq(customers.email, email)
      });
      
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      const customerOrders = await db.query.orders.findMany({
        where: eq(orders.customerId, customer.id),
        orderBy: desc(orders.createdAt),
        with: {
          items: {
            with: {
              product: true
            }
          }
        }
      });
      
      return res.json(customerOrders);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      return res.status(500).json({ error: "Failed to fetch customer orders" });
    }
  });

  // Generate a new cart session ID
  app.post(`${apiPrefix}/cart/session`, (_req, res) => {
    try {
      const sessionId = nanoid(16);
      return res.status(201).json({ sessionId });
    } catch (error) {
      console.error("Error generating session ID:", error);
      return res.status(500).json({ error: "Failed to generate session ID" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

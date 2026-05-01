import { z } from "zod";

const fileLikeSchema = z
  .instanceof(File)
  .or(z.null())
  .optional();

export const customerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal(""))
    .optional(),
  city: z.string().trim().min(2, "City is required."),
  district: z.string().trim().min(2, "District is required."),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits."),
  address: z.string().trim().min(10, "Enter the full delivery address."),
  upiRef: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().trim().min(6, "Password is required."),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  description: z.string().trim().min(20, "Description is required."),
  category: z.enum(["cookies", "gift-boxes", "seasonal"]),
  price: z.coerce.number().min(1, "Price must be greater than zero."),
  originalPrice: z.coerce.number().min(1, "Original price is required."),
  stock: z.coerce.number().min(0, "Stock must be zero or more."),
  weight: z.string().trim().min(2, "Weight or pack info is required."),
  ingredients: z.string().trim().min(2, "Ingredients are required."),
  badge: z.enum(["", "bestseller", "new", "limited"]),
  isActive: z.boolean(),
  imageFile: fileLikeSchema,
});

export const heroSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  subtitle: z.string().trim().min(10, "Subtitle is required."),
  ctaLabel: z.string().trim().min(2, "CTA label is required."),
  ctaLink: z.string().trim().min(1, "CTA link is required."),
  order: z.coerce.number().min(1).max(2),
  isActive: z.boolean(),
  imageFile: fileLikeSchema,
});

export const settingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{10,14}$/, "Enter a valid WhatsApp number."),
  upiId: z.string().trim().min(5, "UPI ID is required."),
  upiName: z.string().trim().min(2, "UPI display name is required."),
  freeShippingMessage: z.string().trim().min(5, "Free shipping message is required."),
  chatbotEnabled: z.boolean(),
  maintenanceMode: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number."),
  message: z.string().trim().min(10, "Please enter a message."),
});

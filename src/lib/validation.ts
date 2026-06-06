import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone is required').max(50),
  message: z.string().min(1, 'Message is required').max(5000),
  property_title: z.string().optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(1, 'Quote is required').max(2000),
  approved: z.boolean().optional(),
});

export const propertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  description: z.string().min(1, 'Description is required').max(10000),
  price: z.string().min(1, 'Price is required').max(100),
  location: z.string().min(1, 'Location is required').max(200),
  category: z.string().min(1, 'Category is required').max(100),
  type: z.string().min(1, 'Type is required').max(100),
  status: z.enum(['For Sale', 'For Rent', 'Sold', 'Rented']).optional().default('For Sale'),
  beds: z.number().int().optional().nullable(),
  baths: z.number().int().optional().nullable(),
  area: z.string().max(50).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  image_metadata: z.any().optional().nullable(),
  video_url: z.string().url().optional().nullable().or(z.literal('')).refine(
    val => !val || /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(val),
    { message: 'Video URL must be from YouTube, YouTube Shorts, or Vimeo' }
  ),
  featured: z.boolean().optional().nullable(),
  make: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  year: z.number().int().optional().nullable(),
  fuel_type: z.string().max(50).optional().nullable(),
  transmission: z.string().max(50).optional().nullable(),
  mileage: z.string().max(50).optional().nullable(),
});

export const agentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  title: z.string().min(1, 'Title is required').max(200),
  photo_url: z.string().url('Photo URL must be a valid URL').optional().nullable(),
  sort_order: z.number().int().optional().nullable(),
});

export const statSchema = z.object({
  label: z.string().min(1, 'Label is required').max(200),
  value: z.string().min(1, 'Value is required').max(100),
  source: z.string().max(50).optional().default('manual'),
  sort_order: z.number().int().optional().nullable(),
});

import { z } from 'zod';

export const listingSchema = z.object({
  title: z.string().min(1, 'schema.title-required').max(255, 'schema.title-long'),
  description: z.string().max(1000, 'schema.desc-long').nullable().optional(),
  contact: z.string().max(255, 'schema.contact-long').nullable().optional(),
  type: z.enum(['BOOK', 'GAME']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable().optional(),
});

export const eventSchema = z.object({
  name: z.string().min(1, { message: 'validation.name' }),
  date: z.string().min(1, { message: 'validation.date' }),
  location: z.string().min(1, { message: 'validation.location' }),
  description: z.string().optional(),
  capacity: z.number().min(1, { message: 'validation.capacity' }),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isExpert: boolean("is_expert").notNull().default(false),
  bio: text("bio"),
  specialties: text("specialties").array(),
  rating: integer("rating"),
  photoUrl: text("photo_url"),
  experience: text("experience"),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  calories: integer("calories"),
  date: timestamp("date").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  expertId: integer("expert_id").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  contactInfo: text("contact_info").notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isExpert: true,
  bio: true,
  specialties: true,
  rating: true,
  photoUrl: true,
  experience: true,
});

export const insertExerciseSchema = createInsertSchema(exercises);
export const insertBookingSchema = createInsertSchema(bookings);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
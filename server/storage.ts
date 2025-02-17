import { users, exercises, bookings, type User, type InsertUser, type Exercise, type Booking } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getExperts(): Promise<User[]>;
  getExercises(userId: number): Promise<Exercise[]>;
  createExercise(exercise: Omit<Exercise, "id">): Promise<Exercise>;
  createBooking(booking: Omit<Booking, "id">): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getExperts(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isExpert, true));
  }

  async getExercises(userId: number): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.userId, userId));
  }

  async createExercise(exercise: Omit<Exercise, "id">): Promise<Exercise> {
    const [newExercise] = await db
      .insert(exercises)
      .values(exercise)
      .returning();
    return newExercise;
  }

  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }
}

export const storage = new DatabaseStorage();
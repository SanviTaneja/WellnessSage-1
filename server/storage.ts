import { Exercise, InsertUser, User, Booking } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: Map<number, User>;
  private exercises: Map<number, Exercise>;
  private bookings: Map<number, Booking>;
  private currentId: { [key: string]: number };

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.users = new Map();
    this.exercises = new Map();
    this.bookings = new Map();
    this.currentId = { users: 1, exercises: 1, bookings: 1 };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getExperts(): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.isExpert);
  }

  async getExercises(userId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(
      (exercise) => exercise.userId === userId,
    );
  }

  async createExercise(exercise: Omit<Exercise, "id">): Promise<Exercise> {
    const id = this.currentId.exercises++;
    const newExercise = { ...exercise, id };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const id = this.currentId.bookings++;
    const newBooking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
}

export const storage = new MemStorage();

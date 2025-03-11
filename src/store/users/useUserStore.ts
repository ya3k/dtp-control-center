import { create } from "zustand";
import type { User } from "@/types/user";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (
    user: Omit<User, "id" | "createAt" | "updatedAt" | "isDelete">
  ) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call delay
      await delay(1000);
      const response = await fetch("https://676bdfa5bc36a202bb860180.mockapi.io/api/v1/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      set({ users: data, loading: false });
      // set({ users: mockUsers, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch users",
        loading: false,
      });
      throw error;
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call delay
      await delay(1000);

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        createAt: new Date().toISOString(),
        isDelete: false,
        ...userData,
      };

      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
      }));
      return newUser;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create user",
        loading: false,
      });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call delay
      await delay(1000);

      const existingUser = get().users.find((user) => user.id === id);
      if (!existingUser) throw new Error("User not found");

      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        loading: false,
      }));
      return updatedUser;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update user",
        loading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call delay
      await delay(1000);

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete user",
        loading: false,
      });
      throw error;
    }
  },
}));

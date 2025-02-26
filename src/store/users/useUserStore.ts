import { create } from "zustand";
import { User } from "@/types/user";

interface UserState {
    users: User[]; // Mảng user
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    loading: true,
    error: null,
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("https://676bdfa5bc36a202bb860180.mockapi.io/api/v1/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            set({ users: data, loading: false });
        } catch (err) {
            set({ error: (err as Error).message, loading: false });
        }
    }
}));

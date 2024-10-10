import { create } from "zustand";

export type UserInfo = {
  userId: string;
  name: string;
  birthDate: Date | null;
  gender: "Male" | "Female" | "Other" | undefined;
  hearingStatus:
    | "Yes, I have hearing loss"
    | "No, I have no hearing loss"
    | undefined;
  address: string;
  contactNumber: string;
  photo: string;
};

type UserStore = {
  user: UserInfo | null;
  getUser: () => UserInfo | null;
  setUser: (user: UserInfo) => void;
  updateUser: (updatedUser: Partial<UserInfo>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,

  getUser: () => get().user,

  setUser: (user) =>
    set(() => ({
      user,
    })),

  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    })),

  clearUser: () =>
    set(() => ({
      user: null,
    })),
}));

type AllUsersStore = {
  users: UserInfo[]; // Array to hold multiple users
  addUser: (user: UserInfo) => void; // Function to add a new user
  updateUser: (id: string, updatedUser: Partial<UserInfo>) => void; // Function to update an existing user
  removeUser: (id: string) => void; // Function to remove a user
  getUserById: (id: string) => UserInfo | undefined; // Function to retrieve a user by their ID
  setUsers: (users: UserInfo[]) => void; // Load an array of users (e.g., from AsyncStorage)
};

export const useAllUsersStore = create<AllUsersStore>((set, get) => ({
  users: [],

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user], // Add new user to the array
    })),

  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map(
        (user) => (user.userId === id ? { ...user, ...updatedUser } : user) // Update only the matching user
      ),
    })),

  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.userId !== id), // Remove user by filtering them out
    })),

  getUserById: (id) => get().users.find((user) => user.userId === id), // Find a user by their ID

  setUsers: (users) =>
    set(() => ({
      users, // Set the entire array of users, useful for loading from persistence (e.g., AsyncStorage)
    })),
}));

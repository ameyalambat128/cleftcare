import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  parentConsent: boolean;
  signedConsent: boolean;
  consentSignedBy: string;
  communityWorkerId: string;
  currentPromptNumber?: number;
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

// Community Worker Store
type CommunityWorkerInfo = {
  communityWorkerId: string;
  emailId: string;
  name: string;
  phone: string;
  region: string;
};

type CommunityWorkerStore = {
  communityWorker: CommunityWorkerInfo | null;
  getCommunityWorker: () => CommunityWorkerInfo | null;
  setCommunityWorker: (communityWorker: CommunityWorkerInfo) => void;
  clearCommunityWorker: () => void;
};

export const useCommunityWorkerStore = create<CommunityWorkerStore>(
  (set, get) => ({
    communityWorker: null,

    getCommunityWorker: () => get().communityWorker,

    setCommunityWorker: (communityWorker) =>
      set(() => ({
        communityWorker,
      })),

    clearCommunityWorker: () =>
      set(() => ({
        communityWorker: null,
      })),
  })
);

// Dev Settings Store
type DevSettingsStore = {
  shortRecordingFlowEnabled: boolean;
  setShortRecordingFlowEnabled: (enabled: boolean) => Promise<void>;
  initializeDevSettings: () => Promise<void>;
};

const DEV_SETTINGS_KEY = "dev-settings-short-recording-flow";

export const useDevSettingsStore = create<DevSettingsStore>((set, get) => ({
  shortRecordingFlowEnabled: false,

  setShortRecordingFlowEnabled: async (enabled: boolean) => {
    set({ shortRecordingFlowEnabled: enabled });
    await AsyncStorage.setItem(DEV_SETTINGS_KEY, JSON.stringify(enabled));
  },

  initializeDevSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(DEV_SETTINGS_KEY);
      if (stored !== null) {
        const enabled = JSON.parse(stored);
        set({ shortRecordingFlowEnabled: enabled });
      }
    } catch (error) {
      console.error("Error loading dev settings:", error);
    }
  },
}));

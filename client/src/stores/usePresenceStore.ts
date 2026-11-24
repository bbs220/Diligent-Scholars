import { create } from "zustand";

// presence state type for realtime activity
type PresenceState = {
  isClientConnected: boolean;
  onlineUserIds: Record<string, boolean>;
  lastActiveMap: Record<string, string>;
  setClientConnected: (connected: boolean) => void;
  setUserOnline: (userId: string, isOnline: boolean, lastActive?: string) => void;
  setBatchUsersPresence: (
    users: Array<{ id: string; online?: boolean; last_active?: string }>,
  ) => void;
  isUserOnline: (userId: string) => boolean;
  getUserLastActive: (userId: string) => string | undefined;
};

// store for managing stream chat online presence
export const usePresenceStore = create<PresenceState>((set, get) => ({
  isClientConnected: false,
  onlineUserIds: {},
  lastActiveMap: {},
  setClientConnected: (connected) => set({ isClientConnected: connected }),
  setUserOnline: (userId, isOnline, lastActive) =>
    set((state) => ({
      onlineUserIds: { ...state.onlineUserIds, [userId]: isOnline },
      lastActiveMap: lastActive
        ? { ...state.lastActiveMap, [userId]: lastActive }
        : state.lastActiveMap,
    })),
  setBatchUsersPresence: (users) =>
    set((state) => {
      const nextOnline = { ...state.onlineUserIds };
      const nextActive = { ...state.lastActiveMap };
      for (const u of users) {
        if (u.id) {
          nextOnline[u.id] = Boolean(u.online);
          if (u.last_active) {
            nextActive[u.id] = u.last_active;
          }
        }
      }
      return { onlineUserIds: nextOnline, lastActiveMap: nextActive };
    }),
  isUserOnline: (userId) => Boolean(get().onlineUserIds[userId]),
  getUserLastActive: (userId) => get().lastActiveMap[userId],
}));

import { create } from "zustand";
import type { Notification } from "@/types/database";

const MAX_NOTIFICATIONS = 100;

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => {
    const capped = notifications.slice(0, MAX_NOTIFICATIONS);
    set({
      notifications: capped,
      unreadCount: capped.filter((n) => !n.read).length,
    });
  },
  addNotification: (notification) =>
    set((s) => {
      if (s.notifications.some((n) => n.id === notification.id)) return s;
      const notifications = [notification, ...s.notifications].slice(
        0,
        MAX_NOTIFICATIONS,
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),
  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));

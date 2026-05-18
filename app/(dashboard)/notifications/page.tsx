"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { getNotifications, markAllNotificationsRead } from "@/features/notifications/services/notificationService";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const notifications = useNotificationStore((s) => s.notifications);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    getNotifications(user.id).then(({ data }) => {
      if (!cancelled && data) setNotifications(data);
    });

    return () => {
      cancelled = true;
    };
  }, [user, setNotifications]);

  return (
    <PageWrapper title="Notifications" description="Stay updated on activity" actions={
      <Button variant="secondary" onClick={async () => { if (user) { await markAllNotificationsRead(user.id); markAllRead(); } }}>Mark all read</Button>
    }>
      <AnimatePresence>
        <div className="space-y-3">
          {notifications.map((n) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Card className={`p-4 ${!n.read ? "border-pink-500/30" : ""}`}>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(n.created_at)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </PageWrapper>
  );
}

import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import socket from "../services/socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const notificationStorageKey = user
    ? `flowsync-notifications-${user._id || user.id}`
    : null;

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!notificationStorageKey) {
      setNotifications([]);
      return;
    }
    try {
      const storedNotifications = localStorage.getItem(notificationStorageKey);
      setNotifications(
        storedNotifications ? JSON.parse(storedNotifications) : [],
      );
    } catch {
      setNotifications([]);
    }
  }, [notificationStorageKey]);

  useEffect(() => {
    if (!notificationStorageKey) {
      return;
    }

    localStorage.setItem(notificationStorageKey, JSON.stringify(notifications));
  }, [notifications, notificationStorageKey]);

  useEffect(() => {
    if (!user) {
      if (socket.connected) {
        socket.disconnect();
      }
      setConnected(false);
      setNotifications([]);
      return;
    }

    const handleConnect = () => {
      setConnected(true);
    };
    const handleDisconnect = () => {
      setConnected(false);
    };
    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);
    };
    const handleNotification = (notification) => {
      const notificationId =
        notification.id ||
        `${notification.type}-${notification.orderId || ""}-${notification.title}-${Date.now()}`;
      const newNotification = {
        ...notification,
        id: notificationId,
        read: false,
        receivedAt: notification.receivedAt || new Date().toISOString(),
      };
      setNotifications((prev) => {
        const exists = prev.some((item) => item.id === newNotification.id);
        if (exists) {
          return prev;
        }
        return [newNotification, ...prev].slice(0, 50);
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("notification", handleNotification);
    socket.connect();
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("notification", handleNotification);
      if (socket.connected) {
        socket.disconnect();
      }
      setConnected(false);
    };
  }, [user]);

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
}

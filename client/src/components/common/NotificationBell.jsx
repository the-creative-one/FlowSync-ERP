import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearNotifications,
  } = useSocket();

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTime = (date) => {
    const notificationDate = new Date(date);

    return notificationDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative
          w-11
          h-11
          rounded-xl
          flex
          items-center
          justify-center
          bg-white
          dark:bg-[#111827]
          border
          border-gray-200
          dark:border-gray-800
          text-[#0C2B4E]
          dark:text-white
          hover:bg-gray-50
          dark:hover:bg-[#1A2438]
          transition
        "
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-5
              h-5
              px-1
              rounded-full
              bg-red-500
              text-white
              text-[10px]
              font-bold
              flex
              items-center
              justify-center
              border-2
              border-white
              dark:border-[#020817]
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            fixed
            md:absolute
            top-18
            md:top-14
            left-4
            right-4
            md:left-auto
            md:right-0
            z-50
            w-auto
            md:w-[360px]
            max-w-none
            md:max-w-[360px]
            bg-white
            dark:bg-[#111827]
            border
            border-gray-200
            dark:border-gray-800
            shadow-2xl
            rounded-2xl
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              py-3
              border-b
              border-gray-200
              dark:border-gray-800
            "
          >
            <div>
              <h3
                className="
                  font-semibold
                  text-[#0C2B4E]
                  dark:text-white
                "
              >
                Notifications
              </h3>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                  mt-0.5
                "
              >
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-[#1D546C]
                  dark:text-blue-300
                  hover:underline
                "
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            ) : (
              notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-red-500
                    dark:text-red-400
                    hover:underline
                  "
                >
                  <Trash2 size={14} />
                  Clear all
                </button>
              )
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div
                className="
                  px-5
                  py-10
                  text-center
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    relative
                    px-4
                    py-4
                    border-b
                    border-gray-100
                    dark:border-gray-800
                    transition
                    ${
                      notification.read
                        ? "bg-transparent"
                        : "bg-blue-50/60 dark:bg-blue-500/5"
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="
                      w-full
                      text-left
                      pr-7
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          mt-1
                          w-2
                          h-2
                          rounded-full
                          shrink-0
                          ${
                            notification.read
                              ? "bg-gray-300 dark:bg-gray-700"
                              : "bg-blue-500"
                          }
                        `}
                      />

                      <div className="min-w-0">
                        <p
                          className="
                            text-sm
                            font-semibold
                            text-[#0C2B4E]
                            dark:text-white
                          "
                        >
                          {notification.title}
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-gray-600
                            dark:text-gray-400
                          "
                        >
                          {notification.message}
                        </p>

                        {notification.receivedAt && (
                          <p
                            className="
                              mt-2
                              text-[11px]
                              text-gray-400
                              dark:text-gray-500
                            "
                          >
                            {formatTime(notification.receivedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeNotification(notification.id)}
                    className="
                      absolute
                      right-3
                      top-3
                      p-1
                      rounded-lg
                      text-gray-400
                      hover:text-gray-700
                      dark:hover:text-gray-200
                      hover:bg-gray-100
                      dark:hover:bg-gray-800
                      transition
                    "
                    aria-label="Remove notification"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

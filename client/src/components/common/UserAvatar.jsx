import { User } from "lucide-react";
import { getAvatarUrl } from "../../utils/avatarUrl";

function UserAvatar({ user, size = "md", className = "" }) {
  const sizes = {
    sm: {
      container: "w-10 h-10",
      icon: 18,
    },

    md: {
      container: "w-12 h-12",
      icon: 22,
    },

    lg: {
      container: "w-24 h-24",
      icon: 42,
    },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div
      className={`
        ${currentSize.container}
        rounded-full
        overflow-hidden
        border
      border-gray-300
      dark:border-gray-800
        flex
        items-center
        justify-center
        text-white
        ${className}
      `}
    >
      {user?.avatar ? (
        <img
          src={getAvatarUrl(user.avatar)}
          alt={user?.name}
          className="w-full h-full object-cover"
        />
      ) : user?.avatarType ? (
        <img
          src={`https://api.dicebear.com/9.x/${user.avatarType}/svg?seed=${user.avatarSeed}`}
          alt={user?.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <User className="text-[#1F2937] dark:text-white" size={currentSize.icon} />
      )}
    </div>
  );
}

export default UserAvatar;

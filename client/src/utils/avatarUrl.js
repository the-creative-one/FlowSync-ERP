const API_URL = import.meta.env.VITE_API_URL;

export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "";

  // Cloudinary URL
  if (avatarPath.startsWith("http")) {
    return avatarPath;
  }

  // Local Upload URL
  return `${API_URL.replace("/api", "")}${avatarPath}`;
};
// const apiUrl = "https://blogs-db-backend.vercel.app";
const apiUrl = "http://localhost:5000";
export const BaseURL = (api) => {
  const url = `${apiUrl}/api/v1/${api}`;
  return url;
};
export const mediaUrl = (file) => {
  return `${apiUrl}/${file}`;
};

// Avatar image, falling back to a generated "initials" avatar when the
// user hasn't uploaded a picture yet.
export const avatarUrl = (avatar, name) => {
  if (avatar) return mediaUrl(avatar);
  const initials = encodeURIComponent(name || "U");
  return `https://ui-avatars.com/api/?name=${initials}&background=random`;
};

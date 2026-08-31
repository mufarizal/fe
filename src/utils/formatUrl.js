export function getStorageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const normalized = path.replace(/^\/?storage\//, "");
  return `${import.meta.env.VITE_API_STORAGE_URL}/${normalized}`;
}

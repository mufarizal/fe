export function getStorageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) {
    try {
      const parsed = new URL(path);
      const normalized = parsed.pathname.replace(/^\/?storage\//, "");
      return `${import.meta.env.VITE_API_STORAGE_URL}/${normalized}`;
    } catch {
      return path;
    }
  }
  const normalized = path.replace(/^\/?storage\//, "");
  return `${import.meta.env.VITE_API_STORAGE_URL}/${normalized}`;
}

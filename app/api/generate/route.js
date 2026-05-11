function findVideoUrl(obj) {
  if (!obj || typeof obj !== "object") return null;

  // cek generated array
  if (Array.isArray(obj.generated) && obj.generated.length > 0) {
    return obj.generated[0];
  }

  const keys = ["video_url", "url", "download_url", "output_url"];

  for (const key of keys) {
    if (typeof obj[key] === "string") {
      return obj[key];
    }
  }

  for (const value of Object.values(obj)) {
    if (typeof value === "string" && value.includes("http")) {
      return value;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findVideoUrl(item);
        if (found) return found;
      }
    }

    if (typeof value === "object") {
      const found = findVideoUrl(value);
      if (found) return found;
    }
  }

  return null;
}

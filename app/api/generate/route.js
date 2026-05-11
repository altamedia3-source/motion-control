export const runtime = "nodejs";

const STATUS_ENDPOINTS = {
  "kling-v2-6-motion-control-std": "/v1/ai/video/kling-v2-6-motion-control-std",
  "kling-v2-6-motion-control-pro": "/v1/ai/video/kling-v2-6-motion-control-pro",
  "kling-v3-motion-control-std": "/v1/ai/video/kling-v3-motion-control-std",
  "kling-v3-motion-control-pro": "/v1/ai/video/kling-v3-motion-control-pro",
};

function findVideoUrl(obj) {
  if (!obj || typeof obj !== "object") return null;

  if (Array.isArray(obj.generated) && obj.generated.length > 0) {
    return obj.generated[0];
  }

  if (obj.data && Array.isArray(obj.data.generated) && obj.data.generated.length > 0) {
    return obj.data.generated[0];
  }

  const keys = ["video_url", "url", "download_url", "output_url"];

  for (const key of keys) {
    if (typeof obj[key] === "string" && obj[key].includes("http")) {
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

    if (value && typeof value === "object") {
      const found = findVideoUrl(value);
      if (found) return found;
    }
  }

  return null;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const apiKey = body.apiKey || process.env.MAGNIFIC_API_KEY;
    const taskId = body.taskId;
    const model = body.model || "kling-v3-motion-control-std";

    if (!apiKey) {
      return Response.json({ error: "API key kosong." }, { status: 400 });
    }

    if (!taskId) {
      return Response.json({ error: "Task ID kosong." }, { status: 400 });
    }

    const endpoint = STATUS_ENDPOINTS[model];

    if (!endpoint) {
      return Response.json({ error: "Model tidak dikenal." }, { status: 400 });
    }

    const res = await fetch(`https://api.magnific.com${endpoint}/${taskId}`, {
      method: "GET",
      headers: {
        "x-freepik-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      return Response.json(
        {
          error: data?.message || data?.error || "Gagal cek status.",
          detail: data,
        },
        { status: res.status }
      );
    }

    const status = (
      data?.data?.status ||
      data?.status ||
      data?.task?.status ||
      data?.state ||
      "unknown"
    ).toString();

    return Response.json({
      ...data,
      normalized: {
        status,
        videoUrl: findVideoUrl(data),
      },
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Status error." },
      { status: 500 }
    );
  }
}

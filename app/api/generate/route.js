export const runtime = "nodejs";

const ENDPOINTS = {
  "kling-v2-6-motion-control-std": "/v1/ai/video/kling-v2-6-motion-control-std",
  "kling-v2-6-motion-control-pro": "/v1/ai/video/kling-v2-6-motion-control-pro",
  "kling-v3-motion-control-std": "/v1/ai/video/kling-v3-motion-control-std",
  "kling-v3-motion-control-pro": "/v1/ai/video/kling-v3-motion-control-pro",
};

function getTaskId(data) {
  return (
    data?.task_id ||
    data?.id ||
    data?.uuid ||
    data?.data?.task_id ||
    data?.data?.id ||
    data?.result?.task_id ||
    data?.task?.id ||
    null
  );
}

export async function POST(req) {
  try {
    const body = await req.json();

    const apiKey = body.apiKey || process.env.MAGNIFIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "API key kosong. Isi di form atau MAGNIFIC_API_KEY di Vercel." },
        { status: 400 }
      );
    }

    if (!body.imageUrl || !body.videoUrl) {
      return Response.json(
        { error: "image_url dan video_url wajib ada. Upload file atau isi URL publik." },
        { status: 400 }
      );
    }

    const model = body.model || "kling-v3-motion-control-std";
    const endpoint = ENDPOINTS[model];

    if (!endpoint) {
      return Response.json({ error: "Model tidak dikenal." }, { status: 400 });
    }

    const payload = {
      image_url: body.imageUrl,
      video_url: body.videoUrl,
      character_orientation: body.orientation || "video",
      cfg_scale: Number(body.cfgScale ?? 0.5),
    };

    if (body.prompt?.trim()) payload.prompt = body.prompt.trim();

    const res = await fetch(`https://api.magnific.com${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-freepik-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        {
          error: data?.message || data?.error || "Generate gagal dari Magnific API.",
          detail: data,
        },
        { status: res.status }
      );
    }

    return Response.json({
      ...data,
      task_id: getTaskId(data),
      model,
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Generate error." },
      { status: 500 }
    );
  }
}

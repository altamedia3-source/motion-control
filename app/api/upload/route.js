export const runtime = "nodejs";

export async function POST(req) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return Response.json(
        {
          error:
            "Upload lokal butuh Cloudinary unsigned upload. Isi CLOUDINARY_CLOUD_NAME dan CLOUDINARY_UPLOAD_PRESET di Vercel, atau pakai URL publik langsung.",
        },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", uploadPreset);

    const resourceType = file.type?.startsWith("video/") ? "video" : "image";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await fetch(url, {
      method: "POST",
      body: uploadForm,
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data?.error?.message || "Upload gagal.", detail: data },
        { status: res.status }
      );
    }

    return Response.json({
      url: data.secure_url,
      public_id: data.public_id,
      resource_type: data.resource_type,
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Upload error." },
      { status: 500 }
    );
  }
}

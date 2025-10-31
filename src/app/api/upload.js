import cloudinary from "@/lib/cloudinary";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { image } = req.body;

      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "my-blog-images", // your chosen folder
      });

      return res.status(200).json({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

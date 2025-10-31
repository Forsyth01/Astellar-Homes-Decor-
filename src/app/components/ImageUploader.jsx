import { useState } from "react";

export default function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setLoading(true);
      const base64 = reader.result;

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();
      setPreview(data.url);
      setLoading(false);
      onUpload(data.url);
    };
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <input type="file" onChange={handleChange} />
      {loading && <p className="text-gray-600">Uploading...</p>}
      {preview && <img src={preview} alt="Uploaded" className="w-48 rounded-lg" />}
    </div>
  );
}

export const uploadToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
};

export async function uploadImageToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/dcg7xwnc6/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "preset"); // Use your unsigned preset
  
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Upload failed");
      return data.secure_url; // This is the image URL you store in your database
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  }
  
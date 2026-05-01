const IMGBB_ENDPOINT =
  "https://api.imgbb.com/1/upload?key=56fdd749790bc201310942f5eac621ca";

export const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(IMGBB_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return {
    url: data.data.url,
    deleteUrl: data.data.delete_url,
    displayUrl: data.data.display_url,
    thumbUrl: data.data.thumb?.url || data.data.url,
  };
};

export const deleteFromImgBB = async (deleteUrl) => {
  if (!deleteUrl) {
    return;
  }

  const response = await fetch(deleteUrl, { method: "GET" });

  if (!response.ok) {
    throw new Error("Unable to delete image from ImgBB.");
  }
};

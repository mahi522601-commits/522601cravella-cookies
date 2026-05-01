import { useState } from "react";
import { deleteFromImgBB, uploadToImgBB } from "@/services/imgbb";

export const useImgBB = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file) => {
    setIsUploading(true);
    setError("");

    try {
      return await uploadToImgBB(file);
    } catch (err) {
      const message = err.message || "Image upload failed.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (deleteUrl) => {
    setError("");
    try {
      await deleteFromImgBB(deleteUrl);
    } catch (err) {
      const message = err.message || "Unable to remove image.";
      setError(message);
      throw new Error(message);
    }
  };

  return {
    uploadFile,
    removeImage,
    isUploading,
    error,
  };
};

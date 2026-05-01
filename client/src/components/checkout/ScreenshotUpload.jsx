import toast from "react-hot-toast";
import ImageUploader from "@/components/ui/ImageUploader";
import { useImgBB } from "@/hooks/useImgBB";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024;

const ScreenshotUpload = ({ value, onChange }) => {
  const { uploadFile, isUploading, error } = useImgBB();

  const handleSelect = async (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Please upload a file smaller than 5MB.");
      return;
    }

    try {
      const uploaded = await uploadFile(file);
      onChange(uploaded);
      toast.success("Payment screenshot uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    }
  };

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-brand-brown">📸 Upload Payment Screenshot</p>
      <ImageUploader
        label="Drag and drop or choose your payment screenshot"
        previewUrl={value?.url}
        onFileSelect={handleSelect}
        onRemove={() => onChange(null)}
        uploading={isUploading}
        error={error}
      />
    </div>
  );
};

export default ScreenshotUpload;

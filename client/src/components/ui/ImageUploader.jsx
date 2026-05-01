import { useRef, useState } from "react";
import { FiImage, FiTrash2, FiUploadCloud } from "react-icons/fi";
import Button from "./Button";
import Spinner from "./Spinner";
import { cn } from "@/utils/cn";

const ImageUploader = ({
  label = "Upload Image",
  previewUrl,
  onFileSelect,
  onRemove,
  error,
  uploading = false,
  accept = "image/png,image/jpeg,image/webp",
  helperText = "JPEG, PNG, WEBP up to 5MB",
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-3xl border-2 border-dashed px-4 py-8 text-center transition",
          dragging
            ? "border-brand-brown bg-brand-brown/5"
            : "border-brand-brown/20 bg-brand-light",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <div className="mx-auto h-44 w-full max-w-xs overflow-hidden rounded-3xl border border-brand-brown/10 bg-white">
              <img src={previewUrl} alt="Selected upload preview" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                icon={<FiImage />}
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                icon={<FiTrash2 />}
                onClick={onRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-brown shadow-soft">
              {uploading ? <Spinner /> : <FiUploadCloud className="h-7 w-7" />}
            </div>
            <div>
              <p className="text-base font-bold text-brand-dark">{label}</p>
              <p className="mt-1 text-sm text-brand-brown/70">{helperText}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Choose Image
            </Button>
          </div>
        )}
      </div>
      {error ? <p className="text-sm font-semibold text-brand-error">{error}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
};

export default ImageUploader;

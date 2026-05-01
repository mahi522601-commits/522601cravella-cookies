import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import ImageUploader from "@/components/ui/ImageUploader";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useImgBB } from "@/hooks/useImgBB";
import { deleteHeroSlide, fetchHeroSlides, saveHeroSlide } from "@/services/firestore";
import { deleteFromImgBB } from "@/services/imgbb";
import { heroSchema } from "@/utils/validators";

const heroDefaults = {
  title: "",
  subtitle: "",
  ctaLabel: "",
  ctaLink: "/shop",
  order: 1,
  isActive: true,
  imageFile: null,
};

const AdminHero = () => {
  const [slides, setSlides] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const { uploadFile, isUploading } = useImgBB();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: heroDefaults,
  });

  const loadSlides = async () => {
    const response = await fetchHeroSlides();
    setSlides(response);
  };

  useEffect(() => {
    loadSlides().catch(() => undefined);
  }, []);

  const activeCount = useMemo(
    () => slides.filter((slide) => slide.isActive && slide.id !== activeSlide?.id).length,
    [slides, activeSlide],
  );

  const openCreate = () => {
    setActiveSlide(null);
    setPreviewUrl("");
    reset(heroDefaults);
    setModalOpen(true);
  };

  const openEdit = (slide) => {
    setActiveSlide(slide);
    setPreviewUrl(slide.imageUrl || "");
    reset({
      ...heroDefaults,
      ...slide,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (slide) => {
    if (!window.confirm(`Delete hero slide "${slide.title}"?`)) return;

    try {
      await deleteHeroSlide(slide.id);
      if (slide.imageDeleteUrl) {
        await deleteFromImgBB(slide.imageDeleteUrl).catch(() => undefined);
      }
      toast.success("Hero slide deleted");
      await loadSlides();
    } catch (error) {
      toast.error(error.message || "Unable to delete hero slide");
    }
  };

  const onSubmit = async (values) => {
    if (values.isActive && activeCount >= 2) {
      toast.error("Only 2 active hero slides are allowed.");
      return;
    }

    try {
      let imagePayload = {
        imageUrl: activeSlide?.imageUrl || "",
        imageDeleteUrl: activeSlide?.imageDeleteUrl || "",
      };

      if (values.imageFile) {
        const uploaded = await uploadFile(values.imageFile);
        imagePayload = {
          imageUrl: uploaded.url,
          imageDeleteUrl: uploaded.deleteUrl,
        };
      }

      await saveHeroSlide(
        {
          title: values.title,
          subtitle: values.subtitle,
          ctaLabel: values.ctaLabel,
          ctaLink: values.ctaLink,
          order: Number(values.order),
          isActive: values.isActive,
          ...imagePayload,
        },
        activeSlide?.id || null,
      );

      if (values.imageFile && activeSlide?.imageDeleteUrl) {
        await deleteFromImgBB(activeSlide.imageDeleteUrl).catch(() => undefined);
      }

      toast.success(activeSlide ? "Hero slide updated" : "Hero slide created");
      setModalOpen(false);
      await loadSlides();
    } catch (error) {
      toast.error(error.message || "Unable to save hero slide");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Hero Images | Cravella Cookies</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-end">
          <Button icon={<FiPlus />} onClick={openCreate}>
            Add Hero Slide
          </Button>
        </div>
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-brand-light/70 text-brand-brown/70">
                <tr>
                  <th className="px-5 py-4 font-bold">Image</th>
                  <th className="px-5 py-4 font-bold">Title</th>
                  <th className="px-5 py-4 font-bold">Subtitle</th>
                  <th className="px-5 py-4 font-bold">CTA</th>
                  <th className="px-5 py-4 font-bold">Order</th>
                  <th className="px-5 py-4 font-bold">Active</th>
                  <th className="px-5 py-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide) => (
                  <tr key={slide.id} className="border-t border-brand-brown/5">
                    <td className="px-5 py-4">
                      <div className="h-16 w-24 overflow-hidden rounded-2xl bg-brand-light">
                        {slide.imageUrl ? <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" /> : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-brand-dark">{slide.title}</td>
                    <td className="px-5 py-4 text-brand-brown/80">{slide.subtitle}</td>
                    <td className="px-5 py-4 text-brand-brown/80">{slide.ctaLabel}</td>
                    <td className="px-5 py-4 text-brand-dark">{slide.order}</td>
                    <td className="px-5 py-4 text-brand-dark">{slide.isActive ? "Yes" : "No"}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(slide)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => handleDelete(slide)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeSlide ? "Edit Hero Slide" : "Add Hero Slide"}
        panelClassName="sm:max-w-4xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Title</span>
            <input className="input-field" {...register("title")} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">CTA Label</span>
            <input className="input-field" {...register("ctaLabel")} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-brown">Subtitle</span>
            <textarea className="textarea-field" {...register("subtitle")} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">CTA Link</span>
            <input className="input-field" {...register("ctaLink")} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Display Order</span>
            <select className="input-field" {...register("order")}>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-[1.5rem] bg-brand-light px-4 py-4 lg:col-span-2">
            <input type="checkbox" {...register("isActive")} />
            <span className="font-semibold text-brand-dark">Active slide</span>
          </label>
          <div className="lg:col-span-2">
            <ImageUploader
              label="Upload Hero Image"
              previewUrl={previewUrl}
              uploading={isUploading}
              onRemove={() => {
                setPreviewUrl("");
                setValue("imageFile", null);
              }}
              onFileSelect={(file) => {
                setPreviewUrl(URL.createObjectURL(file));
                setValue("imageFile", file, { shouldValidate: true });
              }}
            />
          </div>
          <div className="flex justify-end gap-3 lg:col-span-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Hero Slide
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminHero;

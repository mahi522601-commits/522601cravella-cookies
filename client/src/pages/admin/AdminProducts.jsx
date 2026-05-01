import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiSearch, FiToggleLeft, FiToggleRight, FiTrash2 } from "react-icons/fi";
import ImageUploader from "@/components/ui/ImageUploader";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useImgBB } from "@/hooks/useImgBB";
import { deleteProduct, listenToProducts, saveProduct } from "@/services/firestore";
import { deleteFromImgBB } from "@/services/imgbb";
import { formatCurrency } from "@/utils/formatCurrency";
import { productSchema } from "@/utils/validators";

const emptyValues = {
  name: "",
  description: "",
  category: "cookies",
  price: 0,
  originalPrice: 0,
  stock: 0,
  weight: "",
  ingredients: "",
  badge: "",
  isActive: true,
  imageFile: null,
};

const AdminProducts = () => {
  const { uploadFile, isUploading } = useImgBB();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    const unsubscribe = listenToProducts((response) => {
      setProducts(response);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((item) => {
        const term = search.trim().toLowerCase();
        const matchesSearch = term ? item.name.toLowerCase().includes(term) : true;
        const matchesCategory = category === "all" ? true : item.category === category;
        return matchesSearch && matchesCategory;
      }),
    [products, search, category],
  );

  const openCreate = () => {
    setActiveProduct(null);
    setPreviewUrl("");
    reset(emptyValues);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setActiveProduct(product);
    setPreviewUrl(product.imageUrl || "");
    reset({
      ...emptyValues,
      ...product,
      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(", ") : "",
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    try {
      await deleteProduct(product.id);
      if (product.imageDeleteUrl) {
        await deleteFromImgBB(product.imageDeleteUrl).catch(() => undefined);
      }
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.message || "Unable to delete product");
    }
  };

  const handleBulkDelete = async () => {
    const targets = products.filter((item) => selectedIds.includes(item.id));
    if (!targets.length || !window.confirm(`Delete ${targets.length} selected products?`)) return;

    try {
      await Promise.all(
        targets.map(async (product) => {
          await deleteProduct(product.id);
          if (product.imageDeleteUrl) {
            await deleteFromImgBB(product.imageDeleteUrl).catch(() => undefined);
          }
        }),
      );
      setSelectedIds([]);
      toast.success("Selected products deleted");
    } catch (error) {
      toast.error(error.message || "Bulk delete failed");
    }
  };

  const onSubmit = async (values) => {
    try {
      let imagePayload = {
        imageUrl: activeProduct?.imageUrl || "",
        imageDeleteUrl: activeProduct?.imageDeleteUrl || "",
      };

      if (values.imageFile) {
        const uploaded = await uploadFile(values.imageFile);
        imagePayload = {
          imageUrl: uploaded.url,
          imageDeleteUrl: uploaded.deleteUrl,
        };
      }

      const payload = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: Number(values.price),
        originalPrice: Number(values.originalPrice),
        stock: Number(values.stock),
        weight: values.weight,
        ingredients: values.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        badge: values.badge,
        isActive: values.isActive,
        ...imagePayload,
      };

      await saveProduct(payload, activeProduct?.id || null);

      if (values.imageFile && activeProduct?.imageDeleteUrl) {
        await deleteFromImgBB(activeProduct.imageDeleteUrl).catch(() => undefined);
      }

      toast.success(activeProduct ? "Product updated" : "Product created");
      setModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Unable to save product");
    }
  };

  const toggleActive = async (product) => {
    try {
      await saveProduct({ isActive: !product.isActive }, product.id);
      toast.success(`Product ${product.isActive ? "hidden" : "activated"}`);
    } catch (error) {
      toast.error(error.message || "Unable to update status");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Products | Cravella Cookies</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-brand-brown/10 bg-white/85 p-5 shadow-soft xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-brown/45" />
              <input
                className="input-field pl-12"
                placeholder="Search products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <select className="input-field sm:max-w-52" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              <option value="cookies">Cookies</option>
              <option value="gift-boxes">Gift Boxes</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedIds.length ? (
              <Button variant="danger" icon={<FiTrash2 />} onClick={handleBulkDelete}>
                Bulk Delete
              </Button>
            ) : null}
            <Button icon={<FiPlus />} onClick={openCreate}>
              Add Product
            </Button>
          </div>
        </div>

        <div className="card-surface overflow-hidden">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <Spinner className="h-8 w-8 text-brand-brown" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-brand-light/70 text-brand-brown/70">
                  <tr>
                    <th className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                        onChange={(event) =>
                          setSelectedIds(event.target.checked ? filteredProducts.map((item) => item.id) : [])
                        }
                      />
                    </th>
                    <th className="px-5 py-4 font-bold">Image</th>
                    <th className="px-5 py-4 font-bold">Name</th>
                    <th className="px-5 py-4 font-bold">Category</th>
                    <th className="px-5 py-4 font-bold">Price</th>
                    <th className="px-5 py-4 font-bold">Stock</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-brand-brown/5">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={(event) =>
                            setSelectedIds((current) =>
                              event.target.checked
                                ? [...current, product.id]
                                : current.filter((id) => id !== product.id),
                            )
                          }
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-brand-light">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-brand-dark">{product.name}</td>
                      <td className="px-5 py-4 capitalize text-brand-brown/80">{product.category}</td>
                      <td className="px-5 py-4 text-brand-dark">{formatCurrency(product.price)}</td>
                      <td className="px-5 py-4 text-brand-dark">{product.stock}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 font-semibold ${
                            product.isActive
                              ? "bg-brand-success/10 text-brand-success"
                              : "bg-brand-error/10 text-brand-error"
                          }`}
                        >
                          {product.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(product)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={product.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                            onClick={() => toggleActive(product)}
                          >
                            Toggle
                          </Button>
                          <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => handleDelete(product)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeProduct ? "Edit Product" : "Add Product"}
        panelClassName="sm:max-w-4xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-brown">Product Name</span>
            <input className="input-field" {...register("name")} />
            {errors.name ? <span className="mt-2 block text-sm font-semibold text-brand-error">{errors.name.message}</span> : null}
          </label>
          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-brown">Description</span>
            <textarea className="textarea-field" {...register("description")} />
            {errors.description ? <span className="mt-2 block text-sm font-semibold text-brand-error">{errors.description.message}</span> : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Category</span>
            <select className="input-field" {...register("category")}>
              <option value="cookies">Cookies</option>
              <option value="gift-boxes">Gift Boxes</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Badge</span>
            <select className="input-field" {...register("badge")}>
              <option value="">None</option>
              <option value="bestseller">Bestseller</option>
              <option value="new">New</option>
              <option value="limited">Limited</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Price</span>
            <input type="number" className="input-field" {...register("price")} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Original Price</span>
            <input type="number" className="input-field" {...register("originalPrice")} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Stock Quantity</span>
            <input type="number" className="input-field" {...register("stock")} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-brand-brown">Weight / Pack Info</span>
            <input className="input-field" {...register("weight")} />
          </label>
          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-brown">Ingredients</span>
            <input className="input-field" placeholder="Butter, flour, chocolate chips" {...register("ingredients")} />
          </label>
          <label className="flex items-center gap-3 rounded-[1.5rem] bg-brand-light px-4 py-4 lg:col-span-2">
            <input type="checkbox" {...register("isActive")} />
            <span className="font-semibold text-brand-dark">Active product</span>
          </label>
          <div className="lg:col-span-2">
            <ImageUploader
              label="Upload Product Image"
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
            {errors.imageFile ? (
              <span className="mt-2 block text-sm font-semibold text-brand-error">
                {errors.imageFile.message}
              </span>
            ) : null}
          </div>
          <div className="flex justify-end gap-3 lg:col-span-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminProducts;

"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";

import {
  createMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  updateMenuItem,
} from "@/app/admin/menu/actions";
import type { MenuItem } from "@/lib/types";

type ItemFormState = {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  is_available: boolean;
  extras: { id: string; name: string; price: string; is_available: boolean }[];
};

const emptyFormState: ItemFormState = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "kenkey",
  is_available: true,
  extras: [],
};

function getItemInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatPrice(price: number) {
  return `GH₵ ${Number(price).toFixed(2)}`;
}

function toFormState(item: MenuItem): ItemFormState {
  return {
    name: item.name,
    description: item.description ?? "",
    price: String(Number(item.price)),
    image_url: item.image_url ?? "",
    category: item.category,
    is_available: item.is_available,
    extras: item.extras?.map((e) => ({ ...e, price: String(Number(e.price)) })) ?? [],
  };
}

function fromFormState(form: ItemFormState) {
  return {
    name: form.name,
    description: form.description,
    price: Number(form.price),
    image_url: form.image_url,
    category: form.category,
    is_available: form.is_available,
    extras: form.extras.map((e) => ({ ...e, price: Number(e.price) })),
  };
}

function MenuImage({
  imageUrl,
  name,
  textClassName,
}: {
  imageUrl: string | null;
  name: string;
  textClassName?: string;
}) {
  if (imageUrl) {
    return <img alt={name} className="h-full w-full object-cover" src={imageUrl} />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-950 via-stone-800 to-stone-500">
      <span className={textClassName ?? "font-headline text-4xl font-black text-white"}>
        {getItemInitials(name)}
      </span>
    </div>
  );
}

function MenuItemFormFields({
  form,
  onChange,
  isUploading,
  onUpload,
}: {
  form: ItemFormState;
  onChange: (updates: Partial<ItemFormState>) => void;
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
      <div className="relative">
        <label className="absolute -top-2.5 left-2 bg-surface px-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-secondary">
          Item Name
        </label>
        <input
          className="w-full border-b-2 border-outline-variant bg-transparent px-2 py-3 font-headline text-xl font-bold outline-none transition-colors focus:border-primary md:text-2xl"
          type="text"
          value={form.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="e.g. Heritage Jollof"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <div className="relative">
          <label className="absolute -top-2.5 left-2 bg-surface px-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-secondary">
            Price (GHC)
          </label>
          <input
            className="w-full border-b-2 border-outline-variant bg-transparent px-2 py-3 font-dm-sans text-lg font-bold outline-none transition-colors focus:border-primary md:text-xl"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => onChange({ price: event.target.value })}
            placeholder="85.00"
          />
        </div>

        <div className="relative">
          <label className="absolute -top-2.5 left-2 bg-surface px-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-secondary">
            Category
          </label>
          <input
            className="w-full border-b-2 border-outline-variant bg-transparent px-2 py-3 font-dm-sans text-sm font-bold outline-none transition-colors focus:border-primary md:text-base"
            type="text"
            value={form.category}
            onChange={(event) => onChange({ category: event.target.value })}
            placeholder="kenkey"
          />
        </div>
      </div>

      <div className="relative">
        <label className="absolute -top-2.5 left-2 z-10 bg-surface px-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-secondary">
          Description
        </label>
        <textarea
          className="min-h-[120px] w-full resize-none border border-outline-variant bg-transparent px-4 pb-4 pt-5 font-dm-sans text-sm font-medium outline-none transition-colors focus:border-primary"
          value={form.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="A rich blend of spices and heritage..."
        />
      </div>

      <div className="relative">
        <label className="absolute -top-2.5 left-2 bg-surface px-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-secondary">
          Item Image
        </label>
        <div className="flex flex-col gap-4">
          {form.image_url ? (
            <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-outline-variant/20 bg-surface-container-lowest shadow-sm">
              <img 
                src={form.image_url} 
                alt="Item Preview" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Image+Load+Error';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-dm-sans text-[10px] font-black uppercase tracking-widest text-black hover:bg-stone-100"
                  >
                    <Upload size={14} /> Change
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ image_url: "" })}
                    className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-dm-sans text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-700"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="group flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-outline-variant/40 bg-surface-container-lowest transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container transition-transform group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
                {isUploading ? (
                  <Loader2 size={32} className="animate-spin" />
                ) : (
                  <UploadCloud size={32} />
                )}
              </div>
              <div className="text-center">
                <p className="font-dm-sans text-[10px] font-black uppercase tracking-widest text-on-surface">
                  {isUploading ? "Uploading Item Image..." : "Upload Item Image"}
                </p>
                <p className="mt-1 font-dm-sans text-[9px] text-on-surface-variant/70">
                  Recommended: 800x600px or larger
                </p>
              </div>
            </button>
          )}

          <div className="relative">
            <label className="absolute -top-1.5 left-2 bg-surface px-1.5 font-dm-sans text-[8px] font-bold uppercase tracking-widest text-secondary/60">
              Direct Image URL (Optional)
            </label>
            <input
              className="w-full border-b border-outline-variant/30 bg-transparent px-2 py-2 font-dm-sans text-[10px] outline-none transition-colors focus:border-primary"
              type="url"
              value={form.image_url}
              onChange={(event) => onChange({ image_url: event.target.value })}
              placeholder="Or paste a public link here..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-dashed border-outline-variant bg-surface-container-lowest p-6 md:p-8">
        <div className="flex items-center gap-3">
          <UploadCloud size={24} className="text-on-surface-variant" />
          <div>
            <p className="font-dm-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Image Source
            </p>
            <p className="mt-1 font-dm-sans text-[10px] text-on-surface-variant/70">
              Paste a public image URL. If left empty, the card shows item initials.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
        <div className="mb-4 flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div>
            <h4 className="font-headline text-lg font-bold">Extras & Add-ons <span className="text-xs font-normal text-on-surface-variant/60">(Optional)</span></h4>
            <p className="font-dm-sans text-[10px] text-on-surface-variant">
              Configure optional additions like Extra Meat, Fish, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const newExtras = [
                ...form.extras,
                { id: crypto.randomUUID(), name: "", price: "", is_available: true },
              ];
              onChange({ extras: newExtras });
            }}
            className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 font-dm-sans text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Plus size={12} /> Add
          </button>
        </div>

        <div className="space-y-3">
          {form.extras.map((extra, index) => (
            <div
              key={extra.id}
              className="flex items-center gap-3 rounded-lg border border-outline-variant/20 bg-surface p-3"
            >
              <input
                className="flex-1 bg-transparent font-dm-sans text-sm font-bold outline-none placeholder-stone-400"
                placeholder="Name (e.g. Extra Turkey)"
                value={extra.name}
                onChange={(e) => {
                  const newExtras = [...form.extras];
                  newExtras[index].name = e.target.value;
                  onChange({ extras: newExtras });
                }}
              />
              <input
                className="w-20 border-l border-outline-variant/30 bg-transparent pl-3 font-dm-sans text-sm font-bold outline-none placeholder-stone-400"
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                value={extra.price}
                onChange={(e) => {
                  const newExtras = [...form.extras];
                  newExtras[index].price = e.target.value;
                  onChange({ extras: newExtras });
                }}
              />
              <button
                type="button"
                className={`flex h-6 w-10 items-center rounded-full px-0.5 transition-colors ${
                  extra.is_available ? "bg-primary" : "bg-surface-dim"
                }`}
                onClick={() => {
                  const newExtras = [...form.extras];
                  newExtras[index].is_available = !extra.is_available;
                  onChange({ extras: newExtras });
                }}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    extra.is_available ? "translate-x-4" : ""
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  const newExtras = form.extras.filter((_, i) => i !== index);
                  onChange({ extras: newExtras });
                }}
                className="ml-1 text-on-surface-variant hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {form.extras.length === 0 && (
            <p className="py-2 text-center font-dm-sans text-xs text-on-surface-variant">
              No extras configured for this item.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange({ is_available: !form.is_available })}
          className="flex items-center justify-between border border-outline-variant/30 bg-surface-container-lowest p-4 text-left transition-colors hover:border-outline-variant"
        >
          <div>
            <p className="font-dm-sans text-[10px] font-bold uppercase tracking-widest text-on-surface">
              Available
            </p>
            <p className="mt-1 font-dm-sans text-[9px] uppercase text-on-surface-variant">
              Show on customer menu
            </p>
          </div>
          <div
            className={`flex h-6 w-12 items-center rounded-full px-1 transition-colors ${
              form.is_available ? "bg-primary" : "bg-surface-dim"
            }`}
          >
            <div
              className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                form.is_available ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
        </button>

        <div className="flex items-center justify-between border border-outline-variant/30 bg-surface-container-lowest p-4">
          <div>
            <p className="font-dm-sans text-[10px] font-bold uppercase tracking-widest text-on-surface">
              Preview
            </p>
            <p className="mt-1 font-dm-sans text-[9px] uppercase text-on-surface-variant">
              Initials appear when image is empty
            </p>
          </div>
          <div className="h-12 w-12 overflow-hidden rounded-sm">
            <MenuImage imageUrl={form.image_url || null} name={form.name || "New Item"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function MenuManagerClient({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialItems[0]?.id ?? null,
  );
  const [editorForm, setEditorForm] = useState<ItemFormState>(
    initialItems[0] ? toFormState(initialItems[0]) : emptyFormState,
  );
  const [createForm, setCreateForm] = useState<ItemFormState>(emptyFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  const handleFileUpload = async (file: File, isForCreate: boolean) => {
    setIsUploading(true);
    setError(null);
    try {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Please use an image smaller than 5MB (JPG recommended).`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/menu-images", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        publicUrl?: string;
        error?: string;
      };

      if (!response.ok || !result.publicUrl) {
        throw new Error(result.error || "Failed to upload image.");
      }

      if (isForCreate) {
        setCreateForm(prev => ({ ...prev, image_url: result.publicUrl ?? "" }));
      } else {
        setEditorForm(prev => ({ ...prev, image_url: result.publicUrl ?? "" }));
      }
      setFeedback("Image uploaded and preview updated.");
    } catch (err: unknown) {
      console.error("Upload process failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Check your Supabase bucket settings.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  const onlineCount = items.filter((item) => item.is_available).length;
  const averagePrice = items.length
    ? items.reduce((sum, item) => sum + Number(item.price), 0) / items.length
    : 0;

  const runMutation = (work: () => Promise<void>) => {
    setError(null);
    setFeedback(null);

    startTransition(() => {
      void work().catch((mutationError: unknown) => {
        setError(
          mutationError instanceof Error
            ? mutationError.message
            : "Something went wrong while saving the menu item.",
        );
      });
    });
  };

  const selectItem = (item: MenuItem | null) => {
    setSelectedItemId(item?.id ?? null);
    setEditorForm(item ? toFormState(item) : emptyFormState);
  };

  const replaceItem = (nextItem: MenuItem) => {
    setItems((currentItems) =>
      currentItems.some((item) => item.id === nextItem.id)
        ? currentItems.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [...currentItems, nextItem],
    );
    selectItem(nextItem);
  };

  const handleCreate = () => {
    runMutation(async () => {
      const createdItem = await createMenuItem(fromFormState(createForm));
      replaceItem(createdItem);
      setCreateForm(emptyFormState);
      setIsModalOpen(false);
      setFeedback(`${createdItem.name} is now live in the manager.`);
    });
  };

  const handleUpdate = () => {
    if (!selectedItem) {
      setError("Select a menu item before updating.");
      return;
    }

    runMutation(async () => {
      const updatedItem = await updateMenuItem(
        selectedItem.id,
        fromFormState(editorForm),
      );
      replaceItem(updatedItem);
      setFeedback(`${updatedItem.name} was updated.`);
    });
  };

  const handleDelete = (item: MenuItem) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Menu Item",
      message: `Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: () => {
        runMutation(async () => {
          await deleteMenuItem(item.id);
          const remainingItems = items.filter((entry) => entry.id !== item.id);
          setItems(remainingItems);
          const fallbackItem = remainingItems[0] ?? null;
          selectItem(fallbackItem);
          setFeedback(`${item.name} was removed from the menu.`);
        });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleToggleAvailability = (item: MenuItem) => {
    const performToggle = () => {
      runMutation(async () => {
        const updatedItem = await toggleMenuItemAvailability(item.id, !item.is_available);
        replaceItem(updatedItem);
        setFeedback(
          `${updatedItem.name} is now ${updatedItem.is_available ? "available" : "hidden"} on the menu.`,
        );
      });
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    };

    if (item.is_available) {
      setConfirmDialog({
        isOpen: true,
        title: "Hide Menu Item",
        message: `Are you sure you want to hide "${item.name}"? It will no longer be visible to customers.`,
        type: "warning",
        onConfirm: performToggle,
      });
    } else {
      performToggle();
    }
  };

  return (
    <div className="min-h-screen flex-1 space-y-12 overflow-y-auto bg-surface p-6 font-body text-on-surface md:p-8 lg:p-12">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 font-dm-sans text-[10px] font-bold uppercase tracking-[0.2em] text-secondary md:text-xs">
            Inventory Control
          </p>
          <h2 className="font-headline text-4xl font-black leading-tight tracking-tight text-on-surface md:text-5xl lg:text-6xl">
            Menu Manager
          </h2>
          <p className="mt-3 font-dm-sans text-sm font-medium text-on-surface-variant md:text-lg">
            Every card here is now wired directly to the <code>menu_items</code> table.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 bg-primary px-6 py-4 font-dm-sans text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md transition-all hover:bg-primary-container active:scale-95 md:px-8 md:text-sm rounded-2xl cursor-pointer"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </header>

      {(feedback || error) && (
        <div
          className={`border px-5 py-4 font-dm-sans text-xs font-bold uppercase tracking-[0.15em] ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ?? feedback}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group relative transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer ${
              selectedItemId === item.id
                ? "scale-[1.02] bg-surface-container-lowest shadow-[0_0_0_2px_#9d0518,0_0_20px_rgba(157,5,24,0.15)]"
                : item.is_available
                  ? "border border-outline-variant/20 bg-surface-container-low hover:border-outline-variant/60"
                  : "border border-outline-variant/10 bg-surface-container opacity-80 grayscale"
            }`}
          >
            <button
              onClick={() => selectItem(item)}
              className="block w-full text-left"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#E07A5F]">
                {!item.is_available && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-on-surface/20">
                    <div className="bg-on-surface px-4 py-2 font-dm-sans text-[9px] font-bold uppercase tracking-[0.3em] text-surface shadow-xl md:text-[10px]">
                      Hidden
                    </div>
                  </div>
                )}
                <MenuImage
                  imageUrl={item.image_url}
                  name={item.name}
                  textClassName="font-headline text-6xl font-black text-white"
                />
              </div>

              <div className="p-6">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-headline text-xl font-black text-on-surface md:text-2xl">
                    {item.name}
                  </h3>
                  <span className="whitespace-nowrap font-dm-sans text-sm font-black text-secondary md:text-base">
                    {formatPrice(Number(item.price))}
                  </span>
                </div>
                <p className="mb-6 line-clamp-2 font-medium text-on-surface-variant md:line-clamp-3">
                  {item.description ?? "No description added yet."}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.is_available ? "bg-green-500" : "bg-on-surface-variant"
                      }`}
                    ></span>
                    <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest text-on-surface-variant md:text-[10px]">
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest text-secondary">
                    {item.category}
                  </span>
                </div>
              </div>
            </button>

            <div className="flex gap-1 border-t border-outline-variant/10 px-4 py-3 md:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectItem(item);
                  // Scroll to editor on mobile
                  if (window.innerWidth < 768) {
                    document.getElementById("live-editor")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="flex flex-1 items-center justify-center gap-2 p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
              >
                <Edit2 size={16} />
                <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest">
                  Edit
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAvailability(item);
                }}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface disabled:opacity-50"
              >
                {item.is_available ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest">
                  {item.is_available ? "Hide" : "Show"}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 p-2 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest">
                  Delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t-2 border-outline-variant/15 pt-12 md:mt-16">
        <div className="grid grid-cols-1 items-start gap-8 md:gap-12 lg:grid-cols-2">
          <div id="live-editor" className="border border-outline-variant/30 bg-surface-container-low p-6 md:p-8 rounded-3xl">
            <h4 className="mb-6 flex items-center gap-3 font-headline text-xl font-black md:mb-8 md:text-2xl">
              <Edit2 size={24} className="text-primary" />
              Live Edit Context
            </h4>

            {selectedItem ? (
              <div className="space-y-6 md:space-y-8">
                <MenuItemFormFields
                  form={editorForm}
                  isUploading={isUploading}
                  onUpload={(file) => handleFileUpload(file, false)}
                  onChange={(updates) =>
                    setEditorForm((currentState) => ({ ...currentState, ...updates }))
                  }
                />
                <button
                  onClick={handleUpdate}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 bg-primary py-4 font-dm-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md transition-colors hover:bg-primary-container hover:shadow-lg disabled:opacity-50 md:py-5 md:text-xs rounded-2xl cursor-pointer"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Update Item Details
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-outline-variant/30 bg-surface-container-lowest p-8 text-center">
                <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                  No Selection
                </p>
                <p className="mt-3 text-sm text-on-surface-variant">
                  Create a new item or pick one from the grid to edit it here.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="border border-outline-variant/20 border-l-4 border-l-secondary bg-surface-container p-6 shadow-sm md:p-8 rounded-3xl">
              <h4 className="mb-3 font-headline text-lg font-black md:text-xl">
                Menu Integrity
              </h4>
              <p className="mb-6 font-dm-sans text-xs font-medium leading-relaxed text-on-surface-variant md:text-sm">
                Changes here update the database directly and revalidate both the customer menu and the admin manager.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm md:p-5 rounded-2xl">
                  <p className="mb-1 font-dm-sans text-[9px] font-bold uppercase tracking-widest text-secondary md:mb-2 md:text-[10px]">
                    Items Online
                  </p>
                  <p className="font-headline text-2xl font-black text-on-surface md:text-3xl">
                    {onlineCount}
                  </p>
                </div>
                <div className="flex-1 border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm md:p-5 rounded-2xl">
                  <p className="mb-1 font-dm-sans text-[9px] font-bold uppercase tracking-widest text-secondary md:mb-2 md:text-[10px]">
                    Avg Price
                  </p>
                  <p className="font-headline text-2xl font-black text-on-surface md:text-3xl">
                    {formatPrice(averagePrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-blue-100/50 bg-blue-50/50 p-4 md:p-6">
              <Info className="mt-0.5 shrink-0 text-primary" size={20} />
              <div>
                <p className="mb-1 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-on-surface/80 md:mb-2 md:text-xs">
                  Immediate Sync
                </p>
                <p className="font-dm-sans text-[10px] font-medium leading-relaxed text-on-surface-variant md:text-xs">
                  If an image URL is empty, customers and staff will see the food initials in that image slot automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 md:p-6 ${
          isModalOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
        ></div>

        <div
          className={`relative flex max-h-full w-full max-w-2xl transform flex-col overflow-hidden border border-outline-variant/30 bg-surface shadow-2xl transition-all duration-300 rounded-3xl ${
            isModalOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8">
            <div>
              <p className="mb-1 font-dm-sans text-[9px] font-bold uppercase tracking-[0.2em] text-secondary md:text-[10px]">
                Database Sync
              </p>
              <h3 className="font-headline text-2xl font-black md:text-3xl">
                Create Item
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded-sm bg-surface-container p-2 text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <X size={20} />
            </button>
          </div>

          <div className="hide-scrollbar flex-1 space-y-6 overflow-y-auto p-6 md:space-y-8 md:p-8">
            <MenuItemFormFields
              form={createForm}
              isUploading={isUploading}
              onUpload={(file) => handleFileUpload(file, true)}
              onChange={(updates) =>
                setCreateForm((currentState) => ({ ...currentState, ...updates }))
              }
            />
          </div>

          <div className="grid grid-cols-2 shrink-0 border-t border-outline-variant/20">
            <button
              onClick={() => setIsModalOpen(false)}
              className="border-r border-outline-variant/20 bg-surface py-4 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container-high md:py-6 md:text-xs cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleCreate}
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-primary py-4 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-container disabled:opacity-50 md:py-6 md:text-xs cursor-pointer"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              Publish Item
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface p-6 shadow-2xl md:p-8"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${confirmDialog.type === "danger" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                {confirmDialog.type === "danger" ? <Trash2 size={24} /> : <EyeOff size={24} />}
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface md:text-2xl">
                {confirmDialog.title}
              </h3>
              <p className="mt-3 font-dm-sans text-sm text-on-surface-variant leading-relaxed">
                {confirmDialog.message}
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 rounded-2xl bg-surface-container py-3 font-dm-sans text-xs font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className={`flex-1 rounded-2xl py-3 font-dm-sans text-xs font-bold uppercase tracking-widest text-white transition-colors ${confirmDialog.type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

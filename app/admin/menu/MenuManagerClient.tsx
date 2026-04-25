"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Edit2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
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
};

const emptyFormState: ItemFormState = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "kenkey",
  is_available: true,
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
}: {
  form: ItemFormState;
  onChange: (updates: Partial<ItemFormState>) => void;
}) {
  return (
    <>
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
          Image URL
        </label>
        <input
          className="w-full border-b-2 border-outline-variant bg-transparent px-2 py-3 font-dm-sans text-sm font-bold outline-none transition-colors focus:border-primary md:text-base"
          type="url"
          value={form.image_url}
          onChange={(event) => onChange({ image_url: event.target.value })}
          placeholder="https://..."
        />
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
    const confirmed = window.confirm(
      `Delete "${item.name}" from the menu? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    runMutation(async () => {
      await deleteMenuItem(item.id);
      const remainingItems = items.filter((entry) => entry.id !== item.id);
      setItems(remainingItems);
      const fallbackItem = remainingItems[0] ?? null;
      selectItem(fallbackItem);
      setFeedback(`${item.name} was removed from the menu.`);
    });
  };

  const handleToggleAvailability = (item: MenuItem) => {
    runMutation(async () => {
      const updatedItem = await toggleMenuItemAvailability(item.id, !item.is_available);
      replaceItem(updatedItem);
      setFeedback(
        `${updatedItem.name} is now ${updatedItem.is_available ? "available" : "hidden"} on the menu.`,
      );
    });
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
          className="flex items-center justify-center gap-3 bg-primary px-6 py-4 font-dm-sans text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md transition-all hover:bg-primary-container active:scale-95 md:px-8 md:text-sm"
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
            className={`group relative transition-all duration-300 ${
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
                onClick={() => selectItem(item)}
                className="flex flex-1 items-center justify-center gap-2 p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
              >
                <Edit2 size={16} />
                <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest">
                  Edit
                </span>
              </button>
              <button
                onClick={() => handleToggleAvailability(item)}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface disabled:opacity-50"
              >
                {item.is_available ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest">
                  {item.is_available ? "Hide" : "Show"}
                </span>
              </button>
              <button
                onClick={() => handleDelete(item)}
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
          <div className="border border-outline-variant/30 bg-surface-container-low p-6 md:p-8">
            <h4 className="mb-6 flex items-center gap-3 font-headline text-xl font-black md:mb-8 md:text-2xl">
              <Edit2 size={24} className="text-primary" />
              Live Edit Context
            </h4>

            {selectedItem ? (
              <div className="space-y-6 md:space-y-8">
                <MenuItemFormFields
                  form={editorForm}
                  onChange={(updates) =>
                    setEditorForm((currentState) => ({ ...currentState, ...updates }))
                  }
                />
                <button
                  onClick={handleUpdate}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 bg-primary py-4 font-dm-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md transition-colors hover:bg-primary-container hover:shadow-lg disabled:opacity-50 md:py-5 md:text-xs"
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
            <div className="border border-outline-variant/20 border-l-4 border-l-secondary bg-surface-container p-6 shadow-sm md:p-8">
              <h4 className="mb-3 font-headline text-lg font-black md:text-xl">
                Menu Integrity
              </h4>
              <p className="mb-6 font-dm-sans text-xs font-medium leading-relaxed text-on-surface-variant md:text-sm">
                Changes here update the database directly and revalidate both the customer menu and the admin manager.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm md:p-5">
                  <p className="mb-1 font-dm-sans text-[9px] font-bold uppercase tracking-widest text-secondary md:mb-2 md:text-[10px]">
                    Items Online
                  </p>
                  <p className="font-headline text-2xl font-black text-on-surface md:text-3xl">
                    {onlineCount}
                  </p>
                </div>
                <div className="flex-1 border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm md:p-5">
                  <p className="mb-1 font-dm-sans text-[9px] font-bold uppercase tracking-widest text-secondary md:mb-2 md:text-[10px]">
                    Avg Price
                  </p>
                  <p className="font-headline text-2xl font-black text-on-surface md:text-3xl">
                    {formatPrice(averagePrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-sm border border-blue-100/50 bg-blue-50/50 p-4 md:p-6">
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
          className={`relative flex max-h-full w-full max-w-2xl transform flex-col overflow-hidden border border-outline-variant/30 bg-surface shadow-2xl transition-all duration-300 ${
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
              onChange={(updates) =>
                setCreateForm((currentState) => ({ ...currentState, ...updates }))
              }
            />
          </div>

          <div className="grid grid-cols-2 shrink-0 border-t border-outline-variant/20">
            <button
              onClick={() => setIsModalOpen(false)}
              className="border-r border-outline-variant/20 bg-surface py-4 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container-high md:py-6 md:text-xs"
            >
              Discard
            </button>
            <button
              onClick={handleCreate}
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-primary py-4 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-container disabled:opacity-50 md:py-6 md:text-xs"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              Publish Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

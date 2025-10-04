import { Vendor } from "./types";

type RowItem = { label: string; value: (v: Vendor) => string | null };

export const KEY_INFO_SPEC: Record<Vendor["category"], RowItem[]> = {
  "venues": [
    { label: "Capacity", value: v => v.capacity ? `${v.capacity} guests` : null },
    { label: "Spaces", value: v => {
        const s = [v.indoor ? "Indoor" : null, v.outdoor ? "Outdoor" : null].filter(Boolean);
        return s.length ? s.join(" • ") : null;
      }},
    { label: "Price", value: v =>
        v.priceRange?.from ? `From ${v.priceRange.from.toLocaleString()} MAD` : null },
  ],
  "catering": [
    { label: "Price / person", value: v => v.pricePerPerson ? `${v.pricePerPerson.toLocaleString()} MAD` : null },
    { label: "Cuisine", value: v => v.cuisines?.length ? v.cuisines.join(", ") : null },
    { label: "Min. order", value: v => v.minOrder ? `${v.minOrder} guests` : null },
  ],
  "photo-video": [
    { label: "Packages", value: v => v.packages?.length ? v.packages.join(" • ") : null },
    { label: "Coverage", value: v => v.hoursCoverage ? `${v.hoursCoverage} hrs` : null },
    { label: "Price", value: v => v.priceRange?.from ? `From ${v.priceRange.from.toLocaleString()} MAD` : null },
  ],
  "planning": [
    { label: "Services", value: v => v.services?.length ? v.services.join(", ") : null },
    { label: "Packages", value: v => v.packages?.length ? v.packages.join(" • ") : null },
    { label: "Price", value: v => v.priceRange?.from ? `From ${v.priceRange.from.toLocaleString()} MAD` : null },
  ],
  "beauty": [
    { label: "Services", value: v => v.services?.length ? v.services.join(", ") : null },
    { label: "On-site", value: v => (v.services?.includes("On-site") ? "Available" : null) },
    { label: "Price", value: v => v.priceRange?.from ? `From ${v.priceRange.from.toLocaleString()} MAD` : null },
  ],
  "decor": [
    { label: "Services", value: v => v.services?.length ? v.services.join(", ") : null },
    { label: "Delivery & Setup", value: v => v.deliverySetup ? "Included" : null },
    { label: "Price", value: v => v.priceRange?.from ? `From ${v.priceRange.from.toLocaleString()} MAD` : null },
  ],
  "music": [
    { label: "Ensemble", value: v => v.ensembleSize ?? null },
    { label: "Set Duration", value: v => v.setDuration ?? null },
    { label: "Sound System", value: v => v.soundSystem ? "Provided" : null },
  ],
  "dresses": [
    { label: "Styles", value: v => v.services?.length ? v.services.join(", ") : null },
    { label: "Sizes", value: v => v.sizes?.length ? v.sizes.join(", ") : null },
    { label: "Rental", value: v => typeof v.rental === "boolean" ? (v.rental ? "Available" : "No") : null },
  ],
};

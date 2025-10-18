const chips = [
  { id: "mk", label: "Marrakech" },
  { id: "cb", label: "Casablanca" },
  { id: "rb", label: "Rabat" },
  { id: "tg", label: "Tangier" },
  { id: "p1", label: "Under MAD 5K" },
  { id: "p2", label: "MAD 5K–15K" },
  { id: "p3", label: "MAD 15K–50K" },
  { id: "p4", label: "Over MAD 50K" },
];

export default function QuickChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.id}
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          // add aria-pressed + active class when selected
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

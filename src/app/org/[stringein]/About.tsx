interface AboutTabProps {
  category: string;
  subcategory: string;
  city: string;
  state: string;
  rulingDate: string; // Assuming rulingDate is a string (e.g., "2018-08-01")
}

export default function AboutTab({
  category,
  subcategory,
  city,
  state,
  rulingDate,
}: AboutTabProps) {

  const formatRulingDate = (rulingDate: string) => {
    const date = new Date(rulingDate); // Parse the ruling_date
    return date.toLocaleString("en-US", { month: "long", year: "numeric" }); // Format as "Month YYYY"
  };

  const formattedDate = formatRulingDate(rulingDate);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">About</h2>
      <p>{category}</p>
      <p className="text-sm text-slate-300 mb-2">{subcategory}</p>
      <p className="text-slate-200">
        {city}, {state}
      </p>
      <p className="text-slate-300 text-sm">
        Established <span className="text-slate-100">{formattedDate}</span>
      </p>
    </div>
  );
}

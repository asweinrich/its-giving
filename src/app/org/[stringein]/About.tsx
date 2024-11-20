export default function AboutTab({ category, subcategory, city, state, rulingDate }) {
  
  const formatRulingDate = (rulingDate) => {
    const date = new Date(rulingDate); // Parse the ruling_date
    console.log(rulingDate)
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

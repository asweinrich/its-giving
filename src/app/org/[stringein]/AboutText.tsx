import { useEffect, useState } from "react";

interface AboutTextProps {
  npid: string;
}

const AboutText = ({ npid }: AboutTextProps) => {
  const [aboutText, setAboutText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutText = async () => {
      try {
        const response = await fetch(`/api/nonprofit/about?npid=${npid}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setAboutText(data.about);
      } catch (err) {
        console.error(err);
        setError("Failed to load about text.");
      }
    };

   // fetchAboutText();
  }, [npid]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">About</h3>
      {aboutText ? (
        <p className="text-slate-300">{aboutText}</p>
      ) : (
        <p className="text-slate-300">Loading...</p>
      )}
    </div>
  );
};

export default AboutText;

"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define the shape of financial data
interface FinancialRecord {
  year: number;
  revenue: number;
  expenses: number;
}

interface ImpactChartProps {
  filingsWithData: FinancialRecord[];
}

export default function ImpactChart({ filingsWithData }: ImpactChartProps) {
  // Ensure the data array exists and has valid entries
  const filteredData = filingsWithData.filter(
    (filing: FinancialRecord) => filing.revenue !== null && filing.revenue !== undefined
  );

  if (filteredData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-md text-center">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue Growth</h2>
        <p className="text-slate-400">No financial data available for this nonprofit.</p>
      </div>
    );
  }

  // Extract years, revenue, and expenses for the graph
  const years = filteredData.map((filing: FinancialRecord) => filing.year);
  const revenue = filteredData.map((filing: FinancialRecord) => filing.revenue);
  const expenses = filteredData.map((filing: FinancialRecord) => filing.expenses);

  // Chart.js data and options
  const data = {
    labels: years,
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        borderColor: "rgba(34, 197, 94, 1)", // Tailwind green-500
        backgroundColor: "rgba(34, 197, 94, 1)", // Semi-transparent green
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: "Expenses",
        data: expenses,
        borderColor: "rgba(239, 68, 68, 1)", // Tailwind red-500
        backgroundColor: "rgba(239, 68, 68, 1)", // Semi-transparent red
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "rgb(156, 163, 175)", // Tailwind slate-400
          font: {
            size: 14, // Font size for legend labels
            family: "Inter, sans-serif", // Font family for legend labels
            weight: "normal", // Font weight for legend labels
          },
          boxWidth: 8, // Width of the color box
          boxHeight: 8, // Height of the color box
          usePointStyle: true, // Makes the color boxes circular
          padding: 14, // Padding between legend items
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        yAlign: "center",
        displayColors: false, // Hides the color marker
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const datasetLabel = context.dataset.label || "";
            const value = `$${(context.raw as number).toLocaleString()}`;
            return `${datasetLabel}:\n${value}`;
          },
        },
        backgroundColor: "rgba(15, 23, 42, 0.8)", // Tailwind bg-slate-900 with opacity
        titleColor: "#ffffff",
        titleFont: { family: "Inter, sans-serif", size: 14 },
        bodyColor: "#d1d5db",
        bodyFont: { family: "Inter, sans-serif", size: 12 },
        padding: 14,
        borderColor: "rgba(156, 163, 175, 0.2)",
        borderWidth: 1,
        cornerRadius: 4,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          color: "#9ca3af",
          font: { family: "Inter, sans-serif", size: 14 },
        },
        grid: { display: false },
        ticks: {
          font: { size: 10, family: "Inter, sans-serif" },
          color: "rgb(156, 163, 175)",
        },
        border: {
          display: true,
          color: "rgb(156, 163, 175)",
          width: 2,
        },
      },
      y: {
        title: {
          display: true,
          text: "Dollars ($)",
          color: "#9ca3af",
          font: { family: "Inter, sans-serif", size: 14 },
        },
        ticks: {
          font: { size: 10, family: "Inter, sans-serif" },
          color: "rgb(156, 163, 175)", // Tailwind slate-400 for tick labels
          callback: (tickValue: string | number) => {
            const numericValue = typeof tickValue === "string" ? parseFloat(tickValue) : tickValue; // Convert string to number if needed
            if (numericValue >= 1_000_000) return `${(numericValue / 1_000_000).toFixed(1)}M`;
            if (numericValue >= 1_000) return `${(numericValue / 1_000).toFixed(1)}K`;
            return numericValue.toString(); // Return the value as a string
          },
        },
        min: 0,
        grid: { display: false },
        border: {
          display: true,
          color: "rgb(156, 163, 175)",
          width: 2,
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        backgroundColor: "rgba(34, 197, 94, 1)",
        borderColor: "rgba(156, 163, 175, 1)",
        borderWidth: 5,
        hoverRadius: 7,
      },
    },
  };

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold text-white mb-2">Revenue & Expenses</h2>
      <p className="text-sm text-slate-300 mb-4 max-w-4xl">
        Keeping revenue and expenses balanced is key to impact. Extra revenue helps an organization grow and expand programs. Rising expenses might show growth, but can also indicate the need for additional support to continue making a difference.
      </p>
      <div className="max-w-3xl">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

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
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ImpactChart({ filingsWithData }) {

  // Ensure the data array exists and has valid entries
  const filteredData = filingsWithData.filter(
    (filing) => filing.revenue !== null && filing.revenue !== undefined
  );

  if (filteredData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-md text-center">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue Growth</h2>
        <p className="text-slate-400">No financial data available for this nonprofit.</p>
      </div>
    );
  }

  // Extract years and revenue for the graph
  const years = filteredData.map((filing) => filing.year);
  const revenue = filteredData.map((filing) => filing.revenue);
  const expenses = filteredData.map((filing) => filing.expenses);




  // Chart.js data and options
  const data = {
    labels: years, // X-axis labels
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "rgb(156, 163, 175)", // Font color (Tailwind slate-400)
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
        mode: "index", // Ensures all datasets on the same X-axis point are displayed
        intersect: false, // Activates tooltips when hovering anywhere along the X-axis
        yAlign: "center",
        callbacks: {
          label: (context) => {
            // Customize the label format
            const datasetLabel = context.dataset.label || ""; // Get the dataset label (e.g., "Revenue")
            const value = `$${context.raw.toLocaleString()}`; // Format the value as currency

            return `${datasetLabel}:\n${value}`; // Use "\n" for a new line
          },
        },
        backgroundColor: "rgba(15, 23, 42, 0.8)", // Tailwind bg-slate-900 with opacity
        titleColor: "#ffffff", // Title text color
        titleFont: {
          family: "Inter, sans-serif", // Font family for the title
          size: 14, // Font size for the title
          weight: "normal", // Font weight for the title
          lineHeight: 1.5, // Line height for the title
        },
        titleAlign: "start", // Align title text (start, center, end)
        bodyColor: "#d1d5db", // Body text color (Tailwind slate-300)
        bodyFont: {
          family: "Inter, sans-serif", // Font family for the body
          size: 12, // Font size for the body
          weight: "normal", // Font weight for the body
          lineHeight: 1.6, // Line height for the body
        },
        bodyAlign: "start", // Align body text (start, center, end)
        padding: 14, // Padding inside the tooltip
        borderColor: "rgba(156, 163, 175, 0.2)", // Tailwind slate-400 with opacity
        borderWidth: 1, // Border width
        cornerRadius: 4, // Rounds the tooltip corners
        displayColors: false, // Show dataset color indicators
        boxWidth: 6, // Width of the color box
        boxHeight: 6, // Height of the color box
      },
    },
    interaction: {
      mode: "index", // Aligns tooltips for all datasets at the same X-axis point
      intersect: false, // Triggers tooltips for all datasets, not just the one under the cursor
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          color: "#9ca3af", // Tailwind slate-400
          font: {
            family: "Inter, sans-serif", // Font family for the body
            size: 14,
          },
        },
        grid: {
          display: false, // Disables vertical gridlines
        },
        ticks: {
          font: {
            size: 10, // Smaller font size for tick labels
            family: "Inter, sans-serif", // Font family for the body
          },
          color: "rgb(156, 163, 175)", // Tailwind slate-400 for tick labels
        },
        border: {
          display: true, // Ensure the X-axis line is visible
          color: "rgb(156, 163, 175)", // Tailwind slate-400 for axis line
          width: 2, // Adjust thickness of the axis line
        },
      },
      y: {
        title: {
          display: true,
          text: "Dollars ($)",
          color: "#9ca3af",
          font: {
            family: "Inter, sans-serif", // Font family for the body
            size: 14,
          },
        },
        ticks: {
          font: {
            size: 10, // Smaller font size for tick labels
            family: "Inter, sans-serif", // Font family for the body
          },
          color: "rgb(156, 163, 175)", // Tailwind slate-400 for tick labels
          callback: (value) => {
            if (value >= 1_000_000) {
              return `${(value / 1_000_000).toFixed(1)}M`; // Convert to millions with one decimal
            } else if (value >= 10_000) {
              return `${(value / 1_000).toFixed(0)}K`; // Convert to thousands with one decimal
            } else if (value >= 1_000) {
              return `${(value / 1_000).toFixed(1)}K`; // Convert to thousands with one decimal
            }
            return value; // Show full value if less than 1,000
          },
        },
        min: 0,
        grid: {
          display: false, // Disables horizontal gridlines
        },
        border: {
          display: true, // Ensure the Y-axis line is visible
          color: "rgb(156, 163, 175)", // Tailwind slate-400 for axis line
          width: 2, // Adjust thickness of the axis line
        },
      },
    },
    elements: {
      point: {
        radius: 5, // Size of the markers
        backgroundColor: "rgba(34, 197, 94, 1)", // Tailwind green-500 (solid color)
        borderColor: "rgba(156, 163, 175, 1)", // Same color as the outline
        borderWidth: 5, // Thickness of the outline
        hoverRadius: 7, // Size on hover
      },
    },
  };

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold text-white mb-2">Revenue & Expenses</h2>
      <p className="text-xs text-slate-300 mb-4">
        Keeping revenue and expenses balanced is key to impact. Extra revenue helps an organization grow and expand programs. Rising expenses might show growth but can also indicate the need for additional support to continue making a difference.
      </p>
      <div className="max-w-xl">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}


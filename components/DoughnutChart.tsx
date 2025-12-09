"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Category color mapping for the chart (matching Tailwind colors)
const categoryColors: { [key: string]: string } = {
  "Transfer": "#ec4899",      // pink-500
  "Income": "#10b981",         // green-500 (emerald-500)
  "Food & Drink": "#3b82f6",   // blue-500
  "Transport": "#a855f7",      // purple-500
  "Groceries": "#f97316",      // orange-500
  "Entertainment": "#6366f1",  // indigo-500
  "Shopping": "#f43f5e",       // rose-500
  "Travel": "#10b981",         // green-500 (emerald-500)
  "default": "#eba904",        // yellow (custom)
};

const DoughnutChart = ({ accounts, categories }: DoughnutChartProps) => {
  // If categories are provided, use them; otherwise fall back to accounts
  if (categories && categories.length > 0) {
    const categoryNames = categories.map((c) => c.name);
    const categoryCounts = categories.map((c) => c.count);
    const categoryColorsArray = categoryNames.map((name) => 
      categoryColors[name] || categoryColors.default
    );

    const data = {
      datasets: [
        {
          label: 'Categories',
          data: categoryCounts,
          backgroundColor: categoryColorsArray,
        }
      ],
      labels: categoryNames
    }

    return <Doughnut 
      data={data} 
      options={{
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          }
        }
      }}
    />
  }

  // Fallback to accounts if no categories
  const accountNames = accounts?.map((a) => a.name) || [];
  const balances = accounts?.map((a) => a.currentBalance) || [];

  const data = {
    datasets: [
      {
        label: 'Banks',
        data: balances,
        backgroundColor: ['#eba904', '#2265d8', '#2f91fa']
      }
    ],
    labels: accountNames
  }

  return <Doughnut 
    data={data} 
    options={{
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    }}
  />
}

export default DoughnutChart
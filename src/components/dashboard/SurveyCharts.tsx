"use client";
import { useMemo } from "react";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);


export default function SurveyCharts({ responses, questionLabels }: { responses: any[]; questionLabels: string[] }) {
  // Doughnut chart: distribution for all questions
  const answerCounts: Record<string, number> = {};
  responses.forEach(r => {
    questionLabels.forEach((label, idx) => {
      const answer = r.answers && r.answers[idx];
      if (answer) {
        const key = `${label}: ${answer}`;
        answerCounts[key] = (answerCounts[key] || 0) + 1;
      }
    });
  });
  const total = Object.values(answerCounts).reduce((a, b) => a + b, 0);
  const labels = Object.keys(answerCounts);
  const dataValues = labels.map(label => answerCounts[label]);
  const percentages = dataValues.map(v => total > 0 ? ((v / total) * 100).toFixed(1) + "%" : "0%");
  const backgroundColors = [
    "#a78bfa", "#34d399", "#60a5fa", "#fbbf24", "#f87171", "#f472b6", "#10b981", "#6366f1",
    "#d1d5db", "#fca5a5", "#fcd34d", "#6ee7b7", "#818cf8", "#f9fafb", "#f3f4f6", "#e5e7eb"
  ];
  const data = {
    labels: labels.map((label, i) => `${label} (${percentages[i]})`),
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors.slice(0, labels.length),
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "right" },
      title: { display: true, text: `Répartition des réponses pour toutes les questions` },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const idx = context.dataIndex;
            return `${labels[idx]}: ${dataValues[idx]} (${percentages[idx]})`;
          }
        }
      }
    },
  };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ width: 800, height: 800 }}>
        <Doughnut
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: "right" },
              title: { display: true, text: `Répartition des réponses pour toutes les questions` },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const idx = context.dataIndex;
                    return `${labels[idx]}: ${dataValues[idx]} (${percentages[idx]})`;
                  }
                }
              },
              datalabels: {
                color: '#fff',
                font: { weight: 'bold', size: 13 },
                formatter: (value, context) => {
                  const total = context.chart.data.datasets[0].data.reduce((a: number, b: any) => {
                    const aNum = typeof a === 'number' ? a : 0;
                    const bNum = typeof b === 'number' ? b : 0;
                    return aNum + bNum;
                  }, 0);
                  const pct = total ? ((value / total) * 100).toFixed(1) : '0';
                  return pct + '%';
                },
                display: true,
              },
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}

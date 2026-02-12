import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToPDF(itinerary) {
  const doc = new jsPDF();
  const { trip_overview, daily_itinerary, budget_breakdown } = itinerary;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38); // Rose color
  doc.text(`${trip_overview.destination} - ${trip_overview.total_days} Day Trip`, 20, 20);

  // Trip Overview
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`From: ${trip_overview.starting_city}`, 20, 35);
  doc.text(`Budget: ${trip_overview.total_estimated_budget}`, 20, 42);
  
  // Summary
  doc.setFontSize(10);
  const summaryLines = doc.splitTextToSize(trip_overview.travel_summary, 170);
  doc.text(summaryLines, 20, 52);

  let yPos = 70;

  // Daily Itinerary
  daily_itinerary.forEach((day, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Day header
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text(`Day ${day.day}: ${day.title}`, 20, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${day.date} | ${day.theme}`, 20, yPos);
    yPos += 8;

    // Activities
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    if (day.morning) {
      doc.text(`🌅 Morning: ${day.morning.activity}`, 25, yPos);
      yPos += 5;
      doc.setFontSize(8);
      doc.text(`📍 ${day.morning.location} | ⏱ ${day.morning.duration} | 💰 ${day.morning.estimated_cost}`, 25, yPos);
      yPos += 6;
    }

    if (day.afternoon) {
      doc.setFontSize(10);
      doc.text(`☀️ Afternoon: ${day.afternoon.activity}`, 25, yPos);
      yPos += 5;
      doc.setFontSize(8);
      doc.text(`📍 ${day.afternoon.location} | ⏱ ${day.afternoon.duration} | 💰 ${day.afternoon.estimated_cost}`, 25, yPos);
      yPos += 6;
    }

    if (day.evening) {
      doc.setFontSize(10);
      doc.text(`🌆 Evening: ${day.evening.activity}`, 25, yPos);
      yPos += 5;
      doc.setFontSize(8);
      doc.text(`📍 ${day.evening.location} | ⏱ ${day.evening.duration} | 💰 ${day.evening.estimated_cost}`, 25, yPos);
      yPos += 6;
    }

    // Daily cost
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text(`Day Total: ${day.daily_estimated_cost}`, 25, yPos);
    yPos += 10;
  });

  // Budget Breakdown (new page)
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text('Budget Breakdown', 20, 20);

  const budgetData = [];
  if (budget_breakdown) {
    if (budget_breakdown.accommodation) {
      budgetData.push(['Accommodation', budget_breakdown.accommodation.total, budget_breakdown.accommodation.per_day_avg]);
    }
    if (budget_breakdown.food) {
      budgetData.push(['Food', budget_breakdown.food.total, budget_breakdown.food.per_day_avg]);
    }
    if (budget_breakdown.activities) {
      budgetData.push(['Activities', budget_breakdown.activities.total, budget_breakdown.activities.per_day_avg]);
    }
    if (budget_breakdown.transport) {
      budgetData.push(['Transport', `Intercity: ${budget_breakdown.transport.intercity} | Local: ${budget_breakdown.transport.local}`, '-']);
    }
    budgetData.push(['Total', budget_breakdown.total_estimated, '']);
  }

  doc.autoTable({
    startY: 30,
    head: [['Category', 'Total', 'Per Day Avg']],
    body: budgetData,
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] }
  });

  // Save
  doc.save(`${trip_overview.destination}_Itinerary.pdf`);
}

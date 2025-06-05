import React, { useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TotalVentasPorDia = ({ dias, totales_por_dia }) => {
  const chartRef = useRef(null);

  // Asegurar que los datos sean válidos
  const validData = totales_por_dia.map(value => (value != null ? value : 0));
  const maxValue = Math.max(...validData, 0) * 1.2; // Margen del 20%

  const data = {
    labels: dias,
    datasets: [
      {
        label: 'Ventas (C$)',
        data: validData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Córdobas (C$)',
        },
        suggestedMax: maxValue > 0 ? maxValue : 15000, // Ajuste dinámico
      },
      x: {
        title: {
          display: true,
          text: 'Días',
        },
      },
    },
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text('Reporte de Ventas por Día', 105, 25, null, null, 'center');

      // Add Chart Image
      if (chartRef.current) {
        const canvas = chartRef.current.canvas;
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 50, 190, 100);
      } else {
        console.log('No chart reference available.');
      }

      // Add Table
      const tableData = dias.map((dia, index) => [
        dia || 'N/A',
        validData[index] || '0',
      ]);
      autoTable(doc, {
        head: [['Día', 'Total Ventas (C$)']],
        body: tableData,
        startY: 160,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        margin: { top: 50 },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`VentasPorDia_${fecha}.pdf`);
      console.log('PDF generado y descargado.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  return (
    <Card style={{ height: '100%' }}>
      <Card.Body>
        <Card.Title>Total de Ventas por Día</Card.Title>
        <div style={{ height: '100%', position: 'relative' }}>
          <Bar ref={chartRef} data={data} options={options} />
          <Button variant="primary" onClick={generatePDF} className="mt-3">
          Generar Reporte PDF
        </Button>

        </div>

      </Card.Body>
    </Card>
  );
};

export default TotalVentasPorDia;
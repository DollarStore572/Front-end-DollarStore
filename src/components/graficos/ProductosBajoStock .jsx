import React, { useRef, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProductosBajoStock = ({ etiquetas, ventas_por_mes }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Ensure chart types are registered
    Chart.register();
  }, []);

  // Asegurar que los datos sean válidos y limitar a 5 registros
  const validData = ventas_por_mes.map(value => (value != null ? value : 0)).slice(0, 5);
  const maxValue = Math.max(...validData, 0) * 1.2; // Margen del 20%
  const validEtiquetas = etiquetas.slice(0, 5); // Limitar etiquetas a 5

  console.log('Data for chart:', validData, validEtiquetas); // Debug output

  const data = {
    labels: validEtiquetas,
    datasets: [
      {
        label: 'Stock (Unidades)',
        data: validData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Stronger fill color for bars
        borderColor: 'rgba(255, 99, 132, 1)', // Border for bars
        borderWidth: 1,
        type: 'bar', // Explicitly set as bar
        order: 1, // Ensure bars are drawn first
      },
      {
        label: 'Puntos de Stock',
        data: validData,
        borderColor: 'rgba(54, 162, 235, 1)', // Line color
        backgroundColor: 'rgba(54, 162, 235, 0)', // No fill for line
        pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Point color
        pointRadius: 5, // Size of points
        pointHoverRadius: 7,
        fill: false,
        type: 'line', // Explicitly set as line
        order: 2, // Ensure line is drawn over bars
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
          text: 'Unidades',
        },
        suggestedMax: maxValue > 0 ? maxValue : 100, // Ajuste dinámico
      },
      x: {
        title: {
          display: true,
          text: 'Productos',
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
      doc.text('Reporte de Productos Bajo Stock', 105, 25, null, null, 'center');

      // Add Chart Image
      if (chartRef.current) {
        const canvas = chartRef.current.canvas;
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 50, 190, 100);
      } else {
        console.log('No chart reference available.');
      }

      // Add Table
      const tableData = validEtiquetas.map((etiqueta, index) => [
        etiqueta || 'N/A',
        validData[index] || '0',
      ]);
      autoTable(doc, {
        head: [['Producto', 'Stock (Unidades)']],
        body: tableData,
        startY: 160,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        margin: { top: 50 },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`ProductosBajoStock_${fecha}.pdf`);
      console.log('PDF generado y descargado.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  return (
    <Card style={{ height: '100%' }}>
      <Card.Body>
        <Card.Title>Productos Bajo Stock</Card.Title>
        <div style={{ height: '400px', position: 'relative' }}> {/* Increased height for better visibility */}
          <Bar ref={chartRef} data={data} options={options} />
          <Button variant="danger" onClick={generatePDF} className="mt-3">
            Generar Reporte PDF
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductosBajoStock;
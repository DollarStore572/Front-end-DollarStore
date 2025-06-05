import React, { useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProductosMasVendidosCantidad = ({ etiquetas, cantidades_por_producto }) => {
  const chartRef = useRef(null);

  // Asegurar que los datos sean válidos
  const validData = cantidades_por_producto.map(value => (value != null ? value : 0));
  const maxLabels = 10;
  const sortedData = etiquetas
    .map((label, index) => ({ label, value: validData[index] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, maxLabels);

  const maxValue = Math.max(...validData, 0) * 1.2; // Margen del 20%

  const data = {
    labels: sortedData.map(item => item.label),
    datasets: [
      {
        label: 'Cantidad Vendida (Unidades)',
        data: sortedData.map(item => item.value),
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
          text: 'Unidades Vendidas',
        },
        suggestedMax: maxValue > 0 ? maxValue : 100, // Ajuste dinámico
      },
      x: {
        title: {
          display: true,
          text: 'Producto (Top 10)',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
          padding: 10,
          maxTicksLimit: maxLabels,
        },
      },
    },
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Encabezado
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text('Reporte de Productos Más Vendidos', 105, 25, null, null, 'center');

      // Agregar imagen del gráfico
      if (chartRef.current) {
        const canvas = chartRef.current.canvas;
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 50, 190, 100);
      } else {
        console.log('No chart reference available.');
      }

      // Agregar tabla
      const tableData = sortedData.map(item => [
        item.label || 'N/A',
        item.value || '0',
      ]);
      autoTable(doc, {
        head: [['Producto', 'Cantidad Vendida (Unidades)']],
        body: tableData,
        startY: 160,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        margin: { top: 50 },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`ProductosMasVendidos_${fecha}.pdf`);
      console.log('PDF generado y descargado.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  // Si no hay datos, mostrar un mensaje
  if (!etiquetas.length || !cantidades_por_producto.length) {
    return (
      <Card style={{ height: '100%' }}>
        <Card.Body>
          <Card.Title>Productos Más Vendidos por Cantidad</Card.Title>
          <div>No hay datos disponibles.</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ height: '100%' }}>
      <Card.Body>
        <Card.Title>Productos Más Vendidos por Cantidad</Card.Title>
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

export default ProductosMasVendidosCantidad;
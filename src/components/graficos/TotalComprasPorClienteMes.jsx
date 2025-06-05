import React, { useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TotalComprasPorCliente = ({ etiquetas, totales_por_cliente }) => {
  const chartRef = useRef(null);

  // Generar colores apagados (ni pastel ni vibrantes)
  const backgroundColors = etiquetas.map((_, index) => {
    const colors = [
      'rgba(200, 60, 80, 0.7)',   // Rojo apagado
      'rgba(70, 130, 180, 0.7)',  // Azul acero
      'rgba(60, 150, 60, 0.7)',   // Verde oscuro
      'rgba(130, 90, 170, 0.7)',  // Morado suave
      'rgba(200, 120, 50, 0.7)',  // Naranja apagado
      'rgba(180, 160, 50, 0.7)',  // Amarillo mostaza
      'rgba(160, 160, 160, 0.7)', // Gris medio
      'rgba(190, 70, 60, 0.7)',   // Terracota
      'rgba(100, 120, 140, 0.7)', // Azul grisáceo
      'rgba(80, 160, 140, 0.7)',  // Verde azulado
    ];
    return colors[index % colors.length];
  });

  const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

  // Asegurar que los datos sean válidos
  const validData = totales_por_cliente.map(value => (value != null ? value : 0));

  const data = {
    labels: etiquetas,
    datasets: [
      {
        label: 'Compras (C$)',
        data: validData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12,
          },
          color: '#555',
        },
      },
      title: {
        display: true,
        text: 'Total de Compras por Cliente (Top 10)',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#2c3e50',
      },
    },
  };

  // Si no hay datos, mostrar un mensaje
  if (!etiquetas.length || !totales_por_cliente.length) {
    return (
      <Card style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <Card.Title style={{ textAlign: 'center', color: '#2c3e50' }}>
            Total de Compras por Cliente
          </Card.Title>
          <div>No hay datos disponibles.</div>
        </Card.Body>
      </Card>
    );
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Encabezado
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text('Reporte de Compras por Cliente', 105, 25, null, null, 'center');

      // Agregar imagen del gráfico
      if (chartRef.current) {
        const canvas = chartRef.current.canvas;
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 50, 190, 100);
      } else {
        console.log('No chart reference available.');
      }

      // Agregar tabla
      const tableData = etiquetas.map((etiqueta, index) => [
        etiqueta || 'N/A',
        validData[index] || '0',
      ]);
      autoTable(doc, {
        head: [['Cliente', 'Total Compras (C$)']],
        body: tableData,
        startY: 160,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        margin: { top: 50 },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`ComprasPorCliente_${fecha}.pdf`);
      console.log('PDF generado y descargado.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  return (
    <Card style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', height: '100%' }}>
      <Card.Body>
        <Card.Title style={{ textAlign: 'center', marginBottom: '10px', color: '#2c3e50' }}>
          Total de Compras por Cliente
        </Card.Title>
        <div style={{ width: '100%', height: '300px', position: 'relative' }}>
          <Pie ref={chartRef} data={data} options={options} />
        </div>
        <Button variant="primary" onClick={generatePDF} className="mt-3">
          Generar Reporte PDF
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TotalComprasPorCliente;
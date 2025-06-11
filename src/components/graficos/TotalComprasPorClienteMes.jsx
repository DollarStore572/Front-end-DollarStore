import React, { useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";

const TotalComprasPorClienteMes = ({ etiquetas, cantidades_por_cliente }) => {
  const chartRef = useRef(null);

  // Depuración: Verificar los datos recibidos
  console.log("Etiquetas (clientes):", etiquetas);
  console.log("Cantidades por cliente:", cantidades_por_cliente);

  // Limitar a los 3 primeros registros, ordenados por total_compras
  const maxRegistros = 3;
  const sortedData = etiquetas
    .map((label, index) => ({ label, value: cantidades_por_cliente[index] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, maxRegistros);

  const etiquetasLimitadas = sortedData.map(item => item.label);
  const cantidadesLimitadas = sortedData.map(item => item.value);

  // Asegurar que los datos sean válidos
  const validData = cantidadesLimitadas.map(value => (value != null ? Math.round(Number(value)) : 0));

  // Generar colores para el gráfico de pastel
  const backgroundColors = etiquetasLimitadas.map((_, index) => {
    const colors = [
      "rgba(75, 192, 192, 0.2)", // Celeste
      "rgba(255, 99, 132, 0.2)", // Rosa
      "rgba(54, 162, 235, 0.2)", // Azul
    ];
    return colors[index % colors.length];
  });

  const borderColors = backgroundColors.map(color => color.replace("0.2", "1"));

  const data = {
    labels: etiquetasLimitadas,
    datasets: [
      {
        label: "Total de Compras (C$)",
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
    aspectRatio: 1, // Ensures a 1:1 aspect ratio for a perfect circle
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 3 Clientes por Total de Compras (C$)",
        font: { size: 16, weight: "bold" },
        color: "#2c3e50",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            label += new Intl.NumberFormat("es-NI", {
              style: "currency",
              currency: "NIO",
            }).format(context.raw);
            return label;
          },
        },
      },
    },
  };

  // Si no hay datos válidos, mostrar un mensaje
  if (!etiquetasLimitadas.length || !cantidadesLimitadas.length || validData.every(v => v === 0)) {
    console.log("No se renderiza el gráfico: datos vacíos o todos los valores son 0");
    return (
      <Card style={{ height: "100%" }}>
        <Card.Body>
          <Card.Title>Top 3 Clientes por Total de Compras</Card.Title>
          <div>No hay datos disponibles para el mes seleccionado.</div>
        </Card.Body>
      </Card>
    );
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("Reporte de Compras por Cliente", 105, 25, null, null, "center");

      // Add Chart Image
      if (chartRef.current) {
        const canvas = chartRef.current.canvas;
        const imgData = canvas.toDataURL("image/png");

        // Obtener dimensiones del canvas para mantener la proporción
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const pdfWidth = 190; // Ancho máximo en el PDF (210 mm - márgenes)
        const pdfHeight = (canvasHeight / canvasWidth) * pdfWidth; // Calcular altura proporcional

        // Asegurar que la imagen no sea demasiado alta
        const maxHeight = 100;
        const finalHeight = pdfHeight > maxHeight ? maxHeight : pdfHeight;

        doc.addImage(imgData, "PNG", 10, 50, pdfWidth, finalHeight);
      } else {
        console.log("No chart reference available.");
        doc.text("Gráfico no disponible", 10, 50);
      }

      // Add Table
      const tableData = etiquetasLimitadas.map((etiqueta, index) => [
        etiqueta || "N/A",
        new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(validData[index] || 0),
      ]);

      autoTable(doc, {
        head: [["Cliente", "Total de Compras (C$)"]],
        body: tableData,
        startY: 160, // Aumentar startY para evitar solapamiento con el gráfico
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak", // Permitir salto de línea para nombres largos
        },
        headStyles: {
          fillColor: [0, 51, 102],
          textColor: [255, 255, 255],
        },
        columnStyles: {
          0: { cellWidth: 120 }, // Ancho fijo para la columna "Cliente"
          1: { cellWidth: 60 }, // Ancho fijo para la columna "Total de Compras"
        },
        margin: { top: 50, left: 10, right: 10 },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`ComprasPorClienteMes_${fecha}.pdf`);
      console.log("PDF generado y descargado.");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Error al generar el PDF: " + error.message);
    }
  };

  return (
    <Card style={{ height: "100%" }}>
      <Card.Body>
        <Card.Title>Top 3 Clientes por Total de Compras</Card.Title>
        <div style={{ display: "flex", height: "350px", alignItems: "center" }}>
          <div style={{ flex: 3, height: "300px", width: "300px", position: "relative" }}>
            <Pie ref={chartRef} data={data} options={options} />
          </div>
          <div style={{ flex: 1, paddingLeft: "10px", marginTop: "240px" }}>
            <Button variant="danger" onClick={generatePDF}>
              Generar Reporte PDF
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TotalComprasPorClienteMes;

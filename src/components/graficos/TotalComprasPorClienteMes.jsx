import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const TotalComprasPorClienteMes = ({ etiquetas, totales_por_cliente_mes }) => {
  // Asegurar que los datos sean válidos
  const validData = totales_por_cliente_mes.map(value => (value != null ? value : 0));
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
        label: 'Compras (C$)',
        data: sortedData.map(item => item.value),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
          text: 'Cliente y Mes (Top 10)',
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

  return (
    <Card style={{ height: '100%' }}>
      <Card.Body>
        <Card.Title>Total de Compras por Cliente y Mes</Card.Title>
        <div style={{ height: '100%', position: 'relative' }}>
          <Bar data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default TotalComprasPorClienteMes;

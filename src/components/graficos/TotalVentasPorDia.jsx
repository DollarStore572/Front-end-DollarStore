import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const TotalVentasPorDia = ({ dias, totales_por_dia }) => {
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

  return (
    <Card style={{ height: '100%' }}>
      <Card.Body>
        <Card.Title>Total de Ventas por Día</Card.Title>
        <div style={{ height: '100%', position: 'relative' }}>
          <Bar data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default TotalVentasPorDia;
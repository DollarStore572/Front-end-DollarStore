import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TotalVentasPorDia from '../components/graficos/TotalVentasPorDia'; // Ajusta la ruta si es necesario
import TotalComprasPorClienteMes from '../components/graficos/TotalComprasPorClienteMes'; // Importación existente
import ProductosMasVendidosCantidad from '../components/graficos/ProductosMasVendidosCantidad'; // Importación existente
import VentasProductosPorMes from '../components/graficos/VentasProductosPorMes'; // Nueva importación



const Estadisticas = () => {
  // Estados para TotalVentasPorDia
  const [dias, setDias] = useState([]);
  const [totalesPorDia, setTotalesPorDia] = useState([]);

  // Estados para TotalComprasPorClienteMes
  const [etiquetasClienteMes, setEtiquetasClienteMes] = useState([]);
  const [totalesPorClienteMes, setTotalesPorClienteMes] = useState([]);

  // Estados para ProductosMasVendidosCantidad
  const [etiquetasProductos, setEtiquetasProductos] = useState([]);
  const [cantidadesPorProducto, setCantidadesPorProducto] = useState([]);

  // Estados para VentasProductosPorMes
  const [etiquetasVentasMes, setEtiquetasVentasMes] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);

  //Variable de estado para IA
  const [mostrarChatModal, setMostrarChatModal] = useState(false); // Estado para el modal

  useEffect(() => {
    cargaVentasPorDia();
    cargaComprasPorClienteMes();
    cargaProductosMasVendidosCantidad();
    cargaVentasProductosPorMes();
  }, []);

  const cargaVentasPorDia = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/totalventaspordia');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setDias(data.map(item => item.dia));
      setTotalesPorDia(data.map(item => item.total_ventas));
    } catch (error) {
      console.error('Error al cargar ventas por día:', error);
      alert('Error al cargar ventas por día: ' + error.message);
    }
  };

  const cargaComprasPorClienteMes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/totalcomprasporclientemes');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      // Crear etiquetas combinadas: "Nombre Apellido - Mes Año"
      setEtiquetasClienteMes(
        data.map(item => `${item.nombre} ${item.apellido} - ${item.mes} ${item.año}`)
      );
      setTotalesPorClienteMes(data.map(item => item.total_compras));
    } catch (error) {
      console.error('Error al cargar compras por cliente y mes:', error);
      alert('Error al cargar compras por cliente y mes: ' + error.message);
    }
  };

  const cargaProductosMasVendidosCantidad = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/productosmasvendidoscantidad');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEtiquetasProductos(data.map(item => item.nombre_producto));
      setCantidadesPorProducto(data.map(item => item.cantidad_vendida));
    } catch (error) {
      console.error('Error al cargar productos más vendidos por cantidad:', error);
      alert('Error al cargar productos más vendidos por cantidad: ' + error.message);
    }
  };

  const cargaVentasProductosPorMes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/ventasproductospormes');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEtiquetasVentasMes(data.map(item => item.nombre_producto || item.mes));
      setVentasPorMes(data.map(item => item.ventas || item.total_ventas));
    } catch (error) {
      console.error('Error al cargar ventas de productos por mes:', error);
      alert('Error al cargar ventas de productos por mes: ' + error.message);
    }
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Estadísticas</h4>
      <Button 
            variant="primary" 
            className="mb-4"
            onClick={() => setMostrarChatModal(true)}
          >
            Consultar con IA
          </Button>
      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
          <TotalVentasPorDia dias={dias} totales_por_dia={totalesPorDia} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
          <TotalComprasPorClienteMes
            etiquetas={etiquetasClienteMes}
            totales_por_cliente_mes={totalesPorClienteMes}
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
          <ProductosMasVendidosCantidad
            etiquetas={etiquetasProductos}
            cantidades_por_producto={cantidadesPorProducto}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
          <VentasProductosPorMes
            etiquetas={etiquetasVentasMes}
            ventas_por_mes={ventasPorMes}
          />
        </Col>
      </Row>
     
    </Container>
  );
};

export default Estadisticas;

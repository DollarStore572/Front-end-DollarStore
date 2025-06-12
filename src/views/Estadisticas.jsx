import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TotalVentasPorDia from "../components/graficos/TotalVentasPorDia";
import TotalComprasPorClienteMes from "../components/graficos/TotalComprasPorClienteMes";
import ProductosMasVendidosCantidad from "../components/graficos/ProductosMasVendidosCantidad";
import ProductosBajoStock from "../components/graficos/ProductosBajoStock";
import ChatIA from "../components/chat/ChatIA";

const Estadisticas = () => {
  const [dias, setDias] = useState([]);
  const [totalesPorDia, setTotalesPorDia] = useState([]);
  const [etiquetasClientes, setEtiquetasClientes] = useState([]);
  const [cantidadesPorCliente, setCantidadesPorCliente] = useState([]);
  const [etiquetasProductos, setEtiquetasProductos] = useState([]);
  const [cantidadesPorProducto, setCantidadesPorProducto] = useState([]);
  const [etiquetasProductosBajoStock, setEtiquetasProductosBajoStock] = useState([]);
  const [cantidadesStock, setCantidadesStock] = useState([]);
  const [mostrarChatModal, setMostrarChatModal] = useState(false);

  useEffect(() => {
    cargaVentasPorDia();
    cargaTotalComprasPorClienteMes();
    cargaProductosMasVendidosCantidad();
    cargaProductosBajoStock();
  }, []);

  const cargaProductosBajoStock = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/productosbajostock");
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data); // Log raw API response
      // Use 'stock' instead of 'cantidad'
      setEtiquetasProductosBajoStock(data.map((item) => item.nombre_producto || `Producto ${data.indexOf(item) + 1}`));
      setCantidadesStock(data.map((item) => item.stock || 0)); // Changed from item.cantidad to item.stock
      console.log("State updated:", data.map((item) => item.stock)); // Log state update
    } catch (error) {
      console.error("Error al cargar productos bajo stock:", error);
      alert("Error al cargar productos bajo stock: " + error.message);
    }
  };

  const cargaVentasPorDia = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/totalventaspordia");
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setDias(data.map((item) => item.dia));
      setTotalesPorDia(data.map((item) => item.total_ventas));
    } catch (error) {
      console.error("Error al cargar ventas por día:", error);
      alert("Error al cargar ventas por día: " + error.message);
    }
  };

  const cargaTotalComprasPorClienteMes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/totalcomprasporclientemes");
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const labels = data.map((item) => `${item.nombre} ${item.apellido}`);
        const values = data.map((item) => item.total_compras || 0);
        const maxLabels = 10;
        const sortedData = labels
          .map((label, index) => ({ label, value: values[index] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, maxLabels);
        setEtiquetasClientes(sortedData.map((item) => item.label));
        setCantidadesPorCliente(sortedData.map((item) => item.value));
      } else {
        console.warn("No se recibieron datos de totalcomprasporclientemes");
        setEtiquetasClientes([]);
        setCantidadesPorCliente([]);
      }
    } catch (error) {
      console.error("Error al cargar total de compras por cliente:", error);
      alert("Error al cargar total de compras por cliente: " + error.message);
      setEtiquetasClientes([]);
      setCantidadesPorCliente([]);
    }
  };

  const cargaProductosMasVendidosCantidad = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/productosmasvendidoscantidad");
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEtiquetasProductos(data.map((item) => item.nombre_producto));
      setCantidadesPorProducto(data.map((item) => item.cantidad_vendida));
    } catch (error) {
      console.error("Error al cargar productos más vendidos por cantidad:", error);
      alert("Error al cargar productos más vendidos por cantidad: " + error.message);
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
            etiquetas={etiquetasClientes}
            cantidades_por_cliente={cantidadesPorCliente}
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
          <ProductosBajoStock
            etiquetas={etiquetasProductosBajoStock}
            ventas_por_mes={cantidadesStock}
          />
        </Col>
      </Row>
      <ChatIA mostrarChatModal={mostrarChatModal} setMostrarChatModal={setMostrarChatModal} />
    </Container>
  );
};

export default Estadisticas;
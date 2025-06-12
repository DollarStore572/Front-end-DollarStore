import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Tarjeta from '../components/catalogo/Tarjeta';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const CatalogoProductos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [catalogoFiltrados, setCatalogoFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [tipoProductoSeleccionado, setTipoProductoSeleccionado] = useState('');

  // Lista estática de tipos de producto
  const tiposProducto = [
    { id: '', nombre: 'Todos' },
    { id: 'zapato', nombre: 'Zapatos' },
    { id: 'pantalon', nombre: 'Pantalones' },
    { id: 'camisa', nombre: 'Camisas' },
  ];

  // Obtener productos desde la API
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setCatalogoFiltrados(datos); // Inicializar con todos los productos
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const normalizarTexto = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filtrar productos por texto de búsqueda, tipo de producto y descripción no vacía
  useEffect(() => {
    let filtrados = listaProductos;

    // Filtrar productos con descripción no vacía
    filtrados = filtrados.filter(
      (producto) => producto.descripcion && producto.descripcion.trim() !== ''
    );

    // Filtrar por tipo de producto si no es "Todos los tipos"
    if (tipoProductoSeleccionado !== '') {
      filtrados = filtrados.filter((producto) =>
        normalizarTexto(producto.nombre_producto).includes(normalizarTexto(tipoProductoSeleccionado))
      );
    }

    // Filtrar por texto de búsqueda
    if (textoBusqueda) {
      filtrados = filtrados.filter((producto) =>
        producto.nombre_producto.toLowerCase().includes(textoBusqueda.toLowerCase())
      );
    }

    setCatalogoFiltrados(filtrados);
  }, [textoBusqueda, tipoProductoSeleccionado, listaProductos]);

  // Cargar productos al montar el componente
  useEffect(() => {
    obtenerProductos();
  }, []);

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejarCambioTipoProducto = (e) => {
    setTipoProductoSeleccionado(e.target.value);
  };

  if (cargando) return <div className="text-center mt-5">Cargando...</div>;
  if (errorCarga) return <div className="text-center mt-5 text-danger">Error: {errorCarga}</div>;

  return (
    <Container className="mt-5">
      <br />
      <h4 className="mb-4">Catálogo de Productos</h4>
      <Row className="mb-4 align-items-center">
        <Col lg={6} md={8} sm={12} className="d-flex align-items-center">
          <Form.Control
            type="text"
            value={textoBusqueda}
            onChange={manejarCambioBusqueda}
            placeholder="Buscar por nombre o descripción..."
            className="me-2"
          />
          <Form.Select
            value={tipoProductoSeleccionado}
            onChange={manejarCambioTipoProducto}
            aria-label="Seleccionar tipo de producto"
            className="w-auto"
          >
            {tiposProducto.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {catalogoFiltrados.length > 0 ? (
          catalogoFiltrados.map((producto, indice) => (
            <Tarjeta
              key={producto.id_producto}
              indice={indice}
              nombre_producto={producto.nombre_producto}
              descripcion={producto.descripcion}
              precio_unitario={producto.precio_unitario}
              existencia={producto.existencia}
              id_marca={producto.id_marca}
              id_categoria={producto.id_categoria}
              calificacion={producto.calificacion}
              imagen={producto.imagen}
            />
          ))
        ) : (
          <Col>
            <p className="text-center">No se encontraron productos con descripción.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CatalogoProductos;
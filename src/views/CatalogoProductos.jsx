import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Tarjeta from '../components/catalogo/Tarjeta';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const CatalogoProductos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos); // Inicialmente, todos los productos están visibles
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Manejar cambios en el campo de búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = listaProductos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(texto)) ||
        (producto.id_categoria && producto.id_categoria.toString().includes(texto))
    );
    setProductosFiltrados(filtrados);
  };

  if (cargando) return <div>Cargando...</div>;
  if (errorCarga) return <div>Error: {errorCarga}</div>;

  return (
    <Container className="mt-5">
      <h4>Catálogo de Productos</h4>
      <Row className="mb-3">
        <Col lg={6} md={8} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <Row>
        {productosFiltrados.map((producto, indice) => (
          <Tarjeta
            key={producto.id_producto}
            indice={indice}
            nombre_producto={producto.nombre_producto}
            descripcion_producto={producto.descripcion}
            precio_unitario={producto.precio_unitario}
            stock={producto.existencia}
            id_marca={producto.id_marca}
            id_categoria={producto.id_categoria}
            calificacion={producto.calificacion}
            imagen={producto.imagen}
          />
        ))}
      </Row>
    </Container>
  );
};

export default CatalogoProductos;
import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalDetallesVentas from '../components/detalles_ventas/ModalDetallesVentas';
import ModalEliminacionVentas from '../components/ventas/ModalEliminacionVentas';
import ModalRegistroVentas from '../components/ventas/ModalRegistroVentas';
import ModalActualizacionVentas from '../components/ventas/ModalActualizacionVentas';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: '',
    id_tiempo: '',
    fecha: new Date()
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  // Estados para paginación y búsqueda
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const obtenerVentas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/ventas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las ventas');
      }
      const datos = await respuesta.json();
      setListaVentas(datos);
      setVentasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerVentas();
    obtenerClientes();
    obtenerProductos();
  }, []);

  const obtenerDetalles = async (id_venta) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/detalles_ventas/${id_venta}`);
      if (!respuesta.ok) {
        throw new Error('Error al cargar los detalles de la venta');
      }
      const datos = await respuesta.json();
      setDetallesVenta(datos);
      setCargandoDetalles(false);
      setMostrarModal(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const eliminarVenta = async () => {
    if (!ventaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/ventas/${ventaAEliminar.id_venta}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la venta');
      }

      setMostrarModalEliminacion(false);
      await obtenerVentas();
      establecerPaginaActual(1); // Resetear a la primera página tras eliminar
      setVentaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminacion(true);
  };

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      const datos = await respuesta.json();
      setClientes(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const agregarVenta = async (nuevaVenta, detalles) => {
    if (!nuevaVenta.id_cliente || !detalles.length) {
      setErrorCarga("Por favor, selecciona un cliente y agrega al menos un detalle.");
      return;
    }
  
    try {
      const ventaData = {
        id_cliente: nuevaVenta.id_cliente,
        fecha: nuevaVenta.fecha.toISOString().split('T')[0], // Enviar fecha directamente
        detalles: detalles.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_ventas: d.precio_ventas
        }))
      };
  
      const respuesta = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });
  
      if (!respuesta.ok) throw new Error('Error al registrar la venta');
  
      await obtenerVentas();
      setNuevaVenta({ id_cliente: '', fecha: new Date() });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };
  
  const abrirModalActualizacion = async (venta) => {
    setCargandoDetalles(true);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/detalles_ventas/${venta.id_venta}`);
      if (!respuesta.ok) throw new Error('Error al cargar los detalles de la venta');
      const datos = await respuesta.json();
  
      setDetallesEditados(datos.map(d => ({
        id_producto: d.id_producto,
        nombre_producto: d.nombre_producto,
        cantidad: d.cantidad,
        precio_ventas: d.precio_ventas
      })));
  
      setVentaAEditar({
        id_venta: venta.id_venta,
        id_cliente: venta.id_cliente,
        fecha: new Date(venta.fecha),
        nombre_cliente: venta.nombre_cliente
      });
  
      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };
  
  const actualizarVenta = async (ventaActualizada, detalles) => {
    if (!ventaActualizada.id_cliente || !detalles.length) {
      setErrorCarga("Por favor, selecciona un cliente y agrega al menos un detalle.");
      return;
    }
  
    try {
      const ventaData = {
        id_cliente: ventaActualizada.id_cliente,
        fecha: ventaActualizada.fecha.toISOString().split('T')[0], // Corregido nombre y formato
        detalles: detalles.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_ventas: d.precio_ventas
        }))
      };
  
      const respuesta = await fetch(`http://localhost:3000/api/actualizarventa/${ventaActualizada.id_venta}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });
  
      if (!respuesta.ok) throw new Error('Error al actualizar la venta');
  
      await obtenerVentas();
      setMostrarModalActualizacion(false);
      setVentaAEditar(null);
      setDetallesEditados([]);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };
  

  // Lógica de búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaVentas.filter(
      (venta) => venta.nombre_cliente.toLowerCase().includes(texto)
    );
    setVentasFiltradas(filtrados);
  };

  // Lógica de paginación
  const ventasPaginadas = Array.isArray(ventasFiltradas)
    ? ventasFiltradas.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  return (
    <Container className="mt-5">
      <h4>Ventas con Detalles</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: "100%" }}>
            Nueva Venta
          </Button>
        </Col>
        <Col lg={6} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br />

      <TablaVentas
        ventas={ventasPaginadas}
        cargando={cargando}
        error={errorCarga}
        totalElementos={ventasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        obtenerDetalles={obtenerDetalles}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalActualizacion={abrirModalActualizacion}
      />

      <ModalDetallesVentas
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        detalles={detallesVenta}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />

      <ModalEliminacionVentas
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarVenta={eliminarVenta}
      />

      <ModalRegistroVentas
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta}
        setNuevaVenta={setNuevaVenta}
        detallesVenta={detallesNuevos}
        setDetallesVenta={setDetallesNuevos}
        agregarVenta={agregarVenta}
        errorCarga={errorCarga}
        clientes={clientes}
        productos={productos}
      />

      <ModalActualizacionVentas
        mostrarModal={mostrarModalActualizacion}
        setMostrarModal={setMostrarModalActualizacion}
        venta={ventaAEditar}
        detallesVenta={detallesEditados}
        setDetallesVenta={setDetallesEditados}
        actualizarVenta={actualizarVenta}
        errorCarga={errorCarga}
        clientes={clientes}
        productos={productos}
      />
    </Container>
  );
};

export default Ventas;
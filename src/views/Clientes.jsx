import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/clientes/TablaClientes';
import ModalRegistroClientes from '../components/clientes/ModalRegistroClientes';
import ModalEliminacionClientes from '../components/clientes/ModalEliminacionClientes';
import ModalEdicionClientes from '../components/clientes/ModalEdicionClientes';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    cedula: ''
  });

  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const [clienteEditado, setClienteEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      setListaClientes(datos);
      setClientesFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.telefono || !nuevoCliente.cedula) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el cliente');
      }

      await obtenerClientes();
      setNuevoCliente({ nombre: '', apellido: '', telefono: '', cedula: '' });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaClientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(texto) ||
        cliente.apellido.toLowerCase().includes(texto) ||
        cliente.telefono.includes(texto) ||
        cliente.cedula.includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  const clientesPaginados = Array.isArray(clientesFiltrados)
    ? clientesFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcliente/${clienteAEliminar.id_cliente}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el cliente');
      }

      await obtenerClientes();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setClienteAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarCliente = async () => {
    if (!clienteEditado?.nombre || !clienteEditado?.apellido || !clienteEditado?.telefono || !clienteEditado?.cedula) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcliente/${clienteEditado.id_cliente}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: clienteEditado.nombre,
          apellido: clienteEditado.apellido,
          telefono: clienteEditado.telefono,
          cedula: clienteEditado.cedula,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el cliente');
      }

      await obtenerClientes();
      setMostrarModalEdicion(false);
      setClienteEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditado(cliente);
    setMostrarModalEdicion(true);
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Clientes</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}> 
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Cliente
          </Button>
        </Col>
        <Col lg={6} md={8} sm={8} xs={7}> 
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br/>

      <TablaClientes 
        clientes={clientesPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={listaClientes.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
      />

      <ModalRegistroClientes
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejarCambioInput={manejarCambioInput}
        agregarCliente={agregarCliente}
        errorCarga={errorCarga}
      />

      <ModalEliminacionClientes
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
      />

      <ModalEdicionClientes
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditado={clienteEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarCliente={actualizarCliente}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Clientes;
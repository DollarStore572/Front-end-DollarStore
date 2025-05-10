import React, { useState, useEffect } from 'react';
import TablaMarcas from '../components/marcas/TablaMarcas';
import ModalRegistroMarcas from '../components/marcas/ModalRegistroMarcas';
import ModalEliminacionMarcas from '../components/marcas/ModalEliminacionMarcas';
import ModalEdicionMarcas from '../components/marcas/ModalEdicionMarcas';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const Marcas = () => {
  const [listaMarcas, setListaMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState({
    nombre_marca: ''
  });

  const [marcasFiltradas, setMarcasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [marcaAEliminar, setMarcaAEliminar] = useState(null);

  const [marcaEditada, setMarcaEditada] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      setListaMarcas(datos);
      setMarcasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMarcas();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaMarca(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarMarca = async () => {
    if (!nuevaMarca.nombre_marca) {
      setErrorCarga("Por favor, completa el campo antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarmarca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaMarca),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar la marca');
      }

      await obtenerMarcas();
      setNuevaMarca({ nombre_marca: '' });
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

    const filtrados = listaMarcas.filter(
      (marca) => marca.nombre_marca.toLowerCase().includes(texto)
    );
    setMarcasFiltradas(filtrados);
  };

  const marcasPaginadas = Array.isArray(marcasFiltradas)
    ? marcasFiltradas.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  const eliminarMarca = async () => {
    if (!marcaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarmarca/${marcaAEliminar.id_marca}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la marca');
      }

      await obtenerMarcas();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setMarcaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (marca) => {
    setMarcaAEliminar(marca);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setMarcaEditada(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarMarca = async () => {
    if (!marcaEditada?.nombre_marca) {
      setErrorCarga("Por favor, completa el campo antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarmarca/${marcaEditada.id_marca}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_marca: marcaEditada.nombre_marca }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar la marca');
      }

      await obtenerMarcas();
      setMostrarModalEdicion(false);
      setMarcaEditada(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (marca) => {
    setMarcaEditada(marca);
    setMostrarModalEdicion(true);
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Marcas</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}> 
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nueva Marca
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

      <TablaMarcas 
        marcas={marcasPaginadas}
        cargando={cargando}
        error={errorCarga}
        totalElementos={listaMarcas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
      />

      <ModalRegistroMarcas
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaMarca={nuevaMarca}
        manejarCambioInput={manejarCambioInput}
        agregarMarca={agregarMarca}
        errorCarga={errorCarga}
      />

      <ModalEliminacionMarcas
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarMarca={eliminarMarca}
      />

      <ModalEdicionMarcas
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        marcaEditada={marcaEditada}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarMarca={actualizarMarca}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Marcas;
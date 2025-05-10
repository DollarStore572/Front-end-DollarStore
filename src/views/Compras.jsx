import React, { useState, useEffect } from "react";
import TablaCompras from "../components/compras/TablaCompras";
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalDetallesCompras from "../components/detalles_compras/ModalDetallesCompras";
import ModalEliminacionCompras from "../components/compras/ModalEliminacionCompras";
import ModalRegistroCompras from "../components/compras/ModalRegistroCompras";
import ModalActualizacionCompras from "../components/compras/ModalActualizacionCompras";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Compras = () => {
  const [listaCompras, setListaCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesCompra, setDetallesCompra] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    id_proveedor: "",
    fecha: new Date(),
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [compraAEditar, setCompraAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  // Estados para paginación y búsqueda
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const obtenerCompras = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/compras");
      if (!respuesta.ok) {
        throw new Error("Error al cargar las compras");
      }
      const datos = await respuesta.json();
      setListaCompras(datos);
      setComprasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCompras();
    obtenerProveedores();
    obtenerProductos();
  }, []);

  const obtenerDetalles = async (id_compra) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch("http://localhost:3000/api/compras/detalles");
      if (!respuesta.ok) {
        throw new Error("Error al cargar los detalles de la compra");
      }
      const datos = await respuesta.json();
      setDetallesCompra(datos.filter(d => d.id_compra === id_compra));
      setCargandoDetalles(false);
      setMostrarModal(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const eliminarCompra = async () => {
    if (!compraAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcompra/${compraAEliminar.id_compra}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("Error al eliminar la compra");
      }

      setMostrarModalEliminacion(false);
      await obtenerCompras();
      establecerPaginaActual(1); // Resetear a la primera página tras eliminar
      setCompraAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminacion(true);
  };

  const obtenerProveedores = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/proveedores");
      if (!respuesta.ok) throw new Error("Error al cargar los proveedores");
      const datos = await respuesta.json();
      setProveedores(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      if (!respuesta.ok) throw new Error("Error al cargar los productos");
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const agregarCompra = async (nuevaCompra, detalles) => {
    if (!nuevaCompra.id_proveedor || !detalles.length) {
      setErrorCarga("Por favor, selecciona un proveedor y agrega al menos un detalle.");
      return;
    }

    try {
      const compraData = {
        id_proveedor: nuevaCompra.id_proveedor,
        fecha: nuevaCompra.fecha.toISOString().split("T")[0],
        detalles: detalles.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_compra: d.precio_compras,
        })),
      };

      const respuesta = await fetch("http://localhost:3000/api/registrarcompra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compraData),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || "Error al registrar la compra");
      }

      await obtenerCompras();
      setNuevaCompra({ id_proveedor: "", fecha: new Date() });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalActualizacion = async (compra) => {
    setCargandoDetalles(true);
    try {
      const [compraRes, detallesRes] = await Promise.all([
        fetch(`http://localhost:3000/api/obtenercompraporid/${compra.id_compra}`),
        fetch("http://localhost:3000/api/compras/detalles"),
      ]);

      if (!compraRes.ok || !detallesRes.ok) {
        throw new Error("Error al cargar los datos de la compra");
      }

      const compraData = await compraRes.json();
      const detallesData = await detallesRes.json();

      setDetallesEditados(
        detallesData
          .filter(d => d.id_compra === compra.id_compra)
          .map(d => ({
            id_producto: d.id_producto,
            nombre_producto: d.nombre_producto,
            cantidad: d.cantidad,
            precio_compras: d.precio_compras,
          }))
      );

      setCompraAEditar({
        id_compra: compra.id_compra,
        id_proveedor: compraData.id_proveedor,
        fecha: new Date(compraData.fecha),
        nombre_compania: compra.nombre_compania,
      });

      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const actualizarCompra = async (compraActualizada, detalles) => {
    if (!compraActualizada.id_proveedor || !detalles.length) {
      setErrorCarga("Por favor, selecciona un proveedor y agrega al menos un detalle.");
      return;
    }

    try {
      const compraData = {
        id_proveedor: compraActualizada.id_proveedor,
        fecha: compraActualizada.fecha.toISOString().split("T")[0],
        detalles: detalles.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_compra: d.precio_compras,
        })),
      };

      const respuesta = await fetch(`http://localhost:3000/api/actualizarcompra/${compraActualizada.id_compra}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compraData),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || "Error al actualizar la compra");
      }

      await obtenerCompras();
      setMostrarModalActualizacion(false);
      setCompraAEditar(null);
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

    const filtrados = listaCompras.filter(compra =>
      compra.nombre_compania.toLowerCase().includes(texto)
    );
    setComprasFiltradas(filtrados);
  };

  // Lógica de paginación
  const comprasPaginadas = Array.isArray(comprasFiltradas)
    ? comprasFiltradas.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  return (
    <Container className="mt-5">
      <h4>Compras con Detalles</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            variant="primary"
            onClick={() => setMostrarModalRegistro(true)}
            style={{ width: "100%" }}
          >
            Nueva Compra
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

      <TablaCompras
        compras={comprasPaginadas}
        cargando={cargando}
        error={errorCarga}
        totalElementos={comprasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        obtenerDetalles={obtenerDetalles}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalActualizacion={abrirModalActualizacion}
      />

      <ModalDetallesCompras
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        detalles={detallesCompra}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />

      <ModalEliminacionCompras
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCompra={eliminarCompra}
      />

      <ModalRegistroCompras
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaCompra={nuevaCompra}
        setNuevaCompra={setNuevaCompra}
        detallesCompra={detallesNuevos}
        setDetallesCompra={setDetallesNuevos}
        agregarCompra={agregarCompra}
        errorCarga={errorCarga}
        proveedores={proveedores}
        productos={productos}
      />

      <ModalActualizacionCompras
        mostrarModal={mostrarModalActualizacion}
        setMostrarModal={setMostrarModalActualizacion}
        compra={compraAEditar}
        detallesCompra={detallesEditados}
        setDetallesCompra={setDetallesEditados}
        actualizarCompra={actualizarCompra}
        errorCarga={errorCarga}
        proveedores={proveedores}
        productos={productos}
      />
    </Container>
  );
};

export default Compras;
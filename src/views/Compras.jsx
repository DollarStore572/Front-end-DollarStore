import React, { useState, useEffect } from "react";
import TablaCompras from "../components/compras/TablaCompras";
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalDetallesCompras from "../components/detalles_compras/ModalDetallesCompras";
import ModalEliminacionCompras from "../components/compras/ModalEliminacionCompras";
import ModalRegistroCompras from "../components/compras/ModalRegistroCompras";
import ModalActualizacionCompras from "../components/compras/ModalActualizacionCompras";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    fecha: new Date("2025-05-28T14:55:00-05:00"), // Hora actual CST
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

      // Ordenar las compras por id_compra de forma ascendente
      const datosOrdenados = datos.sort((a, b) => a.id_compra - b.id_compra);

      setListaCompras(datosOrdenados);
      setComprasFiltradas(datosOrdenados);
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
      const detallesFiltrados = datos.filter(d => d.id_compra === id_compra);
      setDetallesCompra(detallesFiltrados);
      setCargandoDetalles(false);
      setMostrarModal(true);
      return detallesFiltrados;
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
      console.error("Error al obtener detalles de compra:", error);
      return [];
    }
  };

  const eliminarCompra = async () => {
    if (!compraAEliminar) return;

    console.log("Eliminando compra con ID:", compraAEliminar.id_compra);

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcompra/${compraAEliminar.id_compra}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || "Error al eliminar la compra");
      }

      setMostrarModalEliminacion(false);
      await obtenerCompras();
      establecerPaginaActual(1);
      setCompraAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      console.error("Error en eliminarCompra (frontend):", error);
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
      setNuevaCompra({ id_proveedor: "", fecha: new Date("2025-05-28T14:55:00-05:00") });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalActualizacion = async (compra) => {
    console.log("Abriendo modal para compra con ID:", compra.id_compra); // Depuración
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
        id_compra: compraData.id_compra,
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
    if (!compraActualizada.id_compra) {
      setErrorCarga("Error: ID de compra no válido.");
      return;
    }

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
      console.error("Error al actualizar compra:", error);
      setErrorCarga(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaCompras
      .filter(compra => compra.nombre_compania.toLowerCase().includes(texto))
      .sort((a, b) => a.id_compra - b.id_compra);

    setComprasFiltradas(filtrados);
  };

  const comprasPaginadas = Array.isArray(comprasFiltradas)
    ? comprasFiltradas.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  const generarPDFCompras = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, anchoPagina, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Reporte General de Compras", anchoPagina / 2, 18, { align: "center" });

    const columnas = ["ID Compra", "Fecha", "Proveedor", "Total ($)"];

    const filas = comprasFiltradas.map((compra) => [
      compra.id_compra,
      new Date(compra.fecha).toLocaleDateString(),
      compra.nombre_compania,
      compra.total_venta.toFixed(2),
    ]);

    const totalPaginasPlaceholder = "{total_pages_count_string}";

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();
        const numeroPagina = doc.internal.getNumberOfPages();

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePaginaTexto = `Página ${numeroPagina} de ${totalPaginasPlaceholder}`;
        doc.text(piePaginaTexto, anchoPagina / 2, alturaPagina - 10, { align: "center" });
      },
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPaginasPlaceholder);
    }

    const fecha = new Date("2025-05-28T14:55:00-05:00");
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `ReporteGeneralCompras_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const generarPDFDetalleCompra = async (compra) => {
    const detalles = await obtenerDetalles(compra.id_compra);
    if (!detalles || detalles.length === 0) {
      alert("No se encontraron detalles para esta compra.");
      return;
    }

    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text("Detalle de Compra", anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);

    pdf.text(`ID Compra: ${compra.id_compra}`, 14, posicionY);
    pdf.text(`Fecha: ${new Date(compra.fecha).toLocaleDateString()}`, 14, posicionY + 10);
    pdf.text(`Proveedor: ${compra.nombre_compania}`, 14, posicionY + 20);
    pdf.text(`Total Compra: $${compra.total_venta.toFixed(2)}`, 14, posicionY + 30);

    posicionY += 50;

    const columnasDetalles = ["Producto", "Cantidad", "Precio Unitario ($)", "Subtotal ($)"];
    const filasDetalles = detalles.map(d => [
      d.nombre_producto,
      d.cantidad,
      d.precio_compras.toFixed(2),
      (d.cantidad * d.precio_compras).toFixed(2)
    ]);

    autoTable(pdf, {
      head: [columnasDetalles],
      body: filasDetalles,
      startY: posicionY,
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
      }
    });

    pdf.save(`DetalleCompra_${compra.id_compra}.pdf`);
  };

  const exportarExcelCompras = () => {
    const datos = comprasFiltradas.map((compra) => ({
      'ID Compra': compra.id_compra,
      'Fecha': new Date(compra.fecha).toLocaleDateString(),
      'Proveedor': compra.nombre_compania,
      'Total Compra': compra.total_venta,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Compras');

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date("2025-05-28T14:55:00-05:00");
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `ReporteGeneralCompras_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  return (
    <Container className="mt-5">
      <br />
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
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={generarPDFCompras}
            variant="danger"
            style={{ width: "100%" }}
          >
            Generar Reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={exportarExcelCompras}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
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
        generarPDFDetalleCompra={generarPDFDetalleCompra}
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
import React, { useState, useEffect } from "react";
import TablaVentas from "../components/ventas/TablaVentas";
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalDetallesVentas from "../components/detalles_ventas/ModalDetallesVentas";
import ModalEliminacionVentas from "../components/ventas/ModalEliminacionVentas";
import ModalRegistroVentas from "../components/ventas/ModalRegistroVentas";
import ModalActualizacionVentas from "../components/ventas/ModalActualizacionVentas";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Componente principal para la gestión de ventas
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
    id_cliente: "",
    fecha: new Date("2025-06-10T03:35:00-05:00"),
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Obtener todas las ventas
  const obtenerVentas = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/ventas");
      if (!respuesta.ok) {
        throw new Error("Error al cargar las ventas");
      }
      const datos = await respuesta.json();
      const datosOrdenados = datos.sort((a, b) => a.id_venta - b.id_venta);
      setListaVentas(datosOrdenados);
      setVentasFiltradas(datosOrdenados);
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

  // Obtener detalles de una venta específica
  const obtenerDetalles = async (id_venta) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/detalles_ventas/${id_venta}`);
      if (!respuesta.ok) {
        throw new Error("Error al cargar los detalles de la venta");
      }
      const datos = await respuesta.json();
      setDetallesVenta(datos);
      setCargandoDetalles(false);
      setMostrarModal(true);
      return datos;
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
      console.error("Error al obtener detalles de venta:", error);
      return [];
    }
  };

  // Eliminar una venta
  const eliminarVenta = async () => {
    if (!ventaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/ventas/${ventaAEliminar.id_venta}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("Error al eliminar la venta");
      }

      setMostrarModalEliminacion(false);
      await obtenerVentas();
      establecerPaginaActual(1);
      setVentaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Abrir modal de eliminación
  const abrirModalEliminacion = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminacion(true);
  };

  // Obtener lista de clientes
  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/clientes");
      if (!respuesta.ok) throw new Error("Error al cargar los clientes");
      const datos = await respuesta.json();
      setClientes(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Obtener lista de productos
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

  // Registrar una nueva venta
  const agregarVenta = async (nuevaVenta, detalles) => {
    if (!nuevaVenta.id_cliente || !detalles.length) {
      setErrorCarga("Por favor, selecciona un cliente y agrega al menos un detalle.");
      return;
    }

    try {
      const ventaData = {
        id_cliente: nuevaVenta.id_cliente,
        fecha: nuevaVenta.fecha.toISOString().split("T")[0],
        detalles: detalles.map((d) => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_ventas: d.precio_ventas,
        })),
      };

      const respuesta = await fetch("http://localhost:3000/api/registrarventa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ventaData),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || "Error al registrar la venta");
      }

      await obtenerVentas();
      setNuevaVenta({ id_cliente: "", fecha: new Date("2025-06-10T03:35:00-05:00") });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
      console.error("Error al agregar venta:", error);
    }
  };

  // Abrir modal de actualización
  const abrirModalActualizacion = async (venta) => {
    console.log("Abriendo modal para venta con ID:", venta.id_venta);
    setCargandoDetalles(true);
    try {
      const [ventaRes, detallesRes] = await Promise.all([
        fetch(`http://localhost:3000/api/ventas/${venta.id_venta}`),
        fetch(`http://localhost:3000/api/detalles_ventas/${venta.id_venta}`),
      ]);

      if (!ventaRes.ok) {
        const errorData = await ventaRes.json();
        throw new Error(`Error ${ventaRes.status}: ${errorData.mensaje || "No se pudieron cargar los datos de la venta"}`);
      }
      if (!detallesRes.ok) {
        const errorData = await detallesRes.json();
        throw new Error(`Error ${detallesRes.status}: ${errorData.mensaje || "No se pudieron cargar los detalles de la venta"}`);
      }

      const ventaData = await ventaRes.json();
      const detallesData = await detallesRes.json();

      setDetallesEditados(
        detallesData
          .filter((d) => d.id_venta === venta.id_venta)
          .map((d) => ({
            id_producto: d.id_producto,
            nombre_producto: d.nombre_producto,
            cantidad: d.cantidad || 0,
            precio_ventas: d.precio_ventas || 0,
          }))
      );

      setVentaAEditar({
        id_venta: ventaData.id_venta,
        id_cliente: ventaData.id_cliente || "",
        fecha: ventaData.fecha ? new Date(ventaData.fecha) : new Date("2025-06-10T03:35:00-05:00"),
        nombre_cliente: ventaData.nombre_cliente || "",
      });

      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
      console.error("Error al abrir modal de actualización:", error);
    }
  };

  // Actualizar una venta
  const actualizarVenta = async (ventaActualizada, detalles) => {
    if (!ventaActualizada.id_venta) {
      setErrorCarga("Error: ID de venta no válido.");
      return;
    }
    if (!ventaActualizada.id_cliente || !detalles.length) {
      setErrorCarga("Por favor, selecciona un cliente y agrega al menos un detalle.");
      return;
    }

    try {
      const ventaData = {
        id_cliente: ventaActualizada.id_cliente,
        fecha: ventaActualizada.fecha.toISOString().split("T")[0],
        detalles: detalles.map((d) => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_ventas: d.precio_ventas,
        })),
      };

      const respuesta = await fetch(`http://localhost:3000/api/actualizarventa/${ventaActualizada.id_venta}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ventaData),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || "Error al actualizar la venta");
      }

      await obtenerVentas();
      setMostrarModalActualizacion(false);
      setVentaAEditar(null);
      setDetallesEditados([]);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Manejar búsqueda de ventas
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaVentas
      .filter((venta) => venta.nombre_cliente.toLowerCase().includes(texto))
      .sort((a, b) => a.id_venta - b.id_venta);

    setVentasFiltradas(filtrados);
  };

  // Paginación de ventas
  const ventasPaginadas = Array.isArray(ventasFiltradas)
    ? ventasFiltradas.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  // Generar reporte PDF de ventas
  const generarPDFVentas = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, anchoPagina, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Reporte General de Ventas", anchoPagina / 2, 18, { align: "center" });

    const columnas = ["ID Venta", "Fecha", "Cliente", "Total ($)"];
    const filas = ventasFiltradas.map((venta) => [
      venta.id_venta,
      new Date(venta.fecha).toLocaleDateString(),
      venta.nombre_cliente,
      venta.total_venta.toFixed(2),
    ]);

    const totalPaginasPlaceholder = "{total_pages_count_string}";

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
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

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPaginasPlaceholder);
    }

    const fecha = new Date("2025-06-10T03:35:00-05:00");
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    const nombreArchivo = `ReporteGeneralVentas_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  // Generar PDF de detalles de una venta
  const generarPDFDetalleVenta = async (venta) => {
    const detalles = await obtenerDetalles(venta.id_venta);
    if (!detalles || detalles.length === 0) {
      alert("No se encontraron detalles para esta venta.");
      return;
    }

    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text("Detalle de Venta", anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);

    pdf.text(`ID Venta: ${venta.id_venta}`, 14, posicionY);
    pdf.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, 14, posicionY + 10);
    pdf.text(`Cliente: ${venta.nombre_cliente}`, 14, posicionY + 20);
    pdf.text(`Total Venta: $${venta.total_venta.toFixed(2)}`, 14, posicionY + 30);

    posicionY += 50;

    const columnasDetalles = ["Producto", "Cantidad", "Precio Unitario ($)", "Subtotal ($)"];
    const filasDetalles = detalles.map((d) => [
      d.nombre_producto,
      d.cantidad,
      d.precio_ventas.toFixed(2),
      (d.cantidad * d.precio_ventas).toFixed(2),
    ]);

    autoTable(pdf, {
      head: [columnasDetalles],
      body: filasDetalles,
      startY: posicionY,
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
    });

    pdf.save(`DetalleVenta_${venta.id_venta}.pdf`);
  };

  // Exportar ventas a Excel
  const exportarExcelVentas = () => {
    const datos = ventasFiltradas.map((venta) => ({
      "ID Venta": venta.id_venta,
      Fecha: new Date(venta.fecha).toLocaleDateString(),
      Cliente: venta.nombre_cliente,
      "Total Venta": venta.total_venta,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Ventas");

    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });

    const fecha = new Date("2025-06-10T03:35:00-05:00");
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    const nombreArchivo = `ReporteGeneralVentas_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, nombreArchivo);
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Ventas con Detalles</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            variant="primary"
            onClick={() => setMostrarModalRegistro(true)}
            style={{ width: "100%" }}
          >
            Nueva Venta
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
            onClick={generarPDFVentas}
            variant="danger"
            style={{ width: "100%" }}
          >
            Generar Reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={exportarExcelVentas}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
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
        generarPDFDetalleVenta={generarPDFDetalleVenta}
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
import React, { useState, useEffect } from 'react';
import TablaProveedores from '../components/proveedores/TablaProveedores';
import ModalRegistroProveedores from '../components/proveedores/ModalRegistroProveedores';
import ModalEliminacionProveedores from '../components/proveedores/ModalEliminacionProveedores';
import ModalEdicionProveedores from '../components/proveedores/ModalEdicionProveedores';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf"; // Importar jsPDF
import autoTable from "jspdf-autotable"; // Importar autoTable para tablas en PDF
import * as XLSX from 'xlsx'; // Importar xlsx para Excel
import { saveAs } from 'file-saver'; // Importar file-saver para guardar archivos

const Proveedores = () => {
  const [listaProveedores, setListaProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    compania: '',
    telefono: '',
    correo_electronico: ''
  });

  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

  const [proveedorEditado, setProveedorEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerProveedores = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/proveedores');
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      setListaProveedores(datos);
      setProveedoresFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProveedor = async () => {
    if (!nuevoProveedor.compania || !nuevoProveedor.telefono || !nuevoProveedor.correo_electronico) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproveedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProveedor),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el proveedor');
      }

      await obtenerProveedores();
      setNuevoProveedor({ compania: '', telefono: '', correo_electronico: '' });
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

    const filtrados = listaProveedores.filter(
      (proveedor) =>
        proveedor.compania.toLowerCase().includes(texto) ||
        proveedor.telefono.includes(texto) ||
        proveedor.correo_electronico.toLowerCase().includes(texto)
    );
    setProveedoresFiltrados(filtrados);
  };

  const proveedoresPaginados = Array.isArray(proveedoresFiltrados)
    ? proveedoresFiltrados.slice(
      (paginaActual - 1) * elementosPorPagina,
      paginaActual * elementosPorPagina
    )
    : [];

  const eliminarProveedor = async () => {
    if (!proveedorAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproveedor/${proveedorAEliminar.id_proveedor}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el proveedor');
      }

      await obtenerProveedores();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setProveedorAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProveedorEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarProveedor = async () => {
    if (!proveedorEditado?.compania || !proveedorEditado?.telefono || !proveedorEditado?.correo_electronico) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproveedor/${proveedorEditado.id_proveedor}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compania: proveedorEditado.compania,
          telefono: proveedorEditado.telefono,
          correo_electronico: proveedorEditado.correo_electronico,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el proveedor');
      }

      await obtenerProveedores();
      setMostrarModalEdicion(false);
      setProveedorEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (proveedor) => {
    setProveedorEditado(proveedor);
    setMostrarModalEdicion(true);
  };

  // --- INICIO: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  const generarPDFProveedores = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51); // Color de fondo para el encabezado
    doc.rect(0, 0, anchoPagina, 30, 'F'); // Rectángulo para el encabezado
    doc.setTextColor(255, 255, 255); // Color de texto blanco
    doc.setFontSize(22);
    doc.text("Lista de Proveedores", anchoPagina / 2, 18, { align: "center" });

    // Definición de columnas
    const columnas = ["ID Proveedor", "Compañía", "Teléfono", "Correo Electrónico"];

    // Preparación de los datos de las filas
    const filas = proveedoresFiltrados.map((proveedor) => [
      proveedor.id_proveedor,
      proveedor.compania,
      proveedor.telefono,
      proveedor.correo_electronico,
    ]);

    // Marcador para el total de páginas
    const totalPaginasPlaceholder = "{total_pages_count_string}";

    // Configuración y generación de la tabla con autoTable
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40, // Posición inicial Y de la tabla
      theme: "grid", // Estilo de la tabla
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' }, // Estilos de celda
      margin: { top: 20, left: 14, right: 14 }, // Márgenes del documento
      tableWidth: "auto", // Ancho de la tabla ajustado al contenido
      columnStyles: { // Estilos específicos para columnas si es necesario
        0: { cellWidth: 'auto' }, // ID Proveedor
        1: { cellWidth: 'auto' }, // Compañía
        2: { cellWidth: 'auto' }, // Teléfono
        3: { cellWidth: 'auto' }, // Correo Electrónico
      },
      pageBreak: "auto", // Salto de página automático
      rowPageBreak: "auto", // Salto de página por fila si la fila es muy grande
      // Hook que se ejecuta al dibujar cada página para añadir pie de página
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();
        const numeroPagina = doc.internal.getNumberOfPages();

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Color de texto negro para el pie de página
        const piePaginaTexto = `Página ${numeroPagina} de ${totalPaginasPlaceholder}`;
        doc.text(piePaginaTexto, anchoPagina / 2, alturaPagina - 10, { align: "center" });
      },
    });

    // Reemplazar el placeholder con el número total de páginas real
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPaginasPlaceholder);
    }

    // Guardar el PDF con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `ReporteProveedores_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const generarPDFDetalleProveedor = (proveedor) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(proveedor.compania, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.text(`ID Proveedor: ${proveedor.id_proveedor}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Compañía: ${proveedor.compania}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Teléfono: ${proveedor.telefono}`, anchoPagina / 2, posicionY + 20, { align: "center" });
    pdf.text(`Correo Electrónico: ${proveedor.correo_electronico}`, anchoPagina / 2, posicionY + 30, { align: "center" });

    pdf.save(`DetalleProveedor_${proveedor.compania}.pdf`);
  };

  const exportarExcelProveedores = () => {
    // Estructura de datos para la hoja Excel
    const datos = proveedoresFiltrados.map((proveedor) => ({
      'ID Proveedor': proveedor.id_proveedor,
      'Compañía': proveedor.compania,
      'Teléfono': proveedor.telefono,
      'Correo Electrónico': proveedor.correo_electronico,
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Proveedores');

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `ReporteProveedores_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  // --- FIN: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  return (
    <Container className="mt-5">
      <br />
      <h4>Proveedores</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Proveedor
          </Button>
        </Col>
        <Col lg={6} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        {/* Botones para exportar PDF y Excel */}
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={generarPDFProveedores}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar Reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={exportarExcelProveedores}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
        </Col>
      </Row>
      <br />

      <TablaProveedores
        proveedores={proveedoresPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={proveedoresFiltrados.length} 
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
        generarPDFDetalleProveedor={generarPDFDetalleProveedor} 
      />

      <ModalRegistroProveedores
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProveedor={nuevoProveedor}
        manejarCambioInput={manejarCambioInput}
        agregarProveedor={agregarProveedor}
        errorCarga={errorCarga}
      />

      <ModalEliminacionProveedores
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProveedor={eliminarProveedor}
      />

      <ModalEdicionProveedores
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        proveedorEditado={proveedorEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarProveedor={actualizarProveedor}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Proveedores;




import React, { useState, useEffect } from 'react';
import TablaMarcas from '../components/marcas/TablaMarcas';
import ModalRegistroMarcas from '../components/marcas/ModalRegistroMarcas';
import ModalEliminacionMarcas from '../components/marcas/ModalEliminacionMarcas';
import ModalEdicionMarcas from '../components/marcas/ModalEdicionMarcas';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf"; // Importar jsPDF
import autoTable from "jspdf-autotable"; // Importar autoTable para tablas en PDF
import * as XLSX from 'xlsx'; // Importar xlsx para Excel
import { saveAs } from 'file-saver'; // Importar file-saver para guardar archivos

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

  // --- INICIO: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  const generarPDFMarcas = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51); // Color de fondo para el encabezado
    doc.rect(0, 0, anchoPagina, 30, 'F'); // Rectángulo para el encabezado
    doc.setTextColor(255, 255, 255); // Color de texto blanco
    doc.setFontSize(22);
    doc.text("Lista de Marcas", anchoPagina / 2, 18, { align: "center" });

    // Definición de columnas
    const columnas = ["ID Marca", "Nombre"];

    // Preparación de los datos de las filas
    const filas = marcasFiltradas.map((marca) => [
      marca.id_marca,
      marca.nombre_marca,
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
        0: { cellWidth: 'auto' }, // ID Marca
        1: { cellWidth: 'auto' }, // Nombre
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
    const nombreArchivo = `ReporteMarcas_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const generarPDFDetalleMarca = (marca) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(marca.nombre_marca, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.text(`ID Marca: ${marca.id_marca}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Nombre: ${marca.nombre_marca}`, anchoPagina / 2, posicionY + 10, { align: "center" });

    pdf.save(`DetalleMarca_${marca.nombre_marca}.pdf`);
  };

  const exportarExcelMarcas = () => {
    // Estructura de datos para la hoja Excel
    const datos = marcasFiltradas.map((marca) => ({
      'ID Marca': marca.id_marca,
      'Nombre': marca.nombre_marca,
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Marcas');

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `ReporteMarcas_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  // --- FIN: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

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
        {/* Botones para exportar PDF y Excel */}
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={generarPDFMarcas}
            variant="danger"
            style={{ width: "100%" }}
          >
            Generar Reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={exportarExcelMarcas}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
        </Col>
      </Row>
      <br />

      <TablaMarcas
        marcas={marcasPaginadas}
        cargando={cargando}
        error={errorCarga}
        totalElementos={marcasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
        generarPDFDetalleMarca={generarPDFDetalleMarca}
      />

      <ModalRegistroMarcas
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaMarca={nuevaMarca}
        setNuevaMarca={setNuevaMarca} 
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
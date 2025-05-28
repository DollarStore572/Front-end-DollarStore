import React, { useState, useEffect } from 'react';
import TablaCategorias from '../components/categorias/TablaCategorias';
import ModalRegistroCategorias from '../components/categorias/ModalRegistroCategorias';
import ModalEliminacionCategorias from '../components/categorias/ModalEliminacionCategorias';
import ModalEdicionCategorias from '../components/categorias/ModalEdicionCategorias';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf"; // Importar jsPDF
import autoTable from "jspdf-autotable"; // Importar autoTable para tablas en PDF
import * as XLSX from 'xlsx'; // Importar xlsx para Excel
import { saveAs } from 'file-saver'; // Importar file-saver para guardar archivos

const Categorias = () => {
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: '',
    descripcion: ''
  });

  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      setListaCategorias(datos);
      setCategoriasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre_categoria) {
      setErrorCarga("Por favor, completa el campo antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcategoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCategoria),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar la categoría');
      }

      await obtenerCategorias();
      setNuevaCategoria({ nombre_categoria: '', descripcion: '' });
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

    const filtrados = listaCategorias.filter(
      (categoria) => categoria.nombre_categoria.toLowerCase().includes(texto)
    );
    setCategoriasFiltradas(filtrados);
  };

  const categoriasPaginadas = Array.isArray(categoriasFiltradas)
    ? categoriasFiltradas.slice(
      (paginaActual - 1) * elementosPorPagina,
      paginaActual * elementosPorPagina
    )
    : [];

  const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcategoria/${categoriaAEliminar.id_categoria}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la categoría');
      }

      await obtenerCategorias();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setCategoriaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCategoriaEditada(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarCategoria = async () => {
    if (!categoriaEditada?.nombre_categoria) {
      setErrorCarga("Por favor, completa el campo antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcategoria/${categoriaEditada.id_categoria}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_categoria: categoriaEditada.nombre_categoria, descripcion: categoriaEditada.descripcion }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      await obtenerCategorias();
      setMostrarModalEdicion(false);
      setCategoriaEditada(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditada(categoria);
    setMostrarModalEdicion(true);
  };

  // --- INICIO: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  const generarPDFCategorias = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51); // Color de fondo para el encabezado
    doc.rect(0, 0, anchoPagina, 30, 'F'); // Rectángulo para el encabezado
    doc.setTextColor(255, 255, 255); // Color de texto blanco
    doc.setFontSize(22);
    doc.text("Lista de Categorías", anchoPagina / 2, 18, { align: "center" });

    // Definición de columnas
    const columnas = ["ID Categoría", "Nombre", "Descripción"];

    // Preparación de los datos de las filas
    const filas = categoriasFiltradas.map((categoria) => [
      categoria.id_categoria,
      categoria.nombre_categoria,
      categoria.descripcion || '-', // Usa '-' si la descripción es null/undefined
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
        0: { cellWidth: 'auto' }, // ID Categoría
        1: { cellWidth: 'auto' }, // Nombre
        2: { cellWidth: 'auto' }, // Descripción
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
    const nombreArchivo = `ReporteCategorias_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const generarPDFDetalleCategoria = (categoria) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(categoria.nombre_categoria, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.text(`ID Categoría: ${categoria.id_categoria}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Nombre: ${categoria.nombre_categoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Descripción: ${categoria.descripcion || '-'}`, anchoPagina / 2, posicionY + 20, { align: "center" });

    pdf.save(`DetalleCategoria_${categoria.nombre_categoria}.pdf`);
  };

  const exportarExcelCategorias = () => {
    // Estructura de datos para la hoja Excel
    const datos = categoriasFiltradas.map((categoria) => ({
      'ID Categoría': categoria.id_categoria,
      'Nombre': categoria.nombre_categoria,
      'Descripción': categoria.descripcion || '-',
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Categorias');

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `ReporteCategorias_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  // --- FIN: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  return (
    <Container className="mt-5">
      <br />
      <h4>Categorías</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nueva Categoría
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
            onClick={generarPDFCategorias}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar Reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={exportarExcelCategorias}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
        </Col>
      </Row>
      <br />

      <TablaCategorias
        categorias={categoriasPaginadas}
        cargando={cargando}
        error={errorCarga}
        totalElementos={categoriasFiltradas.length} 
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
        generarPDFDetalleCategoria={generarPDFDetalleCategoria} 
      />

      <ModalRegistroCategorias
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejarCambioInput={manejarCambioInput}
        agregarCategoria={agregarCategoria}
        errorCarga={errorCarga}
      />

      <ModalEliminacionCategorias
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCategoria={eliminarCategoria}
      />

      <ModalEdicionCategorias
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        categoriaEditada={categoriaEditada}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarCategoria={actualizarCategoria}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Categorias;
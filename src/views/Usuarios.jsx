import React, { useState, useEffect } from 'react';
import ModalRegistroUsuarios from '../components/usuarios/ModalRegistroUsuarios';
import ModalEdicionUsuarios from '../components/usuarios/ModalEdicionUsuarios';
import ModalEliminacionUsuarios from '../components/usuarios/ModalEliminacionUsuarios';
import TablaUsuarios from '../components/usuarios/TablaUsuarios';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf"; // Importar jsPDF
import autoTable from "jspdf-autotable"; // Importar autoTable para tablas en PDF
import * as XLSX from 'xlsx'; // Importar xlsx para Excel
import { saveAs } from 'file-saver'; // Importar file-saver para guardar archivos

const Usuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    contraseña: ''
  });

  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 4;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los usuarios');
      }
      const datos = await respuesta.json();
      setListaUsuarios(datos);
      setUsuariosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarUsuario = async () => {
    if (!nuevoUsuario.usuario || !nuevoUsuario.contraseña) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarusuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el usuario');
      }

      await obtenerUsuarios();
      setNuevoUsuario({ usuario: '', contraseña: '' });
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

    const filtrados = listaUsuarios.filter(
      (usuario) =>
        usuario.usuario.toLowerCase().includes(texto)
    );
    setUsuariosFiltrados(filtrados);
  };

  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const eliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarusuario/${usuarioAEliminar.id_usuario}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      await obtenerUsuarios();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setUsuarioAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarUsuario = async () => {
    if (!usuarioEditado?.usuario || !usuarioEditado?.contraseña) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarusuario/${usuarioEditado.id_usuario}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioEditado),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      await obtenerUsuarios();
      setMostrarModalEdicion(false);
      setUsuarioEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado(usuario);
    setMostrarModalEdicion(true);
  };

  // --- INICIO: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  const generarPDFUsuarios = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51); // Color de fondo para el encabezado
    doc.rect(0, 0, anchoPagina, 30, 'F'); // Rectángulo para el encabezado
    doc.setTextColor(255, 255, 255); // Color de texto blanco
    doc.setFontSize(22);
    doc.text("Lista de Usuarios", anchoPagina / 2, 18, { align: "center" });

    // Definición de columnas
    // Nota: La columna 'Contraseña' se incluye según la estructura de tu tabla,
    // pero considera las implicaciones de seguridad al incluirla en reportes.
    const columnas = ["ID Usuario", "Usuario", "Contraseña"];

    // Preparación de los datos de las filas
    const filas = usuariosFiltrados.map((usuario) => [
      usuario.id_usuario,
      usuario.usuario,
      usuario.contraseña, // Incluye la contraseña como está en tus datos
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
        0: { cellWidth: 'auto' }, // ID Usuario
        1: { cellWidth: 'auto' }, // Usuario
        2: { cellWidth: 'auto' }, // Contraseña
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
    const nombreArchivo = `ReporteUsuarios_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const generarPDFDetalleUsuario = (usuario) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(`Detalle de ${usuario.usuario}`, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.text(`ID Usuario: ${usuario.id_usuario}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Usuario: ${usuario.usuario}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Contraseña: ${usuario.contraseña}`, anchoPagina / 2, posicionY + 20, { align: "center" }); // Considera la seguridad aquí

    pdf.save(`DetalleUsuario_${usuario.usuario}.pdf`);
  };

  const exportarExcelUsuarios = () => {
    // Estructura de datos para la hoja Excel
    const datos = usuariosFiltrados.map((usuario) => ({
      'ID Usuario': usuario.id_usuario,
      'Usuario': usuario.usuario,
      'Contraseña': usuario.contraseña, // Considera la seguridad aquí
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Usuarios');

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `ReporteUsuarios_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  // --- FIN: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Usuarios</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
              Nuevo Usuario
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
              onClick={generarPDFUsuarios}
              variant="danger"
              style={{ width: "100%" }}
            >
              Generar Reporte PDF
            </Button>
          </Col>
          <Col lg={3} md={4} sm={4} xs={5}>
            <Button
              className="mb-3"
              onClick={exportarExcelUsuarios}
              variant="success"
              style={{ width: "100%" }}
            >
              Generar Excel
            </Button>
          </Col>
        </Row>
        <br />

        <TablaUsuarios
          usuarios={usuariosPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={usuariosFiltrados.length} 
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
          generarPDFDetalleUsuario={generarPDFDetalleUsuario} 
        />

        <ModalRegistroUsuarios
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoUsuario={nuevoUsuario}
          manejarCambioInput={manejarCambioInput}
          agregarUsuario={agregarUsuario}
          errorCarga={errorCarga}
        />

        <ModalEliminacionUsuarios
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarUsuario={eliminarUsuario}
        />

        <ModalEdicionUsuarios
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          usuarioEditado={usuarioEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarUsuario={actualizarUsuario}
          errorCarga={errorCarga}
        />
      </Container>
    </>
  );
};

export default Usuarios;
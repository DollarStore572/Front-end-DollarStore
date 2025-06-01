import React, { useState, useEffect } from 'react';
import TablaProveedores from '../components/proveedores/TablaProveedores';
import ModalRegistroProveedores from '../components/proveedores/ModalRegistroProveedores';
import ModalEliminacionProveedores from '../components/proveedores/ModalEliminacionProveedores';
import ModalEdicionProveedores from '../components/proveedores/ModalEdicionProveedores';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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


  const generarPDFProveedor = () => {
        const doc = new jsPDF();
        
        // Encabezado del PDF
        doc.setFillColor(28, 41, 51);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F'); // Ajuste dinámico al ancho total
        
        // Título centrado con texto blanco
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.text("Lista de Proveedores", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });
    
        const columnas = ["ID", "Compania", "Telefono", "Correo_Electronico"];
        
        // Asegurarse de que `productoFiltradas` está correctamente definido
        if (!proveedoresFiltrados || proveedoresFiltrados.length === 0) {
            console.error("No hay datos disponibles para generar el PDF.");
            return;
        }
    
        const filas = proveedoresFiltrados.map(proveedor => [
            proveedor.id_proveedor,
            proveedor.compania,
            proveedor.telefono,
            proveedor.correo_electronico,
        ]);
    
        autoTable(doc, {
            head: [columnas],
            body: filas,  // Corregido: `body: filas`
            startY: 40,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2 },
            margin: { top: 20, left: 14, right: 14 },
            tableWidth: "auto",
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' }
            },
            pageBreak: "auto",
            rowPageBreak: "auto",
            didDrawPage: function (data) {
                const alturaPagina = doc.internal.pageSize.getHeight();
                const anchoPagina = doc.internal.pageSize.getWidth();
                const numeroPagina = doc.internal.getNumberOfPages();
    
                // Ajuste correcto de pie de página
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                const piePagina = `Página ${numeroPagina} de ${doc.internal.getNumberOfPages()}`;
                doc.text(piePagina, anchoPagina / 2, alturaPagina - 10, { align: "center" });
            },
        });
    
        // Guardar el PDF con nombre basado en la fecha actual
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const nombreArchivo = `proveedor_${dia}${mes}${anio}.pdf`;
    
        doc.save(nombreArchivo);
    };
    
    
    const generarPDFDetalleProveedor = (proveedor) => {
        const pdf = new jsPDF();
        const anchoPagina = pdf.internal.pageSize.getWidth();
    
        // Encabezado
        pdf.setFillColor(28, 41, 51);
        pdf.rect(0, 0, 220, 30, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.text(proveedor.compania, anchoPagina / 2, 18, { align: "center" });
    
        let posicionY = 50;
    
    
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);
        pdf.text(`Telefono: ${proveedor.telefono}`, anchoPagina / 2, posicionY, { align: "center" });
        pdf.text(`Correo_Electronico: $${proveedor.correo_electronico}`, anchoPagina / 2, posicionY + 20, { align: "center" });
        pdf.save(`${proveedor.compania}.pdf`);
        };
    
    
          const exportarExcelProveedor = () => {
          // Estructura de datos para la hoja Excel
          const datos = proveedoresFiltrados.map((proveedor) => ({
              ID: proveedor.id_proveedor,
              Compania: proveedor.compania,
              Telefono: proveedor.telefono,
              Correo: proveedor.correo_electronico,
              
          }));
    
          // Crear hoja y libro Excel
              const hoja = XLSX.utils.json_to_sheet(datos);
              const libro = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(libro, hoja, 'Proveedor');
    
              // Crear el archivo binario
              const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });4
    
    
              // Guardar el Excel con un nombre basado en la fecha actual
              const fecha = new Date();
              const dia = String(fecha.getDate()).padStart(2, '0');
              const mes = String(fecha.getMonth() + 1).padStart(2, '0');
              const anio = fecha.getFullYear();
    
              const nombreArchivo = `Proveedor_${dia}${mes}${anio}.xlsx`;
    
              // Guardar archivo
              const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
              saveAs(blob, nombreArchivo);
        }






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


        <Col lg={3} md={4} sm={4} xs={5}>
            <Button
              className="mb-3"
              onClick={generarPDFProveedor}
              variant="danger"
              style={{ width: "100%" }}
            >
              Generar reporte PDF
            </Button>
          </Col>
    
          <Col lg={3} md={4} sm={4} xs={5}>
            <Button
              className="mb-3"
              onClick={exportarExcelProveedor}
              variant="success"
              style={{ width: "100%" }}
            >
              Generar Excel
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

      <TablaProveedores 
        proveedores={proveedoresPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={listaProveedores.length}
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
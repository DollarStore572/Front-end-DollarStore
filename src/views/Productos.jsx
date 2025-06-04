import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/productos/TablaProductos';
import ModalRegistroProductos from '../components/productos/ModalRegistroProductos';
import ModalEliminacionProductos from '../components/productos/ModalEliminacionProductos';
import ModalEdicionProductos from '../components/productos/ModalEdicionProductos';
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {saveAs} from 'file-saver';


const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    precio_unitario: '',
    existencia: '',
    id_categoria: '',
    id_marca: '',
    calificacion: '',
    imagen: ''
  });

  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 4;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) {
        throw new Error('Error al obtener categorías');
      }
      const datos = await respuesta.json();
      setCategorias(datos);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setErrorCarga(error.message);
    }
  };

  // Obtener marcas
  const obtenerMarcas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/marcas');
      if (!respuesta.ok) {
        throw new Error('Error al obtener marcas');
      }
      const datos = await respuesta.json();
      setMarcas(datos);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
    obtenerMarcas();
  }, []);

  // Manejar cambios en el formulario de registro
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agregar un nuevo producto
  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto || !nuevoProducto.precio_unitario || !nuevoProducto.existencia || !nuevoProducto.id_categoria 
      || !nuevoProducto.id_marca) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproductos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || 'Error al agregar el producto');
      }

      await obtenerProductos();
      setNuevoProducto({
        nombre_producto: '',
        descripcion: '',
        precio_unitario: '',
        existencia: '',
        id_categoria: '',
        id_marca: '',
        calificacion: '',
        imagen: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Manejar búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaProductos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.descripcion?.toLowerCase().includes(texto) ||
        producto.id_categoria.toString().includes(texto) ||
        producto.id_marca.toString().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  // Paginación
  const productosPaginados = Array.isArray(productosFiltrados)
    ? productosFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  // Eliminar un producto
  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproductos/${productoAEliminar.id_producto}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || 'Error al eliminar el producto');
      }

      await obtenerProductos();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setProductoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Abrir modal de eliminación
  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  // Manejar cambios en el formulario de edición
  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Actualizar un producto
  const actualizarProducto = async () => {
    if (!productoEditado?.nombre_producto || !productoEditado?.precio_unitario || !productoEditado?.existencia || !productoEditado?.id_categoria || !productoEditado?.id_marca) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const productoData = {
        nombre_producto: productoEditado.nombre_producto,
        descripcion: productoEditado.descripcion,
        precio_unitario: parseFloat(productoEditado.precio_unitario),
        existencia: parseInt(productoEditado.existencia, 10),
        id_categoria: parseInt(productoEditado.id_categoria, 10),
        id_marca: parseInt(productoEditado.id_marca, 10),
        calificacion: productoEditado.calificacion ? parseInt(productoEditado.calificacion, 10) : null,
      };

      const respuesta = await fetch(`http://localhost:3000/api/actualizarproductos/${productoEditado.id_producto}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || 'Error al actualizar el producto');
      }

      await obtenerProductos();
      setMostrarModalEdicion(false);
      setProductoEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Abrir modal de edición
  const abrirModalEdicion = (producto) => {
    setProductoEditado(producto);
    setMostrarModalEdicion(true);
  };

 const generarPDFProductos = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    doc.setFillColor(28, 41, 51);
    doc.rect(0,0,anchoPagina,30,'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Lista de productos", anchoPagina/ 2, 18,{align: "center"});
    
    const columnas = ["ID","Nombre", "Descripcion", "Precio","Existencia" ,"Categoria", "Marca", "Calificacion" ];


const filas = productosFiltrados.map((producto)=>[
  producto.id_producto,
  producto.nombre_producto,
  producto.descripcion,
  `C$ ${producto.precio_unitario}`,
   producto.existencia,
  producto.id_categoria,
  producto.id_marca,
  producto.calificacion
]);
const totalPaginas = "{total_pages_count_string}";

autoTable(doc,{
  head: [columnas],
  body: filas,
  startY: 40,
  theme: "grid",
  styles: { fontSize: 10, cellPadding: 2},
  margin:{top: 20, left: 14, right: 14},
  tableLineWidth: "auto",
  columnStyles: {
    0: {cellWidth: 'auto'},
    1: {cellWidth: 'auto'},
    2: {cellWidth: 'auto'},
  },
  pageBreak: "auto",
  rowPageBreak: "auto",

  didDrawPage: function(data){
    const alturaPagina = doc.internal.pageSize.getHeight();
    const anchoPagina = doc.internal.pageSize.getWidth();
    const numeroPagina = doc.internal.getNumberOfPages();

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const piePagina = `Pagina ${numeroPagina} de ${totalPaginas}`;
    doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, {align: "center"});
  },
});
if (typeof doc.putTotalPages === 'function'){
  doc.putTotalPages(totalPaginas);
}

const fecha = new Date();
const dia = String(fecha.getDate()).padStart(2, '0');
const mes = String(fecha.getMonth() + 1).padStart(2, '0');
const anio = fecha.getFullYear();
const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`
doc.save(nombreArchivo);

  }

  const generaPDFDetalleProducto = (producto) =>{
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    //Encabezado 
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(producto.nombre_producto, anchoPagina/ 2, 18, {align: "center"});

    let posicionY = 50;

    if(producto.imagen){
      const propiedadesImagen = pdf.getImageProperties(producto.imagen);
      const anchoImagen = 108;
      const altoImagen = (propiedadesImagen.height*anchoImagen)/propiedadesImagen.width;
      const posicionX = (anchoPagina - anchoImagen)/ 2;

      pdf.addImage(producto.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);
      posicionY = 40 + altoImagen + 10;
    }

    pdf.setTextColor(0,0,0);
    pdf.setFontSize(14);

    pdf.text(`Descripcion: ${producto.descripcion}`, anchoPagina/2, posicionY,{align:"center"});
    pdf.text(`categoria: ${producto.id_categoria}`, anchoPagina/2, posicionY +10,{align: "center"});
    pdf.text(`Precio: C$ ${producto.precio_unitario}`,anchoPagina/2, posicionY + 38,{align: "center"});
    pdf.text(`Existencia: ${producto.existencia}`, anchoPagina / 2, posicionY + 20,{align: "center"});
    pdf.text(`Existencia: ${producto.existencia}`, anchoPagina / 2, posicionY + 20,{align: "center"});
    pdf.text(`Existencia: ${producto.existencia}`, anchoPagina / 2, posicionY + 20,{align: "center"});

    pdf.save(`${producto.nombre_producto}.pdf`);
  }

  //reportes de xlsx

const exportarExcelProducto = () =>{
  const datos = productosFiltrados.map((producto)=>({
ID: producto.id_producto,
Nombre: producto.nombre_producto,
Descripcion: producto.descripcion,
id_categoria: producto.id_categoria,
Precio: parseFloat(producto.precio_unitario),
Existencia: producto.existencia
  }));

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

  const excelBuffer = XLSX.write(libro,{ bookType: 'xlsx', type: 'array'});


  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2,'0');
  const mes = String(fecha.getMonth()+1).padStart(2, '0');
  const anio = fecha.getFullYear();

  const nombreArchivo= `Productos_${dia}${mes}${anio}.xlsx`;

  const blob = new Blob([excelBuffer],{type: 'aplication/octet-stream'});
  saveAs(blob, nombreArchivo);
}

  return (
    <Container className="mt-5">
      <br />
      <h4>Productos</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
         <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
           Nuevo Producto
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
          onClick={generarPDFProductos}
          variant="danger"
          style={{width: "100%" }}
          >
            Generar reporte PDF
          </Button>
          </Col>
          <Col lg={3} md={4} sm={4} xs={5}>
          <Button
          className="mb-3"
          onClick={exportarExcelProducto}
          variant="success"
          style={{width: "100%"}}
          >Generar Excel
          </Button>
    </Col>
        
      </Row>
      <br />

      <TablaProductos
        productos={productosPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={productosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
        generarPDFDetalleProducto={generaPDFDetalleProducto}
      />

      <ModalRegistroProductos
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={agregarProducto}
        errorCarga={errorCarga}
        categorias={categorias}
        marcas={marcas}
      />

      <ModalEliminacionProductos
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
      />

      <ModalEdicionProductos
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditado={productoEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarProducto={actualizarProducto}
        errorCarga={errorCarga}
        categorias={categorias}
        marcas={marcas}
      />
    </Container>
  );
};

export default Productos;
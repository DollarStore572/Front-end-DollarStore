import React from 'react';
import { Table } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

// Declaración del componente TablaCategorias que recibe props
const TablaCategorias = ({
  categorias,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleCategoria // Nueva prop para generar PDF de detalle
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando categorías...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Categoría</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id_categoria}>
              <td>{categoria.id_categoria}</td>
              <td>{categoria.nombre_categoria}</td>
              <td>{categoria.descripcion || '-'}</td> {/* Usa '-' si la descripción es null/undefined */}
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(categoria)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                {/* Botón para generar PDF de detalle por categoría */}
                <Button
                  variant="outline-info" // Color distinto para el botón de PDF de detalle
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleCategoria(categoria)}
                >
                  <i className="bi bi-filetype-pdf"></i> {/* Icono de PDF */}
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(categoria)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

// Exportación del componente
export default TablaCategorias;
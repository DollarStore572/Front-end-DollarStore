import React from 'react';
import { Table } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

// Declaración del componente TablaMarcas que recibe props
const TablaMarcas = ({
  marcas,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleMarca // Nueva prop para generar PDF de detalle
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando marcas...</div>;
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
            <th>ID Marca</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((marca) => (
            <tr key={marca.id_marca}><td>{marca.id_marca}</td>
              <td>{marca.nombre_marca}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(marca)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                {/* Botón para generar PDF de detalle por marca */}
                <Button
                  variant="outline-info" // Color distinto para el botón de PDF de detalle
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleMarca(marca)}
                >
                  <i className="bi bi-filetype-pdf"></i> {/* Icono de PDF */}
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(marca)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td></tr>
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
export default TablaMarcas;
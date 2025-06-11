import React from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  generarPDFDetalleMarca
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando marcas...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Renderizado de la tabla y tarjetas con los datos recibidos
  return (
    <div className="d-flex flex-column justify-content-between" style={{ minHeight: "60vh" }}>
      {/* Vista de tabla para pantallas medianas y grandes */}
      <div className="d-none d-md-block">
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
              <tr key={marca.id_marca}>
                <td>{marca.id_marca}</td>
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
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => generarPDFDetalleMarca(marca)}
                  >
                    <i className="bi bi-filetype-pdf"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(marca)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Vista de tarjetas para pantallas pequeñas */}
      <div className="d-block d-md-none">
        {marcas.map((marca) => (
          <Card key={marca.id_marca} className="mb-2 shadow-sm">
            <Card.Body>
              <Card.Title>{marca.nombre_marca}</Card.Title>
              <Card.Text><strong>ID:</strong> {marca.id_marca}</Card.Text>
              <div>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(marca)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleMarca(marca)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(marca)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="mt-auto">
        <Paginacion
          elementosPorPagina={elementosPorPagina}
          totalElementos={totalElementos}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />
      </div>
    </div>
  );
};

// Exportación del componente
export default TablaMarcas;
import React from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaClientes = ({
  clientes,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleCliente
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando clientes...</div>;
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
              <th>ID Cliente</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Cédula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.cedula}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(cliente)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => generarPDFDetalleCliente(cliente)}
                  >
                    <i className="bi bi-filetype-pdf"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(cliente)}
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
        {clientes.map((cliente) => (
          <Card key={cliente.id_cliente} className="mb-2 shadow-sm">
            <Card.Body>
              <Card.Title>{cliente.nombre} {cliente.apellido}</Card.Title>
              <Card.Text><strong>ID:</strong> {cliente.id_cliente}</Card.Text>
              <Card.Text><strong>Teléfono:</strong> {cliente.telefono}</Card.Text>
              <Card.Text><strong>Cédula:</strong> {cliente.cedula}</Card.Text>
              <div>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(cliente)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleCliente(cliente)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(cliente)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Paginación común para ambas vistas */}
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
export default TablaClientes;
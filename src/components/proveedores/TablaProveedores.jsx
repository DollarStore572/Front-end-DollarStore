import React from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaProveedores que recibe props
const TablaProveedores = ({
  proveedores,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleProveedor
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando proveedores...</div>;
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
              <th>ID Proveedor</th>
              <th>Compañía</th>
              <th>Teléfono</th>
              <th>Correo Electrónico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id_proveedor}>
                <td>{proveedor.id_proveedor}</td>
                <td>{proveedor.compania}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.correo_electronico}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(proveedor)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => generarPDFDetalleProveedor(proveedor)}
                  >
                    <i className="bi bi-filetype-pdf"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(proveedor)}
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
        {proveedores.map((proveedor) => (
          <Card key={proveedor.id_proveedor} className="mb-2 shadow-sm">
            <Card.Body>
              <Card.Title>{proveedor.compania}</Card.Title>
              <Card.Text><strong>ID:</strong> {proveedor.id_proveedor}</Card.Text>
              <Card.Text><strong>Teléfono:</strong> {proveedor.telefono}</Card.Text>
              <Card.Text><strong>Correo Electrónico:</strong> {proveedor.correo_electronico}</Card.Text>
              <div>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(proveedor)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleProveedor(proveedor)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(proveedor)}
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
export default TablaProveedores;
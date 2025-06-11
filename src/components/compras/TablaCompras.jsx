import React from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaCompras = ({
  compras,
  cargando,
  error,
  elementosPorPagina,
  paginaActual,
  totalElementos,
  establecerPaginaActual,
  obtenerDetalles,
  abrirModalEliminacion,
  abrirModalActualizacion,
  generarPDFDetalleCompra
}) => {
  if (cargando) {
    return <div>Cargando compras...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="d-flex flex-column justify-content-between" style={{ minHeight: '60vh' }}>
      {/* Vista de tabla para pantallas medianas y grandes */}
      <div className="d-none d-md-block">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Compra</th>
              <th>Fecha</th>
              <th>Proveedores</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => (
              <tr key={compra.id_compra}>
                <td>{compra.id_compra}</td>
                <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                <td>{compra.nombre_compania}</td>
                <td>
                  ${compra.total_venta != null ? compra.total_venta.toFixed(2) : '0.00'}
                </td>
                <td>
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="me-2"
                    onClick={() => obtenerDetalles(compra.id_compra)}
                  >
                    <i className="bi bi-list-ul"></i>
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => generarPDFDetalleCompra(compra)}
                  >
                    <i className="bi bi-filetype-pdf"></i>
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalActualizacion(compra)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(compra)}
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
        {compras.map((compra) => (
          <Card key={compra.id_compra} className="mb-2 shadow-sm">
            <Card.Body>
              <Card.Title>Compra #{compra.id_compra}</Card.Title>
              <Card.Text>
                <strong>Fecha:</strong> {new Date(compra.fecha).toLocaleDateString()}
              </Card.Text>
              <Card.Text>
                <strong>Proveedor:</strong> {compra.nombre_compania}
              </Card.Text>
              <Card.Text>
                <strong>Total:</strong> $
                {compra.total_venta != null ? compra.total_venta.toFixed(2) : '0.00'}
              </Card.Text>
              <div>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => obtenerDetalles(compra.id_compra)}
                >
                  <i className="bi bi-list-ul"></i>
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleCompra(compra)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalActualizacion(compra)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(compra)}
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

export default TablaCompras;
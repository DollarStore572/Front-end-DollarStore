import React from 'react';
import { Table, Button } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaVentas = ({
  ventas,
  cargando,
  error,
  elementosPorPagina,
  paginaActual,
  totalElementos,
  establecerPaginaActual,
  obtenerDetalles,
  abrirModalEliminacion,
  abrirModalActualizacion,
  generarPDFDetalleVentas
}) => {
  if (cargando) {
    return <div>Cargando ventas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Venta</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={venta.id_venta}>
            <td>{venta.id_venta}</td>
            <td>{new Date(venta.fecha).toLocaleDateString()}</td>
            <td>{venta.nombre_cliente}</td>
            <td>${venta.total_venta.toFixed(2)}</td>
            <td>
              <Button
                variant="outline-success"
                size="sm"
                className="me-2"
                onClick={() => obtenerDetalles(venta.id_venta)}
              >
                <i className="bi bi-list-ul"></i>
              </Button>

              <Button
                  variant="outline-info" // Color distinto para el botón de PDF de detalle
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleVentas(venta)}
                >
                  <i className="bi bi-filetype-pdf"></i> {/* Icono de PDF */}
                </Button>

              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => abrirModalActualizacion(venta)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => abrirModalEliminacion(venta)}
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

export default TablaVentas;
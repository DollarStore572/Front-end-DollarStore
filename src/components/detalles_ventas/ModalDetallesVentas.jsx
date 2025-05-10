import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Container } from 'react-bootstrap';

const ModalDetallesVentas = ({ mostrarModal, setMostrarModal, detalles, cargandoDetalles, errorDetalles }) => {
  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      fullscreen={true}
      aria-labelledby="detalles-venta-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="detalles-venta-modal">Detalles de la Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cargandoDetalles && <div>Cargando detalles...</div>}
        {errorDetalles && <div className="text-danger">Error: {errorDetalles}</div>}
        {!cargandoDetalles && !errorDetalles && detalles.length === 0 && (
          <div>No se encontraron detalles para esta venta.</div>
        )}
        {!cargandoDetalles && !errorDetalles && detalles.length > 0 && (
          <Container>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID Detalle</th>
                  <th>Producto</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <tr key={detalle.id_detalle_venta}>
                    <td>{detalle.id_detalle_venta}</td>
                    <td>{detalle.nombre_producto}</td>
                    <td>{detalle.nombre_cliente}</td>
                    <td>{new Date(detalle.fecha).toLocaleDateString()}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${detalle.precio_ventas.toFixed(2)}</td>
                    <td>${detalle.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesVentas;
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Table, Container } from "react-bootstrap";

const ModalDetallesCompras = ({
  mostrarModal,
  setMostrarModal,
  detalles,
  cargandoDetalles,
  errorDetalles,
}) => {
  // Filtrar detalles válidos
  const detallesValidos = detalles.filter(
    detalle => detalle && typeof detalle.id_compra !== "undefined"
  );

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      fullscreen={true}
      aria-labelledby="detalles-compra-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="detalles-compra-modal">
          Detalles de la Compra
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cargandoDetalles && <div>Cargando detalles...</div>}
        {errorDetalles && <div className="text-danger">Error: {errorDetalles}</div>}
        {!cargandoDetalles && !errorDetalles && detallesValidos.length === 0 && (
          <div>No se encontraron detalles para esta compra.</div>
        )}
        {!cargandoDetalles && !errorDetalles && detallesValidos.length > 0 && (
          <Container>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID Compra</th>
                  <th>Producto</th>
                  <th>Proveedor</th>
                  <th>Fecha</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detallesValidos.map((detalle, index) => (
                  <tr
                    key={`${detalle.id_compra}-${index}`}
                  >
                    <td>{detalle.id_compra || "N/A"}</td>
                    <td>{detalle.nombre_producto || "Desconocido"}</td>
                    <td>{detalle.nombre_compania || "Desconocido"}</td>
                    <td>
                      {detalle.fecha
                        ? new Date(detalle.fecha).toLocaleDateString()
                        : "Sin fecha"}
                    </td>
                    <td>{detalle.cantidad || 0}</td>
                    <td>
                      {typeof detalle.precio_unitario === "number"
                        ? `$${detalle.precio_unitario.toFixed(2)}`
                        : "No disponible"}
                    </td>
                    <td>
                      {typeof detalle.subtotal === "number"
                        ? `$${detalle.subtotal.toFixed(2)}`
                        : "No disponible"}
                    </td>
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

export default ModalDetallesCompras;
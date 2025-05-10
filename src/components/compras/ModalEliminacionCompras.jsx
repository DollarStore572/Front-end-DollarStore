import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCompras = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCompra,
}) => {
  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar esta compra? Esta acción no se puede deshacer.
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
        >
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarCompra}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCompras;
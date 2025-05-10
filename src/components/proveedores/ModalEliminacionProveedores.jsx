import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProveedores = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarProveedor,
}) => {
  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar este proveedor?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarProveedor}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default ModalEliminacionProveedores;
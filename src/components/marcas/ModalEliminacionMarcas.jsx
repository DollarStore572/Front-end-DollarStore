import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionMarcas = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarMarca,
  marca
}) => {
  const idMarca = marca?.id_marca || "desconocido";

  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar la marca #{idMarca}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarMarca}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionMarcas;
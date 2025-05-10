import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionMarcas = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  marcaEditada,
  manejarCambioInputEdicion,
  actualizarMarca,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Marca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreMarca">
            <Form.Label>Nombre de la Marca</Form.Label>
            <Form.Control
              type="text"
              name="nombre_marca"
              value={marcaEditada?.nombre_marca || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre de la marca (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarMarca}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionMarcas;
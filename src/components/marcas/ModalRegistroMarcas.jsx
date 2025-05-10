import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroMarcas = ({
  mostrarModal,
  setMostrarModal,
  nuevaMarca,
  setNuevaMarca,
  agregarMarca,
  errorCarga
}) => {
  const [nombreMarca, setNombreMarca] = useState('');

  // Manejar cambios en el input de nombre de marca
  const manejarCambioNombre = (e) => {
    setNombreMarca(e.target.value);
    setNuevaMarca(prev => ({ ...prev, nombre_marca: e.target.value }));
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Marca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreMarca">
            <Form.Label>Nombre de la Marca</Form.Label>
            <Form.Control
              type="text"
              value={nombreMarca}
              onChange={manejarCambioNombre}
              placeholder="Ingrese el nombre de la marca"
              required
            />
          </Form.Group>

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarMarca}>
          Crear Marca
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroMarcas;
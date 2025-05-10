import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProveedores = ({
  mostrarModal,
  setMostrarModal,
  nuevoProveedor,
  manejarCambioInput,
  agregarProveedor,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formCompaniaProveedor">
            <Form.Label>Compañía</Form.Label>
            <Form.Control
              type="text"
              name="compania"
              value={nuevoProveedor.compania}
              onChange={manejarCambioInput}
              placeholder="Ingresa la compañía (máx. 15 caracteres)"
              maxLength={15}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefonoProveedor">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={nuevoProveedor.telefono}
              onChange={manejarCambioInput}
              placeholder="Ingresa el teléfono (máx. 10 caracteres)"
              maxLength={10}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCorreoProveedor">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correo_electronico"
              value={nuevoProveedor.correo_electronico}
              onChange={manejarCambioInput}
              placeholder="Ingresa el correo electrónico (máx. 25 caracteres)"
              maxLength={25}
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
        <Button variant="primary" onClick={agregarProveedor}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProveedores;
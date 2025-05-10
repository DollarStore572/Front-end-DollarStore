import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCategorias = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  categoriaEditada,
  manejarCambioInputEdicion,
  actualizarCategoria,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreCategoria">
            <Form.Label>Nombre de la Categoría</Form.Label>
            <Form.Control
              type="text"
              name="nombre_categoria"
              value={categoriaEditada?.nombre_categoria || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre de la categoría (máx. 50 caracteres)"
              maxLength={50}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescripcionCategoria">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              value={categoriaEditada?.descripcion || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa una descripción (máx. 200 caracteres)"
              maxLength={200}
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
        <Button variant="primary" onClick={actualizarCategoria}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategorias;
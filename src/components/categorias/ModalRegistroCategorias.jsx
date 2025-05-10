import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalRegistroCategorias = ({
  mostrarModal,
  setMostrarModal,
  nuevaCategoria,
  manejarCambioInput,
  agregarCategoria,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}
        <div className="mb-3">
          <label htmlFor="nombre_categoria" className="form-label">Nombre de la Categoría</label>
          <input
            type="text"
            className="form-control"
            id="nombre_categoria"
            name="nombre_categoria"
            value={nuevaCategoria.nombre_categoria}
            onChange={manejarCambioInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={nuevaCategoria.descripcion}
            onChange={manejarCambioInput}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarCategoria}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCategorias;
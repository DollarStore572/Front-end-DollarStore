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

  const validarletras = (e) => {
    const charCode = e.which ? e.which : e.keyCode;

    // Permitir solo letras [A-Z, a-z]
    if (
        (charCode < 65 || charCode > 90) && // Letras mayúsculas
        (charCode < 97 || charCode > 122) && // Letras minúsculas
        charCode !== 46 && // Retroceso
        charCode !== 8 // Borrar
    ) {
        e.preventDefault(); // Evita que se escriba el carácter
    }
};


const validarFormulario = () => {
    return (
        nuevaCategoria.nombre_categoria.trim() !== "" &&
        nuevaCategoria.descripcion.trim() !== ""
    );
};

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
            onKeyDown={validarletras}
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
            onKeyDown={validarletras}
            onChange={manejarCambioInput}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarCategoria} disabled={!validarFormulario()}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCategorias;

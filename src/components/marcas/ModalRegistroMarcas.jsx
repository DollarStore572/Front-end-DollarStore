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
        (nuevaMarca?.nombre_marca || "").trim() !== "" // Cambié nombreMarca.nombre_marca por nuevaMarca.nombre_marca
    );
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
              onKeyDown={validarletras}
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
        <Button variant="primary" onClick={agregarMarca} disabled={!validarFormulario()}>
          Crear Marca
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroMarcas;

import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionClientes = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditado,
  manejarCambioInputEdicion,
  actualizarCliente,
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



const validarnumeros = (e) => {
    const charCode = e.which ? e.which : e.keyCode;

    // Permitir solo números [0-9]
    if (
        (charCode < 48 || charCode > 57) && // Números
        charCode !== 8 && // Retroceso
        charCode !== 46 // Borrar
    ) {
        e.preventDefault(); // Evita que se escriba el carácter
    }
};


const validarFormulario = () => {
    return (
        (clienteEditado?.nombre || "").trim() !== "" &&
        (clienteEditado?.apellido || "").trim() !== "" &&
        (clienteEditado?.telefono || "").trim() !== "" &&
        (clienteEditado?.cedula || "").trim() !== ""
    );
};
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreCliente">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={clienteEditado?.nombre || ""}
              onChange={manejarCambioInputEdicion}
               onKeyDown={validarletras}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formApellidoCliente">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={clienteEditado?.apellido || ""}
               onKeyDown={validarletras}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el apellido (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefonoCliente">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={clienteEditado?.telefono || ""}
               onKeyDown={validarnumeros}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el teléfono (máx. 12 caracteres)"
              maxLength={12}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCedulaCliente">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={clienteEditado?.cedula || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la cédula (máx. 16 caracteres)"
              maxLength={16}
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
        <Button variant="primary" onClick={actualizarCliente} disabled={!validarFormulario()}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionClientes;

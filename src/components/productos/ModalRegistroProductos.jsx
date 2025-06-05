import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProductos = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
  errorCarga,
  categorias,
  marcas,
}) => {
  console.log("Cargando ModalRegistroProductos.jsx sin validación de calificación");

  const validarletras = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      charCode !== 46 &&
      charCode !== 8
    ) {
      e.preventDefault();
    }
  };

  const validarnumeros = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (
      (charCode < 48 || charCode > 57) &&
      charCode !== 8 &&
      charCode !== 46
    ) {
      e.preventDefault();
    }
  };

  const validarPrecio = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    const inputValue = e.target.value;
    if (
      (charCode < 48 || charCode > 57) &&
      charCode !== 46 &&
      charCode !== 8 &&
      charCode !== 9
    ) {
      e.preventDefault();
    }
    if (charCode === 46 && inputValue.includes(".")) {
      e.preventDefault();
    }
  };

  const validarFormulario = () => {
    return (
      (nuevoProducto.nombre_producto || "").trim() !== "" &&
      (nuevoProducto.descripcion || "").trim() !== "" &&
      (nuevoProducto.existencia || "").trim() !== "" &&
      (nuevoProducto.precio_unitario || "").trim() !== "" &&
      nuevoProducto.id_categoria !== undefined &&
      nuevoProducto.id_categoria !== "" &&
      nuevoProducto.id_marca !== undefined &&
      nuevoProducto.id_marca !== ""
    );
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={nuevoProducto.nombre_producto || ""}
              onKeyDown={validarletras}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre del producto (máx. 100 caracteres)"
              maxLength={100}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescripcionProducto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={nuevoProducto.descripcion || ""}
              onKeyDown={validarletras}
              onChange={manejarCambioInput}
              placeholder="Ingresa la descripción (máx. 250 caracteres)"
              maxLength={250}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioUnitario">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={nuevoProducto.precio_unitario || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el precio unitario"
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formExistencia">
            <Form.Label>Existencia</Form.Label>
            <Form.Control
              type="number"
              name="existencia"
              value={nuevoProducto.existencia || ""}
              onKeyDown={validarnumeros}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cantidad en existencia"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="id_categoria"
              value={nuevoProducto.id_categoria || ""}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias?.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMarca">
            <Form.Label>Marca</Form.Label>
            <Form.Select
              name="id_marca"
              value={nuevoProducto.id_marca || ""}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Selecciona una marca</option>
              {marcas?.map((marca) => (
                <option key={marca.id_marca} value={marca.id_marca}>
                  {marca.nombre_marca}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCalificacion">
            <Form.Label>Calificación (1-5, opcional)</Form.Label>
            <Form.Select
              name="calificacion"
              value={nuevoProducto.calificacion?.toString() ?? ""}
              onChange={manejarCambioInput}
            >
              <option value="">Sin calificación</option>
              {[1, 2, 3, 4, 5].map((valor) => (
                <option key={valor} value={valor}>
                  {valor} {'★'.repeat(valor)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImagenProducto">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              name="imagen"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    manejarCambioInput({
                      target: { name: 'imagen', value: reader.result.split(',')[1] }
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
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
        <Button variant="primary" onClick={agregarProducto} disabled={!validarFormulario()}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProductos;
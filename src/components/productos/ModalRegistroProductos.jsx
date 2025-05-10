import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProductos = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
  errorCarga,
  categorias, // Lista de categorías para el select
  marcas,     // Lista de marcas para el select
}) => {
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
            <Form.Label>Calificación (0-5)</Form.Label>
            <Form.Control
              type="number"
              name="calificacion"
              value={nuevoProducto.calificacion || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa la calificación (0-5)"
              min="0"
              max="5"
              step="1"
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
        <Button variant="primary" onClick={agregarProducto}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProductos;
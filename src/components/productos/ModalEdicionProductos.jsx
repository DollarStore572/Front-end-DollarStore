import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProductos = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditado,
  manejarCambioInputEdicion,
  actualizarProducto,
  errorCarga,
  categorias,
  marcas,
}) => {
  console.log("Cargando ModalEdicionProductos.jsx sin validación de calificación");

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
      (productoEditado?.nombre_producto || "").trim() !== "" &&
      (productoEditado?.descripcion || "").trim() !== "" 
    );
  };

  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoEditado?.nombre_producto || ""}
              onChange={manejarCambioInputEdicion}
              onKeyDown={validarletras}
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
              value={productoEditado?.descripcion || ""}
              onKeyDown={validarletras}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la descripción (máx. 250 caracteres)"
              maxLength={250}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioUnitario">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={productoEditado?.precio_unitario || ""}
              onChange={manejarCambioInputEdicion}
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
              value={productoEditado?.existencia || ""}
              onKeyDown={validarnumeros}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la cantidad en existencia"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="id_categoria"
              value={productoEditado?.id_categoria || ""}
              onChange={manejarCambioInputEdicion}
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
              value={productoEditado?.id_marca || ""}
              onChange={manejarCambioInputEdicion}
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
              value={productoEditado?.calificacion?.toString() ?? ""}
              onChange={manejarCambioInputEdicion}
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
            {productoEditado?.imagen && (
              <div>
                <img
                  src={`data:image/png;base64,${productoEditado.imagen}`}
                  alt="Imagen actual"
                  style={{ maxWidth: '100px', marginBottom: '10px' }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              name="imagen"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    manejarCambioInputEdicion({
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
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarProducto} disabled={!validarFormulario()}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProductos;
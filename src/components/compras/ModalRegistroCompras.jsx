import React, { useState } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ModalRegistroCompras = ({
  mostrarModal,
  setMostrarModal,
  nuevaCompra,
  setNuevaCompra,
  detallesCompra,
  setDetallesCompra,
  agregarCompra,
  errorCarga,
  proveedores,
  productos,
}) => {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_producto: "",
    cantidad: "",
    precio_compras: "",
  });

  // Calcular total de la compra
  const totalCompra = detallesCompra.reduce(
    (sum, detalle) => sum + detalle.cantidad * detalle.precio_compras,
    0
  );

  // Cargar opciones para AsyncSelect
  const cargarProveedores = (inputValue, callback) => {
    const filtrados = proveedores.filter(proveedor =>
      proveedor.compania.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(
      filtrados.map(proveedor => ({
        value: proveedor.id_proveedor,
        label: proveedor.compania,
      }))
    );
  };

  const cargarProductos = (inputValue, callback) => {
    const filtrados = productos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(
      filtrados.map(producto => ({
        value: producto.id_producto,
        label: producto.nombre_producto,
        precio: producto.precio_unitario,
      }))
    );
  };

  // Manejar cambios en los selectores
  const manejarCambioProveedor = seleccionado => {
    setProveedorSeleccionado(seleccionado);
    setNuevaCompra(prev => ({
      ...prev,
      id_proveedor: seleccionado ? seleccionado.value : "",
    }));
  };

  const manejarCambioProducto = seleccionado => {
    setProductoSeleccionado(seleccionado);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: seleccionado ? seleccionado.value : "",
      precio_compras: seleccionado ? seleccionado.precio : "",
    }));
  };

  // Manejar cambios en el detalle
  const manejarCambioDetalle = e => {
    const { name, value } = e.target;
    setNuevoDetalle(prev => ({ ...prev, [name]: value }));
  };

  // Agregar detalle a la lista
  const manejarAgregarDetalle = () => {
    if (
      !nuevoDetalle.id_producto ||
      !nuevoDetalle.cantidad ||
      nuevoDetalle.cantidad <= 0 ||
      !nuevoDetalle.precio_compras ||
      nuevoDetalle.precio_compras <= 0
    ) {
      alert("Por favor, selecciona un producto, una cantidad válida y un precio de compra válido.");
      return;
    }
    setDetallesCompra(prev => [
      ...prev,
      {
        id_producto: nuevoDetalle.id_producto,
        nombre_producto: productoSeleccionado.label,
        cantidad: parseInt(nuevoDetalle.cantidad),
        precio_compras: parseFloat(nuevoDetalle.precio_compras),
      },
    ]);
    setNuevoDetalle({ id_producto: "", cantidad: "", precio_compras: "" });
    setProductoSeleccionado(null);
  };

  // Validar y enviar la compra
  const manejarCrearCompra = () => {
    if (!nuevaCompra.id_proveedor || !nuevaCompra.fecha || detallesCompra.length === 0) {
      alert("Por favor, completa todos los campos requeridos y agrega al menos un detalle.");
      return;
    }
    agregarCompra(nuevaCompra, detallesCompra);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      fullscreen={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Form.Group className="mb-3" controlId="formProveedor">
                <Form.Label>Proveedor</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarProveedores}
                  onChange={manejarCambioProveedor}
                  value={proveedorSeleccionado}
                  placeholder="Buscar proveedor..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Form.Group className="mb-3" controlId="formFechaCompra">
                <Form.Label>Fecha de Compra</Form.Label>
                <br />
                <DatePicker
                  selected={nuevaCompra.fecha}
                  onChange={date =>
                    setNuevaCompra(prev => ({ ...prev, fecha: date }))
                  }
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <h5>Agregar Detalle de Compra</h5>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <Form.Group className="mb-3" controlId="formProducto">
                <Form.Label>Producto</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarProductos}
                  onChange={manejarCambioProducto}
                  value={productoSeleccionado}
                  placeholder="Buscar producto..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <Form.Group className="mb-3" controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <FormControl
                  type="number"
                  name="cantidad"
                  value={nuevoDetalle.cantidad}
                  onChange={manejarCambioDetalle}
                  placeholder="Cantidad"
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={7} sm={8} md={3} lg={3}>
              <Form.Group className="mb-3" controlId="formPrecioCompra">
                <Form.Label>Precio de Compra</Form.Label>
                <FormControl
                  type="number"
                  name="precio_compras"
                  value={nuevoDetalle.precio_compras}
                  onChange={manejarCambioDetalle}
                  placeholder="Precio de compra"
                  step="0.01"
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={5} sm={4} md={2} lg={2} className="d-flex align-items-center mt-3">
              <Button
                style={{ width: "100%" }}
                variant="success"
                onClick={manejarAgregarDetalle}
              >
                Agregar Producto
              </Button>
            </Col>
          </Row>

          {detallesCompra.length > 0 && (
            <>
              <h5 className="mt-4">Detalles Agregados</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio de Compra</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesCompra.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombre_producto}</td>
                      <td>{detalle.cantidad}</td>
                      <td>${detalle.precio_compras.toFixed(2)}</td>
                      <td>
                        ${(detalle.cantidad * detalle.precio_compras).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      <strong>Total:</strong>
                    </td>
                    <td>
                      <strong>${totalCompra.toFixed(2)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}

          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={manejarCrearCompra}>
          Crear Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompras;

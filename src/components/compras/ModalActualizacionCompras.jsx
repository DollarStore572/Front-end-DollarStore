import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ModalActualizacionCompras = ({
  mostrarModal,
  setMostrarModal,
  compra,
  detallesCompra,
  setDetallesCompra,
  actualizarCompra,
  errorCarga,
  proveedores,
  productos,
}) => {
  const [compraEditada, setCompraEditada] = useState(compra || { id_proveedor: "", fecha: new Date("2025-05-28T14:55:00-05:00") });
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_producto: "",
    cantidad: "",
    precio_compras: "",
  });
  const [editandoDetalle, setEditandoDetalle] = useState(null);

  // Calcular total de la compra
  const totalCompra = detallesCompra.reduce(
    (sum, detalle) => sum + detalle.cantidad * detalle.precio_compras,
    0
  );

  // Depuración de props
  useEffect(() => {
    console.log("Props recibidas en ModalActualizacionCompras:", { compra, detallesCompra });
    if (compra) {
      setCompraEditada({
        ...compra,
        fecha: compra.fecha instanceof Date ? compra.fecha : new Date(compra.fecha || "2025-05-28T14:55:00-05:00"),
      });
      setProveedorSeleccionado(
        compra.id_proveedor
          ? { value: compra.id_proveedor, label: proveedores.find(p => p.id_proveedor === compra.id_proveedor)?.compania || "" }
          : null
      );
    }
  }, [compra, proveedores]);

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
    setCompraEditada(prev => ({
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

  // Agregar o actualizar detalle
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

    if (editandoDetalle !== null) {
      const nuevosDetalles = [...detallesCompra];
      nuevosDetalles[editandoDetalle] = {
        ...nuevosDetalles[editandoDetalle],
        id_producto: nuevoDetalle.id_producto,
        nombre_producto: productoSeleccionado.label,
        cantidad: parseInt(nuevoDetalle.cantidad),
        precio_compras: parseFloat(nuevoDetalle.precio_compras),
      };
      setDetallesCompra(nuevosDetalles);
      setEditandoDetalle(null);
    } else {
      setDetallesCompra(prev => [
        ...prev,
        {
          id_producto: nuevoDetalle.id_producto,
          nombre_producto: productoSeleccionado.label,
          cantidad: parseInt(nuevoDetalle.cantidad),
          precio_compras: parseFloat(nuevoDetalle.precio_compras),
        },
      ]);
    }
    setNuevoDetalle({ id_producto: "", cantidad: "", precio_compras: "" });
    setProductoSeleccionado(null);
  };

  // Iniciar edición de un detalle
  const iniciarEdicion = (index) => {
    const detalle = detallesCompra[index];
    setEditandoDetalle(index);
    setProductoSeleccionado({
      value: detalle.id_producto,
      label: detalle.nombre_producto,
    });
    setNuevoDetalle({
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad,
      precio_compras: detalle.precio_compras,
    });
  };

  // Eliminar detalle
  const eliminarDetalle = (index) => {
    const nuevosDetalles = detallesCompra.filter((_, i) => i !== index);
    setDetallesCompra(nuevosDetalles);
    if (editandoDetalle === index) {
      setEditandoDetalle(null);
      setNuevoDetalle({ id_producto: "", cantidad: "", precio_compras: "" });
      setProductoSeleccionado(null);
    }
  };

  // Validar y enviar la compra actualizada
  const manejarActualizarCompra = () => {
    if (!compraEditada.id_proveedor || !compraEditada.fecha || detallesCompra.length === 0) {
      alert("Por favor, completa todos los campos requeridos y agrega al menos un detalle.");
      return;
    }
    actualizarCompra(compraEditada, detallesCompra);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      fullscreen={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Compra</Modal.Title>
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
                  selected={compraEditada.fecha}
                  onChange={date =>
                    setCompraEditada(prev => ({ ...prev, fecha: date }))
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
                variant={editandoDetalle !== null ? "warning" : "success"}
                onClick={manejarAgregarDetalle}
              >
                {editandoDetalle !== null ? "Actualizar Detalle" : "Agregar Producto"}
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
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesCompra.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombre_producto}</td>
                      <td>{detalle.cantidad}</td>
                      <td>${detalle.precio_compras.toFixed(2)}</td>
                      <td>${(detalle.cantidad * detalle.precio_compras).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => iniciarEdicion(index)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => eliminarDetalle(index)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end">
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
        <Button variant="primary" onClick={manejarActualizarCompra}>
          Actualizar Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionCompras;

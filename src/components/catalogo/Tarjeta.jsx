import React from "react";
import { Col, Card, Badge, Stack } from 'react-bootstrap';

const Tarjeta = ({ indice, nombre_producto, descripcion, precio_unitario, existencia, id_marca, id_categoria, calificacion, imagen }) => {
  return (
    <Col lg={3} className="mt-3">
      <Card border="">
        <Card.Img
          variant="top"
          src={`data:image/png;base64,${imagen}`}
        />
        <Card.Body>
          <Card.Title>
            <strong>{nombre_producto}</strong>
          </Card.Title>
          <Card.Text>{descripcion || 'Sin descripción'}</Card.Text>
          <Stack direction="horizontal" gap={2} style={{ flexWrap: 'wrap' }}>
            <Badge pill bg="primary">
              <i className="bi-currency-dollar"></i> {precio_unitario.toFixed(2)}
            </Badge>
            <Badge pill bg="secondary">
              <i className="bi-box"></i> Existencia: {existencia}
            </Badge>
            <Badge pill bg="info">
              <i className="bi-tag"></i> Marca: {id_marca}
            </Badge>
            <Badge pill bg="info">
              <i className="bi-tag"></i> Categoría: {id_categoria}
            </Badge>
            <Badge pill bg="warning">
              <i className="bi-star-fill"></i> Calificación: {calificacion}
            </Badge>
          </Stack>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Tarjeta;
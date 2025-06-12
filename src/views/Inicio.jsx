import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Proposito from "../components/inicio/Proposito";

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navegar("/");
    } else {
      setNombreUsuario(usuarioGuardado);
    }
  }, [navegar]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    navegar("/");
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(31, 27, 145) 100%)",
        padding: "20px",
      }}
    >
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card
            className="shadow-lg border-0"
            style={{
              borderRadius: "15px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <i
                  className="bi bi-shop-window"
                  style={{ fontSize: "3rem", color: "#007bff" }}
                ></i>
              </div>
              <Card.Title as="h1" className="mb-3" style={{ fontWeight: "bold", color: "#343a40" }}>
                ¡Bienvenido, {nombreUsuario}!
              </Card.Title>
              <Card.Text className="mb-4" style={{ fontSize: "1.1rem", color: "#6c757d" }}>
                Estás en la página de inicio de <strong>Dollar Store</strong>. Explora nuestro sistema para gestionar productos, ventas, y más.
              </Card.Text>
              <Button
                variant="primary"
                size="lg"
                onClick={cerrarSesion}
                className="px-5 py-2"
                style={{
                  borderRadius: "25px",
                  transition: "transform 0.2s, background-color 0.3s",
                  backgroundColor: "#007bff",
                  border: "none",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </Button>
            </Card.Body>
            <Card.Footer
              className="text-muted text-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", padding: "15px" }}
            >
              <small>© 2025 Dollar Store - Todos los derechos reservados</small>
            </Card.Footer>
          </Card>
        </Col>
        <Proposito />
      </Row>
    </Container>
  );
};

export default Inicio;
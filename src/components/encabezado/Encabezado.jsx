import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../App.css";

const Encabezado = () => {
  const [estaColapsado, setEstaColapsado] = useState(false);
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const estaLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

  const cerrarSesion = () => {
    setEstaColapsado(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    navegar("/");
  };

  const alternarColapso = () => setEstaColapsado(!estaColapsado);

  const navegarA = (ruta) => {
    navegar(ruta);
    setEstaColapsado(false);
  };

  return (
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        <Navbar.Brand
          onClick={() => navegarA("/inicio")}
          className="text-white"
          style={{ cursor: "pointer" }}
        >
          <i
            className="bi bi-shop-window d-inline-block align-top"
            style={{
              fontSize: "30px",
              width: "30px",
              height: "30px",
              color: "#fff",
              marginRight: "15px",
              marginTop: "-8px",
              animation: "pulse 3s infinite",
            }}
          ></i>
          <strong>Dollar Store</strong>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={alternarColapso}
        />

        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="end"
          show={estaColapsado}
          onHide={() => setEstaColapsado(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel-expand-sm"
              className={estaColapsado ? "color-texto-marca" : "text-white"}
            >
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link
                onClick={() => navegarA("/inicio")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-house-door-fill me-2"></i> : null}
                <strong>Inicio</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/usuarios")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-person-fill me-2"></i> : null}
                <strong>Usuarios</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/clientes")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-people-fill me-2"></i> : null}
                <strong>Clientes</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/categorias")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-tags-fill me-2"></i> : null}
                <strong>Categorías</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/marcas")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-bookmark-fill me-2"></i> : null}
                <strong>Marcas</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/productos")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-box-fill me-2"></i> : null}
                <strong>Productos</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/ventas")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-cart-fill me-2"></i> : null}
                <strong>Ventas</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/compras")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-basket-fill me-2"></i> : null}
                <strong>Compras</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/proveedores")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                {estaColapsado ? <i className="bi bi-truck me-2"></i> : null}
                <strong>Proveedores</strong>
              </Nav.Link>

              {estaLogueado ? (
                <Nav.Link
                  onClick={cerrarSesion}
                  className={estaColapsado ? "text-black" : "text-white"}
                >
                  {estaColapsado ? <i className="bi bi-box-arrow-right me-2"></i> : null}
                  Cerrar Sesión
                </Nav.Link>
              ) : (
                ubicacion.pathname === "/" && (
                  <Nav.Link
                    onClick={() => navegarA("/")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi bi-box-arrow-in-right me-2"></i> : null}
                    Iniciar Sesión
                  </Nav.Link>
                )
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Navbar>
  );
};

export default Encabezado;
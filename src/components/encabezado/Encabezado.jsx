import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../App.css";

const Encabezado = () => {
  // Estado para controlar el colapso del menú lateral
  const [estaColapsado, setEstaColapsado] = useState(false);

  // Hook para manejar la navegación entre rutas
  const navegar = useNavigate();

  // Hook para obtener la ubicación actual de la ruta
  const ubicacion = useLocation();

  // Validación del estado de autenticación con localStorage
  const estaLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setEstaColapsado(false); // Cierra el menú lateral
    localStorage.removeItem("usuario"); // Elimina el usuario de localStorage
    localStorage.removeItem("contraseña"); // Elimina la contraseña de localStorage
    navegar("/"); // Redirige a la página principal
  };

  // Función para alternar el estado del menú lateral
  const alternarColapso = () => setEstaColapsado(!estaColapsado);

  // Función genérica de navegación
  const navegarA = (ruta) => {
    navegar(ruta); // Navega a la ruta especificada
    setEstaColapsado(false); // Cierra el menú lateral
  };

  return (
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        {/* Logo y nombre de la ferretería */}
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

        {/* Botón para alternar el menú lateral en pantallas pequeñas */}
        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={alternarColapso}
        />

        {/* Menú lateral (Offcanvas) */}
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
              {estaLogueado ? (
                <>
                  {/* Opción de navegación a Inicio */}
                  <Nav.Link
                    onClick={() => navegarA("/inicio")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-house-door-fill me-2"></i> : null}
                    <strong>Inicio</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Usuarios */}
                  <Nav.Link
                    onClick={() => navegarA("/usuarios")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-person-fill me-2"></i> : null}
                    <strong>Usuarios</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Clientes */}
                  <Nav.Link
                    onClick={() => navegarA("/clientes")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-people-fill me-2"></i> : null}
                    <strong>Clientes</strong>
                  </Nav.Link>

                  {/* Dropdown de Productos */}
                  <NavDropdown
                    title={
                      <span>
                        {estaColapsado && <i className="bi-bag-heart-fill me-2"></i>}
                        Productos
                      </span>
                    }
                    id="basic-nav-dropdown"
                    className={estaColapsado ? "titulo-negro hover-nav" : "titulo-blanco hover-nav"}
                  >
                    <NavDropdown.Item
                      onClick={() => navegarA("/productos")}
                      className="text-black hover-nav-item"
                    >
                      {estaColapsado ? <i className="bi-box2-heart-fill me-2"></i> : null}
                      <strong>Gestión Productos</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/categorias")}
                      className="text-black hover-nav-item"
                    >
                      {estaColapsado ? <i className="bi-bookmarks-fill me-2"></i> : null}
                      <strong>Gestión Categorías</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/catalogo")}
                      className="text-black hover-nav-item"
                    >
                      {estaColapsado ? <i className="bi-images me-2"></i> : null}
                      <strong>Catálogo de Productos</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/marcas")}
                      className="text-black hover-nav-item"
                    >
                      {estaColapsado ? <i className="bi-images me-2"></i> : null}
                      <strong>Gestión Marcas</strong>
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Opción de navegación a Estadísticas */}
                  <Nav.Link
                    onClick={() => navegarA("/estadisticas")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-bar-chart-fill me-2"></i> : null}
                    <strong>Estadísticas</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Ventas */}
                  <Nav.Link
                    onClick={() => navegarA("/ventas")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-cart-fill me-2"></i> : null}
                    <strong>Ventas</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Compras */}
                  <Nav.Link
                    onClick={() => navegarA("/compras")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-basket-fill me-2"></i> : null}
                    <strong>Compras</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Proveedores */}
                  <Nav.Link
                    onClick={() => navegarA("/proveedores")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-truck me-2"></i> : null}
                    <strong>Proveedores</strong>
                  </Nav.Link>

                  {/* Dropdown de Dashboards */}
                  <NavDropdown
                    title={
                      <span>
                        {estaColapsado && <i className="bi-bag-heart-fill me-2"></i>}
                        Dashboards
                      </span>
                    }
                    id="basic-nav-dropdown"
                    className={estaColapsado ? "titulo-negro hover-nav" : "titulo-blanco hover-nav"}
                  >
                    <NavDropdown.Item
                      onClick={() => navegarA("/dashboard1")}
                      className="text-black hover-nav-item"
                    >
                      {estaColapsado ? <i className="bi-box2-heart-fill me-2"></i> : null}
                      <strong>Dashboard KPI1</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/dashboard2")}
                      className="text-black hover-nav-item"
                    >
                      {estaColapsado ? <i className="bi-box2-heart-fill me-2"></i> : null}
                      <strong>Dashboard KPI2</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/dashboard")}
                      className="text-black hover-nav-item"
                    >
                      {estaColapsado ? <i className="bi-bookmarks-fill me-2"></i> : null}
                      <strong>Dashboard KPI3</strong>
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Opción de cerrar sesión */}
                  <Nav.Link
                    onClick={cerrarSesion}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-box-arrow-right me-2"></i> : null}
                    <strong>Cerrar Sesión</strong>
                  </Nav.Link>
                </>
              ) : (
                ubicacion.pathname === "/" && (
                  <Nav.Link
                    onClick={() => navegarA("/")}
                    className={estaColapsado ? "text-black hover-nav" : "text-white hover-nav"}
                  >
                    {estaColapsado ? <i className="bi bi-box-arrow-in-right me-2"></i> : null}
                    <strong>Iniciar Sesión</strong>
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
        .hover-nav:hover {
          color: rgb(238, 17, 17) !important; /* Cambia solo el color del texto a rojo */
          transition: color 0.3s ease; /* Transición solo para el color */
        }
        .hover-nav-item:hover {
          color: rgb(255, 0, 0) !important; /* Cambia el color del texto a rojo en los ítems del dropdown */
          transition: color 0.3s ease; /* Transición solo para el color */
        }
        /* Desactiva el hover si no está logueado */
        ${!estaLogueado ? `.hover-nav:hover, .hover-nav-item:hover { color: inherit !important; }` : ''}
      `}</style>
    </Navbar>
  );
};

export default Encabezado;

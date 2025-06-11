import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import "./App.css";
import Encabezado from "./components/encabezado/Encabezado";
import Clientes from "./views/Clientes";
import Productos from "./views/Productos";
import Usuarios from "./views/Usuarios";
import Ventas from "./views/Ventas";
import Categorias from "./views/Categorias";
import Proveedores from "./views/Proveedores";
import Marcas from "./views/Marcas";
import Compras from "./views/Compras";
import Estadisticas from "./views/Estadisticas";
import Catalogo from "./views/CatalogoProductos";
import Dashboard from "./views/Dashboard";
import Dashboard2 from "./views/Dashboard2";
import RutaProtegida from "./components/Rutas/RutaProtegida";
import Dashboard1 from "./views/Dashboard1";
import PiePagina from "./components/infopie/PiePagina";

const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Encabezado />
        <main className="margen-superior-main content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<RutaProtegida vista={<Inicio />} />} />
            <Route path="/clientes" element={<RutaProtegida vista={<Clientes />} />} />
            <Route path="/productos" element={<RutaProtegida vista={<Productos />} />} />
            <Route path="/categorias" element={<RutaProtegida vista={<Categorias />} />} />
            <Route path="/ventas" element={<RutaProtegida vista={<Ventas />} />} />
            <Route path="/usuarios" element={<RutaProtegida vista={<Usuarios />} />} />
            <Route path="/proveedores" element={<RutaProtegida vista={<Proveedores />} />} />
            <Route path="/marcas" element={<RutaProtegida vista={<Marcas />} />} />
            <Route path="/compras" element={<RutaProtegida vista={<Compras />} />} />
            <Route path="/estadisticas" element={<RutaProtegida vista={<Estadisticas />} />} />
            <Route path="/catalogo" element={<RutaProtegida vista={<Catalogo />} />} />
            <Route path="/dashboard" element={<RutaProtegida vista={<Dashboard />} />} />
            <Route path="/dashboard2" element={<RutaProtegida vista={<Dashboard2 />} />} />
            <Route path="/dashboard1" element={<RutaProtegida vista={<Dashboard1 />} />} />
          </Routes>
        </main>
        <PiePagina />
      </div>
    </Router>
  );
};

export default App;
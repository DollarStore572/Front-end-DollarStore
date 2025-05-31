import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import './App.css';
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


const App = () => {
  return (
    <Router>
      <main className="margen-superior-main">
      <Encabezado />
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
      </Routes>
      </main>
    </Router>
  );
};

export default App;
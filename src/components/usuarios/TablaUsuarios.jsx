// Importaciones necesarias para el componente visual

// Importaciones necesarias para el componente visual
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

// Declaración del componente TablaCategorias que recibe props
const TablaUsuarios = ({ usuarios, 
  cargando,
  error, 
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion 
  }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando usuarios...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Usuarios</th>
          <th>usuario</th>
          <th>contraseña</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id_usuario}>
            <td>{usuario.id_usuario}</td>
            <td>{usuario.usuario}</td>
            <td>{usuario.contraseña}</td>
          <td>

        <Button
              variant="outline-warning"
              size="sm"
              className="me-2"
              onClick={() => abrirModalEdicion(usuario)}
            >
              <i className="bi bi-pencil"></i>
            </Button>


            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => abrirModalEliminacion(usuario)}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>

  );
};

// Exportación del componente
export default TablaUsuarios;

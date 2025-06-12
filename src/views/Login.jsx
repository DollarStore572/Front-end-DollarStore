import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoginForm from "../components/login/LoginForm";
import "../App.css";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);

  const navegar = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validación básica en el cliente
    if (!nombreUsuario.trim() || !contraseña.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/api/verificar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: nombreUsuario, contraseña }),
      });

      const datos = await respuesta.json();

      // Validación estricta basada en la propiedad 'existe' del servidor
      if (respuesta.ok && datos && datos.existe === true) {
        console.log("Usuario verificado correctamente a las", new Date().toLocaleString("es-ES", { timeZone: "CST" }));
        localStorage.setItem("usuario", nombreUsuario);
        localStorage.setItem("contraseña", contraseña);
        navegar("/inicio");
      } else {
        setError("Usuario o contraseña inválidos. Por favor, verifica tus credenciales.");
      }
    } catch (error) {
      setError("Error al conectar con el servidor. Intenta de nuevo más tarde.");
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    // Verificar si hay un usuario guardado y redirigir si es necesario
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      navegar("/inicio");
    }
    // Restablecer los campos al montar el componente
    setNombreUsuario("");
    setContraseña("");
  }, [navegar]);

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <LoginForm
        email={nombreUsuario}
        password={contraseña}
        error={error}
        setEmail={setNombreUsuario}
        setPassword={setContraseña}
        manejarEnvio={manejarEnvio}
      />
    </Container>
  );
};

export default Login;
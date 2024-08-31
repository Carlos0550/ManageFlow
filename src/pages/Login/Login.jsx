import React, { useState,useRef, useEffect } from 'react'
import "./login.css"
import { message, Spin } from 'antd'
import { useAppContext } from '../../context'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function Login() {
  const {logAdmin,retrieveAdmin, isAuthenticated} = useAppContext()
  const location = useLocation();
  const navigate = useNavigate()
  useEffect(() => {
    // Redirige a /home/dashboard si está autenticado y está en la ruta raíz
    if (isAuthenticated) {
      navigate("/home/dashboard")
    }
  }, [isAuthenticated]);
  const [values, setValues] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })

  const [isLoggin, setIsLoggin] = useState(false)


  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleSubmit = async() => {
    let valid = true;
    let error = {}
    if (!validateEmail(values.email)) {
      valid = false;
      error.email = "El email introducido no es válido";
    }

    if (values.password.trim() === "" || values.password.length < 6) {
      valid = false;
      error.password = "La contraseña introducida debe tener al menos 6 caracteres";
    }
    setErrors(error)

    if (valid) {
      setIsLoggin(true)
      const hiddenMessage = message.loading("Aguarde...",0)
      await logAdmin(values)
      hiddenMessage()
      setIsLoggin(false)
    }
  }


  const alreadyVerify = useRef(false)

  useEffect(()=>{
    if (!alreadyVerify.current) {
      (async()=>{
        const hiddenMessage = message.loading("Aguarde...",0)
        await retrieveAdmin()
        hiddenMessage()
      })()
      alreadyVerify.current = true
    }
  },[location.pathname])

  return (
    <>
      <div className="form__login-wrapper">
        <div className="labels__wrapper">
          <h1>Bienvenido a ManageFlow</h1>

          <label htmlFor='email' style={{ color: errors.email ? "red" : "" }}>
            {errors.email || "Correo electrónico"}:
            <input
              type="text"
              name='email'
              id='email'
              value={values.email}
              style={{ border: errors.email ? "1px solid red" : "" }}
              onChange={handleInput}
            />
          </label>

          <label htmlFor='password' style={{ color: errors.password ? "red" : "" }}>
            {errors.password || "Contraseña"}:
            <input
              type="password"
              name='password'
              id='password'
              value={values.password}
              style={{ border: errors.password ? "1px solid red" : "" }}
              onChange={handleInput}
            />
          </label>
          <button className='btn_login' style={{backgroundColor: isLoggin ? "white" : ""}} onClick={handleSubmit} disabled={isLoggin}>{isLoggin ? <Spin/> : "Iniciar sesión"}</button>
        </div>
      </div>
    </>
  )
}

export default Login
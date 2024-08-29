import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase"
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"
export const AppContext = createContext()

export const useAppContext = () => {
    const ctx = useContext(AppContext)
    if (!ctx) {
        throw new Error("useAppContext debe ser utilizado dentro de un AppContextProvider");
    }
    return ctx;
};

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [clients, setClients] = useState([])
    const alreadyVerify = useRef(false)
    const logAdmin = async (values) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                if (error.message === "Invalid login credentials") {
                    message.error("Credenciales inválidas");
                } else {
                    message.error("Ocurrió un error durante el inicio de sesión");
                }
            } else if (data) {
                setIsAuthenticated(true);
                message.success("Inicio de sesión exitoso");
                navigate("/home/dashboard");
            }
        } catch (err) {
            message.error("Ocurrió un error inesperado");
            console.error(err);
        }
    };


    const retrieveAdmin = async () => {
        if (alreadyVerify.current) return;
    
        alreadyVerify.current = true;
    
        try {
          const { data, error } = await supabase.auth.getSession();
    
          if (error || !data.session?.access_token) {
            message.error("Sesión expirada");
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
            
          }
        } catch (err) {
          console.error(err); 
          message.error("Error al verificar la sesión, por favor verifique su conexión y recargue la página", 5);
          setIsAuthenticated(false);
        }
      };

      useEffect(()=>{
        console.log("Estado de autenticacion: ", isAuthenticated)
      },[isAuthenticated])


    const createClient = async (values = []) => {
        const parsedValues = JSON.stringify(values)
        try {
            const response = await axios.post("http://localhost:4000/create-client", {parsedValues})
            if (response.status === 200) {
                message.success("Cliente guardado")
                await getClients()
            }else if(response.status === 406){
                message.warning(`${response.data.message}`,5)
            }else{
                message.error(`${response.data.message}`,5)

            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                message.error(`${error.response.data.message}`,5)
                console.log(error.response)
            }else{
                message.error("Error de conexión, verifique su red e intentelo nuevamente",3)
            }
        }
    }

    const getClients = async () =>{
        const hiddenMessage = message.loading("Aguarde...",0)
        try {
            const response = await axios.get("http://localhost:4000/get-clients")
            if (response.status === 200) {
                setClients(response.data)
                hiddenMessage()
            }else{
                message.error(`${response.data.message}`)
            }
        } catch (error) {
            if (error.response) {
                message.error(`${error.response.data.message}`)
            }else{
                message.error("Error de conexión, verifique su red e intentelo nuevamente",3)
            }
        }finally{
            hiddenMessage()
        }
    }
    


    return (
        <AppContext.Provider value={{
            createClient,getClients,clients,
            logAdmin, retrieveAdmin, isAuthenticated
        }}>

            {children}
        </AppContext.Provider>
    )
}
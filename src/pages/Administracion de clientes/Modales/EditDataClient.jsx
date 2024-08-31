import { Button, Modal, Card, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../context';
function EditDataClient({ closeModal,selectedClient }) {
    const { updateDataClient } = useAppContext(); 
    const [insertingClient, setInsertingClient] = useState(false);
    const processedClient = () =>{
        if (selectedClient !== null) {
            const dataClient = JSON.parse(selectedClient.datos_cliente)
            // console.log(dataClient)
            // console.log(selectedClient)
            return dataClient
        }
    }

    const clientProcessed = processedClient()
    const [values, setValues] = useState({
        nombre_completo: clientProcessed.nombre_completo || "",
        telefono: clientProcessed.telefono || "",
        email: clientProcessed.email || ""
    })



    const parseLabels = (text) => {
        let textSplitted = text.split("_")
        let capitalicedLabels = textSplitted.map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        return capitalicedLabels.join(" ")
    }
    const [errors, setErrors] = useState({
        nombre_completo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        let error = {};
        let valid = true;
        if (String(values.nombre_completo).trim() === "") {
            valid = false;
            error.nombre_completo = "El nombre no puede estar vacío";
        }
        setErrors(error);

        if (valid) {
            setInsertingClient(true);
            const newValues = {
                values,
                userID: selectedClient.user_id
            }
            await updateDataClient(newValues);
            setInsertingClient(false);
            setValues({
                nombre_completo: "",
                telefono: "",
                email: "",
            });
            closeModal()
        }
    };
    return (
        <>
            <Modal
                open={true}
                onCancel={closeModal}
                footer={[
                    <Button type='primary' danger onClick={closeModal}>Cerrar</Button>
                ]}
            >
                <Card title="Actualizar cliente">
                    <div className='form__wrapper'>
                        {Object.keys(values).map((data, index) => (
                            <label key={data}>
                                {parseLabels(data)}
                                <input
                                    type="text"
                                    name={data}
                                    value={values[data]}
                                    style={{ border: errors[data] ? "1px solid red" : "" }}
                                    onChange={handleChange}
                                />
                                {errors[data] && <span style={{ color: "red" }}>{errors[data]}</span>}
                            </label>
                        ))}
                    </div>
                    <button
                        className='btn__save-client'
                        style={{ backgroundColor: insertingClient ? "white" : "" }}
                        disabled={insertingClient}
                        onClick={handleSubmit}
                    >
                        {insertingClient ? <Spin /> : "Actualizar"}
                    </button>
                </Card>
            </Modal>
        </>
    )
}

export default EditDataClient
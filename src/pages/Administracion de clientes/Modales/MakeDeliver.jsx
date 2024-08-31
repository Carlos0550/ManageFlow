import { Button, Card, Modal, message } from 'antd'
import React, { useState } from 'react'
import { useAppContext } from '../../../context'
import "./css/makeDeliver.css"
import { QuestionCircleFilled } from '@ant-design/icons'
function MakeDeliver({closeModal, clientID, deliversCLient, entrega_id}) {
    const [isValid, setIsValid] = useState(true)
    const {valorCuota, makeDeliver} = useAppContext()
    const [value, setValue] = useState(valorCuota.precio_cuota || 0)
    let initDate = new Date().toISOString().split("T")[0]; 


    const handleChange = (e) =>{
        const newValue = parseInt(e.target.value)
        setValue(newValue);
        if (newValue > 0) {
            setIsValid(true)
        }else{
            setIsValid(false)
        }
    }

    const handleConfirm = async() =>{
        if (!isValid) {
            return message.error("El valor de la entrega debe ser mayor a 0")
        }else{
            const entrega = {
                ...deliversCLient,
                entrega: value,
                fecha_entrega: initDate
            }
            await makeDeliver(clientID, entrega, entrega_id)
            closeModal()
        }
    }
  return (
    <>
        <Modal
        open={true}
        onCancel={closeModal}
        footer={[
            <Button type='primary' danger onClick={closeModal}>Cerrar</Button>,
            <Button type='primary' onClick={handleConfirm}>Entregar</Button>
        ]}
        >
            <Card title={`El valor actual de la cuota es de: ${valorCuota.precio_cuota.toLocaleString("es-ES", { style: "currency", currency: "ARS" })}`}>
            <p className='help__deliver'><QuestionCircleFilled/>{" Puede cambiar esto en Ajustes > Precio de la cuota"}</p>
            <input 
            type="number" 
            className='input_delivery'
            value={value}
            onChange={handleChange}
            style={{ borderColor: isValid ? '' : 'red' }} 
          />
          {!isValid && <p style={{ color: 'red' }}>El valor debe ser mayor que 0</p>}
            </Card>
        </Modal>
    </>
  )
}

export default MakeDeliver
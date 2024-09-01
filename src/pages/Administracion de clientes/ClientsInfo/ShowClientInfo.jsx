import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { Spin, Typography, Card, message } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons';
const { Title, Paragraph } = Typography;

function ShowClientInfo() {
    const { userId } = useParams();
    const [clientInfo, setClientInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(clientInfo)
    }, [clientInfo])

    const fetchClientInfo = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://manage-flow-server.vercel.app/show-client-info/?user_id=${userId}`);
            console.log(response);
            if (response.status === 200) {
                setClientInfo(response.data);
            } else if (response.status === 400) {
                message.error("Link deshabilitado o expirado");
                setError("Link deshabilitado o expirado");
            } else {
                message.error('No se pudo obtener la información del cliente.');
                setError('No se pudo obtener la información del cliente.');
            }
        } catch (err) {
            console.error(err);
            message.error('Error al obtener la información del cliente.');
            setError('Error al obtener la información del cliente.');
        } finally {
            setLoading(false);
        }
    };

    const alreadyFetch = useRef(false)
    useEffect(() => {
        if (userId && !alreadyFetch.current) {
            (async () => {
                alreadyFetch.current = true
                await fetchClientInfo();
            })()
        }
    }, [userId]);


    if (loading) return <Spin size="large" />;

    const parseElements = () => {
        if (!clientInfo) {
            return [];
        }

        const clientArray = Array.isArray(clientInfo) ? clientInfo : [clientInfo];

        return clientArray.map(item => {
            const parseInfo = item.datos_cliente ? JSON.parse(item.datos_cliente) : {};

            return {
                nombre_completo: parseInfo.nombre_completo || "N/A",
                telefono: parseInfo.telefono || "N/A",
                email: parseInfo.email || "N/A",
                estado_membresia: item.status === "activa" ? <p>Al día <CheckCircleTwoTone /></p> : "Vencido" || "Desconocido", 
                vencimiento: item.end_date.split("T")[0].split("-").reverse().join("-")
            };
        });
    };


    const processedClients = parseElements()
    return (
        <>
            <div>
                <Title level={2}> {clientInfo && clientInfo.length > 0 ? `Bienvenido/a ${processedClients[0].nombre_completo}` : "Link expirado o inválido"}</Title>
                <Card title="Informacion personal">
                    {error ? <div>{error}</div> : ""}
                    {!clientInfo ? <div>No se encontró información del cliente.</div> : ""}
                    {clientInfo && !error ? (
                        processedClients.map((client, index) => (
                            <div key={index}>
                                <Paragraph><strong>Nombre Completo:</strong> {client.nombre_completo}</Paragraph>
                                <Paragraph><strong>Teléfono:</strong> {client.telefono}</Paragraph>
                                <Paragraph><strong>Email:</strong> {client.email}</Paragraph>
                                <Paragraph>ID de usuario: {userId}</Paragraph>
                            </div>
                        ))
                    ) : ""}
                </Card>
                <Card title="Estado de membresía">
                    {error ? <div>{error}</div> : ""}
                    {!clientInfo ? <div>No se encontró información del cliente.</div> : ""}
                    {clientInfo && !error ? (
                        processedClients.map((client, index) => (
                            <div key={index}>
                                <Paragraph><strong>Membresía</strong> {client.estado_membresia}</Paragraph>
                                <Paragraph><strong>Vencimiento:</strong> {client.vencimiento}</Paragraph>
                            </div>
                        ))
                    ) : ""}
                </Card>
            </div>
        </>
    )
}

export default ShowClientInfo
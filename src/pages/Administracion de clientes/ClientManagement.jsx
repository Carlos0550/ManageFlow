import React, { useEffect, useRef, useState } from 'react';
import { Table, Typography, Card, Spin, message, Switch, Button, Flex, Skeleton, Modal, Input, Popconfirm } from 'antd';
import "./clientManagement.css";
import { useAppContext } from '../../context';
import Search from 'antd/es/transfer/search';
import axios from 'axios';
import { LinkOutlined, CopyOutlined, DragOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EditDataClient from './Modales/EditDataClient';
import { MoneyOutlined } from '@mui/icons-material';
import MakeDeliver from './Modales/MakeDeliver';
const { Title } = Typography;

function ClientManagement() {
  const { createClient, getClients, clients = [], deleteClient } = useAppContext(); // Asigna un valor por defecto de [] a clients
  console.log(clients)
  const [insertingClient, setInsertingClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [openEditClientModal, setOpenEditClientModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [openDeliverModal, setOpenDeliverModal] = useState(false)
  const [clientID, setClientID] = useState(null)
  const [deliversCLient, setDeliverCLient] = useState([])
  const confirmDeleteClient = (clientID) => {
    new Promise((resolve) => {
      deleteClient(clientID)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          resolve()
        })
    })
  }

  const handleShareChange = async (checked, record) => {
    const toggleValues = {
      id_cliente: record.id_cliente,
      state: checked
    }

    try {
      setIsUpdating(true)
      const response = await axios.put("https://manage-flow-server.vercel.app/toggleLinkClient", { toggleValues })
      if (response.status !== 200) {
        message.error(`${response.data.message}`, 4)
      } else {
        await getClients()
      }
    } catch (error) {
      console.warn(error)

      if (error.response) {
        message.error(`${error.response.data.message}`, 4)
      } else {
        message.error("Error de red: verifique su conexión e intente nuevamente", 4)
      }
    } finally {
      setIsUpdating(false)
    }


    message.info(
      checked
        ? `La información de ${record.nombre} estará disponible durante 24hs`
        : `Se deshabilito el link para compartir la información de ${record.nombre}`, 3
    );
  };
  const [values, setValues] = useState({
    nombre_completo: "",
    teléfono: "",
    email: "",
  });
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
      await createClient(values);
      setInsertingClient(false);
      setValues({
        nombre_completo: "",
        telefono: "",
        email: "",
      });
    }
  };

  const processClients = () => {
    if (!clients || clients.length === 0) {
      return [];
    }

    return clients
      .filter((client) => {
        const data_client = JSON.parse(client.datos_cliente)
        return data_client.nombre_completo.toLowerCase().includes(searchText.toLocaleLowerCase())
      })
      .sort((a, b) => a.id_membresia - b.id_membresia)
      .map((client, index) => {
        const dataClient = JSON.parse(client.datos_cliente);
        const detallesEntregas = JSON.parse(client.detalle_entrega)
        return {
          index: index.toString(),
          id_cliente: client.id_cliente,
          linkHabilitado: client.enabled,
          vencimiento: client.end_date.split("T")[0].split("-").reverse().join("-"),
          detalle_entregas: detallesEntregas,
          entrega_id_cliente: client.entrega_id_cliente,
          estado: client.status === "activa" ? <p style={{ color: "green" }}>Al día</p> : <p style={{ color: "red" }}>Vencido</p>,
          nombre: dataClient.nombre_completo,
          telefono: dataClient.telefono || "N/A",
          email: dataClient.email || "N/A",
        };
      });
  };

  const [clientId, setClientId] = useState(null)
  const getClientLink = (id_cliente) => {
    return `http://localhost:3000/show-client-info/${id_cliente}`
  }

  const handleEditClient = (id) => {
    setSelectedClient(clients.find(client => client.id_cliente === id))
    setOpenEditClientModal(true)
  }

  const [entrega_id, setEntrega_Id] = useState(null)
  const handleMakeDeliver = (id, entregas, entrega_id_cliente) => {
    setDeliverCLient(entregas)
    setClientID(id)
    setEntrega_Id(entrega_id_cliente);
    setOpenDeliverModal(true)
  }

  const columns = [

    {
      title: 'Nombre Completo',
      render: (_, record) => (
        <strong>{record.nombre}</strong>
      ),
      key: 'nombre',
    },
    {
      title: 'Datos',
      render: (_, record) => (
        <>
          <p><strong>Teléfono:</strong> {record.telefono}</p>
          <p><strong>Email:</strong> {record.email}</p>
        </>
      ),
      key: "Datos"
    },
    {
      title: "Vencimiento",
      key: "vencimiento",
      render: (_, record) => (
        <strong>{record.vencimiento}</strong>
      )
    },
    {
      title: "Estado",
      key: "estado",
      dataIndex: "estado"
    },
    {
      title: 'Compartir',
      key: 'share',
      render: (_, record) => (
        <Flex gap="middle" >
          {isUpdating ? <Spin /> : <Switch
            checked={record.linkHabilitado}
            disabled={isUpdating}
            onChange={(checked) => handleShareChange(checked, record)}
          />}
          {record.linkHabilitado ? <Button disabled={isUpdating} onClick={() => { setClientId(record.id_cliente); setShowLink(true) }}><LinkOutlined /></Button> : ""}
        </Flex>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <>
          <div className="action__btns-wrapper">
          <Button type='primary' onClick={() => handleEditClient(record.id_cliente)}><EditOutlined /></Button>
            <Popconfirm
              title="¿Está seguro que desea eliminar este cliente?"
              onConfirm={() => confirmDeleteClient(record.id_cliente)}
            >
              <Button danger><DeleteOutlined /></Button>
            </Popconfirm>
            <Button onClick={()=> handleMakeDeliver(record.id_cliente, record.detalle_entregas, record.entrega_id_cliente)}>Entregar<MoneyOutlined /></Button>
            <Button>Ver históricos</Button>
          </div>
        </>
      )
    }
  ];

  const parseLabels = (text) => {
    let textSplitted = text.split("_")
    let capitalicedLabels = textSplitted.map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    return capitalicedLabels.join(" ")
  }

  const alreadyFetch = useRef(false);
  useEffect(() => {
    (async () => {
      if (!alreadyFetch.current) {
        alreadyFetch.current = true;
        setIsLoading(true)
        await getClients();
        setIsLoading(false)
      }
    })();
  }, [getClients]);

  const processedClients = processClients();

  const clientLink = clientId ? getClientLink(clientId) : '';



  return (
    <>
      <div className='customer__manager-wrapper'>
        <Title level={2}>Administración de Clientes</Title>

        <div className="customer__manager-flex">
          <Card title="Crear Nuevo Cliente" className='card__create-client'>
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
              {insertingClient ? <Spin /> : "Guardar Cliente"}
            </button>
          </Card>

          <Card title="Lista de Clientes" className='card__show-clients'>

            {isLoading ? <Skeleton /> : (
              <>
                <Search
                  placeholder='Busca un cliente aqui'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Table
                  dataSource={processedClients}
                  columns={columns}
                  rowKey="id_cliente"
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: 500 }}
                />
              </>
            )}
          </Card>
        </div>
        {showLink &&
          <Modal
            open={true}
            closeIcon={false}
            footer={[
              <Button onClick={() => setShowLink(false)} type='primary' danger>Cerrar</Button>
            ]}
          >
            <Card title="Preciona el icono para copiar el link!">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  value={clientLink}
                  readOnly
                  style={{ flex: 1, marginRight: '8px' }}
                />
                <CopyToClipboard text={clientLink} onCopy={() => message.success('Enlace copiado al portapapeles!')}>
                  <Button icon={<CopyOutlined />} />
                </CopyToClipboard>
              </div>
            </Card>
          </Modal>}
        {openEditClientModal && <EditDataClient closeModal={() => setOpenEditClientModal(false)} selectedClient={selectedClient} />}
        {openDeliverModal && <MakeDeliver closeModal={()=>setOpenDeliverModal(false)} clientID={clientID} deliversCLient={deliversCLient} entrega_id={entrega_id}/>}
      </div>
    </>
  );
}

export default ClientManagement;

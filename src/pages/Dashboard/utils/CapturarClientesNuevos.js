import dayjs from "dayjs"
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
export const procesarPagosRecientes = (dashboardData) => {
    if (dashboardData && dashboardData !== undefined) {
        const argentinaTimezone = 'America/Argentina/Buenos_Aires'
    let mesActual = dayjs().tz(argentinaTimezone).format("MM") 
    let anioActual = dayjs().tz(argentinaTimezone).format("YYYY")

    function processDeliversClients() {
      let deliversArray = []
      dashboardData.forEach(element => {
        if (element !== undefined && element.detallesentregas) {
          let entregasData = JSON.parse(element.detallesentregas)
          deliversArray.push({
            monto: entregasData.entrega,
            fecha_entrega: entregasData.fecha_entrega
          });
        };
      });

      return deliversArray
    };

    function processDataClient() {
      let clientsInfoArray = [];
    
      dashboardData.forEach(element => {
        if (element !== undefined && element.datoscliente) {
          let clientsInfo = JSON.parse(element.datoscliente);
          
          clientsInfoArray.push({
            nombre: clientsInfo.nombre_completo,
            email: clientsInfo.email,
            telefono: clientsInfo.telefono
          });
        }
      });
    
      return clientsInfoArray;
    }

    const clients = processDataClient();
    const deliveries = processDeliversClients()

    const recentPayments = []

    clients.forEach((client, index) => {
      const delivery = deliveries[index]

      if (delivery && delivery.fecha_entrega) {
        const fechaEntrega = dayjs(delivery.fecha_entrega).tz(argentinaTimezone)
        const mesEntrega = fechaEntrega.format("MM")
        const anioEntrega = fechaEntrega.format("YYYY")

        if (mesEntrega && mesActual && anioEntrega === anioActual) {
          recentPayments.push({
            name: client.nombre,
            date: fechaEntrega.format("YYYY-MM-DD"),
            amount: delivery.monto
          })
        }
      }
    })

    return recentPayments
    }

    
  }


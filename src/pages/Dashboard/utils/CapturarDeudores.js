
import dayjs from "dayjs"
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

export const procesarPagosPendientes = (dashboardData) => {
    if (dashboardData && dashboardData !== undefined) {
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

        const clients = processDataClient();
        const deliveries = processDeliversClients()

        let pagosPendientes = []
        clients.map((client, index) => {
            let pendiente = dashboardData[index].estadomembresia
            let deliverDate = dayjs(deliveries[index].fecha_entrega).format("YYYY-MM-DD")
            if (pendiente === "vencido") {
                pagosPendientes.push({
                    name: client.nombre,
                    fecha_vencimiento: deliverDate
                })
            };
        });

        return pagosPendientes
    }
}

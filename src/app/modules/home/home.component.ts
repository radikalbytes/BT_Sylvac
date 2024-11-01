/// <reference types="web-bluetooth" />
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { linear_chart } from './charts/linear_chart';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild("chart") chart!: ChartComponent; // Referencia al componente de la gráfica
  chart_options = linear_chart // Opciones de la gráfica

  SERVICE_ID = 0x5000 // Identificador del servicio
  MEASUREMENT_ID = 0x5020 // Identificador de la medida

  constructor(){} 

  measures: {timestamp:number,measure:number}[] = [] // Lista de medidas
  measure_status: string = 'active' // Estado de la medida por defecto activo
  display_chart = false // Muestra la gráfica por defecto

  // Muestra dispositivos cercanos
  async requestBluetoothDevice() {
    try { // Intenta acceder a dispositivos Bluetooth

      const device = await navigator.bluetooth.requestDevice({ // Pide al usuario que seleccione un dispositivo Bluetooth
        //acceptAllDevices: true, // Acepta todos los dispositivos Bluetooth
        filters: [{ namePrefix: 'SY' }], // Filtra los dispositivos por nombre
        optionalServices: [this.SERVICE_ID], // Puedes especificar otros servicios opcionales aquí
      });

      console.log('Dispositivo seleccionado:', device) // Muestra el dispositivo seleccionado en la consola

      // Conectar al dispositivo seleccionado
      if (!device.gatt) { // Si GATT no está disponible en el dispositivo seleccionado (GAATT: Generic Attribute Profile)
        throw new Error('GATT no está disponible en el dispositivo seleccionado.'); // Lanza un error
      }
      const server = await device.gatt.connect(); // Conecta al servidor GATT del dispositivo seleccionado

      const service = await server.getPrimaryService(this.SERVICE_ID); // Obtiene el servicio específico

      const characteristic = await service.getCharacteristic(this.MEASUREMENT_ID); // Obtiene la característica específica

      characteristic.startNotifications().then( // Habilita las notificaciones de la característica específica
        _ => {
          this.display_chart = true // Muestra el gráfico
          console.log('Notificaciones habilitadas'); // Muestra un mensaje en la consola
          characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged.bind(this)); // Añade un evento al cambio de valor de la característica
        }
      )
    } catch (error) { // Captura errores
      console.error('Error al acceder a dispositivos Bluetooth:', error); // Muestra un mensaje de error en la consola
    }
  }

  handleCharacteristicValueChanged(event: Event) { // Maneja el cambio de valor de la característica
    if(this.measure_status === 'active'){ // Si la medida está activa
      const target = event.target as BluetoothRemoteGATTCharacteristic; // Obtiene el objetivo del evento
      const value = target.value; // Obtiene el valor de la característica
      if (!value) { // Si no hay valor
        console.error('No se pudo leer el valor de la característica.'); // Muestra un mensaje de error en la consola
        return; // Cancela la operación
      }

      // Decodifica el valor de la característica
      const sint32 = value.getInt32(0, /* littleEndian */ true); // Cambia `true` a `false` si el dispositivo usa big-endian

      if (sint32){ // Si hay un valor
        this.chart_options.series[0].data.push([new Date().getTime(), (sint32 / 1000000)] as any) // Añade la fecha y el valor a la serie de la gráfica
        this.measures.push({timestamp: new Date().getTime(), measure: (sint32 / 1000000)}); // Añade el valor a la lista de medidas
      }
      
      // Forzamos la actualización del gráfico
      this.chart.updateSeries(this.chart_options.series); // Actualiza la serie de la gráfica
    }
  }

  changeMeasureStatus(){ // Cambia el estado de medición
    switch(this.measure_status){ // Según el estado de la medida
      case 'active': // Si está activa
        this.measure_status = 'paused' // Pausa la medida
        break
      case 'paused': // Si está pausada
        this.measure_status = 'active' // Activa la medida
        break
    }
  }

  clearMeasures(){ // Limpia las medidas
    this.measures = [] // Reinicia la lista de medidas
    this.chart_options.series[0].data = [] // Reinicia la serie de la gráfica
    this.chart.updateSeries(this.chart_options.series); // Actualiza la serie de la gráfica
  }


// Función para formatear el timestamp a "dd/mm/yy hh:mm:ss.sss"
 formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes ajustado porque getMonth() retorna 0-11
  const year = date.getFullYear().toString().slice(-2);
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

  saveCSV(){
    let csvContent = "timestamp;value\n";

    this.measures.forEach(measure => {
        const formattedTimestamp = this.formatTimestamp(measure.timestamp);
        const formattedValue = measure.measure.toString().replace('.', ',');
        csvContent += `${formattedTimestamp};${formattedValue}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date();
    const timestamp = date.toISOString().replace(/[-:]/g, '').slice(0, 15);
    a.download = `Mediciones_${timestamp}.csv`;
    a.click();

    URL.revokeObjectURL(url);

  }

  getMinimunValue(){ // Obtiene el valor mínimo
    return Math.min(...this.measures.map(m=>m.measure))
  }

  getMaximumValue(){ // Obtiene el valor máximo
    return Math.max(...this.measures.map(m=>m.measure))
  }

  getAverageValue(){ // Obtiene el valor promedio
    return (this.measures.map(m=>m.measure).reduce((a, b) => a + b, 0) / this.measures.length).toFixed(3)
  }
}
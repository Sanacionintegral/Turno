const API_URL = 'https://script.google.com/macros/s/AKfycbwbB-n6Y5m5GUg8cSUd8PgZEWPLxefSkaMD1Eif9jbMqT1hvGvYuaeU4D0icRYwmijz/exec';
const whatsapp = '2235931151';

let turnos = [];
let reservados = [];

function cargarTurnos() {
  // Creamos un iframe oculto para cargar los datos como si fuera una llamada GET
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = API_URL;

  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const text = doc.body.innerText;
      reservados = JSON.parse(text);

      const fechas = generarFechas();
      let turnoNumero = 1;

      fechas.forEach(fecha => {
        const bloques = generarBloques(fecha);
        bloques.forEach(hora => {
          const diaTexto = formatoDia(fecha);
          const id = `T${turnoNumero}`;
          if (!reservados.includes(id)) {
            turnos.push({ nro: id, diaTexto, hora });
          }
          turnoNumero++;
        });
      });

      mostrarTurnos();
    } catch (error) {
      alert('Error procesando los turnos.');
    }
  };

  document.body.appendChild(iframe);
}

function generarFechas() {
  const hoy = new Date();
  const fechas = [];
  for (let i = 0; i < 14; i++) {
    const f = new Date(hoy);
    f.setDate(f.getDate() + i);
    if (f.getDay() !== 0) fechas.push(f);
  }
  return fechas;
}

function generarBloques(fecha) {
  const bloques = [];
  let inicio = fecha.getDay() === 6 ? 8 : 6;
  let fin = fecha.getDay() === 6 ? 16 : 20;
  for (let i = inicio; i < fin; i++) {
    bloques.push(`${i}:00`);
  }
  return bloques;
}

function formatoDia(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  return `${diaSemana} - ${dia}/${mes}/${año}`;
}

function mostrarTurnos() {
  const contenedor = document.getElementById('turnos');
  contenedor.innerHTML = '';
  turnos.forEach(turno => {
    const div = document.createElement('div');
    div.className = 'turno';
    div.innerHTML = `
      <div><strong>${turno.diaTexto} - ${turno.hora}</strong></div>
      <button onclick="reservarTurno('${turno.nro}', '${turno.diaTexto}', '${turno.hora}')">Reservar turno</button>
    `;
    contenedor.appendChild(div);
  });
}

function reservarTurno(nro, dia, hora) {
  const nombre = prompt("Ingresá tu nombre:");
  const celular = prompt("Ingresá tu número de celular:");
  if (!nombre || !celular) return alert("Debes completar tus datos para continuar.");

  const mensaje = `Ya reservé mi turno para el ${dia} a las ${hora}. Mi nombre es ${nombre}.`;
  const urlWp = `whatsapp://send?phone=549${whatsapp}&text=${encodeURIComponent(mensaje)}`;
  window.location.href = urlWp;

  // Registro en Google Sheets
  const form = document.createElement('form');
  form.style.display = 'none';
  form.method = 'POST';
  form.action = API_URL;

  const payload = {
    nroTurno: nro,
    dia: dia,
    hora: hora,
    nombre: nombre,
    celular: celular
  };

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'data';
  input.value = JSON.stringify(payload);
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}

window.onload = cargarTurnos;



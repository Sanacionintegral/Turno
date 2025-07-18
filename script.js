const API_URL = 'https://script.google.com/macros/s/AKfycbwbB-n6Y5m5GUg8cSUd8PgZEWPLxefSkaMD1Eif9jbMqT1hvGvYuaeU4D0icRYwmijz/exec';
const whatsapp = '2235931151';
let turnos = [];
let reservados = [];

async function cargarTurnos() {
  try {
    const response = await fetch(API_URL);
    reservados = await response.json();

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
  } catch (e) {
    alert("Error cargando turnos: " + e.message);
  }
}

function generarFechas() {
  const hoy = new Date();
  const fechas = [];
  for (let i = 0; i < 14; i++) {
    const f = new Date(hoy);
    f.setDate(f.getDate() + i);
    if (f.getDay() !== 0) fechas.push(f); // excluir domingos
  }
  return fechas;
}

function generarBloques(fecha) {
  const bloques = [];
  let inicio = fecha.getDay() === 6 ? 8 : 6;
  let fin = fecha.getDay() === 6 ? 16 : 20;
  for (let i = inicio; i < fin; i++) {
    const hora = `${i.toString().padStart(2, '0')}:00`;
    bloques.push(hora);
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

  const mensajeWp = `Ya reservé mi turno para el ${dia} a las ${hora}. Mi nombre es ${nombre}.`;
  const whatsappLink = `https://wa.me/549${whatsapp}?text=${encodeURIComponent(mensajeWp)}`;

  // Guardar en Google Sheets
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ nroTurno: nro, dia, hora, nombre, celular }),
    headers: { 'Content-Type': 'application/json' }
  }).then(() => {
    window.location.href = whatsappLink;
  }).catch(err => {
    alert("Error al guardar el turno: " + err.message);
  });
}

window.onload = cargarTurnos;




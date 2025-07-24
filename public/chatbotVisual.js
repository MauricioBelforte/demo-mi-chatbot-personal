// script/chatbot.js
const chatIcon = document.getElementById("chat-icon");
const chatContainer = document.getElementById("chat-container");
const botonEnviarMensaje = document.getElementById("enviar-mensaje");
const mensajeInput = document.getElementById("mensaje");
const mensajesListado = document.getElementById("mensajes");




/// Escuchando el click en el icono
chatIcon.addEventListener("click", () => {
  /* Esconde las animaciones del hover */

  chatIcon.classList.toggle("opened");
  /* Si el elemento ya tiene la clase "visible", la elimina, si no la tiene, la agrega. */
  chatContainer.classList.toggle("visible");
  mostrarMensajeBienvenida();


});

/// Mostrar mensaje de bienvenida apenas se abre el chat
function mostrarMensajeBienvenida() {
  // Si esta vacio agrega el mensaje de bienvenida
  if (mensajesListado.children.length === 0) {
    agregarMensaje("bot", "👋 ¡Hola! Soy el asistente de Mauricio Belforte.\nPodés preguntarme por sus proyectos, tecnologías utilizadas y cómo ponerte en contacto con él.")

  }
}


///
botonEnviarMensaje.addEventListener("click", enviarMensaje);


///
mensajeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    enviarMensaje();
  }
});


async function enviarMensaje() {
  const mensajeDelUsuario = mensajeInput.value.trim();
  if (!mensajeDelUsuario) return;

  agregarMensaje("usuario", mensajeDelUsuario);
  mensajeInput.value = "";

  // ⏳ Mostrar animación mientras llega la respuesta
  const mensajeLoading = mostrarAnimacionRespondiendo();

  try {
    // Peticion a mi api server.js
    const res = await fetch("/api/chatbotApi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: mensajeDelUsuario }),
    });

    const data = await res.json();

    // 💥 Eliminar animación antes de mostrar la respuesta real
    mensajeLoading.remove();

    const mensajeDelModelo = formatearRespuestaBot(data.respuesta);
    console.log(mensajeDelModelo)
    agregarMensaje("bot", mensajeDelModelo, true); // Si hay HTML
  } catch (error) {
    mensajeLoading.remove();
    agregarMensaje("bot", "Lo siento, hubo un error al procesar la respuesta.", false);
    console.error("Error en la petición:", error);
  }
}

function formatearRespuestaBot(textoPlano) {
  // Elimina signos de ángulo que rompen el HTML
  const limpio = textoPlano.replace(/<([^>]+)>/g, '$1');

  // Convierte URLs en enlaces HTML
  const conLinks = limpio.replace(
    /(https?:\/\/[^\s<>()\[\]{}"']+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  /* console.log(conLinks) */
  // Convierte saltos de línea \n en <br>
  const conSaltos = conLinks.replace(/\n/g, '<br>');
  /* console.log(conSaltos) */

  return conSaltos;
}

function agregarMensaje(tipo, texto, esHTML = false) {
  const contenedorVineta = document.createElement("div");
  contenedorVineta.classList.add("chat-container__listado-de-mensajes__mensaje");

  let icono;
  let vineta;

  if (tipo === "usuario") {
    contenedorVineta.classList.add("mensaje--usuario");
    icono = crearIcono("🧑", "vineta-icono-usuario");
    vineta = crearVineta(texto, "vineta-texto-usuario");
  } else {
    contenedorVineta.classList.add("mensaje--bot");
    icono = crearIcono("🤖", "vineta-icono-robot");
    vineta = document.createElement("div");
    vineta.classList.add("vineta-texto-robot");

    if (esHTML) {
      vineta.innerHTML = texto;
    } else {
      vineta.textContent = texto;
    }
  }

  contenedorVineta.appendChild(icono);
  contenedorVineta.appendChild(vineta);
  mensajesListado.appendChild(contenedorVineta);
  mensajesListado.scrollTop = mensajesListado.scrollHeight;
}

function crearVineta(texto, clase) {
  const vineta = document.createElement("div")

  vineta.classList.add(clase);
  vineta.innerText = texto;
  return vineta
}

function crearIcono(icon, clase) {
  const icono = document.createElement("div");

  icono.classList.add(clase);
  icono.innerText = icon;
  return icono

}


function mostrarAnimacionRespondiendo() {
  const contenedor = document.createElement("div");
  contenedor.classList.add(
    "chat-container__listado-de-mensajes__mensaje",
    "mensaje--bot",
    "mensaje--loading"
  );

  const icono = crearIcono("🤖", "vineta-icono-robot");

  const textoAnimado = document.createElement("div");
  textoAnimado.classList.add("vineta-texto-robot", "animacion-respondiendo");

  textoAnimado.innerHTML = `
    <div class="pelotitas-rebotando">
      <span class="pelotita"></span>
      <span class="pelotita"></span>
      <span class="pelotita"></span>
    </div>
  `;

  contenedor.appendChild(icono);
  contenedor.appendChild(textoAnimado);
  mensajesListado.appendChild(contenedor);
  mensajesListado.scrollTop = mensajesListado.scrollHeight;

  return contenedor;
}

document.getElementById("chat-icon").addEventListener("click", () => {

});
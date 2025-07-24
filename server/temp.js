// server/server.js
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/script", express.static(path.join(__dirname, "../script")));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    // Cargamos trabajos.json
    let trabajos = [];
    try {
        const trabajosRaw = await fs.readFile(path.join(__dirname, "trabajos.json"), "utf-8");
        trabajos = JSON.parse(trabajosRaw);
    } catch (err) {
        console.error("Error al cargar trabajos.json:", err);
    }

    // Cargamos sobremi.json
    const keywords = ["hola", "datos", "edad", "años", "vive", "ciudad", "Belforte", "ubicacion",
        "ciudad", "pais", "provincia", "dedica", "trabaja", "trabajo", "creo", "hacer", "sabe", "hace", "bueno",
        "mauricio", "quién sos", "quién es", "sobre vos", "sobre él", "profesion",
        "quién es mauricio", "perfil de mauricio", "contacto", "contactar",
        "email", "linkedin", "github"];

    let perfil = {};
    try {
        const perfilRaw = await fs.readFile(path.join(__dirname, "sobremi.json"), "utf-8");
        perfil = JSON.parse(perfilRaw);
    } catch (err) {
        console.error("Error al cargar sobremi.json:", err);
    }

    // Construimos un contexto a partir del mensaje del usuario
    let contexto = "";

    const mensaje = userMessage.toLowerCase();

    // Sobre trabajos
    if (mensaje.includes("trabajo") || mensaje.includes("proyecto")) {
        /*map crea un arreglo de strings, y a ese arreglo se convierte en un solo string con join */
        contexto = trabajos.map(trabajo => `- ${trabajo.titulo}: ${trabajo.descripcion}`).join("\n");
        /* console.log(contexto); */
        // Sobre tecnologías
    } else if (mensaje.includes("tecnolog")) {
        const techs = [...new Set(trabajos.flatMap(t => t.tecnologias))];
        contexto = `Tecnologías usadas por Mauricio Belforte: ${techs.join(", ")}`;
        /* console.log(contexto); */

        // Sobre Mauricio (nombre, experiencia, contacto, etc.)
    } else if (keywords.some(k => mensaje.toLowerCase().includes(k))) {
        contexto = `
        Nombre y Apellido: ${perfil.nombre}
        Edad: ${perfil.edad}
        Ubicación de ciudad, provincia y Pais: ${perfil.ubicacion}
        Profesión: ${perfil.profesion}
        Sobre Mauricio Belforte: ${perfil.descripcion}
        Tecnologías que sabe utilizar: ${perfil.tecnologias.join(", ")}
        Email: ${perfil.email}
        LinkedIn: ${perfil.linkedin}
        GitHub: ${perfil.github}
            `;
        /* console.log(contexto); */
    } if (mensaje.includes("telefono") || mensaje.includes("celular")) {
        contexto = `Su numero de celular es 221-3030341 (Argentina)`

    }

    else {
        const coincidencia = trabajos.find(t => mensaje.includes(t.titulo.toLowerCase()));
        if (coincidencia) {
            contexto = `Trabajo: ${coincidencia.titulo}\nTecnologías: ${coincidencia.tecnologias.join(", ")}\nDescripción: ${coincidencia.descripcion}`;
        }
    }

    // Construimos el system prompt dinámicamente
    const systemPrompt = `
Respondé en menos de 100 caracteres, en español y con claridad.
 Sos un asistente virtual que brinda información precisa en tercera persona a posibles clientes, exclusivamente relacionada al Desarrollador Web Mauricio Belforte. Usá tercera persona y tono informativo. No te atribuyes la información. 
 Usá puntos y aparte con saltos de linea \n para separar frases en distintas líneas. Las respuestas deben facilitar la lectura. 
 Si no encontras informacion en el contexto que responda el mensaje del usuario, responde solo con la siguiente frase: “No me entrenaron para responder ese tipo de preguntas”.

`;

    function generarPromptUsuario(contexto, userMessage) {
        return `Contexto:\n${contexto}

Si no encontrás una respuesta a la pregunta del usuario, generá un resumen breve del contexto, manteniendo la claridad y el tono informativo.

Utilizando la parte util del contexto, genera un respuesta que debe estar redactada en tercera persona y debe responder solo y únicamente a la siguiente pregunta del usuario: “${userMessage}”.

Usá puntos y aparte con saltos de línea (\\n) para facilitar la lectura. No respondas temas fuera del contexto, ni preguntas de la vida privada de nadie.

`;
    }

    // Enviamos a OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Mi Sitio Web",
        },
        body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: generarPromptUsuario(contexto, userMessage),
                },
            ],
        }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no entendí.";
    res.json({ reply });

    /* 
    El objeto reply es el que llega al frontend cuando hacemos en chatbot.js un fetch('/api/chat', { method: 'POST', body: ... }) y luego lo procesás con const data = await response.json();. 
    
    {
        "reply": "Texto generado por el modelo según el contexto y la pregunta"
    }
    
    */
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));




async function consultarModeloConOpenRouter({ systemPrompt, contexto, userMessage, model }) {
  const generarPromptUsuario = (contexto, userMessage) => `
Contexto:\n${contexto}

Si no encontrás una respuesta a la pregunta del usuario, generá un resumen breve del contexto, manteniendo la claridad y el tono informativo.

Utilizando la parte útil del contexto, generá una respuesta en tercera persona que responda solo y únicamente a la siguiente pregunta del usuario: “${userMessage}”.

Usá puntos y aparte con saltos de línea (\\n) para facilitar la lectura. No respondas temas fuera del contexto, ni preguntas de la vida privada de nadie.
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Mi Sitio Web"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: generarPromptUsuario(contexto, userMessage) }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Lo siento, no entendí.";
}

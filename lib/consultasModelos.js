import { proveedores } from './proveedores.js';
import { modelosPorProveedor } from './modelosPorProveedor.js';

export async function consultarModeloConOpenRouter(promptSistema, promptUsuario) {

    const primerProveedor = proveedores.openrouter
    const primerModelo = modelosPorProveedor.openrouter[0];

    /*Pido los datos al modelo con el fetch(url,objeto) */
    const response = await fetch(primerProveedor.endpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Mi Sitio Web"
        },
        body: JSON.stringify({
            model: primerModelo,
            messages: [
                { role: "system", content: promptSistema },
                { role: "user", content: promptUsuario }
            ]
        })
    });

    const data = await response.json();
    console.log("Respuesta cruda del modelo 1:", data);

    // ❌ Si hay error o respuesta vacía, probamos el segundo modelo
    if (data.error || !data.choices?.[0]?.message?.content) {
        console.warn("Error o respuesta vacía. Probando primer modelo de respaldo...");
        return await probandoSegundoModelo(promptSistema, promptUsuario);
    }

    return data.choices[0].message.content || "Lo siento, no entendí.";
}


export async function probandoSegundoModelo(promptSistema, promptUsuario) {
    /* const segundoModelo = modelos[1]; */

    const segundoProveedor = proveedores.groq;
    const primerModelo = modelosPorProveedor.groq[0];


    const response = await fetch(segundoProveedor.endpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Mi Sitio Web"
        },
        body: JSON.stringify({
            model: primerModelo,
            messages: [
                { role: "system", content: promptSistema },
                { role: "user", content: promptUsuario }
            ]
        })
    });

    const data = await response.json();
    console.log("Respuesta cruda del modelo 2:", data);
    // ❌ Si hay error o respuesta vacía, probamos el tercer modelo
    if (data.error || !data.choices?.[0]?.message?.content) {
        console.warn("Error o respuesta vacía. Probando modelo de respaldo...");
        return await probandoTercerModelo(promptSistema, promptUsuario);
    }
    return data.choices?.[0]?.message?.content || "La respuesta falló incluso en el segundo modelo alternativo.";






}

export async function probandoTercerModelo(promptSistema, promptUsuario) {


    /* const tercerModelo = modelos[2]; */

    const tercerProveedor = proveedores.together;
    const primerModelo = modelosPorProveedor.together[0];

    if (!tercerModelo) return "No me entrenaron para responder ese tipo de preguntas.";

    console.log("→ Usando tercer modelo de respaldo:", tercerModelo);



    const response = await fetch(tercerProveedor, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Mi Sitio Web"
        },
        body: JSON.stringify({
            model: primerModelo,
            messages: [
                { role: "system", content: promptSistema },
                { role: "user", content: promptUsuario }
            ]
        })
    });

    const data = await response.json();
    console.log("Respuesta cruda del modelo 3:", data);
    return data.choices?.[0]?.message?.content || "No me entrenaron para responder ese tipo de preguntas.";
}

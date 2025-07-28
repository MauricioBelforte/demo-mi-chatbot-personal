# 💬 demo-mi-chatbot-personal

Bot funcional y auto-hospedado en Vercel, con datos propios en backend. Ideal para explorar respuestas personalizadas, lógica contextual desacoplada y despliegue real en producción. 
- En local: busca en la carpeta `server/` y levanta un servidor Express en `localhost`.
- En producción: Vercel detecta las carpetas `public/` y `api/`, creando automáticamente la ruta `/api/chatbotApi` desde el archivo `chatbotApi.js`.

---

## 🚀 ¿Qué hace este bot?

- Responde con contexto basado en datos reales (`/datos`)
- Tiene fallback si no encuentra información útil
- Modular y fácil de portar a otros entornos
- Funciona en local y en Vercel, usando backend embebido como función serverless

---

## 📁 Estructura actual del proyecto

```text
mi-chatbot-personal/
├── api/           # backend embebido para Vercel (chatbotApi.js)
├── datos/         # datos personales estructurados
├── lib/           # funciones compartidas entre frontend/backend
├── public/        # frontend estático, incluyendo HTML y JS
├── server/        # versión Express para uso local
├── vercel.json    # configuración explícita para servir frontend
├── .env (local)   # claves API privadas (no subidas al repo)
├── package.json   # dependencias y scripts
└── README.md      # este archivo 😎
```

---

## 💡 Cómo levantarlo en local

1. Asegurate de tener Node.js instalado
2. Cloná el proyecto o descargá el ZIP
3. Desde la raíz del proyecto, ejecutá:

```bash
npm install
npm start
```

> 🛠️ **Importante:** Si descargás el proyecto como ZIP desde GitHub, la carpeta `node_modules` no viene incluida. Debés correr `npm install` antes de ejecutar cualquier script. Este paso soluciona errores como:
>
> ```
> Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express'
> ```

---

## 🌐 Cómo desplegarlo en Vercel

Este repositorio está adaptado para deploy directo en [Vercel](https://vercel.com/) sin frameworks externos. Solo necesitás:

1. Crear un nuevo proyecto en Vercel
2. Importar este repositorio desde GitHub
3. Agregar las variables de entorno en el panel (`OPENROUTER_API_KEY`, etc.)
4. Confirmar que el archivo `vercel.json` esté presente y contenga:

```json
{
  "outputDirectory": "public",
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> 🦸 Este archivo le indica a Vercel que debe servir los archivos estáticos desde `/public`. Sin él, el deploy puede terminar en pantalla "Congratulations!"... pero con error `404`.

---

## ⚙️ Backend en Vercel

Vercel no ejecuta tu `server.js`. En su lugar:

- Cada archivo dentro de `/api/` es una función serverless (ej.: `chatbotApi.js`)
- El frontend hace `fetch("/api/chatbotApi")` para comunicarse
- El backend responde con lógica modular definida en `/lib/`

🔧 Ejemplo de fetch en frontend:

```js
const res = await fetch("/api/chatbotApi", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ mensaje: "Hola" })
});
const data = await res.json();
```

---

## 🔐 Variables de entorno recomendadas

Estas claves no deben subirse al repo. En Vercel, ingresalas manualmente:

```
OPENROUTER_API_KEY=sk-xxx...
TOGETHER_API_KEY=xxx...
GROQ_API_KEY=xxx...
```

---

## 🧠 Lecciones aprendidas

- ✅ Al descargar un ZIP de GitHub, recordá correr `npm install` antes de `npm start`
- ✅ Vercel requiere `"outputDirectory"` explícito si no detecta framework
- ✅ El backend embebido como `/api/chatbotApi.js` evita usar `express` en producción
- ✅ Compartir lógica en `/lib/` permite reutilizar funciones entre entornos

---

## 💬 ¿Querés saber más sobre mí?

Preguntale al bot. Está hecho para eso.  
Él tiene las respuestas. Y los datos.  
Si querés conocerme, charlá con él 😉

---

> ℹ️ Este repositorio fue renombrado como `demo-mi-chatbot-personal` para reflejar su rol como demo funcional dentro del ecosistema IA modular.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Podés usarlo, modificarlo y distribuirlo libremente.  
Consultá el archivo `LICENSE` para ver el texto completo.
```


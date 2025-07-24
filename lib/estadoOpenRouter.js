// lib/estadoOpenRouter.js

export async function obtenerEstadoOpenRouter() {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error("No se encontró OPENROUTER_API_KEY en las variables de entorno.");
        }

        const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ Error al consultar el estado de OpenRouter:", error.message);
        return null;
    }
}

export async function chequearLimiteOpenRouter() {
    const info = await obtenerEstadoOpenRouter();

    if (info && info.data) {
        const { usage, limit, is_free_tier } = info.data;

        console.log(`🔐 [OpenRouter] Uso actual: ${usage}/${limit ?? "∞"}`);
        console.log(`🆓 [OpenRouter] Plan gratuito: ${is_free_tier ? "Sí" : "No"}`);

        const limiteNum = typeof limit === "number" ? limit : Infinity;

        if (usage >= limiteNum) {
            console.warn("⚠️ [OpenRouter] Límite excedido. Activando fallback...");
            return {
                degradado: true,
                proveedor: "openrouter",
                usage,
                limit: limiteNum,
                is_free_tier
            };
        }
    }

    return { degradado: false, proveedor: "openrouter" };
}

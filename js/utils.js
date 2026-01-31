/**
 * js/utils.js - Herramientas Matemáticas y de Dibujo Civil
 */

const BIMUtils = {
    /**
     * Limpia un canvas y dibuja la grilla base
     * @param {HTMLCanvasElement} canvas 
     * @param {string} title - Nombre del visor
     */
    drawGrid(canvas, title) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const step = 40; // Tamaño de la cuadrícula en píxeles

        // 1. Limpieza de fondo
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);

        // 2. Dibujo de Grilla (Líneas tenues)
        ctx.beginPath();
        ctx.strokeStyle = '#151518';
        ctx.lineWidth = 1;

        for (let x = 0; x <= w; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let y = 0; y <= h; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();

        // 3. Ejes de referencia (Cruces sutiles en el centro)
        ctx.beginPath();
        ctx.strokeStyle = '#222';
        ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
        ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
        ctx.stroke();

        // 4. Marca de agua técnica
        ctx.fillStyle = '#333';
        ctx.font = '8px Orbitron';
        ctx.fillText(`${title} | VISOR TI V2.0`, 15, h - 15);
    },

    /**
     * Convierte coordenadas de proyecto a píxeles de pantalla
     * @param {number} x - Valor real (Easting o Progresiva)
     * @param {number} y - Valor real (Northing o Elevación)
     * @param {Object} bounds - Límites del proyecto {minX, maxX, minY, maxY}
     * @param {number} w - Ancho del canvas
     * @param {number} h - Alto del canvas
     * @param {number} padding - Margen de seguridad
     */
    worldToScreen(x, y, bounds, w, h, padding = 40) {
        const scaleX = (w - padding * 2) / (bounds.maxX - bounds.minX);
        const scaleY = (h - padding * 2) / (bounds.maxY - bounds.minY);
        
        // Usamos la misma escala para ambos ejes para no deformar la geometría (Escala 1:1)
        const scale = Math.min(scaleX, scaleY);

        const screenX = padding + (x - bounds.minX) * scale;
        // Invertimos Y porque en Canvas el 0 está arriba
        const screenY = h - (padding + (y - bounds.minY) * scale);

        return { x: screenX, y: screenY, scale: scale };
    }
};

/**
 * Función Orquestadora para redibujar todos los visores
 */
window.drawAll = (currentK) => {
    const vPlanta = document.getElementById('canvas-planta');
    const vPerfil = document.getElementById('canvas-perfil');
    const vSeccion = document.getElementById('canvas-seccion');

    if (vPlanta) BIMUtils.drawGrid(vPlanta, "PLANTA");
    if (vPerfil) BIMUtils.drawGrid(vPerfil, "PERFIL");
    if (vSeccion) BIMUtils.drawGrid(vSeccion, "ST");

    // Aquí llamaremos a las funciones de dibujo de líneas cuando carguemos los JSON
    console.log(`Renderizando grillas técnicas para PK: ${currentK}`);
};
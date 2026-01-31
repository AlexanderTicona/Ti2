/**
 * js/state.js - Gestión de Estado BIM 4.0
 */
const appState = {
    ui: {
        currentK: 0,
        minK: 0,
        maxK: 100 // Se actualizará al cargar tus JSON
    },

    /**
     * Sincroniza el PK en toda la App
     */
    setPK(val, origin = 'slider') {
        let numericValue;

        if (origin === 'input') {
            numericValue = this.parsePK(val);
        } else {
            numericValue = parseFloat(val);
        }

        // Validaciones de rango
        if (isNaN(numericValue)) numericValue = this.ui.currentK;
        if (numericValue < this.ui.minK) numericValue = this.ui.minK;
        if (numericValue > this.ui.maxK) numericValue = this.ui.maxK;

        this.ui.currentK = numericValue;

        // Actualizar el Input de texto (PK 0+000.00)
        const input = document.getElementById('pk-input');
        if (input && origin !== 'input') {
            input.value = this.formatPK(numericValue);
        }

        // Actualizar el Slider (si el cambio vino del teclado)
        const slider = document.getElementById('master-slider');
        if (slider && origin !== 'slider') {
            slider.value = numericValue;
        }

        this.notifyViewers();
    },

    formatPK(val) {
        const km = Math.floor(val / 1000);
        const m = (val % 1000).toFixed(2).padStart(6, '0');
        return `${km}+${m}`;
    },

    parsePK(text) {
        const cleanText = text.replace(/\+/g, '').replace(/\s/g, '');
        return parseFloat(cleanText) || 0;
    },

    notifyViewers() {
        // Buscamos la función drawAll que vive en utils.js
        if (typeof window.drawAll === 'function') {
            window.drawAll(this.ui.currentK);
        } else {
            console.warn("Utils.js aún no ha cargado la función drawAll");
        }
    }
};
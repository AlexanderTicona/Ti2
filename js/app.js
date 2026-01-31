/**
 * js/app.js - Orquestador Global BIM 4.0
 */

// 1. SACAMOS LA FUNCIÓN AL ÁMBITO GLOBAL
const resizeUI = () => {
    const containers = document.querySelectorAll('.v-container');
    containers.forEach(container => {
        if (container.offsetParent !== null) {
            const canvas = container.querySelector('canvas');
            const header = container.querySelector('.v-header');
            
            // Forzamos el tamaño real del contenedor
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight - (header ? header.offsetHeight : 0);
        }
    });
    
    // Notificamos al estado para que dispare el dibujo de utils.js
    if (window.appState && window.appState.notifyViewers) {
        window.appState.notifyViewers();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('viewport-grid');
    const navButtons = document.querySelectorAll('.nav-btn');
    const masterSlider = document.getElementById('master-slider');
    const pkInput = document.getElementById('pk-input');

    // Navegación de Layouts
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            grid.className = `layout-${btn.dataset.layout}`;
            
            // Redibujo automático tras el cambio de pestaña
            requestAnimationFrame(() => {
                setTimeout(resizeUI, 50);
            });
        });
    });

    // Control del Slider
    masterSlider.addEventListener('input', (e) => {
        appState.setPK(e.target.value, 'slider');
    });

    masterSlider.addEventListener('touchstart', (e) => {
        e.stopPropagation(); 
    }, { passive: true });

    // Input manual
    pkInput.addEventListener('change', (e) => {
        appState.setPK(e.target.value, 'input');
    });

    pkInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') pkInput.blur();
    });

    // Carga de archivos
    document.getElementById('trigger-file').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    // 1. Escuchar cambios de tamaño
    window.addEventListener('resize', resizeUI);
    
    // 2. Usar un observador para el grid (esto detecta cuando cambias de pestaña)
    new ResizeObserver(() => {
        resizeUI();
    }).observe(grid);

    // 3. LA SOLUCIÓN: Forzar el encendido inicial en tres etapas
    // Etapa 1: Inmediato
    resizeUI(); 
    
    // Etapa 2: Cuando el DOM está listo
    window.onload = () => {
        resizeUI();
    };

    // Etapa 3: Un pequeño retraso de seguridad para asegurar que el CSS cargó
    setTimeout(resizeUI, 300);
});
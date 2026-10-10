# Sesión de aprendizaje · Fracciones

Página educativa responsive en español, basada en la referencia visual proporcionada.

## Abrir la página
Descarga el repositorio y abre `index.html` en tu navegador. No requiere instalación ni compilación.

## Dónde modificar
- `index.html`: textos, objetivos y actividades. Las secciones están identificadas con comentarios y con los IDs inicio, desarrollo y cierre.
- `styles.css`: colores en :root, distribución, componentes y adaptación móvil al final del archivo.
- `app.js`: simulador, comprobación de equivalencia y botón de impresión.

## Publicar con GitHub Pages
En Settings → Pages, selecciona Deploy from a branch, rama main y carpeta / (root). GitHub mostrará la URL cuando termine la publicación.

## Uso
Modifica los numeradores y denominadores del simulador para comparar dos fracciones entre 0 y 1. Las figuras y la explicación se actualizan inmediatamente. El botón Imprimir permite guardar la sesión como PDF desde el navegador.

## Accesibilidad
HTML semántico, etiquetas para controles, foco visible, mensajes anunciados con aria-live y adaptación a pantallas pequeñas. La equivalencia se comunica mediante texto además del color.

## Verificación
Revisión estática de IDs y prueba de la lógica del simulador con un DOM simulado: estado inicial, equivalencia, desigualdad, límite del numerador y reinicio. Pendiente de comprobación visual y funcional en un navegador real.

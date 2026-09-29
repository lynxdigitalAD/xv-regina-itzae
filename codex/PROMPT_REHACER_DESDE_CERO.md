# CODEX — REHACER VISUALMENTE BIEN DESDE CERO

IGNORA por completo cualquier implementación anterior basada en screenshots/secciones completas.

## Regla principal
La imagen `reference/referencia_aprobada.png` es SOLO referencia visual.
NO usarla como fondo.
NO usar `reference/seccion_*.png` como fondo.
NO colocar hotspots invisibles sobre screenshots.
NO tapar textos de screenshots con rectángulos.

Construye una WEB REAL con HTML/CSS/JS (o componentes si el proyecto ya usa framework).

## Assets correctos
Los archivos de `assets/` son PIEZAS decorativas que sí puedes colocar:
- laterales
- personajes
- pergamino limpio
- reloj limpio
- letreros
- texturas pequeñas

Están extraídos de la referencia para conservar el aspecto.

## Fondos
Los fondos centrales deben construirse con CSS usando:
`codex/theme_reference.css`
y capas de gradientes oscuros azul petróleo, neblina y glow.

Puedes usar `count_path_texture.png` o `hero_bottom_path_texture.png` como textura secundaria discreta,
pero NO una captura completa de sección.

## Portada
Debe ser 100svh y mostrar únicamente la portada antes de abrir.
Layout desktop:
- decoración izquierda: `hero_left_decor.png`
- centro: títulos HTML reales
- decoración derecha: `hero_right_decor.png`
- usar además `hero_cat.png`, `hero_hatter.png` o `hero_girl.png` solo si hace falta mayor control.
- no duplicar elementos si ya están visibles en un panel lateral.

Centro HTML:
Mis
XV
Años
Regina Itzae
Avila Espinosa
botón real “Abrir invitación”
texto “Desliza para descubrir la magia”

El botón debe tener glow rosa/morado y estar integrado al diseño.

## Bendición / Padrinos
NO usar un rectángulo beige.
Usar `assets/family/family_parchment_clean.png` como pergamino real.
Texto HTML centrado encima.
Colocar `family_left_decor.png` y `family_right_decor.png` en laterales.

## Contador
Usar `assets/countdown/pocket_watch_clean.png` cuatro veces.
Los números y labels son HTML reales.
No poner cajas detrás de “Faltan”.
Usar `count_left_decor.png` y `count_right_decor.png`.
`count_path_texture.png` puede ir muy suave en el fondo central.

## Mapas
Construir tabs, tarjeta y botón con HTML/CSS.
NO usar screenshot de la sección.
Decoración:
- `maps_left_decor.png`
- `maps_right_decor.png`
o `maps_cat_queen.png` si necesitas controlar ese personaje.
La tarjeta central debe tener fondo claro gris-azulado tipo mapa, no blanco plano.
Tabs:
Ceremonia / Recepción
Botón:
Abrir en Maps

## Confirmar asistencia
Construir título, subtítulo y botón WhatsApp con HTML.
Usar:
- `rsvp_left_decor.png`
- `rsvp_right_decor.png`
La sección debe conservar un camino oscuro central y glow rosado, sin cajas negras.

## Desktop
NO dejar una columna angosta con grandes bordes negros.
Usar contenedor visual de hasta 1180px y aprovechar el ancho.
Los recursos laterales deben crecer proporcionalmente y el contenido central seguir legible.

## Mobile
Usar composición vertical, pero los personajes/decoración deben permanecer en posición absoluta alrededor del contenido.
No convertir todo en tarjetas apiladas.

## Tipografías
- Cinzel Decorative: XV / títulos ceremoniales
- Great Vibes: Regina Itzae y script
- Cormorant Garamond: resto

## Comparación
Después de terminar cada sección:
1. abrir `reference/referencia_aprobada.png`
2. comparar color, proporción y densidad visual
3. corregir hasta que el sitio se sienta como LA MISMA DIRECCIÓN ARTÍSTICA

No continúes a la siguiente sección hasta que la actual esté visualmente cercana.

## Orden
1. Portada
2. Bendición / Padrinos
3. Contador
4. Mapas
5. Confirmar asistencia

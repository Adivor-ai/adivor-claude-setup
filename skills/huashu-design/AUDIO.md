# Audio de huashu-design (no viene en el repo)

Esta skill usa 43 archivos de audio: 6 pistas de música de fondo (BGM) y 37 efectos
de sonido (SFX). **No están en el repositorio a propósito.**

## Por qué no están

Pesan 26.9 MB, el 84% de la skill. Git guarda binarios sin comprimirlos ni poder
diferenciarlos: cada vez que se reemplaza un `.mp3`, el historial crece otros megabytes
**de forma permanente**, y todos los que clonen el repo los descargan para siempre,
aunque nunca produzcan una pieza con audio.

El `.gitignore` bloquea `*.mp3`, `*.wav`, `*.m4a`, `*.aac`, `*.ogg` y `*.flac` para que
no vuelvan a entrar por accidente.

## Cuándo los necesitas

Solo si vas a producir una **pieza animada con sonido**. Para prototipos, slides HTML,
demos interactivos y exploración de direcciones —que es el 90% del uso de esta skill—
no hacen falta y todo funciona igual.

## Cómo conseguirlos

1. Pídeselo al equipo: el paquete `huashu-audio.zip`.
2. Descomprímelo dentro de `skills/huashu-design/assets/`, respetando la estructura:
   - `assets/*.mp3` — las 6 pistas BGM
   - `assets/sfx/**/*.mp3` — los 37 efectos
3. No los agregues a git: el `.gitignore` ya los ignora, déjalo así.

## Qué falta exactamente

- BGM: `bgm-tutorial`, `bgm-tutorial-alt`, `bgm-ad`, `bgm-tech`, `bgm-educational`, `bgm-educational-alt`
- SFX: 37 archivos bajo `assets/sfx/` (container, feedback, transition, ui)

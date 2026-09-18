---
description: >-
  Configura el setup de Adivor sin copiar nada a mano. Parte A (una vez por
  máquina): escribe el reparto activa/off de las skills de diseño y el bloque
  deny en tu ~/.claude/settings.json. Parte B (una vez por repo): genera
  CLAUDE.md desde el stack real, un .claude/settings.json de proyecto y
  docs/features/. Fusiona sin pisar lo que ya tengas y enseña el diff antes de
  escribir. Triggers: «bootstrap», «configura mi setup», «aplica el reparto de
  skills», «prepara este repo».
---

# /bootstrap

Dos partes **independientes**. Pregunta cuál quiere antes de hacer nada:

- **A — Usuario.** Una sola vez por máquina. Toca `~/.claude/settings.json`.
- **B — Proyecto.** Una vez por repo. Toca el repo actual.
- **Ambas.**

`$ARGUMENTS` puede traer `a`, `b` o `ambas` para saltarse la pregunta.

`${CLAUDE_PLUGIN_ROOT}` es la raíz del plugin instalado. Úsala tal cual.

---

## Parte A — configuración de usuario

Un plugin **no puede** imponer `skillOverrides`: es un ajuste personal. Sin este
paso llegan las 8 skills de diseño activas, compitiendo por el mismo trigger.

### A.1 Enseñar qué cambiaría, sin escribir

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap-user.mjs" --dry-run
```

Pega la salida tal cual. No la resumas: la persona tiene que ver línea por línea
qué se añade.

Si dice `Nada que hacer: ya aplicado`, **para aquí**. Ya está configurada, no
hay nada que hacer. No insistas ni ofrezcas reaplicar.

Si dice `ABORTADO: ... no es JSON valido`, **para aquí** y muestra el error. No
intentes reparar el archivo.

### A.2 Confirmar

Pregunta si aplica. Dos opciones:

- todo (skills + bloque `deny`)
- solo las skills (añade `--skills-only`)

Si dice que no, termina sin escribir.

### A.3 Aplicar

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap-user.mjs" --apply
```

El script hace el respaldo, escribe y **se verifica solo** releyendo del disco.
Pega la sección de verificación completa.

Una línea `[--] <skill> = "on" por decision tuya, respetado` **no es un fallo**:
es el script negándose a pisar una elección previa. Dilo así, no como problema.

Si el exit code es 1, muestra el comando de reversión que imprime y no sigas
con la parte B.

### A.4 Cerrar

Di que hay que **reiniciar Claude Code** para que tome el cambio. Sin reinicio,
la sesión actual sigue viendo las 8 skills.

---

## Parte B — configuración de proyecto

Trabaja sobre el repo actual. Si no estás dentro de un repo git, dilo y para.

### B.1 Detectar el stack real

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap-project.mjs" --dry-run
```

Pega la salida. El stack sale de `package.json`, los lockfiles y los scripts
reales — no de una plantilla.

### B.2 CLAUDE.md

**Aquí no uses el script: escribe tú el archivo.** Un CLAUDE.md útil nace de leer
el repo, no de rellenar huecos.

Antes de escribir, lee de verdad: `package.json`, el README, la estructura de
carpetas, y un par de archivos fuente representativos.

El archivo debe caber en **menos de 100 líneas** y contener solo lo que un
recién llegado no puede deducir mirando el repo:

- Qué es el proyecto, en dos frases
- Los comandos reales, copiados de los scripts, no inventados
- Arquitectura: qué vive en cada carpeta y por qué
- Convenciones que el código ya sigue (nómbralas tras leerlo, no las supongas)
- Gotchas: lo que rompe si no lo sabes

No escribas consejos genéricos de programación. Si una frase valdría para
cualquier repo del mundo, sobra.

**Si `CLAUDE.md` ya existe: no lo sobreescribas.** Ofrece añadir o actualizar
solo este bloque, y deja intacto todo lo demás:

```markdown
<!-- adivor:bootstrap:inicio -->
...contenido generado...
<!-- adivor:bootstrap:fin -->
```

### B.3 Aplicar lo determinista

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap-project.mjs" --apply
```

Crea o fusiona `.claude/settings.json` con los permisos del stack detectado, y
crea `docs/features/`. También se verifica solo; pega esa sección.

El objetivo de ese archivo: que `settings.local.json` deje de ser el único sitio
donde se aprueba todo. Lo genérico se versiona y lo comparte el equipo.

### B.4 Cerrar

Recuerda que `.claude/settings.json` **se commitea** y `settings.local.json` no.

---

## Reglas para ti

1. **Nunca escribas en `~/.claude/settings.json` con Write o Edit.** Solo a
   través del script: es el único que fusiona, respalda y verifica.
2. **Nunca te saltes el dry-run.** Ver antes de escribir es el contrato.
3. **No repitas trabajo hecho.** `Nada que hacer` significa terminar, no
   reintentar.
4. **No des por verificado lo que no ejecutaste.** La verificación es la que
   imprime el script releyendo del disco, no tu impresión de que salió bien.
5. **Si algo falla, di qué falló y cómo revertirlo.** Con la ruta del respaldo.

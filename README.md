# Adivor Claude Setup

Agentes, comandos, skills y hooks del equipo de Adivor para Claude Code.

## Instalación

Dos líneas dentro de Claude Code:

```
/plugin marketplace add Adivor-ai/adivor-claude-setup
/plugin install adivor-setup@adivor
```

Reinicia Claude Code. Listo. Los cambios que subamos te llegan en tu siguiente sesión.

Para actualizar a mano en cualquier momento:

```
/plugin marketplace update adivor
```

## Qué trae

| Carpeta | Contenido |
|---|---|
| `agents/` | 16 subagentes: `code-reviewer`, `security-sentinel`, `test-engineer`, `verify-app`, `implementer`, `research-agent`, `feature-analyst`, `github-workflow`, `worktree-worker`, `docs-keeper`, `oncall-guide`, `code-simplifier`, `build-validator`, `design-auditor`, `ux-designer`, `claude-md-keeper` |
| `commands/` | 15 slash commands (ver tabla abajo) |
| `skills/` | Skills del equipo, incluidas las 8 de diseño (ver tabla abajo) |
| `hooks/` | `proteger-main.sh` (bloquea push directo a main/master/develop) y el motor `skill-eval` |
| `rules/` | Reglas globales |
| `settings.json` | Referencia para copiar a mano: bloque `deny` portable y reparto activa/off de skills. No se aplica solo (ver abajo) |
| `settings.windows.json` | 8 reglas `deny` adicionales, solo para Windows |

### Los 16 comandos con barra

| Comando | Cuándo se usa |
|---|---|
| `/pr-review` | Revisa un pull request ya abierto contra los estándares del proyecto |
| `/commit-push-pr` | Atajo que hace commit, push y abre el PR de una vez |
| `/verify` | Verificación go/no-go antes de mergear: build, tests, tipos, smoke |
| `/techdebt` | Barrido de deuda técnica sobre todo el proyecto, al cerrar una sesión |
| `/docs-sync` | Reporta qué documentación quedó desfasada respecto al código |
| `/code-quality` | Barrido de calidad sobre un codebase TypeScript/React completo |
| `/update-memory` | Extrae reglas nuevas de la conversación y las propone para CLAUDE.md |
| `/modularize-memory` | Parte un CLAUDE.md sobredimensionado en `.claude/rules/` |
| `/btw` | Pregunta rápida sin contaminar el contexto de la conversación actual |
| `/research` | Explora código que no conoces y produce un mapa de arquitectura |
| `/simplify` | Propone simplificaciones de los cambios recientes, sin cambiar comportamiento |
| `/pr-summary` | Redacta el resumen de un PR a partir del diff |
| `/cove` | Chain-of-Verification: el modelo verifica su propia respuesta antes de darla (viene de `skills/cove`, no de `commands/`) |
| `/cove-isolated` | Igual que `/cove` pero con subagentes aislados, para máxima exactitud |
| `/migrate` | Migra un proyecto de Task Master MCP a seguimiento en markdown |
| `/sync-workflow` | Actualiza el workflow de sincronización desde el repo plantilla |

### Los 16 agentes

| Agente | Cuándo se usa |
|---|---|
| `code-reviewer` | Revisión en 5 pasadas del código recién escrito, antes de commitear |
| `security-sentinel` | Auditoría de seguridad tras tocar auth, endpoints, datos o dependencias |
| `test-engineer` | Escribe y arregla tests, analiza cobertura |
| `verify-app` | Veredicto go/no-go antes de mergear. Es el paso final |
| `build-validator` | Corre lint, tipos y build en orden de costo y diagnostica el primer error |
| `implementer` | Ejecuta un plan ya escrito, tarea por tarea |
| `worktree-worker` | Ejecuta una tarea en un worktree separado y abre el PR |
| `research-agent` | Explora código existente y produce un `research.md` |
| `feature-analyst` | Convierte una idea en PRD, diseño técnico y plan de implementación |
| `github-workflow` | Flujo git completo: commits, ramas, conflictos, releases |
| `docs-keeper` | Mantiene docs de arquitectura, ADRs y README al día con el código |
| `oncall-guide` | Debugging de producción, incidentes, runbooks y postmortems |
| `code-simplifier` | Analiza complejidad de los cambios recientes y propone simplificaciones |
| `design-auditor` | Reporte de auditoría visual con hallazgos puntuados por severidad |
| `ux-designer` | Construye interfaces React: componentes, layouts, tokens |
| `claude-md-keeper` | Trabajo largo sobre CLAUDE.md, aislado en su propia ventana de contexto |

## Qué NO trae, y por qué

| No está | Por qué |
|---|---|
| **`deck-design-system`** | Contiene el método comercial de Adivor: reglas de entrega a cliente, convenciones de nombre de archivo, uso de material del cliente. No es una herramienta, es know-how del negocio. Se queda interno |
| **Los 43 `.mp3` de `huashu-design`** | Pesan 26.9 MB, el 84% de esa skill. Git no comprime ni diferencia binarios: cada reemplazo crecería el historial para siempre y todos los clonarían aunque nunca produzcan audio. Ver `skills/huashu-design/AUDIO.md` para conseguirlos |
| **`install.ps1`** | Era un instalador de PowerShell, solo Windows. Con el marketplace las dos líneas de `/plugin` son el único mecanismo: un script paralelo se desincroniza del plugin |
| **`settings.local.json`, `.credentials`, `agent-memory/`, `sessions/`** | Datos de máquina. El `.gitignore` los bloquea |

## Cómo elegir skill de diseño

Elige **una** skill de proceso. Si además quieres un look concreto, encadena **una** skill de estilo después. Nunca dos de la misma columna.

| Paso | Skill | Cuándo |
|---|---|---|
| **1. Proceso** (elige una) | `impeccable` 🟢 | UI de producto, o cualquier pantalla que ya tiene código |
| | `design-taste-frontend` 🟢 | Landing, portfolio o rediseño de web de marketing |
| | `frontend-designer` ⚪ | Un componente suelto, sin proyecto detrás |
| **2. Estilo** (opcional, elige una) | `minimalist-ui` ⚪ | Editorial monocromo cálido |
| | `industrial-brutalist-ui` ⚪ | Swiss print o terminal CRT, para mucho dato |
| | `high-end-visual-design` ⚪ | Agencia premium, Awwwards/Linear |
| **Aparte** | `huashu-design` ⚪ | Prototipo desechable o demo animada (instrucciones en chino) |
| | `design-taste-frontend-v1` ⚪ | Solo compatibilidad hacia atrás |

🟢 activa por defecto · ⚪ instalada pero en `off`: se invoca por nombre con `/nombre-skill`

**Ejemplos:**
- «diseña la pantalla de ajustes» → `impeccable`
- «haz una landing y que se vea cara» → `design-taste-frontend`, luego `high-end-visual-design`

Las 8 se instalan siempre. El `off` solo evita que compitan por el mismo trigger; cualquiera se activa escribiendo su nombre.

## Por qué hay dos archivos de configuración

| Archivo | Qué hace | Se aplica solo? |
|---|---|---|
| `hooks/hooks.json` | Los hooks del plugin: bloqueo de push a ramas protegidas, auto-formato, type-check, motor de skills | **Sí.** Claude Code lo carga al instalar el plugin |
| `settings.json` (raíz) | Permisos, variables de entorno y el reparto activa/off de skills | **No.** Un plugin no puede tocar tus settings personales |

`settings.json` está aquí como **referencia para copiar a mano**, no como algo que se
aplique al instalar. Lo importante que contiene:

```json
"skillOverrides": {
  "frontend-designer": "off",
  "design-taste-frontend-v1": "off",
  "minimalist-ui": "off",
  "industrial-brutalist-ui": "off",
  "high-end-visual-design": "off",
  "huashu-design": "off"
}
```

**Sin esto, las 8 skills de diseño te llegan activas y compiten entre sí por el mismo
trigger**, que es justo lo que el reparto evita. Copia ese bloque a tu
`~/.claude/settings.json` después de instalar.

### Qué cubre el bloque `deny`

`settings.json` trae un bloque `permissions.deny` con 16 reglas portables. No hay bloque
`allow`: cosas como `npm install` o `gh run` las apruebas tú la primera vez que las uses.

**Lo que bloquea:**

| Categoría | Reglas |
|---|---|
| Ejecución de código arbitrario | `node -e`, `node --eval`, `python -c`, `python3 -c` |
| Red saliente sin control | `curl`, `wget` |
| Lectura de secretos | `**/.env*`, `**/id_rsa*`, `**/*.pem`, `**/*credential*` |
| Push a ramas protegidas | `--force`, `-f`, y a `main` / `develop` con y sin `-u` |

**Lo que NO bloquea, y conviene que sepas:**

- **No sustituye a `proteger-main.sh`.** Las reglas `deny` solo atrapan texto literal: no
  ven un `push` estando parado en `main`, ni un refspec como `HEAD:main`. El hook sí. Las
  dos capas se complementan, no se reemplazan.
- **No cubre variantes que no estén escritas.** `node --experimental-x -e` o un alias propio
  se escapan.
- **No bloquea `git` en general**, ni lectura de archivos normales, ni `npm`, ni `docker`.
- **No es un sandbox.** Es una red de seguridad contra descuidos, no contra alguien
  decidido a saltársela.

### Reglas solo para Windows

`settings.windows.json` trae 8 reglas más que **solo tienen sentido en Windows**: cierran
PowerShell como vía de escape (`Invoke-Expression`, `iex`, `Invoke-WebRequest`, `iwr`,
`Invoke-RestMethod`, lectura de `.env` por PowerShell, y `powershell` / `powershell.exe`
invocados desde bash).

Si estás en Mac o Linux, ignora ese archivo. Si estás en Windows, añade esas reglas a tu
bloque `deny` junto con las 16 portables.

## Convenciones

Reglas que aplican a todo lo que se suba a este repo.

### Rutas: siempre `~/`, nunca absolutas

```
✅  ~/.claude/agent-memory/code-reviewer/
✅  .claude/skills/impeccable/scripts/context.mjs
❌  C:\Users\TuNombre\.claude\agent-memory\code-reviewer\
❌  /Users/tunombre/.claude/...
❌  D:\Work\proyecto\...
```

Una ruta absoluta funciona en una sola máquina. Este repo lo usan personas en Windows y en Mac: `~/` funciona en ambos, `C:\` no. Además una ruta absoluta filtra tu nombre de usuario.

### Separadores: `/`, nunca `\`

Las barras normales funcionan en Windows, en Mac y en Linux. Las invertidas solo en Windows, y encima hay que escaparlas en JSON y en YAML.

### Nada específico de una máquina o de un cliente

No subas: nombres de cliente, endpoints internos, slugs de organización, correos, tokens ni llaves. Si un ejemplo necesita un valor, usa un placeholder: `SENTRY_ORG=tu-org`, `API_KEY=xxx`.

### Nada de binarios pesados

Sin audio, video ni imágenes grandes. El `.gitignore` bloquea `*.mp3`, `*.wav`, `*.m4a`, `*.aac`, `*.ogg` y `*.flac`. Si una skill necesita assets pesados, documenta de dónde bajarlos.

### Antes de subir

Los hooks de este repo bloquean el push directo a `main`, `master` y `develop`. El flujo es rama + PR.

## Dudas

Abre un issue en este repo.

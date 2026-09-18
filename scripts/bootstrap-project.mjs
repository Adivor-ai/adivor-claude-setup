#!/usr/bin/env node
/**
 * bootstrap-project.mjs - parte B: configuracion de proyecto.
 *
 * NO genera CLAUDE.md: eso lo hace el modelo desde /bootstrap, porque un
 * CLAUDE.md util nace de leer el repo, no de rellenar una plantilla. Este
 * script hace lo determinista: detecta el stack, fusiona .claude/settings.json
 * sin pisar nada, y crea docs/features/.
 *
 * Uso:
 *   node bootstrap-project.mjs --detect      imprime el stack en JSON
 *   node bootstrap-project.mjs --dry-run
 *   node bootstrap-project.mjs --apply
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const args = new Set(process.argv.slice(2));
const modo = args.has('--apply') ? 'apply' : args.has('--detect') ? 'detect' : 'dry-run';
const OKM = '  [ok] ';

function leerJSON(p) {
  try { return JSON.parse(readFileSync(p, 'utf8').replace(/^﻿/, '')); }
  catch { return null; }
}

function detectar() {
  const hay = (f) => existsSync(join(RAIZ, f));
  const pkg = leerJSON(join(RAIZ, 'package.json'));
  const s = pkg && pkg.scripts ? pkg.scripts : {};
  const dep = Object.assign({}, pkg && pkg.dependencies, pkg && pkg.devDependencies);
  const tiene = (n) => Object.prototype.hasOwnProperty.call(dep, n);

  let gestor = 'npm';
  if (hay('pnpm-lock.yaml')) gestor = 'pnpm';
  else if (hay('yarn.lock')) gestor = 'yarn';
  else if (hay('bun.lockb')) gestor = 'bun';

  const marcos = [];
  if (tiene('next')) marcos.push('Next.js');
  if (tiene('react') && !tiene('next')) marcos.push('React');
  if (tiene('vue')) marcos.push('Vue');
  if (tiene('svelte')) marcos.push('Svelte');
  if (tiene('astro')) marcos.push('Astro');
  if (tiene('express') || tiene('fastify') || tiene('hono')) marcos.push('backend Node');

  const tests = [];
  if (tiene('vitest')) tests.push('vitest');
  if (tiene('jest')) tests.push('jest');
  if (tiene('@playwright/test')) tests.push('playwright');

  return {
    gestor,
    // En un monorepo el tsconfig no vive en la raiz: la dependencia y el
    // script typecheck son mejores senales que el archivo.
    lenguaje: (hay('tsconfig.json') || tiene('typescript') || !!s.typecheck || !!s['type-check'])
      ? 'TypeScript' : (pkg ? 'JavaScript' : 'desconocido'),
    marcos,
    tests,
    monorepo: hay('pnpm-workspace.yaml') || !!(pkg && pkg.workspaces),
    scripts: Object.keys(s),
    comandos: {
      dev: s.dev ? gestor + ' run dev' : null,
      build: s.build ? gestor + ' run build' : null,
      test: s.test ? gestor + ' run test' : null,
      lint: s.lint ? gestor + ' run lint' : null,
      typecheck: s.typecheck ? gestor + ' run typecheck'
                : (s['type-check'] ? gestor + ' run type-check' : null),
    },
    yaExiste: {
      claudeMd: hay('CLAUDE.md'),
      settingsProyecto: hay('.claude/settings.json'),
      docsFeatures: hay('docs/features'),
    },
  };
}

/** Permisos genericos que valen para cualquier repo con este stack. */
function permisosDe(st) {
  const g = st.gestor;
  const a = ['Bash(git status:*)', 'Bash(git diff:*)', 'Bash(git log:*)',
             'Bash(git add:*)', 'Bash(git branch:*)', 'Bash(git checkout:*)',
             'Bash(ls:*)', 'Bash(cat:*)', 'Bash(rg:*)', 'Bash(find:*)'];
  ['dev', 'build', 'test', 'lint', 'typecheck'].forEach((k) => {
    if (st.comandos[k]) a.push('Bash(' + g + ' run ' + k + ':*)');
  });
  if (st.tests.includes('vitest')) a.push('Bash(' + g + ' exec vitest:*)');
  if (st.tests.includes('playwright')) a.push('Bash(' + g + ' exec playwright:*)');
  if (st.lenguaje === 'TypeScript') a.push('Bash(' + g + ' exec tsc:*)');
  a.push('Bash(' + g + ' install:*)', 'Bash(gh pr view:*)', 'Bash(gh pr list:*)');
  return a;
}

function fusionarSettings(nuevos) {
  const ruta = join(RAIZ, '.claude', 'settings.json');
  const previo = existsSync(ruta) ? leerJSON(ruta) : {};
  if (existsSync(ruta) && previo === null) {
    console.error('\nABORTADO: .claude/settings.json existe pero no es JSON valido.');
    console.error('  No se escribio nada.\n');
    process.exit(2);
  }
  const d = previo || {};
  const actual = (d.permissions && d.permissions.allow) || [];
  const faltan = nuevos.filter((r) => !actual.includes(r));
  return { ruta, d, faltan, existia: existsSync(ruta) };
}

const st = detectar();

if (modo === 'detect') {
  console.log(JSON.stringify(st, null, 2));
  process.exit(0);
}

console.log('\nSTACK DETECTADO');
console.log('  gestor      : ' + st.gestor);
console.log('  lenguaje    : ' + st.lenguaje);
console.log('  marcos      : ' + (st.marcos.join(', ') || 'ninguno detectado'));
console.log('  tests       : ' + (st.tests.join(', ') || 'ninguno detectado'));
console.log('  monorepo    : ' + (st.monorepo ? 'si' : 'no'));
const cmds = Object.keys(st.comandos).filter((k) => st.comandos[k]);
console.log('  comandos    : ' + (cmds.map((k) => k + ' -> ' + st.comandos[k]).join('\n                ') || 'ninguno'));

const permisos = permisosDe(st);
const fus = fusionarSettings(permisos);
console.log('\n.claude/settings.json' + (fus.existia ? '' : '  (se creara)'));
if (fus.faltan.length) {
  console.log('  Se anadiran ' + fus.faltan.length + ' permisos allow:');
  fus.faltan.forEach((r) => console.log('    + ' + r));
} else console.log(OKM + 'nada que anadir');

console.log('\nCLAUDE.md');
console.log(st.yaExiste.claudeMd
  ? '  [!] ya existe: NO se sobreescribe. /bootstrap te ofrecera actualizar un bloque delimitado.'
  : '  se generara desde el stack de arriba (lo escribe el modelo, no este script)');

console.log('\ndocs/features/');
console.log(st.yaExiste.docsFeatures ? OKM + 'ya existe' : '  se creara con su README');

if (modo === 'dry-run') {
  console.log('\n(dry-run: no se escribio nada. Para aplicar: --apply)\n');
  process.exit(0);
}

if (fus.faltan.length) {
  mkdirSync(join(RAIZ, '.claude'), { recursive: true });
  fus.d.permissions = fus.d.permissions || {};
  fus.d.permissions.allow = ((fus.d.permissions.allow) || []).concat(fus.faltan);
  writeFileSync(fus.ruta, JSON.stringify(fus.d, null, 2) + '\n', 'utf8');
  console.log('\nEscrito: .claude/settings.json');
}
if (!st.yaExiste.docsFeatures) {
  mkdirSync(join(RAIZ, 'docs', 'features'), { recursive: true });
  writeFileSync(join(RAIZ, 'docs', 'features', 'README.md'),
    '# Features\n\nUna carpeta por feature, con la cadena intent -> spec -> plan:\n\n' +
    '- `intent.md`  el problema y para quien, sin solucion todavia\n' +
    '- `spec.md`    que debe hacer, con criterios de aceptacion verificables\n' +
    '- `plan.md`    como se implementa, en pasos pequenos y verificables\n\n' +
    'Creada por `/bootstrap`.\n', 'utf8');
  console.log('Creado: docs/features/README.md');
}

console.log('\nVERIFICACION (releyendo del disco)\n');
let fallos = 0;
const rel = leerJSON(fus.ruta);
if (rel === null) { console.log('  [XX] .claude/settings.json no parsea'); fallos++; }
else {
  console.log(OKM + '.claude/settings.json parsea');
  const al = (rel.permissions && rel.permissions.allow) || [];
  const f = permisos.filter((r) => !al.includes(r));
  if (!f.length) console.log(OKM + 'los ' + permisos.length + ' permisos estan presentes');
  else { console.log('  [XX] faltan ' + f.length + ' permisos'); fallos++; }
}
if (existsSync(join(RAIZ, 'docs', 'features'))) console.log(OKM + 'docs/features/ existe');
else { console.log('  [XX] docs/features/ no existe'); fallos++; }
console.log(fallos ? '\nFALLARON ' + fallos + ' comprobaciones.\n' : '\nParte B lista.\n');
process.exit(fallos ? 1 : 0);

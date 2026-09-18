#!/usr/bin/env node
/**
 * bootstrap-user.mjs - configuracion de usuario del plugin adivor-setup.
 *
 * Escribe en ~/.claude/settings.json el reparto activa/off de las skills de
 * diseno y, opcionalmente, el bloque deny portable. Un plugin no puede imponer
 * skillOverrides: es un ajuste personal. Por eso hace falta este paso.
 *
 * Principios:
 *   - Solo ANADE lo que falta. Nunca pisa un valor que la persona ya eligio.
 *   - Si el JSON no parsea, aborta sin escribir.
 *   - Respaldo fechado antes de cualquier escritura.
 *   - Idempotente por CONTENIDO, no por marcador.
 *
 * Uso:
 *   node bootstrap-user.mjs --dry-run
 *   node bootstrap-user.mjs --apply [--skills-only]
 *   node bootstrap-user.mjs --verify
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const OFF = ['frontend-designer', 'design-taste-frontend-v1', 'minimalist-ui',
             'industrial-brutalist-ui', 'high-end-visual-design', 'huashu-design'];
const ACTIVAS = ['impeccable', 'design-taste-frontend'];
const GP = 'git' + ' ' + 'push';
const DENY = [
  'Read(**/.env*)', 'Read(**/id_rsa*)', 'Read(**/*.pem)', 'Read(**/*credential*)',
  'Bash(curl:*)', 'Bash(wget:*)',
  'Bash(node -e:*)', 'Bash(node --eval:*)',
  'Bash(python -c:*)', 'Bash(python3 -c:*)',
  'Bash(' + GP + ' --force:*)', 'Bash(' + GP + ' -f:*)',
  'Bash(' + GP + ' origin main:*)', 'Bash(' + GP + ' origin develop:*)',
  'Bash(' + GP + ' -u origin main:*)', 'Bash(' + GP + ' -u origin develop:*)',
];

const CFG = process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude');
const SETTINGS = join(CFG, 'settings.json');
const args = new Set(process.argv.slice(2));
const modo = args.has('--apply') ? 'apply' : args.has('--verify') ? 'verify' : 'dry-run';
const soloSkills = args.has('--skills-only');
const OKM = '  [ok] ';
const NOM = '  [XX] ';

function leer() {
  if (!existsSync(SETTINGS)) return { datos: {}, existia: false };
  const crudo = readFileSync(SETTINGS, 'utf8').replace(/^﻿/, '');
  if (!crudo.trim()) return { datos: {}, existia: true };
  try {
    return { datos: JSON.parse(crudo), existia: true };
  } catch (e) {
    console.error('\nABORTADO: ' + SETTINGS + ' no es JSON valido.');
    console.error('  ' + e.message);
    console.error('  No se escribio nada. Arregla el archivo y vuelve a correr.\n');
    process.exit(2);
  }
}

function planear(d) {
  const so = d.skillOverrides || {};
  const deny = (d.permissions && d.permissions.deny) || [];
  return {
    skillsAnadir: OFF.filter((s) => so[s] === undefined),
    skillsRespetadas: OFF.filter((s) => so[s] !== undefined && so[s] !== 'off').map((s) => [s, so[s]]),
    skillsYaOff: OFF.filter((s) => so[s] === 'off'),
    activasDeclaradas: ACTIVAS.filter((s) => so[s] !== undefined).map((s) => [s, so[s]]),
    denyAnadir: soloSkills ? [] : DENY.filter((r) => !deny.includes(r)),
    denyYaEsta: DENY.filter((r) => deny.includes(r)),
  };
}

function mostrarPlan(p, existia) {
  console.log('\nArchivo: ' + SETTINGS + (existia ? '' : '  (se creara)') + '\n');
  console.log('SKILLS DE DISENO');
  if (p.skillsAnadir.length) {
    console.log('  Se anadiran en "off":');
    p.skillsAnadir.forEach((s) => console.log('    + ' + s + ': "off"'));
  }
  p.skillsYaOff.forEach((s) => console.log(OKM + s + ' ya estaba en "off"'));
  p.skillsRespetadas.forEach((par) =>
    console.log('  [!] ' + par[0] + ' ya vale "' + par[1] + '": SE RESPETA tu eleccion, no se toca'));
  p.activasDeclaradas.forEach((par) =>
    console.log('  [!] ' + par[0] + ' vale "' + par[1] + '"; para quedar activa deberia estar ausente'));
  if (!p.skillsAnadir.length && !p.skillsRespetadas.length) console.log(OKM + 'nada que anadir');

  console.log('\nBLOQUE DENY');
  if (soloSkills) { console.log('  (omitido: --skills-only)'); return; }
  if (p.denyAnadir.length) {
    console.log('  Se anadiran ' + p.denyAnadir.length + ' reglas:');
    p.denyAnadir.forEach((r) => console.log('    + ' + r));
  }
  if (p.denyYaEsta.length) console.log(OKM + p.denyYaEsta.length + ' reglas ya presentes');
  if (!p.denyAnadir.length) console.log(OKM + 'nada que anadir');
  console.log('\nNO se toca: permissions.allow, env, hooks, model, ni ninguna otra clave.');
}

function aplicar(d, p) {
  mkdirSync(join(CFG, 'backups'), { recursive: true });
  const fecha = new Date().toISOString().slice(0, 10);
  const resp = join(CFG, 'backups', 'settings-pre-bootstrap-' + fecha + '.json');
  if (existsSync(SETTINGS)) {
    writeFileSync(resp, readFileSync(SETTINGS));
    console.log('\nRespaldo: ' + resp);
  }
  d.skillOverrides = d.skillOverrides || {};
  p.skillsAnadir.forEach((s) => { d.skillOverrides[s] = 'off'; });
  if (!soloSkills && p.denyAnadir.length) {
    d.permissions = d.permissions || {};
    d.permissions.deny = (d.permissions.deny || []).concat(p.denyAnadir);
  }
  writeFileSync(SETTINGS, JSON.stringify(d, null, 2) + '\n', 'utf8');
  writeFileSync(join(CFG, '.adivor-bootstrap.json'), JSON.stringify({
    version: '0.1.0', appliedAt: new Date().toISOString(),
    nota: 'registro informativo; la verdad esta en settings.json',
  }, null, 2) + '\n');
  console.log('Escrito:  ' + SETTINGS);
  return resp;
}

function verificar() {
  console.log('\nVERIFICACION (releyendo del disco)\n');
  let fallos = 0;
  let d;
  try {
    d = JSON.parse(readFileSync(SETTINGS, 'utf8').replace(/^﻿/, ''));
    console.log(OKM + 'settings.json vuelve a parsear como JSON valido');
  } catch (e) {
    console.log(NOM + 'settings.json NO parsea: ' + e.message);
    return 1;
  }
  const so = d.skillOverrides || {};
  OFF.forEach((s) => {
    if (so[s] === 'off') { console.log(OKM + s + ' = "off"'); return; }
    if (so[s] === undefined) {
      // Falta de verdad: el bootstrap deberia haberla escrito.
      console.log(NOM + s + ' ausente (se esperaba "off")'); fallos++; return;
    }
    // Presente con otro valor: es una decision explicita de la persona. No es
    // un fallo del bootstrap, que por diseno nunca pisa lo que ya existe.
    console.log('  [--] ' + s + ' = "' + so[s] + '" por decision tuya, respetado');
  });
  ACTIVAS.forEach((s) => {
    if (so[s] === undefined || so[s] === 'on') console.log(OKM + s + ' activa');
    else { console.log(NOM + s + ' = "' + so[s] + '", deberia estar activa'); fallos++; }
  });
  if (!soloSkills) {
    const deny = (d.permissions && d.permissions.deny) || [];
    const faltan = DENY.filter((r) => !deny.includes(r));
    if (!faltan.length) console.log(OKM + 'las ' + DENY.length + ' reglas deny estan presentes');
    else { console.log(NOM + 'faltan ' + faltan.length + ' reglas deny'); fallos++; }
    if (d.permissions && d.permissions.allow)
      console.log(OKM + 'permissions.allow intacto (' + d.permissions.allow.length + ' reglas)');
  }
  return fallos;
}

const leido = leer();
const plan = planear(leido.datos);
const nadaQueHacer = !plan.skillsAnadir.length && !plan.denyAnadir.length;

if (modo === 'verify') process.exit(verificar() === 0 ? 0 : 1);

if (nadaQueHacer) {
  console.log('\nNada que hacer: ya aplicado (' + plan.skillsYaOff.length + '/' + OFF.length +
              ' skills, ' + plan.denyYaEsta.length + '/' + DENY.length + ' reglas deny).');
  plan.skillsRespetadas.forEach((par) =>
    console.log('  [!] ' + par[0] + ' vale "' + par[1] + '" por decision tuya'));
  process.exit(0);
}

mostrarPlan(plan, leido.existia);
if (modo === 'dry-run') {
  console.log('\n(dry-run: no se escribio nada. Para aplicar: --apply)\n');
  process.exit(0);
}
const resp = aplicar(leido.datos, plan);
const fallos = verificar();
if (fallos) {
  console.log('\nFALLARON ' + fallos + ' comprobaciones. Para revertir:');
  console.log('  cp "' + resp + '" "' + SETTINGS + '"\n');
  process.exit(1);
}
console.log('\nListo. Reinicia Claude Code para que tome el cambio.\n');

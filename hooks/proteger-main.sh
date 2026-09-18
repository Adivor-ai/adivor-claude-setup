#!/bin/bash
# Bloquea empujar a main/master por dos vias independientes:
#   1. refspec: el comando apunta a main aunque estes parada en otra rama
#      (git push origin mi-rama:main, git push origin HEAD:refs/heads/main)
#   2. rama actual: estas parada en main y empujas, con o sin argumentos
#      (git push, git push origin HEAD:main)
#
# Por que las dos: una regla deny sobre el texto "git push origin main" no
# atrapa ninguno de los dos casos. El texto solo no basta, y la rama sola
# tampoco.
#
# Por que el ancla de frontera: sin ella, cualquier comando que solo MENCIONE
# un push a main (un script de prueba, un grep, editar esta misma doc) queda
# bloqueado. Se exige que 'git push' aparezca en posicion de comando: al
# inicio, o tras ; & | ( o &&. Una mencion dentro de comillas no cuenta.
#
# No usa jq a proposito: jq no esta instalado en esta maquina y fue lo que
# dejo muerto al antiguo validate-bash.sh.

INPUT=$(cat)

bloquear() {
  echo "{\"block\": true, \"message\": \"$1 El flujo es solo-PR. Haz: git checkout -b mi-cambio && git push -u origin mi-cambio, y luego abre el PR.\"}" >&2
  exit 2
}

# Puerta: solo invocaciones reales de git push, no menciones.
printf '%s' "$INPUT" | grep -qE '(^|["(;&|]|&&)[[:space:]]*git[[:space:]]+push([[:space:]]|")' || exit 0

# 1) Refspec hacia main/master/develop, desde cualquier rama.
case "$INPUT" in
  *":main"*|*":refs/heads/main"*|*":master"*|*":refs/heads/master"*|*":develop"*|*":refs/heads/develop"*)
    bloquear "Ese push apunta a una rama protegida por refspec." ;;
esac

# 2) Parada en main, master o develop.
RAMA=$(git branch --show-current 2>/dev/null)
if [ "$RAMA" = "main" ] || [ "$RAMA" = "master" ] || [ "$RAMA" = "develop" ]; then
  bloquear "Estas parada en $RAMA y no se empuja directo a esta rama."
fi

exit 0

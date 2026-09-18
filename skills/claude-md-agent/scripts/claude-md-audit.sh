#!/usr/bin/env bash
# claude-md-audit.sh — Analyze CLAUDE.md health across a project
# Usage: bash .claude/scripts/claude-md-audit.sh [project-root]
#
# Checks line counts, staleness signals, structure issues, and gives a health score.

set -euo pipefail

ROOT="${1:-.}"
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CLAUDE.md Health Audit${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo ""

# --- Find all CLAUDE.md files ---
echo -e "${CYAN}[1/5] Discovering CLAUDE.md files...${NC}"
CLAUDE_FILES=()
while IFS= read -r -d '' file; do
    CLAUDE_FILES+=("$file")
done < <(find "$ROOT" -name "CLAUDE.md" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.next/*" -print0 2>/dev/null)

# Also check .claude/ directory
if [[ -d "$ROOT/.claude" ]]; then
    while IFS= read -r -d '' file; do
        CLAUDE_FILES+=("$file")
    done < <(find "$ROOT/.claude" -name "*.md" -not -path "*/skills/*" -not -path "*/commands/*" -print0 2>/dev/null)
fi

if [[ ${#CLAUDE_FILES[@]} -eq 0 ]]; then
    echo -e "${RED}  No CLAUDE.md files found.${NC}"
    echo "  Run: tell Claude 'create a CLAUDE.md for this project' to generate one."
    exit 0
fi

echo -e "  Found ${#CLAUDE_FILES[@]} file(s)"
echo ""

# --- Analyze each file ---
echo -e "${CYAN}[2/5] Analyzing file sizes...${NC}"
TOTAL_LINES=0
OVER_BUDGET=0

for file in "${CLAUDE_FILES[@]}"; do
    REL_PATH="${file#$ROOT/}"
    LINES=$(wc -l < "$file" | tr -d ' ')
    TOTAL_LINES=$((TOTAL_LINES + LINES))

    # Determine threshold based on location
    if [[ "$REL_PATH" == "CLAUDE.md" || "$REL_PATH" == ".claude/CLAUDE.md" ]]; then
        THRESHOLD=100
        LABEL="root"
    elif [[ "$REL_PATH" == .claude/rules/* ]]; then
        THRESHOLD=60
        LABEL="rule"
    else
        THRESHOLD=40
        LABEL="subdir"
    fi

    if [[ $LINES -gt $THRESHOLD ]]; then
        echo -e "  ${RED}✗${NC} $REL_PATH — ${RED}${LINES} lines${NC} (target: <${THRESHOLD} for ${LABEL})"
        OVER_BUDGET=$((OVER_BUDGET + 1))
    elif [[ $LINES -gt $((THRESHOLD * 80 / 100)) ]]; then
        echo -e "  ${YELLOW}●${NC} $REL_PATH — ${YELLOW}${LINES} lines${NC} (approaching ${THRESHOLD} limit)"
    else
        echo -e "  ${GREEN}✓${NC} $REL_PATH — ${GREEN}${LINES} lines${NC}"
    fi
done

echo ""
echo "  Total instruction lines across all files: ${TOTAL_LINES}"
echo ""

# --- Check for common issues ---
echo -e "${CYAN}[3/5] Checking for common issues...${NC}"
ISSUES=0

for file in "${CLAUDE_FILES[@]}"; do
    REL_PATH="${file#$ROOT/}"

    # Check for vague rules
    VAGUE_COUNT=$(grep -ciE "(write clean|best practice|proper(ly)?|good code|be careful|as needed)" "$file" 2>/dev/null || echo "0")
    if [[ "$VAGUE_COUNT" -gt 0 ]]; then
        echo -e "  ${YELLOW}⚠${NC} $REL_PATH — ${VAGUE_COUNT} potentially vague rule(s) detected"
        ISSUES=$((ISSUES + 1))
    fi

    # Check for secrets/env patterns
    SECRET_COUNT=$(grep -ciE "(api[_-]?key|password|secret|token)\s*[:=]" "$file" 2>/dev/null || echo "0")
    if [[ "$SECRET_COUNT" -gt 0 ]]; then
        echo -e "  ${RED}✗${NC} $REL_PATH — ${RED}Possible secrets detected (${SECRET_COUNT} match(es))${NC}"
        ISSUES=$((ISSUES + 1))
    fi

    # Check for missing alternatives (Don't/Never without alternative)
    BARE_PROHIBITIONS=$(grep -cE "^-\s*(Don't|Never|Do not|NEVER|DON'T)" "$file" 2>/dev/null || echo "0")
    ALTERNATIVES=$(grep -cE "(instead|prefer|use .+ instead|rather)" "$file" 2>/dev/null || echo "0")
    if [[ "$BARE_PROHIBITIONS" -gt "$ALTERNATIVES" ]]; then
        MISSING=$((BARE_PROHIBITIONS - ALTERNATIVES))
        echo -e "  ${YELLOW}⚠${NC} $REL_PATH — ~${MISSING} prohibition(s) without alternatives"
        ISSUES=$((ISSUES + 1))
    fi

    # Check for overuse of emphasis
    EMPHASIS_COUNT=$(grep -cE "(IMPORTANT|CRITICAL|MUST|NEVER|ALWAYS)" "$file" 2>/dev/null || echo "0")
    if [[ "$EMPHASIS_COUNT" -gt 5 ]]; then
        echo -e "  ${YELLOW}⚠${NC} $REL_PATH — ${EMPHASIS_COUNT} emphasis markers (if everything is critical, nothing is)"
        ISSUES=$((ISSUES + 1))
    fi
done

if [[ $ISSUES -eq 0 ]]; then
    echo -e "  ${GREEN}✓${NC} No common issues detected"
fi
echo ""

# --- Check structure completeness ---
echo -e "${CYAN}[4/5] Checking structure...${NC}"
ROOT_FILE=""
if [[ -f "$ROOT/CLAUDE.md" ]]; then
    ROOT_FILE="$ROOT/CLAUDE.md"
elif [[ -f "$ROOT/.claude/CLAUDE.md" ]]; then
    ROOT_FILE="$ROOT/.claude/CLAUDE.md"
fi

if [[ -n "$ROOT_FILE" ]]; then
    # Commands is the highest-value section
    if grep -qiE "^#{1,3}\s.*Command" "$ROOT_FILE" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Commands section present (highest-value section)"
    else
        echo -e "  ${RED}✗${NC} Missing Commands section — this is the #1 most valuable section"
    fi

    if [[ -d "$ROOT/.claude/rules" ]] && [[ -n "$(ls -A "$ROOT/.claude/rules" 2>/dev/null)" ]]; then
        RULE_COUNT=$(find "$ROOT/.claude/rules" -name "*.md" | wc -l | tr -d ' ')
        echo -e "  ${GREEN}✓${NC} .claude/rules/ directory with ${RULE_COUNT} rule file(s)"
    else
        echo -e "  ${YELLOW}●${NC} No .claude/rules/ directory (optional, useful for modularization)"
    fi

    SUBDIR_COUNT=0
    for dir in "$ROOT/src" "$ROOT/app" "$ROOT/lib" "$ROOT/packages"; do
        if [[ -d "$dir" ]]; then
            COUNT=$(find "$dir" -name "CLAUDE.md" 2>/dev/null | wc -l | tr -d ' ')
            SUBDIR_COUNT=$((SUBDIR_COUNT + COUNT))
        fi
    done
    if [[ "$SUBDIR_COUNT" -gt 0 ]]; then
        echo -e "  ${GREEN}✓${NC} ${SUBDIR_COUNT} subdirectory CLAUDE.md file(s) for lazy loading"
    else
        echo -e "  ${YELLOW}●${NC} No subdirectory CLAUDE.md files (optional, good for large projects)"
    fi
else
    echo -e "  ${RED}✗${NC} No root CLAUDE.md found"
fi
echo ""

# --- Summary ---
echo -e "${CYAN}[5/5] Summary${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo "  Files:           ${#CLAUDE_FILES[@]}"
echo "  Total lines:     ${TOTAL_LINES}"
echo "  Over budget:     ${OVER_BUDGET}"
echo "  Issues found:    ${ISSUES}"

SCORE=100
SCORE=$((SCORE - OVER_BUDGET * 15))
SCORE=$((SCORE - ISSUES * 5))
if [[ -z "$ROOT_FILE" ]]; then SCORE=$((SCORE - 30)); fi
if [[ $SCORE -lt 0 ]]; then SCORE=0; fi

if [[ $SCORE -ge 80 ]]; then
    echo -e "  Health score:    ${GREEN}${SCORE}/100${NC}"
elif [[ $SCORE -ge 50 ]]; then
    echo -e "  Health score:    ${YELLOW}${SCORE}/100${NC}"
else
    echo -e "  Health score:    ${RED}${SCORE}/100${NC}"
fi
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"

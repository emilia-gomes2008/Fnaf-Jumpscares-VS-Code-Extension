# 🐻 FNAF Jumpscares for VS Code

> **Good luck programming. They are watching.**

A VS Code extension that randomly scares you with Five Nights at Freddy's jumpscares while you program.

## Animatronics

| Animatronic | Game |
|---|---|
| 🟫 Freddy Fazbear | FNAF 1 |
| 🟣 Bonnie | FNAF 1 |
| 🟡 Chica | FNAF 1 |
| 🔴 Withered Foxy | FNAF 2 |
| 🩷 Mangle | FNAF 2 |
| ⚫ Fredbear Nightmare | FNAF 4 |

## Installation

### Option 1: Install via VSIX

1. Go to `Extensions` in VS Code (`Ctrl+Shift+X`)
2. Click on `...` (More Actions) → **Install from VSIX...**
3. Select the file `fnaf-jumpscares-1.0.0.vsix`

### Option 2: Install manually (development)

```bash
# Install dependencies
cd fnaf-jumpscares
npm install

# Open in VS Code
code .

# Press F5 to start the extension in debug mode
```

## Settings

Go to VS Code settings (`Ctrl+,`) and look for **FNAF**:

| Definition | Description | Standard |
|---|---|---|
| `fnaf.enabled` | Enable/disable jumpscares | `true` |
| `fnaf.chance` | Jumpscare probability (%) | `5` |
| `fnaf.intervalSeconds` | Interval between checks (sec) | `30` |
| `fnaf.soundEnabled` | Activate sounds | `true` |

### How it works

Every **X seconds** (configurable), there is a **Y% probability** that you will receive a random jumpscare.

Example with pattern:
- Every 30 seconds → 5% chance of jumpscare

## Commands

- **FNAF: Trigger Jumpscare Now** — Forces an immediate jumpscare
- **FNAF: Configure Jumpscares** — Opens settings

Access via `Ctrl+Shift+P` → type `FNAF`

---

*"It's me."* 🎩
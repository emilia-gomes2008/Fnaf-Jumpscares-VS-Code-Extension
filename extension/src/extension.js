const vscode = require('vscode');
const path = require('path');

let jumpscareTimer = null;
let statusBarItem = null;

const ANIMATRONICS = [
  {
    id: 'freddy',
    gif: 'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/c/cb/Output_o2BAmu.gif/revision/latest/scale-to-width-down/1000?cb=20201222033648',
    glow: '#8B4513',
    bg: '#0a0500',
  },
  {
    id: 'bonnie',
    gif: 'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/3/31/Bonnie_blarg.gif/revision/latest/scale-to-width-down/1000?cb=20201222033919',
    glow: '#6a0dad',
    bg: '#050010',
  },
  {
    id: 'chica',
    gif: 'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/8/8a/Chica_blarg.gif/revision/latest/scale-to-width-down/1000?cb=20201222034119',
    glow: '#FFD700',
    bg: '#0a0800',
  },
  {
    id: 'withered_foxy',
    gif: 'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/b/b9/FNAF2OldFoxyJumpscare.gif/revision/latest/scale-to-width-down/1000?cb=201503',
    glow: '#8B0000',
    bg: '#0a0000',
  },
  {
    id: 'mangle',
    gif: "https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/3/31/Mangle%27s_Jumpscare.gif/revision/latest?cb=20180718034008",
    glow: '#FF69B4',
    bg: '#0a0008',
  },
  {
    id: 'nightmare_fredbear',
    gif: 'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/5/5c/Nightmare_Fredbear_Jumpscare.gif/revision/latest?cb=20180702231907',
    glow: '#FF4500',
    bg: '#000000',
  },
];

function activate(context) {
  console.log('FNAF Jumpscares ativado. Boa sorte...');

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(eye) FNAF';
  statusBarItem.tooltip = 'FNAF Jumpscares — Ele está a observar...';
  statusBarItem.command = 'fnaf.openSettings';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand('fnaf.triggerJumpscare', () => {
      triggerJumpscare(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fnaf.openSettings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'fnaf');
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('fnaf')) {
        restartTimer(context);
      }
    })
  );

  restartTimer(context);
}

function restartTimer(context) {
  if (jumpscareTimer) {
    clearInterval(jumpscareTimer);
    jumpscareTimer = null;
  }

  const config = vscode.workspace.getConfiguration('fnaf');
  const enabled = config.get('enabled', true);

  if (!enabled) {
    statusBarItem.text = '$(eye-closed) FNAF';
    return;
  }

  statusBarItem.text = '$(eye) FNAF';

  const intervalSeconds = config.get('intervalSeconds', 30);
  jumpscareTimer = setInterval(() => {
    maybeJumpscare(context);
  }, intervalSeconds * 1000);

  context.subscriptions.push({
    dispose: () => { if (jumpscareTimer) clearInterval(jumpscareTimer); }
  });
}

function maybeJumpscare(context) {
  const config = vscode.workspace.getConfiguration('fnaf');
  if (!config.get('enabled', true)) return;
  const chance = config.get('chance', 5);
  if (Math.random() * 100 < chance) {
    triggerJumpscare(context);
  }
}

function triggerJumpscare(context) {
  const animatronic = ANIMATRONICS[Math.floor(Math.random() * ANIMATRONICS.length)];
  showJumpscarePanel(context, animatronic);
}

function showJumpscarePanel(context, animatronic) {
  const panel = vscode.window.createWebviewPanel(
    'fnafJumpscare',
    '⚠️ ' + animatronic.id,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, 'media'))
      ]
    }
  );

  const config = vscode.workspace.getConfiguration('fnaf');
  const soundEnabled = config.get('soundEnabled', true);

  const mediaUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'media'))
  ).toString();

  panel.webview.html = getJumpscareHtml(animatronic, mediaUri, soundEnabled);

  setTimeout(() => {
    try { panel.dispose(); } catch (_) {}
  }, 4000);
}

function getJumpscareHtml(animatronic, mediaUri, soundEnabled) {
  const { gif, glow, bg, id } = animatronic;
  // Escape for safe HTML attribute embedding
  const safeGif = gif.replace(/&/g, '&amp;');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https://static.wikia.nocookie.net ${mediaUri} data: blob:; media-src ${mediaUri} data: blob:; script-src 'unsafe-inline'; style-src 'unsafe-inline';">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: ${bg};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Courier New', monospace;
  }

  body { animation: bodyFlash 0.06s steps(1) 3; }
  @keyframes bodyFlash {
    0%   { background: #fff; }
    50%  { background: #cc0000; }
    100% { background: ${bg}; }
  }

  .scene {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: shake 0.12s ease-in-out infinite;
  }
  @keyframes shake {
    0%   { transform: translate(0,0)        rotate(0deg); }
    15%  { transform: translate(-14px, 9px)  rotate(-1.5deg); }
    30%  { transform: translate(14px, -9px)  rotate(1.5deg); }
    45%  { transform: translate(-9px, 14px)  rotate(-1deg); }
    60%  { transform: translate(9px, -14px)  rotate(1deg); }
    75%  { transform: translate(-5px, 5px)   rotate(-0.5deg); }
    100% { transform: translate(0,0)        rotate(0deg); }
  }

  .jumpscare-gif {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    object-position: center top;
    animation: gifZoom 0.1s ease-out forwards;
    filter:
      drop-shadow(0 0 80px ${glow})
      drop-shadow(0 0 30px ${glow})
      brightness(1.2)
      contrast(1.1);
  }
  @keyframes gifZoom {
    0%   { transform: scale(0.15); opacity: 0; }
    50%  { transform: scale(1.1);  opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }

  .red-bleed {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 20%, rgba(150,0,0,0.6) 100%);
    pointer-events: none;
    z-index: 10;
    animation: bleedPulse 0.1s ease-in-out infinite alternate;
  }
  @keyframes bleedPulse {
    from { opacity: 0.5; }
    to   { opacity: 1.0; }
  }

  .scanlines {
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0,0,0,0.2) 2px,
      rgba(0,0,0,0.2) 4px
    );
    pointer-events: none;
    z-index: 11;
  }

  .chroma {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 12;
    animation: chroma 0.08s steps(1) infinite;
  }
  @keyframes chroma {
    0%   { box-shadow: inset 5px 0 0 rgba(255,0,0,0.18), inset -5px 0 0 rgba(0,0,255,0.18); }
    50%  { box-shadow: inset -5px 0 0 rgba(255,0,0,0.18), inset 5px 0 0 rgba(0,0,255,0.18); }
    100% { box-shadow: inset 5px 0 0 rgba(255,0,0,0.18), inset -5px 0 0 rgba(0,0,255,0.18); }
  }

  .fallback {
    display: none;
    position: fixed;
    inset: 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    background: ${bg};
  }
  .fallback-emoji { font-size: 10rem; animation: shake 0.12s ease-in-out infinite; }
  .fallback-name  { font-size: 2rem; color: ${glow}; letter-spacing: 0.3em; text-transform: uppercase; }
</style>
</head>
<body>

<div class="scene">
  <img
    class="jumpscare-gif"
    src="${safeGif}"
    onerror="this.parentElement.style.display='none'; document.querySelector('.fallback').style.display='flex';"
  />
</div>

<div class="fallback">
  <div class="fallback-emoji">💀</div>
</div>

<div class="red-bleed"></div>
<div class="scanlines"></div>
<div class="chroma"></div>

${soundEnabled ? `<audio autoplay><source src="${mediaUri}/sounds/${id}.mp3" type="audio/mpeg"></audio>` : ''}

<script>
  // Extra white flash on load
  document.body.style.background = '#fff';
  setTimeout(() => { document.body.style.background = '${bg}'; }, 60);
</script>
</body>
</html>`;
}

function deactivate() {
  if (jumpscareTimer) clearInterval(jumpscareTimer);
}

module.exports = { activate, deactivate };

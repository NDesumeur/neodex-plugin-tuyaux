// Tuyaux : Tourne les tuyaux pour amener l'eau du château d'eau jusqu'à toutes les maisons du quartier.
// Jeu NeoDex : police, cadres et boutons propres au jeu. Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Tuyaux</span><span class="hint">Clic : tourner · clic droit : tourner dans l'autre sens</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="224" height="196"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="tuPrev">◀</button><button class="btn" id="tuNext">▶</button><button class="btn" id="tuFs">PLEIN ÉCRAN</button></div>
      <label class="row"><input type="checkbox" id="tuRnd"> Réseaux au hasard (nouveau à chaque partie)</label>
      <label class="row"><input type="checkbox" id="tuWrap"> Bords reliés : un tuyau qui sort d’un côté revient de l’autre</label>
      <div class="row"><button class="btn" id="tuDaily">RÉSEAU DU JOUR</button></div>
      <div class="hint">L'eau suit les raccords qui se touchent des deux côtés. Une maison s'allume quand l'eau arrive.</div><div class="hint">Le réseau n'a jamais de boucle : chaque maison n'a qu'un seul chemin vers le château d'eau.</div><div class="hint">La grille grandit tous les trois niveaux, de 5 × 5 jusqu'à 12 × 12.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 480px;min-width:min(100%,320px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{height:100vh;max-width:100vw}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{height:min(calc(100vh - 190px),900px);min-height:300px;max-width:100%;width:auto}  /* le rapport largeur / hauteur suit la grille (posé par le jeu) */`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "TUYAUX", T: {"k": "#030a14", "k2": "#08162a", "fill": "#0e2240", "fillOn": "#143058", "hl": "#1c3a6a", "line": "#2e5a9a", "acc": "#3fe0ff", "accL": "#c8f8ff", "accS": "#1a9ac0", "accD": "#06304a", "rivet": "#c8f8ff", "btn": "#1c3a6a", "btnHi": "#4a7ac0", "btnLo": "#08162a", "btnHov": "#1c4478", "btnHovHi": "#6a9ae0", "text": "#eef6ff", "muted": "#a8c0e0", "acc2": "#5fdf6a", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#040c1a", "bgDot": "#0e2240", "bgDot2": "#08162a", "spark": "#2e5a9a", "spark2": "#5fdf6a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "....kkkk....", "....kbbk....", "....kbbk....", "kkkkkbbkkkkk", "kbbbbbbbbbbk", "kbbbbbbbbbbk", "kkkkkbbkkkkk", "....kbbk....", "....kbbk....", "....kkkk....", "............"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"], [/^PLEIN/, "full"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
let W = 224, H = 196; const cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Tuyaux : tourner les tuyaux pour amener l'eau du château d'eau à toutes les maisons. Chaque niveau est un réseau sans boucle, toujours faisable. ---------- */
const TU = {T: 20};
const rot = m => ((m << 1) | (m >> 3)) & 15;  // un quart de tour dans le sens des aiguilles d'une montre (1 haut, 2 droite, 4 bas, 8 gauche)
const TU_DIR = [[1, 0, -1, 4], [2, 1, 0, 8], [4, 0, 1, 1], [8, -1, 0, 2]];  // bit, dx, dy, bit opposé
function tuPipe(m, wet) {  // un tuyau de 20 × 20 : contour, métal, reflet, et l'eau dedans quand il est rempli
  return cnv(20, 20, b => {
    const arm = (x, y, w, h) => { px(b, '#05010b', x, y, w, h); };
    const parts = [[7, 7, 6, 6]]; if (m & 1) parts.push([7, 0, 6, 8]); if (m & 2) parts.push([12, 7, 8, 6]); if (m & 4) parts.push([7, 12, 6, 8]); if (m & 8) parts.push([0, 7, 8, 6]);
    for (const [x, y, w, h] of parts) arm(x, y, w, h);
    for (const [x, y, w, h] of parts) { const v = h > w || (w === 6 && h === 6); px(b, '#8a8aa8', x + 1, y + (v ? 0 : 1), w - 2 + (v ? 0 : 2) - (v ? 0 : 2), h - (v ? 0 : 2)); }
    px(b, '#8a8aa8', 8, 8, 4, 4);
    if (m & 1) px(b, '#c8c8e0', 8, 0, 1, 8); if (m & 4) px(b, '#c8c8e0', 8, 12, 1, 8); if (m & 2) px(b, '#c8c8e0', 12, 8, 8, 1); if (m & 8) px(b, '#c8c8e0', 0, 8, 8, 1);
    if (m & 1) px(b, '#5a5a78', 11, 0, 1, 8); if (m & 4) px(b, '#5a5a78', 11, 12, 1, 8); if (m & 2) px(b, '#5a5a78', 12, 11, 8, 1); if (m & 8) px(b, '#5a5a78', 0, 11, 8, 1);
    const c = wet ? '#3fa0ff' : '#2a2a3a', c2 = wet ? '#9ad0ff' : '#3a3a4a';
    px(b, c, 9, 9, 2, 2); if (m & 1) px(b, c, 9, 0, 2, 9); if (m & 4) px(b, c, 9, 11, 2, 9); if (m & 2) px(b, c, 11, 9, 9, 2); if (m & 8) px(b, c, 0, 9, 9, 2);
    if (wet) { if (m & 1) px(b, c2, 9, 2, 1, 3); if (m & 4) px(b, c2, 9, 14, 1, 3); if (m & 2) px(b, c2, 14, 9, 3, 1); if (m & 8) px(b, c2, 2, 9, 3, 1); }
    for (const [bit, x, y, w, h] of [[1, 6, 0, 8, 2], [4, 6, 18, 8, 2], [2, 18, 6, 2, 8], [8, 0, 6, 2, 8]]) if (m & bit) { px(b, '#05010b', x, y, w, h); px(b, '#a8a8c8', x + (w > h ? 1 : 0), y + (w > h ? 0 : 1), w - (w > h ? 2 : 0), h - (w > h ? 0 : 2)); }  // les raccords
  });
}
const TU_SPR = [0, 1].map(wet => [...Array(16)].map((_, m) => tuPipe(m, wet)));
const TU_PAL = {k: '#05010b', r: '#d8584a', R: '#8a2c2c', w: '#e8d8c0', W: '#b8a890', d: '#6a3a24', l: '#ffd86b', o: '#2a2a3a', s: '#8a8aa8', S: '#c8c8e0', b: '#3fa0ff', B: '#9ad0ff'};
const TU_HOUSE = [spr(['....kk......', '...krrk.....', '..krrrrk....', '.krrrrrrk...', 'krrrrrrrrk..', '.kwwwwwwk...', '.kwookwwk...', '.kwookddk...', '.kwwwkddk...', '.kkkkkkkk...'], TU_PAL), spr(['....kk......', '...krrk.....', '..krrrrk....', '.krrrrrrk...', 'krrrrrrrrk..', '.kwwwwwwk...', '.kwllkwwk...', '.kwllkddk...', '.kwwwkddk...', '.kkkkkkkk...'], TU_PAL)];
const TU_TOWER = spr(['..kkkkkkkk..', '.kbBbbbbbbk.', '.kbbbbbbbbk.', '.kbbbbbbbbk.', '..kkkkkkkk..', '...ks..sk...', '...k.ss.k...', '...ks..sk...', '..kk....kk..', '..k......k..'], TU_PAL);
const tus = gstore('tuyaux', {level: 1, top: 1, stars: 0, games: 0}); tus.daily ??= {last: '', streak: 0, best: 0};
const tuDay = (k = 0) => { const d = new Date(Date.now() - k * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const tuNb = (x, y, dx, dy, n, wrap) => { const a = x + dx, b = y + dy; if (wrap) return [(a + n) % n, (b + n) % n]; return a >= 0 && b >= 0 && a < n && b < n ? [a, b] : null; };  // la voisine, en passant par le bord d'en face si les bords sont reliés
let tu = null;
function tuGen(level, seed = level * 104729, wrap = false) {  // un arbre couvrant au hasard depuis le centre : chaque case est reliée, sans boucle ; les feuilles sont les maisons
  const n = Math.min(12, 5 + Math.floor((level - 1) / 3)), r = seeded(seed), m = [...Array(n)].map(() => Array(n).fill(0)), src = [Math.floor(n / 2), Math.floor(n / 2)];
  const seen = new Set([src.join()]), front = [src];
  while (front.length) {
    const i = Math.floor(r() * front.length), [x, y] = front[i], opts = TU_DIR.filter(([, dx, dy]) => { const p = tuNb(x, y, dx, dy, n, wrap); return p && !seen.has(p.join()); });
    if (!opts.length) { front.splice(i, 1); continue; }
    const [bit, dx, dy, opp] = opts[Math.floor(r() * opts.length)], [a, b] = tuNb(x, y, dx, dy, n, wrap); m[y][x] |= bit; m[b][a] |= opp; seen.add(a + ',' + b); front.push([a, b]);
  }
  const sol = m.map(row => [...row]); let par = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {  // chaque case tournée au hasard ; le « par » compte les quarts de tour pour revenir (dans un sens ou dans l'autre)
    const t = Math.floor(r() * 4); for (let k = 0; k < t; k++) m[y][x] = rot(m[y][x]);
    let c = m[y][x], k = 0; while (c !== sol[y][x]) { c = rot(c); k++; } par += Math.min(k, 4 - k);
  }
  return {n, m, src, sol, par: Math.max(1, par), wrap};
}
function tuFlow() {  // l'eau part du château et suit les raccords qui se répondent des deux côtés
  const {n, m, src} = tu, wet = m.map(r => r.map(() => false)), dist = m.map(r => r.map(() => 0)), q = [src]; wet[src[1]][src[0]] = true;
  while (q.length) { const [x, y] = q.shift(); for (const [bit, dx, dy, opp] of TU_DIR) { const p = tuNb(x, y, dx, dy, n, tu.wrap); if (!p) continue; const [a, b] = p; if ((m[y][x] & bit) && (m[b][a] & opp) && !wet[b][a]) { wet[b][a] = true; dist[b][a] = dist[y][x] + 1; q.push([a, b]); } } }
  tu.wet = wet; tu.dist = dist; return wet.every(r => r.every(v => v));
}
// le canevas prend la taille de la grille (et d'un bandeau de 16 px) : la grille remplit tout le cadre, quelle que soit sa taille
const tuBgs = {};
function tuSize(n) { W = n * TU.T + 8; H = n * TU.T + 24; if (cv.width !== W) { cv.width = W; cv.height = H; g.imageSmoothingEnabled = false; } cv.style.aspectRatio = W + ' / ' + H; }
function tuNew(level = tus.level, daily = false) { if (!daily) { tus.level = level; saveGames(); } tu = Object.assign(tu || {tick: 0, raf: 0}, {mode: 'play', ...(daily ? tuGen(10, +tuDay().replace(/-/g, '')) : tuGen(level, tus.rnd ? Math.floor(Math.random() * 1e9) : undefined, !!tus.wrap)), daily, moves: 0, wonAt: 0, spin: null, hover: null}); tuSize(tu.n); if (tuFlow()) { tu.m[0][0] = rot(tu.m[0][0]); tuFlow(); } tuInfo(); }
const tuOff = () => [Math.floor((W - tu.n * TU.T) / 2), 16 + Math.floor((H - 16 - tu.n * TU.T) / 2)];
function tuTurn(x, y, back) {
  if (tu.mode !== 'play') return; for (let k = 0; k < (back ? 3 : 1); k++) tu.m[y][x] = rot(tu.m[y][x]); tu.moves++; tu.spin = {x, y, t: 6, back}; beep(back ? 300 : 360, .04, 'square', 0, .04);
  if (tuFlow()) { tu.mode = 'won'; tu.wonAt = tu.tick; const st = tu.moves <= tu.par ? 3 : tu.moves <= tu.par * 1.5 ? 2 : 1; tu.stars = st; tus.stars += st; tus.games++;
    tu.flowEnd = Math.max(...tu.dist.flat()) * TU_FLOW;  // l'eau coule depuis le château, case après case
    if (tu.daily) { const d = tus.daily; if (d.last !== tuDay()) { d.streak = d.last === tuDay(1) ? d.streak + 1 : 1; d.best = Math.max(d.best, d.streak); d.last = tuDay(); } } else { if (tus.level >= tus.top) tus.top = tus.level + 1; best('tuyaux', tus.level); } saveGames(); tuInfo(); [392, 523, 659, 784].forEach((f, k) => setTimeout(() => beep(f, .16, 'triangle'), k * 100)); }
  else if (tu.wet[y][x]) beep(720, .05, 'triangle', 0, .04);
}
const tuBg = () => tuBgs[W] ??= cnv(W, H, b => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(b, (x * 7 + y * 13) % 17 < 2 ? '#3a7a3a' : (x + y) % 2 ? '#2e6a32' : '#2a6430', x, y); });
const TU_FLOW = 3;  // images par case quand l'eau coule à la fin
function tuDraw() {
  g.drawImage(tuBg(), 0, 0); const [ox, oy] = tuOff(), T = TU.T;
  px(g, '#05010b', ox - 3, oy - 3, tu.n * T + 6, tu.n * T + 6); px(g, '#5a3a24', ox - 2, oy - 2, tu.n * T + 4, tu.n * T + 4);
  if (tu.wrap) for (let k = 0; k < tu.n * T + 6; k += 4) { const c = (k + (tu.tick >> 2)) % 8 < 4 ? '#3fa0ff' : '#9ad0ff'; px(g, c, ox - 3 + k, oy - 3, 2, 1); px(g, c, ox - 3 + k, oy + tu.n * T + 2, 2, 1); px(g, c, ox - 3, oy - 3 + k, 1, 2); px(g, c, ox + tu.n * T + 2, oy - 3 + k, 1, 2); }  // les bords reliés : un cadre d'eau en pointillés
  if (tu.spin && --tu.spin.t <= 0) tu.spin = null;
  for (let y = 0; y < tu.n; y++) for (let x = 0; x < tu.n; x++) {
    const X = ox + x * T, Y = oy + y * T, v = tu.m[y][x], flow = tu.mode === 'won' ? tu.tick - tu.wonAt : 1e9, wet = tu.wet[y][x] && tu.dist[y][x] * TU_FLOW <= flow;
    if (tu.mode === 'won' && tu.dist[y][x] * TU_FLOW === flow) { if ([1, 2, 4, 8].includes(v)) beep(880 + tu.dist[y][x] * 20, .05, 'triangle', 0, .04); }
    px(g, (x + y) % 2 ? '#6a4a30' : '#634428', X, Y, T, T);
    if (tu.hover && tu.hover[0] === x && tu.hover[1] === y && tu.mode === 'play') px(g, '#8a6a40', X, Y, T, T);
    const s = tu.spin && tu.spin.x === x && tu.spin.y === y ? tu.spin : null;
    if (s) { g.save(); g.translate(X + 10, Y + 10); g.rotate((s.back ? 1 : -1) * s.t / 6 * Math.PI / 2); g.drawImage(TU_SPR[wet ? 1 : 0][v], -10, -10); g.restore(); } else g.drawImage(TU_SPR[wet ? 1 : 0][v], X, Y);
    const isSrc = x === tu.src[0] && y === tu.src[1], leaf = [1, 2, 4, 8].includes(v);
    if (isSrc) g.drawImage(TU_TOWER, X + 4, Y + 5); else if (leaf) g.drawImage(TU_HOUSE[wet ? 1 : 0], X + 5, Y + 5);
  }
  px(g, '#1a3a1c', 0, 0, W, 14); pxFont(g, tu.daily ? 'DU JOUR' : 'NIV ' + tus.level + (tu.wrap ? ' · BORDS RELIÉS' : ''), 4, 10, '#9ad0ff', 7);
  const houses = tu.m.flat().filter((v, i) => [1, 2, 4, 8].includes(v) && !(i % tu.n === tu.src[0] && Math.floor(i / tu.n) === tu.src[1])).length, lit = tu.m.flat().filter((v, i) => [1, 2, 4, 8].includes(v) && tu.wet[Math.floor(i / tu.n)][i % tu.n] && !(i % tu.n === tu.src[0] && Math.floor(i / tu.n) === tu.src[1])).length;
  pxFont(g, lit + '/' + houses + ' · ' + tu.moves, W - 4, 10, '#c8ffc8', 6, 'right');  // maisons allumées · coups
  if (tu.mode === 'won' && tu.tick - tu.wonAt > (tu.flowEnd || 0) + 30) gameText(g, W, [['BRAVO !', '#9ad0ff', 12], [tu.stars + ' / 3 étoile' + (tu.stars > 1 ? 's' : ''), '#ffd84a'], [tu.moves + ' coup' + (tu.moves > 1 ? 's' : ''), '#ffffff'], ['Clic : suivant', '#ffffff']], Math.round(H / 2) - 14);
}
const tuCell = e => { const [x, y] = cpos(e), [ox, oy] = tuOff(), cx = Math.floor((x - ox) / TU.T), cy = Math.floor((y - oy) / TU.T); return cx >= 0 && cy >= 0 && cx < tu.n && cy < tu.n ? [cx, cy] : null; };
cv.oncontextmenu = e => e.preventDefault();
cv.onpointermove = e => { if (tu) tu.hover = tuCell(e); };
cv.onpointerdown = e => { e.preventDefault(); if (!tu) return; if (tu.mode === 'won') { if (tu.tick - tu.wonAt > (tu.flowEnd || 0) + 30) tuNew(tu.daily ? tus.level : tus.level + 1); return; } const c = tuCell(e); if (c) tuTurn(c[0], c[1], e.button === 2); };
function tuInfo() {
  setTimeout(tuTrophies); const d = tus.daily; showStats([['Niveau', tus.level + (tu ? ' (' + tu.n + ' × ' + tu.n + ')' : '')], ['Niveau le plus loin', tus.top], ['Étoiles', tus.stars], ['Niveaux finis', tus.games], ['Réseau du jour', d.last === tuDay() ? 'fait ✓' : 'à faire'], ['Série de jours', (d.last === tuDay() || d.last === tuDay(1) ? d.streak : 0) + ' (record ' + d.best + ')']]); }
$('tuWrap').checked = !!tus.wrap; $('tuWrap').onchange = () => { tus.wrap = $('tuWrap').checked; saveGames(); tuNew(tus.level); $('tuWrap').blur(); };
$('tuDaily').onclick = () => { tuNew(tus.level, true); $('tuDaily').blur(); };
$('tuPrev').onclick = () => { if (tus.level > 1) tuNew(tus.level - 1); $('tuPrev').blur(); };
$('tuNext').onclick = () => { if (tus.level < tus.top) tuNew(tus.level + 1); $('tuNext').blur(); };
$('gNew').onclick = () => { tuNew(tus.level); $('gNew').blur(); };
$('tuRnd').checked = !!tus.rnd; $('tuRnd').onchange = () => { tus.rnd = $('tuRnd').checked; saveGames(); tuNew(tus.level); $('tuRnd').blur(); };  // plans au hasard : la taille suit toujours le niveau

{  // vérification : quatre quarts de tour reviennent au départ ; le réseau généré relie toutes les cases avant d'être mélangé
  let ok = tuGen(16).n === 10 && tuGen(22).n === 12 && tuGen(40).n === 12; for (let lv = 1; lv < 26; lv++) { const r = tuGen(lv); ok &&= r.m.flat().every(v => v > 0); }
  const keep = tu, gen = tuGen(7); tu = {...gen, m: gen.sol.map(r => [...r])}; const solved = tuFlow();
  const gw = tuGen(9, 5, true); tu = {...gw, m: gw.sol.map(r => [...r])}; const wsolved = tuFlow(), edges = gw.sol.flat().reduce((a, v) => a + [1, 2, 4, 8].filter(b => v & b).length, 0) / 2;
  const crosses = gw.sol.some((r, y) => (r[0] & 8) || (r[gw.n - 1] & 2)) || gw.sol[0].some(v => v & 1);  // au moins un tuyau passe par un bord
  ok &&= wsolved && edges === gw.n * gw.n - 1 && crosses && Math.max(...tu.dist.flat()) > 0;
  console.assert(rot(rot(rot(rot(5)))) === 5 && rot(1) === 2 && rot(8) === 1 && ok && solved, 'tuyaux'); cv.dataset.selfcheck = ok && solved ? 'ok' : 'raté'; tu = keep;
}
cv.__tu = {st: () => tu, go: lv => tuNew(lv), solve: () => { tu.m = tu.sol.map(r => [...r]); tu.m[0][0] = rot(rot(rot(tu.m[0][0]))); tuTurn(0, 0, false); }};  // pour le test « local »
$('tuFs').onclick = () => { $('tuFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function tuTrophies() {
  const sig = [tus.top, tus.stars, tus.games, tus.daily.best].join(); if (sig === tuTrophies.sig) return; tuTrophies.sig = sig;
  trophyRecord('niveau', tus.games ? tus.top : null); trophyRecord('etoiles', tus.stars || null);
  if (tus.games >= 1) trophy('premier'); if (tus.top >= 10) trophy('n10'); if (tus.top >= 25) trophy('n25'); if (tus.top >= 50) trophy('n50');
  if (tus.stars >= 100) trophy('etoiles'); if (tus.daily.best >= 7) trophy('jour7');
}
ctx.onOpen(() => { if (!tu) tuNew(); gameLoop(tu, 'tuyaux', () => {}, tuDraw); tuInfo(); });

}

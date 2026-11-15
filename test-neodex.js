// lancé par le test « local » de NeoDex : la grille remplit le cadre (5 × 5 comme 12 × 12), un niveau réussi, le plein écran
// et la place prise par le jeu (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'tuyaux-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const U = js => pj(`(() => { const U = document.getElementById('gc').__tu; ${js} })()`);
  const fill = () => pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(), t = c.__tu.st(); return {n: t.n, part: Math.round(t.n * 20 / c.width * r.width), w: Math.round(r.width), h: Math.round(r.height)}; })()`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await sleep(500);
  for (const lv of [1, 22]) {
    await U(`U.go(${lv}); return 0;`); await sleep(400); await shot('niveau-' + lv);
    const f = await fill(); if (f.n !== (lv === 1 ? 5 : 12) || f.part < f.w * .9 || f.h < 300) throw new Error('la grille ne remplit pas le cadre : ' + JSON.stringify(f));
  }
  await U(`U.solve(); return 0;`); await sleep(900); await shot('gagne');
  if (await U(`return U.st().mode;`) !== 'won') throw new Error('le niveau devait être réussi');
  await pj(`document.getElementById('tuFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  await U(`U.go(1); return 0;`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'grilles 5 × 5 et 12 × 12 qui remplissent le cadre · niveau réussi · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};

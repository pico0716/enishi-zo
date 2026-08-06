const people = [
  ['@haru', '#cb6751', 32, 14, 86], ['@mori', '#648f62', 25, 8, 79],
  ['@nagi', '#e2a84b', 18, 9, 73], ['@ito', '#8d71b9', 14, 6, 68],
  ['@sora', '#4f9da7', 11, 5, 61], ['@yui', '#d37b96', 9, 7, 64]
];
const mosaic = document.querySelector('#mosaic');
const create = document.querySelector('#create');
const intro = document.querySelector('#intro');
const exp = document.querySelector('#experience');
const clusterMap = document.querySelector('#clusterMap');
const reasonCard = document.querySelector('#reasonCard');
const caption = document.querySelector('#caption');
const grid = 20;

function portraitTone(x, y) {
  const face = ((x - 9.5) ** 2 / 40) + ((y - 10.5) ** 2 / 58) < 1;
  const hair = y < 8 && ((x - 9.5) ** 2 / 48) + ((y - 7.5) ** 2 / 28) < 1;
  const shirt = y > 16 && x > 4 && x < 15;
  const eye = y === 11 && (x === 7 || x === 12);
  const mouth = y === 14 && x > 8 && x < 11;
  if (eye || mouth) return '#3d4540';
  if (hair) return '#424b44';
  if (shirt) return '#8d71b9';
  if (face) return '#e7a17e';
  return '#b7d1bb';
}

function buildMosaic() {
  mosaic.replaceChildren();
  for (let y = 0; y < grid; y++) for (let x = 0; x < grid; x++) {
    const person = people[(x * 3 + y * 5 + Math.floor(Math.random() * 4)) % people.length];
    const tile = document.createElement('button');
    const avatar = document.createElement('span');
    tile.className = 'tile'; tile.title = person[0]; avatar.className = 'tile-avatar';
    tile.style.setProperty('--target', portraitTone(x, y));
    tile.style.setProperty('--person', person[1]);
    tile.style.setProperty('--scale', .9 + Math.random() * .12);
    tile.append(avatar);
    tile.addEventListener('click', () => selectPerson(person, tile));
    mosaic.append(tile);
  }
}
function selectPerson(p, tile) {
  document.querySelectorAll('.tile.selected').forEach(t => t.classList.remove('selected'));
  tile?.classList.add('selected');
  document.querySelector('#personName').textContent = p[0];
  document.querySelector('#personRole').textContent = 'あなたの縁を近くで形づくる人';
  document.querySelector('#replies').textContent = `${p[2]} 回`;
  document.querySelector('#mutuals').textContent = `${p[3]} 人`;
  document.querySelector('#affinity').textContent = `${p[4]}%`;
}
function buildClusters() {
  clusterMap.replaceChildren();
  const spots = [[11,25,150],[58,12,105],[38,52,130],[69,63,92],[13,72,80],[76,34,66]];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.classList.add('cluster-links');
  [[18,40,44,65],[44,65,72,73],[44,65,62,22],[62,22,79,42],[18,40,62,22]].forEach(([x1,y1,x2,y2]) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${x1}%`); line.setAttribute('y1', `${y1}%`); line.setAttribute('x2', `${x2}%`); line.setAttribute('y2', `${y2}%`); svg.append(line);
  }); clusterMap.append(svg);
  people.forEach((p, i) => {
    const c = document.createElement('button'); const avatar = document.createElement('span'); const count = document.createElement('span');
    const [l,t,s] = spots[i]; c.className='cluster'; c.dataset.label=p[0]; c.style.cssText=`--color:${p[1]};--size:${s}px;left:${l}%;top:${t}%`;
    avatar.className='cluster-avatar'; count.className='count'; count.textContent=`${p[2]}回`; c.append(avatar,count);
    c.onclick=()=>{show('reasons');selectPerson(p)}; clusterMap.append(c);
  });
}
function show(view) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
  mosaic.classList.toggle('hidden', view !== 'mosaic'); clusterMap.classList.toggle('hidden', view !== 'clusters'); reasonCard.classList.toggle('hidden', view !== 'reasons');
  document.querySelector('#resultLabel').classList.toggle('hidden', view !== 'mosaic');
  caption.textContent = {mosaic:'48人の縁が、あなたの像を結んでいます。',clusters:'近い縁ほど、太い線でつながっています。',reasons:'ひとつひとつの縁が、あなたを形づくる。'}[view];
}
create.onclick=()=>{document.querySelector('.app-shell').classList.add('has-result');intro.classList.add('hidden');exp.classList.remove('hidden');buildMosaic();buildClusters();};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>show(t.dataset.view));
document.querySelector('#refresh').onclick=()=>{buildMosaic();caption.textContent='いまの縁を、もう一度結び直しました。'};

function makeShareImage() {
  const size=1200,pad=95,tile=(size-pad*2)/grid,canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#f5f0e7';ctx.fillRect(0,0,size,size);ctx.fillStyle='#49745a';ctx.font='700 30px sans-serif';ctx.fillText('ENISHI-ZO',pad,72);ctx.fillStyle='#27322c';ctx.font='70px serif';ctx.fillText('えにし像',pad,150);
  [...mosaic.children].forEach((node,i)=>{const x=i%grid,y=Math.floor(i/grid),style=getComputedStyle(node);ctx.fillStyle=style.getPropertyValue('--target');ctx.fillRect(pad+x*tile,pad+180+y*tile,tile-3,tile-3);});
  ctx.fillStyle='#7e8278';ctx.font='30px sans-serif';ctx.fillText('つながりが、あなたの輪郭になる。',pad,size-55);return new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
}
document.querySelector('#share').onclick=async()=>{const blob=await makeShareImage(),file=new File([blob],'enishi-zo.png',{type:'image/png'}),text='私を形づくる縁を結んだ、えにし像。 #えにし像';try{if(navigator.canShare?.({files:[file]}))await navigator.share({title:'えにし像',text,files:[file]});else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='enishi-zo.png';a.click();URL.revokeObjectURL(a.href)}}catch(error){if(error.name!=='AbortError')console.error(error)}};

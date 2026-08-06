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

function buildMosaic() {
  mosaic.replaceChildren();
  for (let y=0;y<15;y++) for (let x=0;x<15;x++) {
    const radial = Math.hypot(x-7,y-7)/10;
    const person = people[(x*3+y*5+Math.floor(Math.random()*3)) % people.length];
    const tile = document.createElement('button');
    tile.className = 'tile'; tile.title = person[0];
    tile.style.setProperty('--color', person[1]);
    tile.style.setProperty('--opacity', Math.max(.25,1-radial*.62));
    tile.style.setProperty('--scale', .86 + Math.random()*.2);
    tile.addEventListener('click', () => selectPerson(person, tile));
    mosaic.append(tile);
  }
}
function selectPerson(p, tile) {
  document.querySelectorAll('.tile.selected').forEach(t=>t.classList.remove('selected'));
  tile?.classList.add('selected');
  document.querySelector('#personName').textContent=p[0];
  document.querySelector('#personRole').textContent=`あなたの縁を近くで形づくる人`;
  document.querySelector('#replies').textContent=`${p[2]} 回`;
  document.querySelector('#mutuals').textContent=`${p[3]} 人`;
  document.querySelector('#affinity').textContent=`${p[4]}%`;
}
function buildClusters() {
  clusterMap.replaceChildren();
  const spots=[[15,22,150],[61,12,105],[42,49,130],[70,62,92],[18,70,80],[78,32,66]];
  people.forEach((p,i)=> { const c=document.createElement('div'); const [l,t,s]=spots[i]; c.className='cluster';c.dataset.label=p[0];c.style.cssText=`--color:${p[1]};--size:${s}px;left:${l}%;top:${t}%`;c.textContent=p[2]+'回';c.onclick=()=>{show('reasons');selectPerson(p)};clusterMap.append(c); });
}
function show(view) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===view));
  mosaic.classList.toggle('hidden',view!=='mosaic');
  clusterMap.classList.toggle('hidden',view!=='clusters');
  reasonCard.classList.toggle('hidden',view!=='reasons');
  caption.textContent={mosaic:'近い縁ほど、あなたの輪郭の近くに。',clusters:'あなたの周りには、いくつの居場所がありますか。',reasons:'ひとつひとつの縁が、あなたを形づくる。'}[view];
}
create.onclick=()=>{intro.classList.add('hidden');exp.classList.remove('hidden');buildMosaic();buildClusters();};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>show(t.dataset.view));
document.querySelector('#refresh').onclick=()=>{buildMosaic();caption.textContent='今の縁を、もう一度結び直しました。'};

function makeShareImage() {
  const size = 1200, pad = 95, grid = 15, tile = (size - pad * 2) / grid;
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f5f0e7'; ctx.fillRect(0,0,size,size);
  ctx.fillStyle = '#49745a'; ctx.font = '700 30px sans-serif'; ctx.letterSpacing = '6px'; ctx.fillText('ENISHI-ZO',pad,72);
  ctx.fillStyle = '#27322c'; ctx.font = '70px serif'; ctx.fillText('えにし像',pad,150);
  ctx.save(); ctx.translate(size/2,size/2); ctx.rotate(-.035); ctx.translate(-size/2,-size/2);
  [...mosaic.children].forEach((node,i)=>{
    const x=i%grid, y=Math.floor(i/grid), style=getComputedStyle(node);
    ctx.globalAlpha=Number(style.getPropertyValue('--opacity')) || .8;
    ctx.fillStyle=style.getPropertyValue('--color');
    ctx.fillRect(pad+x*tile+3,pad+135+y*tile+3,tile-6,tile-6);
  }); ctx.restore(); ctx.globalAlpha=1;
  ctx.fillStyle='#7e8278';ctx.font='30px sans-serif';ctx.fillText('つながりが、あなたの輪郭になる。',pad,size-55);
  return new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
}
document.querySelector('#share').onclick=async()=>{
  const blob=await makeShareImage(); const file=new File([blob],'enishi-zo.png',{type:'image/png'});
  const message='私を形づくる縁を結んだ、えにし像。 #えにし像';
  try {
    if (navigator.canShare?.({files:[file]})) await navigator.share({title:'えにし像',text:message,files:[file]});
    else { const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='enishi-zo.png';link.click();URL.revokeObjectURL(link.href); }
  } catch (error) { if (error.name !== 'AbortError') console.error(error); }
};

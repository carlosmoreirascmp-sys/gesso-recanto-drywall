'use strict';
const whatsappIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.84 9.84 0 0 0-8.43 14.91L2.05 22l5.2-1.52A9.9 9.9 0 1 0 12.04 2Zm0 17.98a8.14 8.14 0 0 1-4.15-1.14l-.3-.18-3.08.9.82-3-.2-.31a8.15 8.15 0 1 1 6.91 3.73Zm4.47-6.1c-.24-.12-1.45-.72-1.67-.8-.23-.08-.39-.12-.56.12-.16.25-.63.8-.78.96-.14.17-.28.19-.52.07-.25-.12-1.03-.38-1.96-1.21-.73-.65-1.22-1.45-1.36-1.69-.15-.24-.02-.37.1-.49.11-.11.25-.28.37-.43.12-.14.16-.24.25-.41.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.83-.2-.49-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.13.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.19 1.13.16 1.55.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z"/></svg>';
document.querySelectorAll('.wa-slot').forEach(el=>{el.innerHTML=whatsappIcon});
const media=[
{file:'caminhao-entrega-editado.mp4',poster:'caminhao-entrega-capa.jpg',title:'Entrega de drywall',category:'ENTREGA PRÓPRIA',type:'video'},
{file:'gesso-caminhao-editado.mp4',poster:'gesso-caminhao-capa.jpg',title:'Caminhão da Recanto',category:'NOSSA ESTRUTURA',type:'video'},
{file:'estoque-placas.webp',title:'Placas à disposição',category:'NOSSO ESTOQUE',type:'image'},
{file:'hero-drywall.webp',title:'Forro com iluminação',category:'INSPIRAÇÃO DE ACABAMENTO',type:'image'},
{file:'fabrica-gesso-producao.mp4',poster:'gesso-estoque-real.jpeg',title:'Produção na fábrica',category:'NOSSA FÁBRICA',type:'video'},
{file:'entrega-gesso-obra.mp4',poster:'poster-entrega-gesso.jpg',title:'Gesso chegando à obra',category:'ENTREGA PRÓPRIA',type:'video'},
{file:'estoque-sacos-gesso.mp4',poster:'estoque-sacos-gesso.webp',title:'Movimentação do estoque',category:'NOSSO ESTOQUE',type:'video'},
{file:'entrega-placas-gesso.mp4',poster:'entrega-placas-gesso.webp',title:'Entrega de placas',category:'ENTREGA PRÓPRIA',type:'video'},
{file:'variedades-gesso-estoque.mp4',poster:'variedades-gesso-estoque.webp',title:'Peças de gesso no estoque',category:'NOSSOS PRODUTOS',type:'video'},
{file:'gesso-estoque-real.jpeg',title:'Gesso de 40 kg',category:'NOSSO ESTOQUE',type:'image'},
{file:'entrega-drywall-propria.jpeg',title:'Material a caminho',category:'ENTREGA PRÓPRIA',type:'image'},
{file:'card-parede.webp',title:'Paredes em drywall',category:'INSPIRAÇÃO DE ACABAMENTO',type:'image'},
{file:'card-forro.webp',title:'Forros e iluminação',category:'INSPIRAÇÃO DE ACABAMENTO',type:'image'},
{file:'card-divisoria.webp',title:'Divisórias e ambientes',category:'INSPIRAÇÃO DE ACABAMENTO',type:'image'},
{file:'card-outro-projeto.webp',title:'Projetos sob medida',category:'INSPIRAÇÃO DE ACABAMENTO',type:'image'},
{file:'casa-acabamento-gesso.jpg',title:'Detalhes em gesso',category:'INSPIRAÇÃO DE ACABAMENTO',type:'image'},
{file:'hero-materiais-drywall.webp',title:'Materiais para drywall',category:'COMPOSIÇÃO DE MATERIAIS',type:'image'},
{file:'instalacao-drywall.webp',title:'Montagem de drywall',category:'REFERÊNCIA DE INSTALAÇÃO',type:'image'}
];
const grid=document.querySelector('#media-grid'),dialog=document.querySelector('#media-dialog'),viewer=document.querySelector('#viewer-media');
let filter='all',page=0,selected=0,lastTrigger=null;
const items=()=>media.filter(m=>filter==='all'||m.type===filter);
function track(name,params){if(typeof window.gtag==='function')window.gtag('event',name,{site_section:'principal',...params});}
function renderGallery(){
 const list=items(),start=page*4;grid.replaceChildren();
 list.slice(start,start+4).forEach((item,offset)=>{
  const button=document.createElement('button');button.type='button';button.className='media-card';button.setAttribute('aria-label',(item.type==='video'?'Assistir: ':'Ampliar: ')+item.title);
  const thumb=document.createElement('span');thumb.className='media-thumb';const img=document.createElement('img');img.src='/principal/assets/'+(item.poster||item.file);img.alt='';img.loading='lazy';img.decoding='async';thumb.append(img);
  const badge=document.createElement('span');badge.className='media-type';badge.textContent=item.type==='video'?'VÍDEO':'FOTO';thumb.append(badge);
  if(item.type==='video'){const play=document.createElement('span');play.className='play';play.setAttribute('aria-hidden','true');play.textContent='▶';thumb.append(play);}
  const label=document.createElement('span');label.className='media-label';const text=document.createElement('span');text.textContent=item.title;const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');label.append(text,arrow);button.append(thumb,label);
  button.addEventListener('click',()=>{selected=start+offset;lastTrigger=button;renderViewer();dialog.showModal();document.body.classList.add('viewer-open');track('open_gallery_media',{media_type:item.type,media_name:item.file});});grid.append(button);
 });
 document.querySelector('#gallery-status').textContent=`${start+1}–${Math.min(start+4,list.length)} de ${list.length} ${filter==='video'?'vídeos':filter==='image'?'fotos':'itens · 7 vídeos e 11 fotos'}`;
 document.querySelector('#gallery-prev').disabled=page===0;document.querySelector('#gallery-next').disabled=start+4>=list.length;
}
function clearViewer(){viewer.querySelector('video')?.pause();viewer.replaceChildren();}
function renderViewer(){clearViewer();const list=items(),item=list[selected];document.querySelector('#viewer-title').textContent=item.title;document.querySelector('#viewer-category').textContent=item.category;document.querySelector('#viewer-count').textContent=`${selected+1} de ${list.length}`;
 const el=document.createElement(item.type==='video'?'video':'img');el.src='/principal/assets/'+item.file;
 if(item.type==='video'){el.controls=true;el.playsInline=true;el.preload='metadata';el.poster='/principal/assets/'+item.poster;el.setAttribute('aria-label',item.title);el.addEventListener('play',()=>track('play_gallery_video',{media_name:item.file}),{once:true});}else{el.alt=item.title;el.decoding='async';}
 viewer.append(el);document.querySelector('#viewer-prev').disabled=selected===0;document.querySelector('#viewer-next').disabled=selected===list.length-1;
}
function moveViewer(delta){const next=selected+delta;if(next>=0&&next<items().length){selected=next;renderViewer();}}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;page=0;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderGallery();}));
document.querySelector('#gallery-prev').addEventListener('click',()=>{if(page>0){page--;renderGallery();}});document.querySelector('#gallery-next').addEventListener('click',()=>{if((page+1)*4<items().length){page++;renderGallery();}});
document.querySelector('#viewer-prev').addEventListener('click',()=>moveViewer(-1));document.querySelector('#viewer-next').addEventListener('click',()=>moveViewer(1));document.querySelector('#viewer-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{clearViewer();document.body.classList.remove('viewer-open');lastTrigger?.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
document.addEventListener('keydown',e=>{if(dialog.open){if(e.key==='ArrowRight'){e.preventDefault();moveViewer(1);}if(e.key==='ArrowLeft'){e.preventDefault();moveViewer(-1);}}if(e.key==='Escape')document.querySelector('.services-menu').open=false;});
const menu=document.querySelector('.services-menu');document.addEventListener('click',e=>{if(!menu.contains(e.target))menu.open=false;});
renderGallery();

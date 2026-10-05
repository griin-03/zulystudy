(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const pad=n=>String(n).padStart(2,'0');
const hms=s=>pad(Math.floor(s/3600))+':'+pad(Math.floor(s%3600/60))+':'+pad(s%60);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const root=document.documentElement;

/* theme */
const themeBtn=$('#theme');
const eff=()=>root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
function paintTheme(){
  $('#themeUse').setAttribute('href',eff()==='dark'?'#i-sun':'#i-moon');
  themeBtn.setAttribute('aria-label',eff()==='dark'?'Chuyển sang giao diện sáng':'Chuyển sang giao diện tối');
}
themeBtn.addEventListener('click',()=>{
  const n=eff()==='dark'?'light':'dark';
  root.setAttribute('data-theme',n);
  try{localStorage.setItem('camlo-theme',n)}catch(e){}
  paintTheme();
});
paintTheme();

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
$$('#bento > *').forEach((e,i)=>e.style.setProperty('--rd',(i*100)+'ms'));
$$('[data-reveal]').forEach(el=>io.observe(el));

/* count */
function countTo(el,to,fmt,dur){
  const t0=performance.now();
  (function f(t){
    const p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
    el.textContent=fmt(Math.round(to*e));
    if(p<1)requestAnimationFrame(f);
  })(t0);
}
const io2=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){countTo(e.target,+e.target.dataset.count,v=>v.toLocaleString('vi-VN'),1600);io2.unobserve(e.target)}
}),{threshold:.6});
$$('[data-count]').forEach(el=>io2.observe(el));

/* scroll */
const bar=$('#progress'), nav=$('.nav');
function onScroll(){
  const h=document.documentElement, max=h.scrollHeight-innerHeight;
  bar.style.transform='scaleX('+(max>0?Math.min(scrollY/max,1):0)+')';
  nav.classList.toggle('scrolled',scrollY>8);
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* marquee clone */
const track=$('#track');
track.appendChild(track.firstElementChild.cloneNode(true));

/* hero room */
const acc={
  hp:'<path d="M41 40a19 19 0 0 1 38 0" fill="none" stroke="rgba(74,46,51,.55)" stroke-width="4"/><rect x="37" y="38" width="7" height="12" rx="2" fill="rgba(74,46,51,.55)"/><rect x="76" y="38" width="7" height="12" rx="2" fill="rgba(74,46,51,.55)"/>',
  gl:'<circle cx="53" cy="41" r="5.500" fill="none" stroke="rgba(74,46,51,.6)" stroke-width="2"/><circle cx="67" cy="41" r="5.500" fill="none" stroke="rgba(74,46,51,.6)" stroke-width="2"/><path d="M58.500 41h3" stroke="rgba(74,46,51,.6)" stroke-width="2"/>',
  bun:'<circle cx="60" cy="19" r="8" fill="rgba(74,46,51,.45)"/><path d="M43 38a17 18 0 0 1 34 0c-6-7-28-7-34 0z" fill="rgba(74,46,51,.45)"/>',
  cap:'<path d="M42 35a18 15 0 0 1 36 0z" fill="rgba(74,46,51,.5)"/><rect x="42" y="33" width="44" height="4" rx="2" fill="rgba(74,46,51,.5)"/>',
  hair:'<path d="M42 44a18 22 0 0 1 36 0c-4-10-8-12-18-12s-14 2-18 12z" fill="rgba(74,46,51,.5)"/>'
};
const silhouette=a=>'<svg class="pp" viewBox="0 0 120 90" aria-hidden="true"><path d="M18 90c0-21 19-31 42-31s42 10 42 31z" fill="rgba(74,46,51,.28)"/><circle cx="60" cy="40" r="17" fill="rgba(74,46,51,.38)"/>'+acc[a]+'</svg>';
const people=[
  {n:'Minh Anh',c:'var(--p6)',t:8048,on:1,a:'hp'},
  {n:'Quốc Bảo',c:'var(--p2)',t:6451,on:1,a:'gl'},
  {n:'Thu Hà',c:'var(--p1)',t:11152,on:1,a:'bun'},
  {n:'Gia Huy',c:'var(--p3)',t:2299,on:1,a:'cap'},
  {n:'Ngọc Lan',c:'var(--p4)',t:4364,on:1,a:'hair'},
  {n:'Đức Anh',c:'var(--p5)',t:3120,on:0,a:'hp',init:'ĐA'}
];
const tilesEl=$('#tiles');
tilesEl.innerHTML=people.map((p,i)=>
  '<div class="tile'+(p.on?'':' off')+'" style="--i:'+i+'"><div class="pic" style="--c:'+(p.on?p.c:'var(--off)')+'">'+
  silhouette(p.a)+
  '<div class="init"><b>'+(p.init||p.n.split(' ').map(w=>w[0]).join(''))+'</b></div>'+
  '<span class="st"><i class="dot"></i><svg class="ic"><use href="#i-camera-off"/></svg></span></div>'+
  '<div class="cap"><span class="nm">'+p.n+'</span><span class="tm">'+hms(p.t)+'</span></div></div>'
).join('');
const tileEls=$$('.tile',tilesEl);
function liveCount(){$('#liveCount').textContent=people.filter(p=>p.on).length+' đang bật cam'}
setInterval(()=>{
  people.forEach((p,i)=>{if(p.on){p.t++;$('.tm',tileEls[i]).textContent=hms(p.t)}});
},1000);

const feed=$('#feedText');
function setFeed(msg){
  feed.textContent=msg;feed.classList.remove('swap');void feed.offsetWidth;feed.classList.add('swap');
}
setTimeout(()=>setFeed('Thu Hà vừa đạt mục tiêu 3 giờ'),3800);
setInterval(()=>{
  const p=people[5];p.on=p.on?0:1;
  const el=tileEls[5];
  el.classList.toggle('off',!p.on);
  $('.pic',el).style.setProperty('--c',p.on?'var(--p5)':'var(--off)');
  liveCount();
  setFeed(p.on?'Đức Anh bật cam, đồng hồ chạy tiếp':'Đức Anh tắt cam, đồng hồ tạm dừng');
},8500);
liveCount();

/* hero tilt */
const room=$('#room');
if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches){
  $('.hero').addEventListener('mousemove',e=>{
    const r=room.getBoundingClientRect();
    const x=(e.clientX-(r.left+r.width/2))/innerWidth, y=(e.clientY-(r.top+r.height/2))/innerHeight;
    room.style.setProperty('--ry',(x*7).toFixed(2)+'deg');
    room.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');
  });
  $('.hero').addEventListener('mouseleave',()=>{room.style.setProperty('--rx','0deg');room.style.setProperty('--ry','0deg')});
}

/* steps */
const stepsIO=new IntersectionObserver(()=>{},{});
/* (steps dùng class .in từ reveal) */

/* demo timer */
const demo=$('#demo'), sw=$('#sw'), big=$('#big'), prog=$('#prog');
let today=8048, sess=0, running=true;
const GOAL=14400, C=553;
function setBig(str){
  if(big.children.length!==str.length){
    big.innerHTML=[...str].map(ch=>'<span class="'+(ch===':'?'c':'d')+'">'+ch+'</span>').join('');
  }
  [...big.children].forEach((sp,i)=>{
    if(sp.textContent!==str[i]){
      sp.textContent=str[i];
      if(str[i]!==':'){sp.classList.remove('tick');void sp.offsetWidth;sp.classList.add('tick')}
    }
  });
}
function setRing(){prog.style.strokeDashoffset=C*(1-Math.min(today/GOAL,1))}
setBig(hms(today));
const ioD=new IntersectionObserver(es=>{if(es[0].isIntersecting){setTimeout(setRing,300);ioD.disconnect()}},{threshold:.4});
ioD.observe(demo);
setInterval(()=>{
  if(!running)return;
  today++;sess++;
  setBig(hms(today));
  $('#sess').textContent=hms(sess);
  $('#today').textContent=hms(today);
  if(prog.style.strokeDashoffset!=='')setRing();
},1000);
sw.addEventListener('click',()=>{
  running=!running;
  sw.setAttribute('aria-checked',String(running));
  demo.classList.toggle('paused',!running);
  $('#chipText').textContent=running?'Đang tính giờ':'Đã tạm dừng';
  $('#swText').textContent=running?'Đang bật, giờ học đang chạy':'Đang tắt, đồng hồ tạm dừng';
  $('#swIcon use').setAttribute('href',running?'#i-camera':'#i-camera-off');
  if(running)sess=0;
});

/* heatmap */
const heat=$('#heat');
let hh='';
for(let r=0;r<5;r++)for(let c=0;c<7;c++){
  const lv=(r*7+c*3+r*c*2)%5;
  hh+='<i style="--lv:'+(r===4&&c>4?0:Math.max(lv,r>2?1:0))+';--w:'+(r+c)+'"></i>';
}
heat.innerHTML=hh;

/* rooms live numbers */
const roomNums=$$('#rooms em');
setInterval(()=>{
  const el=roomNums[Math.floor(Math.random()*roomNums.length)];
  let n=+el.dataset.n+(Math.random()<.5?-1:1)*(1+Math.floor(Math.random()*4));
  n=Math.max(20,n);el.dataset.n=n;el.textContent=n;
  el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');
},1800);

/* ranking */
const who={
  'Thu Hà':['TH','var(--p1)'],'Minh Anh':['MA','var(--p6)'],'Quốc Bảo':['QB','var(--p2)'],
  'Ngọc Lan':['NL','var(--p4)'],'Gia Huy':['GH','var(--p3)'],'Phương Linh':['PL','var(--p5)'],'Đức Anh':['ĐA','var(--p1)']
};
const ranks={
  day:[['Thu Hà',312],['Minh Anh',274],['Quốc Bảo',241],['Ngọc Lan',205],['Gia Huy',168],['Phương Linh',122],['Đức Anh',87]],
  week:[['Quốc Bảo',1820],['Thu Hà',1745],['Minh Anh',1602],['Gia Huy',1388],['Phương Linh',1210],['Ngọc Lan',1096],['Đức Anh',904]],
  month:[['Thu Hà',7480],['Minh Anh',7105],['Quốc Bảo',6912],['Phương Linh',5870],['Gia Huy',5544],['Ngọc Lan',4930],['Đức Anh',4210]]
};
const fmtM=m=>{const h=Math.floor(m/60);return h?h+'g '+pad(m%60)+'p':m+'p'};
const list=$('#rankList'), ind=$('#segInd'), tabs=$$('.seg button');
function moveInd(b){ind.style.width=b.offsetWidth+'px';ind.style.transform='translateX('+b.offsetLeft+'px)'}
function renderRank(k){
  const d=ranks[k], max=d[0][1];
  list.classList.remove('go');
  list.innerHTML=d.map(([n,m],i)=>
    '<li style="--i:'+i+'"><span class="rk r'+(i+1)+'">'+(i+1)+'</span>'+
    '<span class="av" style="background:'+who[n][1]+'">'+who[n][0]+'</span>'+
    '<span class="nm">'+n+'</span>'+
    '<span class="bar"><i style="--w:'+(m/max*100).toFixed(1)+'%;background:'+who[n][1]+'"></i></span>'+
    '<span class="tm" data-v="'+m+'">0p</span></li>'
  ).join('');
  void list.offsetWidth;
  list.classList.add('go');
  $$('.tm',list).forEach(el=>countTo(el,+el.dataset.v,fmtM,1000));
}
tabs.forEach(b=>b.addEventListener('click',()=>{
  tabs.forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  moveInd(b);renderRank(b.dataset.k);
}));
const ioR=new IntersectionObserver(es=>{if(es[0].isIntersecting){renderRank('day');ioR.disconnect()}},{threshold:.25});
ioR.observe(list);
function initInd(){moveInd($('.seg button[aria-selected="true"]'))}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(initInd);
addEventListener('resize',initInd);
initInd();

/* faq */
$$('.qa').forEach(q=>{
  $('button',q).addEventListener('click',()=>{
    const open=!q.classList.contains('open');
    q.classList.toggle('open',open);
    $('button',q).setAttribute('aria-expanded',String(open));
  });
});

/* discord chat */
const body=$('#chatBody'), typed=$('#typed');
function addMsg(html){
  const d=document.createElement('div');d.className='msg';d.innerHTML=html;body.appendChild(d);
  while(body.children.length>5)body.firstElementChild.remove();
  return d;
}
const av=(n,c)=>'<span class="av" style="background:'+c+'">'+n+'</span>';
const userMsg=(n,c,time,t)=>av(n.split(' ').map(w=>w[0]).join(''),c)+'<div><div class="who"><b>'+n+'</b><time>'+time+'</time></div><p>'+t+'</p></div>';
const botMsg=inner=>av('C','var(--rose)')+'<div><div class="who"><b>Camlo</b><span class="tag">BOT</span><time>vừa xong</time></div>'+inner+'</div>';
addMsg(userMsg('Thu Hà','var(--p1)','20:41','Ai học tới khuya không, mình mới vào phòng.'));
addMsg(userMsg('Quốc Bảo','var(--p2)','20:42','Mình đang bật cam rồi nè. Ai muốn xem hạng tuần thì gõ lệnh nhé.'));
const scen=[
  {cmd:'/giohoc',html:'<div class="embed" style="--ec:var(--p1)"><b>Giờ học của Minh Anh</b><div class="fields"><div><span>Hôm nay</span><b>4g 32p</b></div><div><span>Tuần này</span><b>21g 40p</b></div><div><span>Chuỗi ngày</span><b>12 ngày</b></div></div><div class="mbar"><i style="--w:76%"></i></div></div>'},
  {cmd:'/xephang',html:'<div class="embed" style="--ec:var(--p2)"><b>Bảng xếp hạng hôm nay</b><div class="lines"><div><span>1. Thu Hà</span><b>5g 12p</b></div><div><span>2. Minh Anh</span><b>4g 34p</b></div><div><span>3. Quốc Bảo</span><b>4g 01p</b></div></div></div>'},
  {cmd:'/muctieu 4',html:'<div class="embed" style="--ec:var(--p3)"><b>Đã đặt mục tiêu 4 giờ mỗi ngày</b><div class="lines"><div><span>Camlo sẽ nhắc bạn lúc 21:00 nếu chưa đủ giờ.</span></div></div><div class="mbar"><i style="--w:63%"></i></div></div>'}
];
let vis=false, waiters=[];
const ioC=new IntersectionObserver(es=>{
  vis=es[0].isIntersecting;
  if(vis){waiters.forEach(r=>r());waiters=[]}
},{threshold:.35});
ioC.observe($('.chat'));
const whenVisible=()=>vis?Promise.resolve():new Promise(r=>waiters.push(r));
async function chatLoop(){
  let k=0;
  while(true){
    await whenVisible();
    await sleep(1200);
    const s=scen[k%scen.length];k++;
    typed.textContent='';
    for(const ch of s.cmd){typed.textContent+=ch;await sleep(70+Math.random()*60)}
    await sleep(450);
    typed.textContent='';
    addMsg(userMsg('Minh Anh','var(--p6)','20:4'+(3+k%5),'<code>'+s.cmd+'</code>'));
    await sleep(500);
    const t=addMsg(av('C','var(--rose)')+'<div class="dots"><i></i><i></i><i></i></div>');
    await sleep(1000);
    t.remove();
    addMsg(botMsg(s.html));
    await sleep(4200);
  }
}
chatLoop();

/* ===== login notebook ===== */
/* Điền URL OAuth thật vào đây khi có backend. Để trống thì chạy chế độ minh họa. */
const AUTH_URLS={google:'',discord:''};
const ov=$('#lgOverlay'), book=$('#book'), leafCover=$('#leafCover'), leafLogin=$('#leafLogin'), pg3=$('#pg3');
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const D=RM?80:1150;
let state=0, lastFocus=null, token=0, user=null, openTimer=null, closing=false;

/* lỗ đục sổ + vòng kim loại */
$$('.face',book).forEach(f=>{
  const h=document.createElement('div');h.className='holes';h.setAttribute('aria-hidden','true');
  h.innerHTML='<i class="hole"></i>'.repeat(8);f.appendChild(h);
});
$('#rings').innerHTML='<i class="ring"></i>'.repeat(8);
const today_=new Date().toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
$$('[data-date]').forEach(el=>el.textContent=today_);

function setState(s){
  state=s;book.dataset.s=s;
  leafCover.classList.toggle('flipped',s>=1);
  leafLogin.classList.toggle('flipped',s>=2);
  leafCover.inert=s!==0;leafLogin.inert=s!==1;pg3.inert=s!==2;
}
function resetP3(){
  delete pg3.dataset.done;
  $$('#todo li').forEach(li=>li.classList.remove('on'));
  $('#p3Title').textContent='Đang kết nối';
}
function toLogin(){
  clearTimeout(openTimer);
  setState(1);
  setTimeout(()=>{if(state===1)$('.pbtn',leafLogin).focus({preventScroll:true})},D);
}
function openLogin(trigger){
  if(user||!ov.hidden)return;
  lastFocus=trigger||document.activeElement;
  token++;closing=false;
  book.classList.add('noanim');resetP3();setState(0);void book.offsetWidth;book.classList.remove('noanim');
  ov.hidden=false;void ov.offsetWidth;ov.classList.add('show');
  document.body.style.overflow='hidden';
  ov.focus({preventScroll:true});
  clearTimeout(openTimer);
  openTimer=setTimeout(()=>{if(state===0)toLogin()},RM?50:900);
}
async function closeBook(){
  if(closing||ov.hidden)return;
  closing=true;token++;clearTimeout(openTimer);
  if(state===2){setState(1);await sleep(D*.5)}
  if(state===1){setState(0);await sleep(D*.95)}
  ov.classList.remove('show');
  await sleep(RM?20:350);
  ov.hidden=true;document.body.style.overflow='';closing=false;
  if(lastFocus&&lastFocus.isConnected&&lastFocus.offsetParent!==null)lastFocus.focus({preventScroll:true});
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-open-login]');
  if(t){e.preventDefault();openLogin(t)}
});
leafCover.addEventListener('click',()=>{if(state===0)toLogin()});
$('#lgClose').addEventListener('click',closeBook);
ov.addEventListener('click',e=>{if(e.target===ov)closeBook()});
ov.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeBook();return}
  if(e.key!=='Tab')return;
  const f=[...ov.querySelectorAll('button')].filter(el=>!el.closest('[inert]')&&el.getClientRects().length);
  if(!f.length)return;
  const first=f[0], last=f[f.length-1];
  if(e.shiftKey&&(document.activeElement===first||document.activeElement===ov)){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});

$$('.pbtn',leafLogin).forEach(b=>b.addEventListener('click',()=>choose(b.dataset.provider)));
async function choose(p){
  if(state!==1)return;
  const my=++token;
  const name=p==='google'?'Google':'Discord';
  resetP3();
  $('#p3Prov').textContent=name;
  $('#p3Step1').textContent='Xác nhận tài khoản '+name;
  $('#p3Sub').innerHTML='Camlo đang kết nối với <b>'+name+'</b>.';
  setState(2);
  await sleep(D*.85);if(my!==token)return;
  if(AUTH_URLS[p]){location.href=AUTH_URLS[p];return}
  for(const li of $$('#todo li')){
    await sleep(RM?60:700);if(my!==token)return;
    li.classList.add('on');
  }
  await sleep(RM?60:500);if(my!==token)return;
  user={name:'Minh Anh',init:'MA',provider:name};
  pg3.dataset.done='1';
  $('#p3Title').textContent='Xong rồi!';
  $('#p3Sub').innerHTML='Chào mừng <b>'+user.name+'</b>, giờ học của bạn sẽ được lưu.';
  $('#p3Enter').focus({preventScroll:true});
}
$('#p3Back').addEventListener('click',()=>{
  token++;setState(1);
  setTimeout(()=>{if(state===1)$('.pbtn',leafLogin).focus({preventScroll:true})},D);
});

function applyLogin(){
  document.body.classList.add('is-in');
  $('#meAv').textContent=user.init;$('#meName').textContent=user.name;
  $('#meChip').title='Đăng nhập bằng '+user.provider+'. Nhấn để đăng xuất';
  $('#meTitle').textContent='Chào '+user.name;
  $('#meSub').textContent='Hôm nay bạn đang đứng thứ 4 trong phòng. Cố thêm chút nữa nhé.';
  const mb=$('#meBtn');mb.removeAttribute('data-open-login');mb.setAttribute('data-enter-app','1');mb.textContent='Mở bảng điều khiển';
}
$('#p3Enter').addEventListener('click',async()=>{
  applyLogin();lastFocus=null;
  await closeBook();
  enterApp();
});
$('#meChip').addEventListener('click',()=>enterApp());
document.addEventListener('click',e=>{if(e.target.closest('[data-enter-app]'))enterApp()});

/* ===== dashboard ===== */
const app=$('#app');
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const WD=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
const dateOf=d=>{const x=new Date();x.setDate(x.getDate()-d);return x};
const dayLabel=d=>d===0?'Hôm nay':d===1?'Hôm qua':WD[dateOf(d).getDay()]+', '+pad(dateOf(d).getDate())+'/'+pad(dateOf(d).getMonth()+1);

/* toast */
let atm;
function atoast(msg){
  $('#atoastTxt').textContent=msg;
  const t=$('#atoast');t.classList.add('show');
  clearTimeout(atm);atm=setTimeout(()=>t.classList.remove('show'),2400);
}

/* dữ liệu mẫu */
const sessions=[
  {d:0,s:'19:05',e:'21:19',room:'Ôn thi tốt nghiệp',tag:'Toán',m:134},
  {d:0,s:'14:10',e:'15:02',room:'Đọc sách yên tĩnh',tag:'Văn',m:52},
  {d:1,s:'20:00',e:'22:30',room:'Lập trình cùng nhau',tag:'Lập trình',m:150},
  {d:1,s:'08:15',e:'09:47',room:'IELTS buổi sáng',tag:'Tiếng Anh',m:92},
  {d:2,s:'19:30',e:'21:30',room:'Ôn thi tốt nghiệp',tag:'Toán',m:120},
  {d:2,s:'13:00',e:'14:30',room:'Đọc sách yên tĩnh',tag:'Văn',m:90},
  {d:3,s:'21:00',e:'22:35',room:'Lập trình cùng nhau',tag:'Lập trình',m:95},
  {d:4,s:'18:40',e:'21:20',room:'Ôn thi tốt nghiệp',tag:'Toán',m:160},
  {d:4,s:'07:30',e:'09:18',room:'IELTS buổi sáng',tag:'Tiếng Anh',m:108},
  {d:5,s:'15:00',e:'17:55',room:'Lập trình cùng nhau',tag:'Lập trình',m:175},
  {d:6,s:'19:10',e:'21:30',room:'Ôn thi tốt nghiệp',tag:'Toán',m:140},
  {d:6,s:'10:00',e:'11:30',room:'Đọc sách yên tĩnh',tag:'Văn',m:90}
];
const dayMin=d=>sessions.filter(s=>s.d===d).reduce((a,s)=>a+s.m,0);
const BASE=dayMin(0);
let goalMin=240, live=true, liveSecs=720;
const todaySecs=()=>BASE*60+liveSecs;
const weekMin=()=>{let t=0;for(let d=0;d<7;d++)t+=dayMin(d);return t+Math.floor(liveSecs/60)};

/* đồng hồ có hiệu ứng lật số */
function mkClock(el){
  return str=>{
    if(el.children.length!==str.length){
      el.innerHTML=[...str].map(ch=>'<span class="'+(ch===':'?'c':'d')+'">'+ch+'</span>').join('');
    }
    [...el.children].forEach((sp,i)=>{
      if(sp.textContent!==str[i]){
        sp.textContent=str[i];
        if(str[i]!==':'){sp.classList.remove('tick');void sp.offsetWidth;sp.classList.add('tick')}
      }
    });
  };
}
const dClock=mkClock($('#dClock'));
const dProg=$('#dProg');

/* chuyển trang */
const views=$$('.view',app);
const navBtns=$$('#snav [data-go], #tabIn [data-go]');
const sideInd=$('#navInd'), tabInd=$('#tabInd');
let cur='overview';
function placeInds(){
  const sb=$('#snav [data-go].on'), tb=$('#tabIn [data-go].on');
  if(sb&&sb.offsetHeight){sideInd.style.height=sb.offsetHeight+'px';sideInd.style.transform='translateY('+sb.offsetTop+'px)'}
  if(tb&&tb.offsetWidth){const w=tb.offsetWidth*.5;tabInd.style.width=w+'px';tabInd.style.transform='translateX('+(tb.offsetLeft+(tb.offsetWidth-w)/2)+'px)'}
}
function go(v){
  cur=v;
  views.forEach(x=>x.classList.toggle('on',x.dataset.view===v));
  navBtns.forEach(b=>{const on=b.dataset.go===v;b.classList.toggle('on',on);b.setAttribute('aria-current',on?'page':'false')});
  placeInds();
  scrollTo({top:0});
  if(v==='overview'){renderBoard(true);setTimeout(updateToday,150)}
  if(v==='sessions')renderSessions();
  if(v==='rank')renderRank();
  if(v==='goals')renderGoal();
  if(v==='servers')renderServers();
  if(v==='settings')paintThemeSeg();
}
app.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');
  if(g){e.preventDefault();go(g.dataset.go)}
  const lo=e.target.closest('[data-logout]');
  if(lo)logout();
});

function enterApp(){
  if(!user)return;
  document.body.classList.add('in-app');
  document.body.style.overflow='';
  $$('.app-av').forEach(el=>el.textContent=user.init);
  $$('.app-name').forEach(el=>el.textContent=user.name);
  $$('.app-prov').forEach(el=>el.textContent='Đăng nhập bằng '+user.provider);
  const other=user.provider==='Google'?'Discord':'Google';
  paintLinks();
  const h=new Date().getHours();
  const part=h<11?'buổi sáng':h<14?'buổi trưa':h<18?'buổi chiều':'buổi tối';
  $('#greet').textContent='Chào '+part+', '+user.name;
  dProg.style.strokeDashoffset=553;
  go('overview');
  setTimeout(placeInds,80);
  atoast('Chào mừng bạn trở lại');
}
function logout(){
  user=null;
  document.body.classList.remove('in-app','is-in');
  $('#meTitle').textContent='Xem hạng của bạn';
  $('#meSub').textContent='Đăng nhập để so giờ học với cả phòng.';
  const mb=$('#meBtn');mb.removeAttribute('data-enter-app');mb.setAttribute('data-open-login','');mb.textContent='Đăng nhập';
  scrollTo({top:0});
}
addEventListener('resize',placeInds);
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(placeInds);

/* tổng quan: thẻ hôm nay */
const dSw=$('#dSw'), todayEl=$('#today');
function updateToday(){
  const t=todaySecs(), g=goalMin*60;
  dClock(hms(t));
  dProg.style.strokeDashoffset=553*(1-Math.min(t/g,1));
  const pct=Math.round(t/g*100);
  $('#dGoalTxt').textContent=pct>=100?'Đã đạt mục tiêu '+fmtM(goalMin)+'. Giỏi lắm!':pct+'% mục tiêu '+fmtM(goalMin);
  $('#dRoomSub').textContent=live?'Phiên này '+hms(liveSecs):'Đã tạm dừng, bật cam để học tiếp';
  const left=Math.max(Math.ceil((g-t)/60),0);
  $('#greetSub').textContent='Hôm nay bạn đã học '+fmtM(Math.floor(t/60))+(left?'. Còn '+left+' phút nữa là đủ mục tiêu.':'. Bạn đã đạt mục tiêu hôm nay.');
  $('#sWeek').textContent=fmtM(weekMin());
  const cols=$$('#dChart .d-col'), lastCol=cols[cols.length-1];
  if(lastCol){
    const m=Math.floor(t/60);
    lastCol.querySelector('i').style.height=barH(m);
    lastCol.querySelector('.val').textContent=(m/60).toFixed(1).replace('.',',');
  }
  const ld=$('#liveDur');if(ld)ld.textContent=hms(liveSecs);
}
dSw.addEventListener('click',()=>{
  live=!live;
  dSw.setAttribute('aria-checked',String(live));
  todayEl.classList.toggle('paused',!live);
  $('#dPill').classList.toggle('off',!live);
  $('#dPillTxt').textContent=live?'Đang tính giờ':'Đã tạm dừng';
  if(live)liveSecs=0;
  updateToday();
  atoast(live?'Đã bật cam, đồng hồ chạy tiếp':'Đã tắt cam, đồng hồ tạm dừng');
});

/* biểu đồ 7 ngày */
const CH_MAX=300;
/* chiều cao cột: chừa 24px phía trên cho nhãn giá trị */
function barH(m){return 'calc((100% - 24px) * '+Math.min(m/CH_MAX,1).toFixed(3)+')'}
function renderChart(){
  const ch=$('#dChart'), lb=$('#dLabels');
  let h='', l='';
  for(let k=0;k<7;k++){
    const d=6-k;
    const m=d===0?Math.floor(todaySecs()/60):dayMin(d);
    h+='<div class="d-col'+(d===0?' today-c':'')+'" style="--k:'+k+'"><span class="val">'+(m/60).toFixed(1).replace('.',',')+'</span><i style="height:'+barH(m)+'"></i></div>';
    l+='<span>'+(d===0?'Nay':['CN','T2','T3','T4','T5','T6','T7'][dateOf(d).getDay()])+'</span>';
  }
  h+='<div class="goal-line" id="goalLine"><span>'+fmtM(goalMin)+'</span></div>';
  ch.innerHTML=h;lb.innerHTML=l;
  placeGoalLine();
}
function placeGoalLine(){
  const gl=$('#goalLine');if(!gl)return;
  /* chart có padding-top 6px, nên trừ 30px để khớp với đỉnh các cột */
  gl.style.bottom='calc((100% - 30px) * '+Math.min(goalMin/CH_MAX,1).toFixed(3)+')';
}

/* xếp hạng hôm nay */
let boardSig='';
function boardData(){
  const me=Math.floor(todaySecs()/60);
  const arr=ranks.day.filter(([n])=>n!=='Minh Anh').map(([n,m])=>({n,m}));
  arr.push({n:'Bạn',m:me,me:true});
  return arr.sort((a,b)=>b.m-a.m);
}
function renderBoard(force){
  const arr=boardData(), max=arr[0].m, sig=arr.map(x=>x.n).join();
  const list=$('#bList');
  const myRank=arr.findIndex(x=>x.me)+1;
  $('#sRank').textContent='Hạng '+myRank;
  if(myRank>1){const up=arr[myRank-2];$('#sRankD').textContent='Cách hạng '+(myRank-1)+' khoảng '+Math.max(up.m-arr[myRank-1].m,1)+' phút'}
  else $('#sRankD').textContent='Bạn đang dẫn đầu phòng';
  if(force||sig!==boardSig){
    boardSig=sig;
    list.innerHTML=arr.map((x,i)=>{
      const w=who[x.n]||['MA','var(--p6)'];
      return '<li class="b-row'+(x.me?' me':'')+'" style="animation:rowIn .45s cubic-bezier(.2,.9,.3,1) both;animation-delay:'+i*60+'ms">'+
        '<span class="rk r'+(i+1)+'">'+(i+1)+'</span>'+
        '<span class="av" style="background:'+w[1]+'">'+w[0]+'</span>'+
        '<div style="min-width:0"><span class="nm" style="display:block">'+(x.me?'Bạn<span class="b-tag">Minh Anh</span>':x.n)+'</span><span class="bar"><i style="--w:'+(x.m/max*100).toFixed(1)+'%;background:'+w[1]+';transform:scaleX(1)"></i></span></div>'+
        '<span class="tm">'+fmtM(x.m)+'</span></li>';
    }).join('');
  }else{
    $$('.b-row',list).forEach((row,i)=>{
      $('.tm',row).textContent=fmtM(arr[i].m);
      $('.bar i',row).style.setProperty('--w',(arr[i].m/max*100).toFixed(1)+'%');
    });
  }
}

/* lịch học 5 tuần */
(function(){
  let h='';
  for(let r=0;r<5;r++)for(let c=0;c<7;c++){
    const lv=(r*7+c*3+r*c*2)%5;
    h+='<i style="--lv:'+(r===4&&c>4?0:Math.max(lv,r>2?1:0))+';--w:'+(r+c)+'"></i>';
  }
  $('#dHeat').innerHTML=h;
})();

/* việc cần làm */
let tasks=[
  {t:'Làm 20 câu hình học không gian',d:1},
  {t:'Đọc chương 3 môn Ngữ văn',d:0},
  {t:'Ôn từ vựng IELTS unit 5',d:0},
  {t:'Nộp bài tập lập trình',d:0}
];
function taskProg(){
  const n=tasks.filter(x=>x.d).length;
  $('#tCount').textContent=n+'/'+tasks.length+' xong';
  $('#tBar').style.setProperty('--w',(tasks.length?n/tasks.length*100:0)+'%');
}
function renderTasks(newIdx){
  $('#tList').innerHTML=tasks.length?tasks.map((k,i)=>
    '<li class="task'+(k.d?' done':'')+(i===newIdx?' new':'')+'" data-i="'+i+'">'+
    '<button type="button" class="tcb" aria-label="Đánh dấu hoàn thành" aria-pressed="'+!!k.d+'"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>'+
    '<span class="t-text">'+esc(k.t)+'</span>'+
    '<button type="button" class="t-del" aria-label="Xóa việc này"><svg class="ic"><use href="#i-x"/></svg></button></li>'
  ).join(''):'<li class="empty">Chưa có việc nào. Thêm một việc nhỏ để bắt đầu nhé.</li>';
  taskProg();
}
$('#tForm').addEventListener('submit',e=>{
  e.preventDefault();
  const inp=$('#tInput'), v=inp.value.trim();
  if(!v)return;
  tasks.push({t:v,d:0});inp.value='';
  renderTasks(tasks.length-1);
});
$('#tList').addEventListener('click',e=>{
  const li=e.target.closest('.task');if(!li)return;
  const i=+li.dataset.i;
  if(e.target.closest('.tcb')){
    tasks[i].d=tasks[i].d?0:1;
    li.classList.toggle('done',!!tasks[i].d);
    $('.tcb',li).setAttribute('aria-pressed',String(!!tasks[i].d));
    taskProg();
    if(tasks.every(x=>x.d))atoast('Xong hết việc hôm nay rồi!');
  }else if(e.target.closest('.t-del')){
    li.classList.add('out');
    setTimeout(()=>{tasks.splice(i,1);renderTasks()},330);
  }
});

/* phiên gần đây và danh sách phiên */
const sRow=(s,i)=>'<div class="s-row" style="--i:'+i+'"><div><b>'+s.room+'</b><div class="s-meta"><span class="tagc" data-tag="'+s.tag+'">'+s.tag+'</span><span>'+s.s+' - '+s.e+'</span></div></div><span class="s-dur">'+fmtM(s.m)+'</span></div>';
function renderRecent(){
  $('#rList').innerHTML=
    '<div class="s-row live-row" id="liveRow"><div><b>Ôn thi tốt nghiệp</b><div class="s-meta"><span class="tagc" data-tag="Toán">Toán</span><span>Đang diễn ra</span></div></div><span class="s-dur" id="liveDur">'+hms(liveSecs)+'</span></div>'+
    sessions.slice(0,3).map(sRow).join('');
}
let rangeSel=7, tagSel='all';
function renderSessions(){
  const list=sessions.filter(s=>s.d<rangeSel&&(tagSel==='all'||s.tag===tagSel));
  const total=list.reduce((a,s)=>a+s.m,0);
  $('#sumT').textContent=fmtM(total);
  $('#sumN').textContent=list.length;
  $('#sumA').textContent=list.length?fmtM(Math.round(total/list.length)):'0p';
  let html='', i=0;
  for(let d=0;d<rangeSel;d++){
    const day=list.filter(s=>s.d===d);
    if(!day.length)continue;
    html+='<div class="day-h">'+dayLabel(d)+'<span>'+fmtM(day.reduce((a,s)=>a+s.m,0))+'</span></div>'+day.map(s=>sRow(s,i++)).join('');
  }
  const el=$('#sList');
  el.innerHTML=html||'<p class="empty">Không có phiên học nào khớp bộ lọc này.</p>';
  el.classList.remove('re');void el.offsetWidth;el.classList.add('re');
}
$('#rangeChips').addEventListener('click',e=>{
  const b=e.target.closest('.chip');if(!b)return;
  rangeSel=+b.dataset.r;
  $$('#rangeChips .chip').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  renderSessions();
});
$('#tagChips').addEventListener('click',e=>{
  const b=e.target.closest('.chip');if(!b)return;
  tagSel=b.dataset.t;
  $$('#tagChips .chip').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  renderSessions();
});

/* mục tiêu */
let goalDraft=goalMin;
function renderGoal(){
  goalDraft=goalMin;paintGoal();
}
function paintGoal(){
  $('#gOut').innerHTML=fmtM(goalDraft).replace('g ','g ')+'<small>mỗi ngày</small>';
  $('#gVal').textContent=(goalDraft/60).toFixed(goalDraft%60?1:0).replace('.',',')+' giờ';
  $('#gProg').style.strokeDashoffset=553*(1-goalDraft/480);
}
$('#gMinus').addEventListener('click',()=>{goalDraft=Math.max(30,goalDraft-30);paintGoal()});
$('#gPlus').addEventListener('click',()=>{goalDraft=Math.min(480,goalDraft+30);paintGoal()});
$('#gDays').addEventListener('click',e=>{
  const b=e.target.closest('.chip');if(!b)return;
  b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));
});
$('#gSave').addEventListener('click',()=>{
  goalMin=goalDraft;
  renderChart();updateToday();
  atoast('Đã lưu mục tiêu '+fmtM(goalMin)+' mỗi ngày');
});
$$('.sw-t',app).forEach(b=>b.addEventListener('click',()=>{
  b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'));
  atoast(b.dataset.msg||'Đã lưu');
}));
$('#remTime').addEventListener('change',e=>atoast('Sẽ nhắc bạn lúc '+e.target.value));

/* máy chủ */
const servers=[
  {n:'Cùng Nhau Học',ab:'CN',m:1284,ok:1,c:'var(--p1)',ch:[['Ôn thi tốt nghiệp',1,214],['IELTS buổi sáng',1,98],['Lập trình cùng nhau',1,163],['Đọc sách yên tĩnh',0,71],['Phòng chờ',0,12]],board:'bao-cao-hoc-tap',reset:'Hàng tuần'},
  {n:'Lớp 12A3',ab:'12',m:46,ok:1,c:'var(--p2)',ch:[['Tự học buổi tối',1,18],['Hỏi bài',1,6],['Giải lao',0,3]],board:'xep-hang',reset:'Hàng ngày'},
  {n:'Nhóm đồ án',ab:'ĐA',m:8,ok:0,c:'var(--p3)',ch:[['Họp nhóm',0,0],['Làm việc chung',0,2]],board:'chung',reset:'Hàng tuần'}
];
let srvSel=0;
function renderServers(){
  $('#srvList').innerHTML=servers.map((s,i)=>
    '<button type="button" class="srv" role="option" data-i="'+i+'" aria-selected="'+(i===srvSel)+'"><span class="srv-av" style="background:'+s.c+'">'+s.ab+'</span><div><b>'+s.n+'</b><span>'+s.m.toLocaleString('vi-VN')+' thành viên</span></div><span class="st-chip'+(s.ok?'':' warn')+'">'+(s.ok?'Hoạt động':'Cần quyền')+'</span></button>'
  ).join('');
  const s=servers[srvSel];
  const opt=(arr,v)=>arr.map(o=>'<option'+(o===v?' selected':'')+'>'+o+'</option>').join('');
  $('#srvDetail').innerHTML=
    '<div class="dc-head"><h3>'+s.n+'</h3><span class="muted">'+s.m.toLocaleString('vi-VN')+' thành viên</span></div>'+
    (s.ok?'':'<div class="banner" id="banner"><span>Camlo chưa có quyền xem kênh voice ở server này nên chưa tính giờ được.</span><button type="button" class="btn" id="fix">Cấp quyền</button></div>')+
    '<h4 class="sub-h">Kênh voice được tính giờ</h4>'+
    '<ul class="ch-list">'+s.ch.map((c,i)=>
      '<li class="ch"><svg class="ic"><use href="#i-speaker"/></svg><div><b>'+c[0]+'</b><span>'+(c[2]?c[2]+' người đang trong kênh':'Hiện chưa có ai')+'</span></div>'+
      '<button type="button" class="sw" role="switch" aria-checked="'+!!c[1]+'" data-ch="'+i+'" aria-label="Tính giờ kênh '+c[0]+'"><i></i></button></li>'
    ).join('')+'</ul>'+
    '<div class="field"><label for="selBoard">Kênh gửi báo cáo</label><select class="inp" id="selBoard">'+opt(['bao-cao-hoc-tap','xep-hang','chung','thong-bao'],s.board)+'</select></div>'+
    '<div class="field"><label for="selReset">Đặt lại bảng xếp hạng</label><select class="inp" id="selReset">'+opt(['Hàng ngày','Hàng tuần','Hàng tháng'],s.reset)+'</select></div>';
}
$('#srvList').addEventListener('click',e=>{
  const b=e.target.closest('.srv');if(!b)return;
  srvSel=+b.dataset.i;renderServers();
});
$('#srvDetail').addEventListener('click',e=>{
  const s=servers[srvSel];
  const sw=e.target.closest('[data-ch]');
  if(sw){
    const c=s.ch[+sw.dataset.ch];c[1]=c[1]?0:1;
    sw.setAttribute('aria-checked',String(!!c[1]));
    atoast(c[1]?'Đã bật tính giờ kênh '+c[0]:'Đã tắt tính giờ kênh '+c[0]);
    return;
  }
  const fix=e.target.closest('#fix');
  if(fix){
    fix.textContent='Đang kiểm tra...';fix.disabled=true;
    setTimeout(()=>{
      s.ok=1;
      const bn=$('#banner');if(bn)bn.classList.add('gone');
      setTimeout(renderServers,380);
      atoast('Camlo đã có đủ quyền ở '+s.n);
    },1000);
  }
});
$('#srvDetail').addEventListener('change',e=>{
  const s=servers[srvSel];
  if(e.target.id==='selBoard'){s.board=e.target.value;atoast('Đã chọn kênh #'+e.target.value)}
  if(e.target.id==='selReset'){s.reset=e.target.value;atoast('Bảng xếp hạng đặt lại '+e.target.value.toLowerCase())}
});
$('#invite').addEventListener('click',()=>atoast('Mở trang mời Camlo (bản minh họa)'));

/* cài đặt */
function paintLinks(){
  const gOn=user&&user.provider==='Google'||linkedG;
  $('#gStatus').textContent=gOn?'Đã kết nối':'Chưa kết nối';
  const bt=$('#linkGoogle');
  bt.textContent=gOn?'Ngắt kết nối':'Kết nối';
  const dOn=user&&user.provider==='Discord'||linkedD;
  $('#dStatus').textContent=dOn?'Đã kết nối':'Chưa kết nối';
  $('#dChip').textContent=dOn?'Đã kết nối':'Chưa kết nối';
}
let linkedG=false, linkedD=true;
$('#linkGoogle').addEventListener('click',()=>{
  if(user&&user.provider==='Google'){atoast('Đây là tài khoản bạn đang dùng để đăng nhập');return}
  linkedG=!linkedG;paintLinks();
  atoast(linkedG?'Đã kết nối Google':'Đã ngắt kết nối Google');
});
function paintThemeSeg(){
  const cur_=root.getAttribute('data-theme')||'auto';
  $$('#themeSeg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.th===cur_)));
}
$('#themeSeg').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const v=b.dataset.th;
  if(v==='auto'){root.removeAttribute('data-theme');try{localStorage.removeItem('camlo-theme')}catch(x){}}
  else{root.setAttribute('data-theme',v);try{localStorage.setItem('camlo-theme',v)}catch(x){}}
  paintTheme();paintThemeSeg();
});
let wipeTm, wipeArm=false;
$('#wipe').addEventListener('click',e=>{
  const b=e.currentTarget;
  if(!wipeArm){
    wipeArm=true;b.textContent='Nhấn lại để xác nhận';
    wipeTm=setTimeout(()=>{wipeArm=false;b.textContent='Xóa dữ liệu'},3500);
  }else{
    clearTimeout(wipeTm);wipeArm=false;b.textContent='Xóa dữ liệu';
    atoast('Đây là bản minh họa nên chưa xóa dữ liệu thật');
  }
});

/* ===== trang xếp hạng toàn server ===== */
const hsh=(a,b)=>{const x=Math.sin(a*127.1+b*311.7)*43758.5453;return x-Math.floor(x)};
const SUBJ=['Toán','Văn','Tiếng Anh','Lập trình'];
const PER={day:'Hôm nay',week:'Tuần này',month:'Tháng này',all:'Mọi lúc'};
const TIER_N={ruby:'Hồng ngọc',gold:'Vàng',silver:'Bạc',bronze:'Đồng'};
const ROOMC=['var(--p1)','var(--p6)','var(--p2)','var(--p3)','var(--p4)','var(--p5)'];
const BOARDS=[
  {k:'time',n:'Giờ học',d:'Tổng thời gian bật cam',unit:'m'},
  {k:'streak',n:'Chuỗi ngày',d:'Số ngày học liên tiếp',unit:'d',noPeriod:1},
  {k:'longest',n:'Phiên dài nhất',d:'Một lần bật cam lâu nhất',unit:'m'},
  {k:'goal',n:'Đạt mục tiêu',d:'Số ngày đạt mục tiêu giờ học',unit:'d'},
  {k:'grow',n:'Tiến bộ',d:'Mức tăng so với kỳ trước',unit:'%'},
  {k:'subject',n:'Theo môn',d:'Giờ học theo từng môn',unit:'m',subs:1},
  {k:'rooms',n:'Theo phòng',d:'Phòng voice sôi động nhất',unit:'m'}
];
const MEM=[
  ['Bảo Châu',2105,'Cú đêm','var(--p5)'],['Tuấn Kiệt',1960,'Học bá','var(--p6)'],['Khánh Linh',1895,'Dậy sớm','var(--p2)'],
  ['Quốc Bảo',1820,'Mọt sách','var(--p2)'],['Thu Hà',1745,'Chăm chỉ','var(--p1)'],['Hải Đăng',1530,'Cú đêm','var(--p3)'],
  ['Mai Phương',1475,'Dậy sớm','var(--p4)'],['Gia Huy',1388,'Lập trình viên','var(--p3)'],['Anh Thư',1340,'Học bá','var(--p1)'],
  ['Trung Hiếu',1295,'Mọt sách','var(--p6)'],['Phương Linh',1210,'Chăm chỉ','var(--p5)'],['Diễm My',1180,'Dậy sớm','var(--p4)'],
  ['Minh Khôi',1120,'Cú đêm','var(--p2)'],['Ngọc Lan',1096,'Chăm chỉ','var(--p4)'],['Yến Nhi',1050,'Mọt sách','var(--p1)'],
  ['Gia Bảo',990,'Lập trình viên','var(--p6)'],['Thanh Trúc',940,'Dậy sớm','var(--p3)'],['Đức Anh',904,'Cú đêm','var(--p5)'],
  ['Việt Anh',860,'Học bá','var(--p2)'],['Bích Ngọc',815,'Chăm chỉ','var(--p1)'],['Hữu Phước',770,'Mọt sách','var(--p6)'],
  ['Tường Vy',690,'Dậy sớm','var(--p4)'],['Công Danh',610,'Lập trình viên','var(--p3)'],['Kim Ngân',540,'Chăm chỉ','var(--p5)']
];
const RS={server:0,board:'time',period:'week',sub:'Toán',sort:'desc',q:'',limit:10,items:[]};
const initOf=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
const tierOf=(r,n)=>r===1?'ruby':r<=3?'gold':r<=Math.max(6,Math.ceil(n*.35))?'silver':'bronze';

function membersOf(si){
  const idx=MEM.map((_,i)=>i);
  const take=si===0?idx:si===1?idx.filter(i=>i%2===0).slice(0,11):idx.filter(i=>i%3===1).slice(0,6);
  const list=take.map(i=>({i,n:MEM[i][0],init:initOf(MEM[i][0]),color:MEM[i][3],title:MEM[i][2]}));
  list.push({me:true,n:user?user.name:'Minh Anh',init:user?user.init:'MA',color:'var(--p6)',title:'Chăm chỉ'});
  return list;
}
function meVals(p){
  const wk=weekMin(), dayM=Math.floor(todaySecs()/60);
  const rng=p==='day'?1:7, mult={day:1,week:1,month:4.1,all:12.5}[p];
  const S=t=>sessions.filter(s=>s.tag===t&&s.d<rng).reduce((a,s)=>a+s.m,0);
  const subj={};SUBJ.forEach(t=>subj[t]=Math.round(S(t)*mult));
  return {
    time:{day:dayM,week:wk,month:Math.round(wk*4.1),all:Math.round(wk*12.5)}[p],
    streak:12,
    longest:{day:134,week:175,month:215,all:260}[p],
    goal:{day:0,week:2,month:9,all:30}[p],
    grow:{day:-23,week:12,month:8,all:15}[p],
    subj
  };
}
function memVals(i,p){
  const w=MEM[i][1];
  const time=Math.round({day:w/7*(.6+.8*hsh(i,1)),week:w,month:w*(3.8+.8*hsh(i,2)),all:w*(11+6*hsh(i,3))}[p]);
  let longest=Math.round((60+w*.08*(.6+.8*hsh(i,5)))*{day:.8,week:1,month:1.3,all:1.6}[p]);
  if(p==='day')longest=Math.min(longest,time);
  const D={day:1,week:7,month:30,all:120}[p];
  const goal=Math.round(D*Math.min(w/2200*(.75+.5*hsh(i,6)),1));
  const grow=Math.round(-25+115*hsh(i,7+{day:0,week:1,month:2,all:3}[p]));
  const streak=Math.max(1,Math.round(1+58*Math.pow(hsh(i,4),2)));
  const subj={};SUBJ.forEach((t,j)=>subj[t]=Math.round(time*(.1+.45*Math.pow(hsh(i,10+j),1.4))));
  return {time,streak,longest,goal,grow,subj};
}
function buildBoard(k){
  const p=RS.period, si=RS.server, ms=membersOf(si);
  let items;
  if(k==='rooms'){
    const total=ms.reduce((a,m)=>a+(m.me?meVals(p).time:memVals(m.i,p).time),0);
    const chs=servers[si].ch;
    const ws=chs.map((c,j)=>.5+hsh(j,60+si)*1.5), sw=ws.reduce((a,b)=>a+b,0);
    items=chs.map((c,j)=>({id:'r'+j,n:c[0],room:true,init:'',color:ROOMC[j%ROOMC.length],
      title:Math.max(1,Math.round(ms.length*(.25+.6*hsh(j,70+si))))+' thành viên',value:Math.round(total*ws[j]/sw)}));
  }else{
    items=ms.map(m=>{
      const v=m.me?meVals(p):memVals(m.i,p);
      return {id:m.me?'me':m.i,n:m.n,init:m.init,color:m.color,title:m.title,me:!!m.me,value:k==='subject'?v.subj[RS.sub]:v[k]};
    });
  }
  items.sort((a,b)=>b.value-a.value);
  items.forEach((x,i)=>{
    x.rank=i+1;x.tier=tierOf(i+1,items.length);
    x.chg=Math.round((hsh(i+1,40+si+(typeof x.id==='number'?x.id:7))-.5)*7);
  });
  return items;
}
function fmtVal(B,v){
  if(B.unit==='m')return fmtM(v);
  if(B.unit==='d')return v+' ngày';
  return (v>0?'+':v<0?'-':'')+Math.abs(v)+'%';
}
function avtHTML(x,sz,showRank){
  const face=x.room?'<svg class="ic"><use href="#i-speaker"/></svg>':x.init;
  return '<span class="avt" data-tier="'+x.tier+'" style="--sz:'+sz+'px;--ac:'+x.color+'"><span class="avt-frame"></span><span class="avt-face">'+face+'</span>'+(showRank?'<i class="avt-rank">'+x.rank+'</i>':'')+'</span>';
}
function chgHTML(n){
  return n>0?'<span class="chg up"><i></i>Tăng '+n+'</span>':n<0?'<span class="chg down"><i></i>Giảm '+(-n)+'</span>':'<span class="chg">Giữ hạng</span>';
}

function renderRank(){
  const B=BOARDS.find(b=>b.k===RS.board);
  const items=buildBoard(RS.board);
  RS.items=items;
  /* điều khiển */
  $$('#rkBoards .chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.b===RS.board)));
  $$('#rkPeriod button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.p===RS.period)));
  $('#rkPeriod').classList.toggle('dis',!!B.noPeriod);
  const subs=$('#rkSubs');subs.hidden=!B.subs;
  $$('#rkSubs .chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.t===RS.sub)));
  $('#rkDesc').textContent=B.d+(B.subs?' ('+RS.sub+')':'')+'. '+(B.noPeriod?'Bảng này không chia theo khoảng thời gian.':PER[RS.period]+'.');

  /* thống kê server */
  const si=RS.server, ms=membersOf(si);
  const tot=ms.reduce((a,m)=>a+(m.me?meVals(RS.period).time:memVals(m.i,RS.period).time),0);
  const scale=servers[si].m/ms.length;
  const online=Math.max(1,Math.round(servers[si].m*(.06+.04*hsh(si,90))));
  $('#rkStats').innerHTML=
    '<div><span>Thành viên</span><b>'+servers[si].m.toLocaleString('vi-VN')+'</b></div>'+
    '<div><span>Tổng giờ học</span><b>'+Math.round(tot*scale/60).toLocaleString('vi-VN')+' giờ</b></div>'+
    '<div><span>Trung bình mỗi người</span><b>'+fmtM(Math.round(tot/ms.length))+'</b></div>'+
    '<div><span>Đang bật cam</span><b>'+online.toLocaleString('vi-VN')+'</b></div>';

  /* thẻ nền dài của bạn */
  let mine=items.find(x=>x.me), MB=B, MI=items;
  if(!mine){MI=buildBoard('time');mine=MI.find(x=>x.me);MB=BOARDS[0]}
  const above=mine.rank>1?MI[mine.rank-2]:null;
  const mv=meVals(RS.period);
  const nextTxt=above?'Cần thêm '+fmtVal(MB,Math.max(above.value-mine.value,1))+' để lên hạng '+(mine.rank-1)+' trên bảng '+MB.n.toLowerCase():'Bạn đang dẫn đầu bảng '+MB.n.toLowerCase()+'. Giữ vững nhé!';
  const pct=above?Math.max(0,Math.min(mine.value/Math.max(above.value,1),1))*100:100;
  $('#rkCard').innerHTML=
    '<article class="rcard" data-tier="'+mine.tier+'"'+(mine.rank<=3?' data-fx="shine"':'')+'>'+
    '<div class="rcard-bg"></div><div class="rcard-fx" aria-hidden="true"></div>'+
    '<div class="rcard-body">'+avtHTML(mine,76,true)+
    '<div class="rc-id"><span class="ttl">'+mine.title+'</span><h3 class="rc-name">'+mine.n+'</h3><span class="rc-sub">'+servers[si].n+', hạng '+TIER_N[mine.tier]+'</span></div>'+
    '<div class="rc-stats"><div><span>Hạng '+MB.n.toLowerCase()+'</span><b>#'+mine.rank+'</b></div><div><span>Giờ học '+PER[RS.period].toLowerCase()+'</span><b>'+fmtM(mv.time)+'</b></div><div><span>Chuỗi ngày</span><b>'+mv.streak+' ngày</b></div></div>'+
    '<div class="rc-next"><span>'+nextTxt+'</span><div class="rc-bar"><i style="--w:'+pct.toFixed(1)+'%"></i></div></div>'+
    '</div></article>';

  /* bục vinh danh */
  $('#rkPodTag').textContent=B.n+(B.subs?', '+RS.sub:'');
  if(items.length>=3){
    $('#rkPodium').innerHTML='<div class="podium">'+[1,0,2].map(idx=>{
      const x=items[idx], h=[124,94,74][idx], dl=['.55s','.3s','.15s'][idx];
      return '<div class="pd'+(idx===0?' first':'')+'" data-tier="'+x.tier+'" style="--h:'+h+'px;--dl:'+dl+'">'+
        avtHTML(x,idx===0?68:54,false)+
        '<b class="pn">'+x.n+(x.me?' (Bạn)':'')+'</b><span class="pv">'+fmtVal(B,x.value)+'</span>'+
        '<div class="pd-block">'+(idx+1)+'</div></div>';
    }).join('')+'</div>';
  }else $('#rkPodium').innerHTML='<p class="empty">Chưa đủ thành viên để dựng bục.</p>';

  /* biểu đồ ngang top 10 */
  const top=items.slice(0,10);
  const lo=Math.min(0,...top.map(x=>x.value)), hi=Math.max(...top.map(x=>x.value))||1;
  const rowH=(x,k)=>'<div class="hb-row'+(x.me?' me':'')+'" data-tier="'+x.tier+'" style="--k:'+k+';--w:'+(Math.max((x.value-lo)/(hi-lo||1),.02)*100).toFixed(1)+'%"><span class="no">'+x.rank+'</span><span class="nm2">'+x.n+'</span><span class="hb-track"><i></i></span><span class="val">'+fmtVal(B,x.value)+'</span></div>';
  let ch=top.map(rowH).join('');
  const me=items.find(x=>x.me);
  if(me&&me.rank>10)ch+='<div class="hb-gap"></div>'+rowH(me,10);
  $('#rkChart').innerHTML=ch;

  /* phân bố */
  const vals=items.map(x=>x.value), vlo=Math.min(...vals), vhi=Math.max(...vals), bins=6;
  const bw=(vhi-vlo)/bins||1, counts=new Array(bins).fill(0);
  let meBin=-1;
  items.forEach(x=>{
    const b=Math.min(bins-1,Math.floor((x.value-vlo)/bw));
    counts[b]++;if(x.me)meBin=b;
  });
  const cmax=Math.max(...counts)||1;
  const lab=v=>B.unit==='m'?Math.round(v/60):Math.round(v);
  const unit=B.unit==='m'?'giờ':B.unit==='d'?'ngày':'%';
  $('#rkHistTag').textContent='Đơn vị: '+unit;
  $('#rkHist').innerHTML=
    '<div class="hist">'+counts.map((c,i)=>'<div class="hist-col'+(i===meBin?' me':'')+'" style="--k:'+i+'"><span>'+c+'</span><i style="--r:'+(c/cmax).toFixed(3)+'"></i></div>').join('')+'</div>'+
    '<div class="hist-labels">'+counts.map((c,i)=>'<span>'+lab(vlo+i*bw)+'-'+lab(vlo+(i+1)*bw)+'</span>').join('')+'</div>'+
    '<p class="hist-note">'+(me?'Bạn đứng <b>hạng '+me.rank+'</b> trên '+items.length+' thành viên. Cột màu hồng là nhóm của bạn.':'Phòng không có dữ liệu cá nhân của bạn.')+'</p>';

  /* quán quân các bảng */
  $('#rkChamps').innerHTML=BOARDS.map(b=>{
    const it=buildBoard(b.k), c=it[0];
    return '<button type="button" class="champ" data-b="'+b.k+'" data-tier="'+c.tier+'" aria-pressed="'+(b.k===RS.board)+'"><span class="muted">'+b.n+(b.subs?' ('+RS.sub+')':'')+'</span><div class="ncard">'+avtHTML(c,38,false)+'<div class="nm-b"><b>'+c.n+(c.me?' (Bạn)':'')+'</b><span>'+fmtVal(b,c.value)+'</span></div></div></button>';
  }).join('');

  renderTable(true);
}

function renderTable(anim){
  const B=BOARDS.find(b=>b.k===RS.board);
  let arr=RS.items.slice();
  const q=norm(RS.q.trim());
  if(q)arr=arr.filter(x=>norm(x.n).includes(q));
  if(RS.sort==='asc')arr.reverse();
  const shown=arr.slice(0,RS.limit);
  const head='<div class="tr th"><span>Hạng</span><span>Thành viên</span><span>'+B.n+'</span><span>Xu hướng</span><span>Cấp</span></div>';
  const rows=shown.map((x,i)=>
    '<div class="tr'+(x.me?' me':'')+'" data-tier="'+x.tier+'" style="--i:'+Math.min(i,12)+'">'+
    '<span class="c-rk rk-n">'+x.rank+'</span>'+
    '<div class="c-mem ncard">'+avtHTML(x,40,false)+'<div class="nm-b"><b>'+x.n+(x.me?'<span class="b-tag">Bạn</span>':'')+'</b><span class="ttl">'+x.title+'</span></div></div>'+
    '<span class="c-val">'+fmtVal(B,x.value)+'</span>'+
    '<span class="c-chg">'+chgHTML(x.chg)+'</span>'+
    '<span class="c-tier"><span class="tier-chip">'+TIER_N[x.tier]+'</span></span></div>'
  ).join('');
  const tb=$('#rkTable');
  tb.innerHTML=shown.length?head+rows:'<p class="empty">Không tìm thấy thành viên nào.</p>';
  tb.classList.remove('re');
  if(anim){void tb.offsetWidth;tb.classList.add('re')}
  $('#rkCount').textContent='Hiển thị '+shown.length+'/'+arr.length+' thành viên';
  $('#rkMore').hidden=shown.length>=arr.length;
}

/* thư viện thẻ tên (dựng một lần) */
function renderCatalog(){
  const tiers=['ruby','gold','silver','bronze'];
  const dsc={ruby:'Quán quân của bảng',gold:'Hạng 2 và 3',silver:'Nhóm đầu của server',bronze:'Các thành viên đang tiến bộ'};
  const sample=(t,i,extra)=>Object.assign({tier:t,color:ROOMC[i],init:'TV',rank:i+1},extra||{});
  $('#rkCatalog').innerHTML=
    '<div class="cat-sec"><h4>Khung avatar theo kích cỡ</h4><div class="cat-frames">'+tiers.map((t,i)=>
      '<div class="cat-frame"><div class="row">'+[32,44,60].map(s=>avtHTML(sample(t,i),s,false)).join('')+'</div><b>'+TIER_N[t]+'</b><span class="d">'+dsc[t]+'</span></div>'
    ).join('')+'</div></div>'+
    '<div class="cat-sec"><h4>Thẻ tên gọn trong danh sách</h4><div class="cat-names">'+tiers.map((t,i)=>
      '<div class="ncard" data-tier="'+t+'">'+avtHTML(sample(t,i),40,false)+'<div class="nm-b"><b>Tên thành viên</b><span class="ttl">Danh hiệu</span></div></div>'
    ).join('')+'</div></div>'+
    '<div class="cat-sec"><h4>Thẻ nền dài</h4><div class="cat-cards">'+tiers.map((t,i)=>
      '<article class="rcard sm" data-tier="'+t+'"'+(t==='ruby'?' data-fx="shine"':'')+'><div class="rcard-bg"></div><div class="rcard-fx" aria-hidden="true"></div>'+
      '<div class="rcard-body">'+avtHTML(sample(t,i),56,true)+
      '<div class="rc-id"><span class="ttl">Danh hiệu</span><h3 class="rc-name">Tên thành viên</h3><span class="rc-sub">Hạng '+TIER_N[t]+'</span></div>'+
      '<div class="rc-stats"><div><span>Giờ học</span><b>23g 26p</b></div><div><span>Chuỗi</span><b>12 ngày</b></div></div></div></article>'
    ).join('')+'</div></div>';
}

/* khởi tạo điều khiển xếp hạng */
(function(){
  $('#rkServer').innerHTML=servers.map((s,i)=>'<option value="'+i+'">'+s.n+'</option>').join('');
  $('#rkBoards').innerHTML=BOARDS.map(b=>'<button type="button" class="chip" data-b="'+b.k+'" aria-pressed="false">'+b.n+'</button>').join('');
  $('#rkSubs').innerHTML=SUBJ.map(t=>'<button type="button" class="chip" data-t="'+t+'" aria-pressed="false">'+t+'</button>').join('');
  renderCatalog();
  const setBoard=k=>{RS.board=k;RS.limit=10;renderRank()};
  $('#rkBoards').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)setBoard(b.dataset.b)});
  $('#rkChamps').addEventListener('click',e=>{const b=e.target.closest('.champ');if(b){setBoard(b.dataset.b);scrollTo({top:0,behavior:'smooth'})}});
  $('#rkPeriod').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;RS.period=b.dataset.p;RS.limit=10;renderRank()});
  $('#rkSubs').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;RS.sub=b.dataset.t;RS.limit=10;renderRank()});
  $('#rkServer').addEventListener('change',e=>{RS.server=+e.target.value;RS.limit=10;renderRank()});
  $('#rkSearch').addEventListener('input',e=>{RS.q=e.target.value;RS.limit=10;renderTable(false)});
  $('#rkSort').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    RS.sort=b.dataset.s;
    $$('#rkSort button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    renderTable(true);
  });
  $('#rkMore').addEventListener('click',()=>{RS.limit+=10;renderTable(false)});
})();

/* khởi tạo dữ liệu dashboard */
renderChart();renderTasks();renderRecent();renderBoard(true);
setInterval(()=>{
  if(!document.body.classList.contains('in-app'))return;
  if(live)liveSecs++;
  if(cur==='overview'){
    updateToday();
    if(live&&liveSecs%5===0)renderBoard(false);
  }else if(live){
    const ld=$('#liveDur');if(ld)ld.textContent=hms(liveSecs);
  }
},1000);
})();

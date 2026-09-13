let soundOn=true, bubbleScore=0, nextStar=1, memoryFirst=null, memoryLock=false, gardenLevel=0;

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='bubble')startBubbles();if(id==='starsGame')newStars();if(id==='memory')newMemory()}
document.getElementById('soundBtn').onclick=()=>{soundOn=!soundOn;document.getElementById('soundBtn').textContent=soundOn?'🔊':'🔇'};

function startBubbles(){const area=document.getElementById('bubbleArea');area.innerHTML='';bubbleScore=0;document.getElementById('bubbleScore').textContent=0;clearInterval(window.bubbleTimer);window.bubbleTimer=setInterval(()=>{if(!document.getElementById('bubble').classList.contains('active'))return;let b=document.createElement('button');b.className='bubble';let size=35+Math.random()*55;b.style.width=size+'px';b.style.height=size+'px';b.style.left=Math.random()*(area.clientWidth-size)+'px';b.style.top=(area.clientHeight-20)+'px';b.onclick=()=>{bubbleScore++;document.getElementById('bubbleScore').textContent=bubbleScore;b.remove()};area.appendChild(b);setTimeout(()=>b.remove(),5000)},650)}

function newStars(){const area=document.getElementById('starArea');area.innerHTML='';nextStar=1;document.getElementById('starScore').textContent=0;let pts=[];for(let i=0;i<8;i++){let s=document.createElement('button');s.className='star';s.textContent='✦';s.style.left=(8+Math.random()*84)+'%';s.style.top=(8+Math.random()*78)+'%';s.dataset.n=i+1;s.onclick=()=>{if(+s.dataset.n===nextStar){s.textContent='✧';s.style.opacity=.35;nextStar++;document.getElementById('starScore').textContent=nextStar-1;if(nextStar===9)toast('✨ Costellazione completata!')}};area.appendChild(s)}}

function newMemory(){const emojis=['🌸','🌙','☁️','🦋','🌷','⭐','🍓','🐱'];let arr=[...emojis,...emojis].sort(()=>Math.random()-.5);let grid=document.getElementById('memoryGrid');grid.innerHTML='';memoryFirst=null;memoryLock=false;arr.forEach(e=>{let c=document.createElement('button');c.className='card';c.dataset.e=e;c.textContent=e;c.onclick=()=>flip(c);grid.appendChild(c)})}
function flip(c){if(memoryLock||c.classList.contains('open')||c.classList.contains('matched'))return;c.classList.add('open');if(!memoryFirst){memoryFirst=c;return}if(memoryFirst.dataset.e===c.dataset.e){memoryFirst.classList.add('matched');c.classList.add('matched');memoryFirst=null;if(document.querySelectorAll('.matched').length===16)toast('🌷 Hai trovato tutte le coppie!')}else{memoryLock=true;setTimeout(()=>{c.classList.remove('open');memoryFirst.classList.remove('open');memoryFirst=null;memoryLock=false},700)}}

function water(){gardenLevel=Math.min(3,gardenLevel+1);grow();toast('💧 Un po’ d’acqua!')}
function sun(){gardenLevel=Math.min(3,gardenLevel+1);grow();toast('☀️ Il sole fa bene!')}
function grow(){let f=document.getElementById('flower');f.textContent=['🌱','🌿','🌷','🌻'][gardenLevel];f.style.transform=`scale(${1+gardenLevel*.08})`;document.getElementById('gardenMsg').textContent=['Il tuo semino aspetta un po’ di attenzione.','Sta spuntando qualcosa!','Sta crescendo!','È sbocciato! 🌻'][gardenLevel]}
function secret(){toast('💗 Ciao Culettina!');}
function toast(t){let x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}

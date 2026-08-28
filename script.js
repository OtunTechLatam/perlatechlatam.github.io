const header=document.querySelector("#header"),menu=document.querySelector(".menu"),nav=document.querySelector("#nav");
menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)});
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>20),{passive:true});
const links=[...document.querySelectorAll("nav a[href^='#']")], sections=[...document.querySelectorAll("main section[id]")];
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("active",l.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-35% 0px -55%"}).observe;
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle("active",l.getAttribute("href")==="#"+e.target.id))}}),{rootMargin:"-35% 0px -55%"});
sections.forEach(s=>spy.observe(s));
const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");reveal.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(x=>reveal.observe(x));
const glow=document.querySelector(".cursor-glow"),dot=document.querySelector(".cursor-dot");
if(matchMedia("(pointer:fine)").matches){let x=innerWidth/2,y=innerHeight/2,gx=x,gy=y;addEventListener("mousemove",e=>{x=e.clientX;y=e.clientY;dot.style.left=x+"px";dot.style.top=y+"px"},{passive:true});(function loop(){gx+=(x-gx)*.09;gy+=(y-gy)*.09;glow.style.left=gx+"px";glow.style.top=gy+"px";requestAnimationFrame(loop)})()}
document.querySelector("#year").textContent=new Date().getFullYear();

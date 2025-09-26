const $ = (s) => document.querySelector(s);
const state = {
  apiKey: null,
  set(k){ this.apiKey=k||null; $("#api-key").textContent=this.apiKey||"—";
          $("#copy-key").disabled=!k; $("#clear-key").disabled=!k; }
};
function pretty(v){ try{return typeof v==="string"?v:JSON.stringify(v,null,2);}catch{return String(v);} }
async function callApi(path, opt={}) {
  const res = await fetch(path,{method:"GET",headers:{Accept:"application/json",...(opt.headers||{})},...opt});
  const txt = await res.text(); let data; try{data=JSON.parse(txt);}catch{data={ok:res.ok,raw:txt};}
  if(!res.ok){ const e=new Error(`HTTP ${res.status}`); e.data=data; throw e; } return data;
}
$("#check-health").addEventListener("click", async () => {
  const tgt=$("#login-result"); tgt.textContent="Checking API…";
  try{ const d=await callApi("/api/health"); tgt.innerHTML=`<span class="ok">OK</span>\n${pretty(d)}`;}
  catch(e){ tgt.innerHTML=`<span class="err">${e.message}</span>\n${pretty(e.data)}`;}
});
$("#register-form").addEventListener("submit", async (e)=>{
  e.preventDefault(); const {email,password}=e.target; const out=$("#register-result"); out.textContent="Creating…";
  try{ const d=await callApi("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:email.value.trim(),password:password.value})});
       out.innerHTML=`<span class="ok">Registered</span>\n${pretty(d)}`; state.set(d.api_key||d.token||d.key);}
  catch(err){ out.innerHTML=`<span class="err">${err.message}</span>\n${pretty(err.data)}`;}
});
$("#login-form").addEventListener("submit", async (e)=>{
  e.preventDefault(); const {email,password}=e.target; const out=$("#login-result"); out.textContent="Logging in…";
  try{ const d=await callApi("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:email.value.trim(),password:password.value})});
       out.innerHTML=`<span class="ok">Logged in</span>\n${pretty(d)}`; state.set(d.api_key||d.token||d.key);}
  catch(err){ out.innerHTML=`<span class="err">${err.message}</span>\n${pretty(err.data)}`;}
});
$("#copy-key").addEventListener("click", async ()=>{ if(state.apiKey) try{await navigator.clipboard.writeText(state.apiKey);}catch{} });
$("#clear-key").addEventListener("click", ()=> state.set(null));
$("#year").textContent = new Date().getFullYear();

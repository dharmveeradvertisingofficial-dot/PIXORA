const menuButton=document.getElementById('menuButton');
const sidebar=document.getElementById('sidebar');

function closeSidebar(){
  if(!sidebar)return;
  sidebar.classList.remove('open');
  document.body.classList.remove('sidebar-open');
  const backdrop=document.querySelector('.sidebar-backdrop');
  if(backdrop)backdrop.classList.remove('visible');
  if(menuButton)menuButton.setAttribute('aria-expanded','false');
}
function openSidebar(){
  if(!sidebar)return;
  sidebar.classList.add('open');
  document.body.classList.add('sidebar-open');
  const backdrop=document.querySelector('.sidebar-backdrop');
  if(backdrop)backdrop.classList.add('visible');
  if(menuButton)menuButton.setAttribute('aria-expanded','true');
}
if(menuButton&&sidebar){
  let backdrop=document.querySelector('.sidebar-backdrop');
  if(!backdrop){
    backdrop=document.createElement('div');
    backdrop.className='sidebar-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    document.body.appendChild(backdrop);
  }
  menuButton.addEventListener('click',()=>{
    if(sidebar.classList.contains('open'))closeSidebar();
    else openSidebar();
  });
  backdrop.addEventListener('click',closeSidebar);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSidebar();});
  document.querySelectorAll('.sidebar a').forEach(a=>a.addEventListener('click',closeSidebar));
  document.addEventListener('click',e=>{
    if(window.innerWidth<=760 && sidebar.classList.contains('open') &&
       !sidebar.contains(e.target) && !menuButton.contains(e.target) &&
       !e.target.closest('.sidebar-backdrop')) closeSidebar();
  });
}

const form=document.getElementById('searchForm');
if(form){
  const input=document.getElementById('q');
  const results=document.getElementById('results');
  const message=document.getElementById('searchMessage');
  const items=[
    {title:'Ganesh Festival Creative',category:'Festival',href:'festival.html',className:'p1',label:'गणेशोत्सव'},
    {title:'Marathi Event Banner',category:'Banner',href:'banners.html',className:'p2',label:'महाराष्ट्र'},
    {title:'Warm Abstract Background',category:'Background',href:'backgrounds.html',className:'p3',label:'Abstract'}
  ];
  const params=new URLSearchParams(location.search);
  if(input)input.value=params.get('q')||'';
  function runSearch(e){
    if(e)e.preventDefault();
    const q=(input?.value||'').toLowerCase().trim();
    const found=items.filter(x=>(x.title+' '+x.category+' '+x.label).toLowerCase().includes(q));
    if(results)results.innerHTML=found.map(x=>`<a class="design-card" href="${x.href}"><div class="preview ${x.className}"><strong>${x.label}</strong></div><b>${x.title}</b><small>Sample preview · Demo</small></a>`).join('');
    if(message)message.textContent=found.length?`${found.length} sample result(s).`:'No sample designs found. Try “festival”, “banner” or “background”.';
  }
  form.addEventListener('submit',runSearch);
  if(input&&input.value)runSearch();
}
/* PIXORA account menu + authenticated creator upload */
(function(){
 const SUPABASE_URL='https://gvqhwcnaycxjrlyycbci.supabase.co';
 const SUPABASE_ANON_KEY='sb_publishable_2Xb08RsHWptXCIxc_R8Iow_Gzmkb-m0';
 const profileButton=document.getElementById('profileMenuButton');
 const menu=document.getElementById('profileMenu');
 if(profileButton&&menu){
   profileButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;profileButton.setAttribute('aria-expanded',String(open));});
   document.addEventListener('click',e=>{if(!e.target.closest('.profile-menu-wrap')){menu.hidden=true;profileButton.setAttribute('aria-expanded','false');}});
 }
 let client=null,currentUser=null;
 function setMenuUser(user){
   currentUser=user||null;
   const name=document.getElementById('menuUserName'),email=document.getElementById('menuUserEmail'),login=document.getElementById('menuLoginLink'),logout=document.getElementById('menuLogoutButton');
   if(name)name.textContent=user?(user.user_metadata?.full_name||user.user_metadata?.name||'PIXORA creator'):'PIXORA account';
   if(email)email.textContent=user?(user.email||'Signed in'):'Sign in to personalize PIXORA';
   if(login)login.hidden=!!user;
   if(logout)logout.hidden=!user;
   if(profileButton){
     profileButton.innerHTML='';
     const avatar=user?.user_metadata?.avatar_url||user?.user_metadata?.picture;
     if(avatar){
       const img=document.createElement('img');img.src=avatar;img.alt='';img.className='profile-menu-avatar';profileButton.appendChild(img);
     }else profileButton.textContent=(user?.user_metadata?.full_name||user?.email||'P').trim().charAt(0).toUpperCase();
   }
   const status=document.getElementById('uploadAuthStatus');
   if(status)status.textContent=user?'Signed in as '+(user.email||'PIXORA user')+'. You can upload a design.':'Please log in with Google or email before uploading.';
   const upload=document.getElementById('designUploadForm');
   if(upload){const submit=upload.querySelector('button[type=submit]');if(submit)submit.disabled=!user;}
   const settings=document.getElementById('settingsStatus');
   if(settings)settings.textContent=user?'Signed in as '+(user.email||'PIXORA user')+'. To change your name or password, use your account page.':'You are not signed in. Log in to access account settings.';
   const collections=document.getElementById('collectionsStatus');
   if(collections)collections.textContent=user?'Signed in as '+(user.email||'PIXORA user')+'. Saved collections require the database setup in PIXORA-SUPABASE-SETUP.sql.':'Sign in to view your collections.';
 }
 function initSupabase(){
   if(!window.supabase?.createClient)return;
   client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
   client.auth.getSession().then(({data})=>setMenuUser(data.session?.user||null));
   client.auth.onAuthStateChange((_event,session)=>setMenuUser(session?.user||null));
 }
 if(window.supabase?.createClient)initSupabase();
 else{
   const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';sc.onload=initSupabase;document.head.appendChild(sc);
 }
 const logout=document.getElementById('menuLogoutButton');
 if(logout)logout.addEventListener('click',async()=>{
   if(!client){location.href='account.html';return;}
   const {error}=await client.auth.signOut();
   if(error)alert(error.message);else location.href='index.html';
 });
 const uploadForm=document.getElementById('designUploadForm');
 if(uploadForm)uploadForm.addEventListener('submit',async e=>{
   e.preventDefault();const msg=document.getElementById('uploadMessage');if(msg)msg.textContent='';
   if(!client||!currentUser){if(msg)msg.textContent='Please log in first using Google or email.';return;}
   const file=document.getElementById('designFile')?.files?.[0];if(!file)return;
   if(file.size>25*1024*1024){if(msg)msg.textContent='File must be 25 MB or smaller.';return;}
   const allowed=['image/jpeg','image/png','image/svg+xml','application/pdf',''];
   if(!allowed.includes(file.type)&&!(/\.(psd)$/i.test(file.name))){if(msg)msg.textContent='Please choose JPG, PNG, SVG, PDF or PSD.';return;}
   const submit=uploadForm.querySelector('button[type=submit]');
   if(submit){submit.disabled=true;submit.textContent='Uploading…';}
   try{
     const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const path=currentUser.id+'/'+Date.now()+'-'+safeName;
     const {error:storageError}=await client.storage.from('design-files').upload(path,file,{upsert:false,contentType:file.type||'application/octet-stream'});
     if(storageError)throw storageError;
     const {error:dbError}=await client.from('designs').insert({user_id:currentUser.id,title:document.getElementById('designTitle').value.trim(),category:document.getElementById('designCategory').value,description:document.getElementById('designDescription').value.trim(),price_inr:Number(document.getElementById('designPrice').value),file_path:path,original_filename:file.name});
     if(dbError){await client.storage.from('design-files').remove([path]);throw dbError;}
     if(msg)msg.textContent='Upload complete! Your design has been saved.';
     uploadForm.reset();const price=document.getElementById('designPrice');if(price)price.value='0';
   }catch(err){if(msg)msg.textContent='Upload could not finish: '+(err.message||'Check Supabase setup and Storage policies.');}
   finally{if(submit){submit.disabled=!currentUser;submit.textContent='Upload design';}}
 });
})();
/* PIXORA mobile search improvement */
(function () {
  const form = document.getElementById("homeSearchForm");
  const input = document.getElementById("homeSearchInput");

  if (!form || !input) return;

  input.addEventListener("focus", function () {
    setTimeout(function () {
      input.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  });
})();
/* PIXORA Home Page Mobile Search */
(function () {
  const input = document.getElementById("homeHeroSearchInput");

  if (!input) return;

  input.addEventListener("focus", function () {
    setTimeout(function () {
      const rect = input.getBoundingClientRect();

      if (rect.bottom > window.innerHeight * 0.65 ||
          rect.top < 0) {
        input.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }, 250);
  });
})();

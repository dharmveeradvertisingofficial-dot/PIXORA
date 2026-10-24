const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');

if (menuButton && sidebar) {
    // १. थ्री-लाईनवर क्लिक केल्यावर साईडबार उघडणे/बंद करणे
    menuButton.addEventListener('click', (e) => {
        sidebar.classList.toggle('open');
        e.stopPropagation(); // मोबाईलवर क्लिक बाहेर पसरण्यापासून रोखतो (खूप महत्त्वाचे)
    });

    // २. साईडबारमधील कोणत्याही लिंकवर क्लिक केल्यास तो बंद करणे
    document.querySelectorAll('.sidebar a').forEach(a => 
        a.addEventListener('click', () => sidebar.classList.remove('open'))
    );

    // ३. नवीन बदल: फक्त मोबाईलवर बाहेर कुठेही क्लिक/टच केल्यास साईडबार आत जाणे (बंद होणे)
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768) { // फक्त मोबाईलसाठी
            // जर साईडबार उघडा असेल आणि क्लिक साईडबारच्या किंवा मेनू बटनच्या बाहेर झाले असेल
            if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== menuButton) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// --- इथून पुढे तुमचा शोध (Search) आणि इतर सर्व कोड जसाच्या तसा सुरक्षित आहे ---
const form=document.getElementById('searchForm');if(form){const input=document.getElementById('q');const results=document.getElementById('results');const message=document.getElementById('searchMessage');const items=[{title:'Ganesh Festival Creative',category:'Festival',href:'festival.html',className:'p1',label:'गणेशोत्सव'},{title:'Marathi Event Banner',category:'Banner',href:'banners.html',className:'p2',label:'महाराष्ट्र'},{title:'Warm Abstract Background',category:'Background',href:'backgrounds.html',className:'p3',label:'Abstract'}];const params=new URLSearchParams(location.search);if(input)input.value=params.get('q')||'';function runSearch(e){if(e)e.preventDefault();const q=(input.value||'').toLowerCase().trim();const found=items.filter(x=>(x.title+' '+x.category+' '+x.label).toLowerCase().includes(q));results.innerHTML=found.map(x=>`<a class="design-card" href="${x.href}"><div class="preview ${x.className}"><strong>${x.label}</strong></div><b>${x.title}</b><small>Sample preview · Demo</small></a>`).join('');message.textContent=found.length?`${found.length} sample result(s).`:'No sample designs found. Try “festival”, “banner” or “background”.';}form.addEventListener('submit',runSearch);if(input&&input.value)runSearch();}
/* PIXORA account menu + authenticated creator upload */
(function(){
 const SUPABASE_URL='https://gvqhwcnaycxjrlyycbci.supabase.co';
 const SUPABASE_ANON_KEY='sb_publishable_2Xb08RsHWptXCIxc_R8Iow_Gzmkb-m0';
 const menuButton=document.getElementById('profileMenuButton');
 const menu=document.getElementById('profileMenu');
 if(menuButton&&menu){
   menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));});
   document.addEventListener('click',e=>{if(!e.target.closest('.profile-menu-wrap')){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}});
 }
 let client=null, currentUser=null;
 function setMenuUser(user){
   currentUser=user||null;
   const name=document.getElementById('menuUserName'), email=document.getElementById('menuUserEmail'), login=document.getElementById('menuLoginLink'), logout=document.getElementById('menuLogoutButton');
   if(name) name.textContent=user?(user.user_metadata?.full_name||user.user_metadata?.name||'PIXORA creator'):'PIXORA account';
   if(email) email.textContent=user?(user.email||'Signed in'):'Sign in to personalize PIXORA';
   if(login) login.hidden=!!user;
   if(logout) logout.hidden=!user;
   if(menuButton){menuButton.innerHTML=''; if(user?.user_metadata?.avatar_url||user?.user_metadata?.picture){const img=document.createElement('img');img.src=user.user_metadata.avatar_url||user.user_metadata.picture;img.alt='';img.className='profile-menu-avatar';menuButton.appendChild(img);}else menuButton.textContent=(user?.user_metadata?.full_name||user?.email||'P').trim().charAt(0).toUpperCase();}
   const status=document.getElementById('uploadAuthStatus');
   if(status)status.textContent=user?'Signed in as '+(user.email||'PIXORA user')+'. You can upload a design.':'Please log in with Google or email before uploading.';
   const form=document.getElementById('designUploadForm');if(form){form.querySelector('button[type=submit]').disabled=!user;}
   const settings=document.getElementById('settingsStatus');if(settings)settings.textContent=user?'Signed in as '+(user.email||'PIXORA user')+'. To change your name or password, use your account page.':'You are not signed in. Log in to access account settings.';
   const collections=document.getElementById('collectionsStatus');if(collections)collections.textContent=user?'Signed in as '+(user.email||'PIXORA user')+'. Saved collections require the database setup in PIXORA-SUPABASE-SETUP.sql.':'Sign in to view your collections.';
 }
 if(window.supabase?.createClient){client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);client.auth.getSession().then(({data})=>setMenuUser(data.session?.user||null));client.auth.onAuthStateChange((_event,session)=>setMenuUser(session?.user||null));}
 else {const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';sc.onload=()=>{client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);client.auth.getSession().then(({data})=>setMenuUser(data.session?.user||null));client.auth.onAuthStateChange((_event,session)=>setMenuUser(session?.user||null));};document.head.appendChild(sc);}
 const logout=document.getElementById('menuLogoutButton');if(logout)logout.addEventListener('click',async()=>{if(!client){location.href='account.html';return;}const {error}=await client.auth.signOut();if(error)alert(error.message);else location.href='index.html';});
 const uploadForm=document.getElementById('designUploadForm');
 if(uploadForm)uploadForm.addEventListener('submit',async e=>{
   e.preventDefault();const msg=document.getElementById('uploadMessage');msg.textContent='';
   if(!client||!currentUser){msg.textContent='Please log in first using Google or email.';return;}
   const file=document.getElementById('designFile').files[0];if(!file)return;
   if(file.size>25*1024*1024){msg.textContent='File must be 25 MB or smaller.';return;}
   const allowed=['image/jpeg','image/png','image/svg+xml','application/pdf',''];if(!allowed.includes(file.type)&&!(/\.(psd)$/i.test(file.name))){msg.textContent='Please choose JPG, PNG, SVG, PDF or PSD.';return;}
   const btn=uploadForm.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Uploading…';
   try{
     const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const path=currentUser.id+'/'+Date.now()+'-'+safeName;
     const {error:storageError}=await client.storage.from('design-files').upload(path,file,{upsert:false,contentType:file.type||'application/octet-stream'});
     if(storageError)throw storageError;
     const {error:dbError}=await client.from('designs').insert({user_id:currentUser.id,title:document.getElementById('designTitle').value.trim(),category:document.getElementById('designCategory').value,description:document.getElementById('designDescription').value.trim(),price_inr:Number(document.getElementById('designPrice').value),file_path:path,original_filename:file.name});
     if(dbError){await client.storage.from('design-files').remove([path]);throw dbError;}
     msg.textContent='Upload complete! Your design has been saved.';
     uploadForm.reset();document.getElementById('designPrice').value='0';
   }catch(err){msg.textContent='Upload could not finish: '+(err.message||'Check Supabase setup and Storage policies.');}
   finally{btn.disabled=!currentUser;btn.textContent='Upload design';}
 });
})();

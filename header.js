document.addEventListener("DOMContentLoaded", function() {
    // १. हेडरचा (Topbar) कोड जो सर्व पानांवर ऑटोमॅटिक येईल
    const topbarHTML = `
    <header class="topbar">
        <button class="menu-button" id="menuButton" aria-label="Open menu">☰</button>
        <a class="topbar-logo" href="index.html" aria-label="PIXORA home"><img src="assets/pixora-logo.png" alt="PIXORA"></a>
        <div class="topbar-spacer"></div>
        <a class="top-link" href="plans.html">PLANS</a>
        <div class="profile-menu-wrap">
            <button class="profile-dot" id="profileMenuButton" aria-label="Open account menu" aria-expanded="false">P</button>
            <div class="profile-menu" id="profileMenu" hidden>
                <div class="profile-menu-user"><strong id="menuUserName">PIXORA account</strong><small id="menuUserEmail">Sign in to personalize PIXORA</small></div>
                <a href="plans.html">Get a Plan</a><a href="settings.html">Settings</a><a href="collections.html">My Collections</a>
                <a href="account.html" id="menuLoginLink">Log in / Sign up</a><button type="button" id="menuLogoutButton" hidden>Log out</button>
            </div>
        </div>
    </header>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    `;

    // हेडर मुख्य पानावर इन्सर्ट करणे
    const mainElement = document.querySelector('main.main');
    if (mainElement) {
        mainElement.insertAdjacentHTML('afterbegin', topbarHTML);
    }

    // २. Sidebar आणि Menu toggle (तीन रेषांचे बटन)
    const menuBtn = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // ३. Profile Menu Toggle (जीमेल/प्रोफाइल आयकॉन)
    const profileBtn = document.getElementById('profileMenuButton');
    const profileMenu = document.getElementById('profileMenu');
    
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = profileMenu.hasAttribute('hidden');
            if (isHidden) {
                profileMenu.removeAttribute('hidden');
                profileBtn.setAttribute('aria-expanded', 'true');
            } else {
                profileMenu.setAttribute('hidden', '');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // बाहेर कुठेही क्लिक केल्यास प्रोफाईल मेनू बंद होणे
        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                profileMenu.setAttribute('hidden', '');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

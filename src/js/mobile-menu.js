const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
const mobileSubmenus = mobileMenu ? Array.from(mobileMenu.querySelectorAll('[data-mobile-submenu]')) : [];

const setMobileSubmenuState = (submenu, shouldOpen) => {
  const trigger = submenu.querySelector('.pb-mobile-submenu-toggle');
  const panel = submenu.querySelector('.pb-mobile-submenu-panel');
  if (!trigger || !panel) return;

  submenu.classList.toggle('is-open', shouldOpen);
  trigger.setAttribute('aria-expanded', String(shouldOpen));
  panel.setAttribute('aria-hidden', String(!shouldOpen));
};

const closeMobileMenu = () => {
  if (!mobileMenuButton || !mobileMenu) return;
  mobileMenu.classList.remove('is-open');
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileSubmenus.forEach(submenu => setMobileSubmenuState(submenu, false));
};

if (mobileMenuButton && mobileMenu) {
  mobileMenu.setAttribute('aria-hidden', 'true');

  mobileSubmenus.forEach(submenu => {
    const trigger = submenu.querySelector('.pb-mobile-submenu-toggle');
    const startsOpen = submenu.classList.contains('is-open') || trigger?.getAttribute('aria-expanded') === 'true';
    setMobileSubmenuState(submenu, startsOpen);

    trigger?.addEventListener('click', () => {
      const isOpen = submenu.classList.contains('is-open');
      setMobileSubmenuState(submenu, !isOpen);
    });
  });

  mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', !isOpen);
    mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
  });

  mobileMenuLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isHashLink = href.startsWith('#') && href.length > 1;

    if (!isHashLink) {
      link.addEventListener('click', closeMobileMenu);
      return;
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(href);
      closeMobileMenu();

      window.setTimeout(() => {
        if (!target) return;

        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        const scrollTop = Math.max(0, targetTop - headerHeight - 10);

        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        window.history.replaceState(null, '', href);
      }, 340);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMobileMenu();
  });
}
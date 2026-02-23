document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
  const introFold = window.innerHeight * 0.95;

  revealElements.forEach((element, index) => {
    element.classList.add('pb-reveal');
    const isHero = Boolean(element.closest('[data-reveal-zone="hero"]'));
    const isHeaderReveal = element.hasAttribute('data-reveal-header');
    if (isHeaderReveal) {
      element.classList.add('pb-reveal-header');
      element.style.setProperty('--pb-reveal-duration', '980ms');
    }

    const isIntro = element.getBoundingClientRect().top <= introFold;
    if (isIntro && !isHeaderReveal) {
      element.classList.add('pb-reveal-intro');
    }

    if (isHero) {
      element.style.setProperty('--pb-reveal-intro-duration', '1150ms');
    }

    const customDelay = Number.parseInt(element.dataset.revealDelay || '', 10);
    const step = Number.isNaN(customDelay) ? index % 4 : customDelay;
    const stagger = isHeaderReveal ? 160 : (isHero ? 120 : (isIntro ? 240 : 90));
    element.style.transitionDelay = `${Math.max(step, 0) * stagger}ms`;
  });

  const startReveal = () => {
    revealElements.forEach(element => element.classList.add('is-visible'));
  };

  // Ensure initial hidden state is painted before we toggle visibility.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(startReveal);
  });

  const parallaxLayers = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!reduceMotion && parallaxLayers.length > 0) {
    let currentY = 0;
    let targetY = window.scrollY;
    let rafId = null;

    const updateParallax = () => {
      const delta = targetY - currentY;
      currentY += delta * 0.08;

      parallaxLayers.forEach(layer => {
        const speed = Number.parseFloat(layer.dataset.parallax || '0.06');
        layer.style.transform = `translate3d(0, ${(currentY * speed).toFixed(2)}px, 0)`;
      });

      if (Math.abs(delta) > 0.1) {
        rafId = window.requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    };

    const onScroll = () => {
      targetY = window.scrollY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});

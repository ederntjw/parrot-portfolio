'use strict';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let motionPreference = true;
try { motionPreference = localStorage.getItem('parrot-motion') !== 'off'; } catch { /* Storage is optional. */ }
let motionEnabled = false;
let revealObserver;
const motionButton = document.createElement('button');
motionButton.type = 'button';
motionButton.className = 'motion-control';
document.querySelector('.colophon').append(motionButton);
const entrance = (element, index = 0) => element.animate(
  [{opacity: 0, transform: 'translateY(32px)', clipPath: 'inset(0 0 100% 0)'}, {opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 -25% 0)'}],
  {duration: 1300, delay: index * 140, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'}
);
const updateMotion = (initial = false) => {
  motionEnabled = motionPreference && !reducedMotion.matches;
  document.documentElement.classList.toggle('motion-off', !motionEnabled);
  motionButton.textContent = reducedMotion.matches ? 'Motion: reduced' : `Motion: ${motionEnabled ? 'on' : 'off'}`;
  motionButton.setAttribute('aria-label', reducedMotion.matches ? 'Motion reduced by your device setting' : `Turn motion ${motionEnabled ? 'off' : 'on'}`);
  motionButton.disabled = reducedMotion.matches;
  revealObserver?.disconnect();
  if (!motionEnabled) {
    document.getAnimations().forEach(animation => animation.cancel());
    document.querySelectorAll('.card-image').forEach(el => { el.style.removeProperty('--px'); el.style.removeProperty('--py'); });
    return;
  }
  if (initial) {
    document.querySelectorAll('.hero h1 span,.hero h1 em,.project-heading h1').forEach(entrance);
    document.querySelector('.hero-art')?.animate([{opacity:0,clipPath:'inset(8% 3% 8% 3%)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],{duration:1500,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hidden) {
        entry.target.animate([{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,easing:'cubic-bezier(.2,.7,.2,1)'});
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.06});
  document.querySelectorAll('.project-card,.intro h2,.spirit-copy,.foundation h2,.timeline li,.gallery-item,.project-story h2').forEach(el=>revealObserver.observe(el));
};
motionButton.addEventListener('click', () => {
  motionPreference = !motionPreference;
  try { localStorage.setItem('parrot-motion', motionPreference ? 'on' : 'off'); } catch { /* Still works without persistence. */ }
  updateMotion();
});
reducedMotion.addEventListener('change', () => updateMotion());
updateMotion(true);

document.querySelectorAll('.card-image').forEach(frame => {
  frame.addEventListener('pointermove', event => {
    if (!motionEnabled || !finePointer.matches) return;
    const bounds = frame.getBoundingClientRect();
    frame.style.setProperty('--px', `${((event.clientX - bounds.left) / bounds.width - .5) * 10}px`);
    frame.style.setProperty('--py', `${((event.clientY - bounds.top) / bounds.height - .5) * 10}px`);
  });
  frame.addEventListener('pointerleave', () => { frame.style.removeProperty('--px'); frame.style.removeProperty('--py'); });
});

const galleryItems = [...document.querySelectorAll('.gallery-item')];
if (galleryItems.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Project image viewer');
  dialog.innerHTML = '<div class="lightbox-toolbar"><span class="lightbox-counter" aria-live="polite"></span><button type="button" class="lightbox-close" aria-label="Close image viewer">Close ×</button></div><div class="lightbox-frame"><img alt=""></div><div class="lightbox-bottom"><button type="button" class="lightbox-prev" aria-label="Previous image">←</button><p class="lightbox-caption"></p><button type="button" class="lightbox-next" aria-label="Next image">→</button></div>';
  document.body.append(dialog);
  let current = 0;
  let opener;
  const displayImage = index => {
    current = (index + galleryItems.length) % galleryItems.length;
    const source = galleryItems[current].querySelector('img');
    const target = dialog.querySelector('img');
    target.src = source.src;
    target.alt = source.alt;
    dialog.querySelector('.lightbox-caption').textContent = galleryItems[current].querySelector('figcaption').textContent;
    dialog.querySelector('.lightbox-counter').textContent = `${current + 1} / ${galleryItems.length}`;
  };
  galleryItems.forEach((figure, index) => {
    const image = figure.querySelector('img');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Enlarge image ${index + 1}: ${image.alt}`);
    figure.insertBefore(button, image);
    button.append(image);
    button.addEventListener('click', () => {
      opener = button;
      displayImage(index);
      dialog.showModal();
      dialog.querySelector('.lightbox-close').focus();
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => displayImage(current - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => displayImage(current + 1));
  dialog.querySelectorAll('.lightbox-prev,.lightbox-next').forEach(button => { button.hidden = galleryItems.length === 1; });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); displayImage(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); displayImage(current - 1); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => opener?.focus({preventScroll: true}));
}

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project-card')];
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = category !== 'All' && card.dataset.category !== category; });
    document.querySelector('.project-grid').classList.toggle('is-filtered', category !== 'All');
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('.results').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
  });
});

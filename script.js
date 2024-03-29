'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const operationContainer = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navLink = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const allImages = document.querySelectorAll('img[data-src]');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', closeModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////
// IMPLEMENTING SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

/////////////////////////////////////////
// PAGE NAVIGATION -> EVENT DELEGATION

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////
// IMPLEMENTING TABBED COMPONENT
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause....
  if (!clicked) return;

  // REMOVING THE CLASSES
  operationContainer.forEach(cont => {
    cont.classList.remove('operations__content--active');
  })
  tabs.forEach((tab) => {
    tab.classList.remove('operations__tab--active');
  });

  // ADDING THE CLASSES
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

/////////////////////////////////////////
// IMPLEMENTING MENU NAVIGATION
const handleover = function (opacity) {
  return function (e) {
    const link = e.target;
    if (e.target.classList.contains('nav__link')) {
      const logo = link.closest('.nav').querySelector('.nav__logo');

      navLink.forEach((el) => {
        return el !== link ? el.style.opacity = opacity : '';
      });
      logo.style.opacity = opacity;
    }
  }
};

nav.addEventListener('mouseover', handleover(0.5));
nav.addEventListener('mouseout', handleover(1));

/////////////////////////////////////////
// IMPLEMENTING A STICKY NAVIGATION
const navHeight = nav.getBoundingClientRect().height;

// Callback function for Intersection Observer
const stickNav = function (entries) {
  const [entry] = entries;
  entry.intersectionRatio === navOptions.threshold ? nav.classList.add('sticky') : nav.classList.remove('sticky');
};

// Options for Intersection
const navOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
};

const observer = new IntersectionObserver(stickNav, navOptions);
observer.observe(header); // The element to observe

/////////////////////////////////////////
// SCROLL ANIMATION (Revealing Elements on Scroll)

// Callback Function
const sectionReveal = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.2
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////////////////////////
// Lazy Loading of Images

// Callback Function
const lazyLoadImg = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(lazyLoadImg, {
  root: null,
  threshold: 0.1,
  // rootMargin: '200px'
});

// SELECTING THE ELEMENT
allImages.forEach(img => imgObserver.observe(img));
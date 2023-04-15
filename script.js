'use strict';
// Selecting //////////////////////////////////////////////////
const scrollBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const showModalBtn = document.querySelectorAll('.btn--show-modal');
const modalElm = document.querySelector('.modal');
const overlayElm = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.btn--close-modal');
const navLinkElm = document.querySelectorAll('.nav__link');
const navLinkContainer = document.querySelector('.nav__links');
// Modal Window ///////////////////////////////////////////////

const openModal = function () {
  modalElm.classList.remove('hidden');
  overlayElm.classList.remove('hidden');
};
const closeModal = function () {
  modalElm.classList.add('hidden');
  overlayElm.classList.add('hidden');
};
showModalBtn.forEach(btns => {
  btns.addEventListener('click', openModal);
});

closeModalBtn.addEventListener('click', closeModal);
overlayElm.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalElm.classList.contains('hidden')) {
    closeModal();
  }
});
//-LEARN MORE BUTTON-////////////////////////////////////////////////////////
scrollBtn.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});
//-SCROLLING IN NAV BAR-///////////////////////////////////////////////////////////

// This is not efficient we just click one element, but it will loop through all the elements

// navLinkElm.forEach(elm => {
//   elm.addEventListener('click', function (e) {
//     // We want to prevent scrolling to the section where we have defined ID in the HTML
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// This is the best way
navLinkContainer.addEventListener('click', function (e) {
  e.preventDefault(); // We want to prevent scrolling to the section where we have defined ID in the HTML
  if (e.target.classList.contains('nav__link')) {
    // we don't want to handle the parent element
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//-TAB COMPONENT-////////////////////////////////////////////////////////////

const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  // remove all the active tabs then add the active class for the element is clicked
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  tabContents.forEach(tc => tc.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
// NAV ///////////////////////////////////////////////////////
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblingLinks = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblingLinks.forEach(link => {
      link.style.opacity = this;
    });
    logo.style.opacity = this;
    link.style.opacity = 1;
  }
};
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');
// This is the way to avoid repeating yourself.
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// The best way - We bind the argument to the handleHover function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
// STICKY NAVIGATION /////////////////////////////////////////

// This the bad practice
// const section1Coord = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   // If the current y of the viewport > the top of section 1
//   if (this.window.scrollY > section1Coord.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// This is the better practice
const navHeight = nav.getBoundingClientRect().height;
const callback = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(callback, {
  root: null, // null is the current viewport
  threshold: 0, // when we see 0% of the root means not seeing the root anymore the callback function will be called
  rootMargin: `-${navHeight}px`,
  // rootMargin: '-90px', // this is not responsive
});
headerObserver.observe(header); // observer the changes of the header

// REVEAL SECTIONS ////////////////////////////////////////////

const sections = document.querySelectorAll('.section');
const revealSections = function (entries, observer) {
  const [entry] = entries;
  // fix bug at the first section is not revealed
  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove('section--hidden');
  // We don't want the observe method always being called. It is not good
  observer.unobserve(entry.target);
};
const sectionsObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15, // see 15% of the section => callback function is executed
});
sections.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOADING IMAGES ////////////////////////////////////////
const targetImgs = document.querySelectorAll('img[data-src]'); // select images which have the data-src attribute
const loadingImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src; // change the src attribute of image
  // entry.target.classList.remove('lazy-img'); bad performance. Because the wifi is slow the image has not loaded, but the blur is removed then users will see the urgly image
  // This means when the image is already loaded then the function will be executed
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(loadingImage, {
  root: null,
  threshold: 0, // when see 0% of the image
  rootMargin: '200px', // make loading happens before seeing the image
});

targetImgs.forEach(img => imageObserver.observe(img));

// SLIDER /////////////////////////////////////////////////////
// Selecting
let currentSlide = 0;
const leftBtn = document.querySelector('.slider__btn--left');
const rightBtn = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

// Set default things
const initailize = function () {
  moveSlide(0);
  createDots();
  addActiveDot(0);
};
// move to a specific slide
const moveSlide = function (currentSlide) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
};
// add dots dynamicly to the dot container
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
// add active class function
const addActiveDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
initailize();
// go to next slide
const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveSlide(currentSlide);
  addActiveDot(currentSlide);
};
const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  moveSlide(currentSlide);
  addActiveDot(currentSlide);
};

rightBtn.addEventListener('click', nextSlide);
leftBtn.addEventListener('click', previousSlide);

// listening to the key event
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && previousSlide();
  addActiveDot(currentSlide);
});

// listen to the dot which user click to
dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const slideNumber = e.target.dataset.slide;
  moveSlide(slideNumber);
  addActiveDot(slideNumber);
});

import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';
import { element } from 'three/tsl';

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    spaceBetween: 40,
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    autoplay: {
        delay: 7000,
        pauseOnMouseEnter: true,
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },

    breakpoints: {

    }
  });


// panel page z indices

const panelPages = document.querySelectorAll(".panelPages");

panelPages.forEach((element, index) => {
  let initial = 4;
  const panelChildren = element.children;
  for (let i = 0; i < panelChildren.length; i++) {
    //panelChildren[i].style.width = "75vw";
    panelChildren[i].style.zIndex = `${initial}`;
    initial += 1;
  }
});

// about panel unique behavior
const leftAbout = document.getElementById("button-about-left");
const rightAbout = document.getElementById("button-about-right");
const aboutPanel = document.getElementById("aboutPanel");
const aboutImage = document.getElementById("aboutImage")

leftAbout.addEventListener("click", () => {
  console.log("left clicked");
  aboutPanel.style.width = "60vw";
  
  //aboutImage.style.width = "40vw"
});

rightAbout.addEventListener("click", () => {
  aboutPanel.style.width = "0";
  //aboutImage.style.width = "100vw"
  
});

// remaining panels
// get last child of each panelpages element, add activePanel class

// right button clicked:
// get panelPages sibling, find active panel, remove active from panel

// left button clicked: 
// get panelPages sibling, find active panel, add active to next sibling

const panels = document.querySelectorAll(".panel");

panels.forEach((panel, index) => {

  const pages = Array.from(panel.querySelectorAll('.panelPage'));
  let currentIndex = pages.length - 1;

  const leftButton = panel.querySelector(".button-left");
  const rightButton = panel.querySelector(".button-right");

  leftButton.addEventListener("click", () => {
    if (currentIndex < pages.length) {
      currentIndex++;
      pages[currentIndex].style.width = "60vw";
    }
  });

  rightButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      pages[currentIndex].style.width = "0";
      currentIndex--;
    }
  });

});
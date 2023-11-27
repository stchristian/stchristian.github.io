import "./components";
import anime from "animejs/lib/anime";
import TechnologiesTableController from "./technologies";
import Router from "./router";

const baseUrl = window.location.origin;

let toggleButton;
let nav;
let pageAnimation;
let notationsOpen = false;
let notation;
let notationButton;

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  toggleButton = document.getElementById("hamburgerMenu");
  nav = document.querySelector("nav");

  toggleButton.addEventListener("click", openOrCloseMenu);

  notationButton = document.getElementById("notationButton");
  notation = document.querySelector(".notation");
  notationButton.addEventListener("click", () => {
    notation.classList.toggle("notation--open");
  });

  loadAnimations();
  new TechnologiesTableController();
  new Router({
    onPageLoadFinished: () => {
      pageAnimation = anime({
        targets: ".page--active",
        opacity: 0,
        translateX: -32,
        duration: 1000,
        direction: "reverse",
        easing: "easeInCubic",
      });

      if (toggleButton.checked) {
        toggleButton.checked = false;
        openOrCloseMenu();
      }
    },
  });
}

function openOrCloseMenu() {
  if (toggleButton.checked) {
    nav.classList.add("open");
  } else {
    nav.classList.remove("open");
  }
}

function loadAnimations() {
  anime({
    targets: "rect",
    translateY: [0, 100, 0],
    duration: 2000,
    delay: anime.stagger(100),
    autoplay: true,
    direction: "alternate",
    loop: true,
  });
}

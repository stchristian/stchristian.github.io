const baseUrl = window.location.origin;

let toggleButton;
let nav;
let links;
let pages = [];
let activePathname;
let pageAnimation;
let notationsOpen = false;
let notationButton;

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  toggleButton = document.getElementById("hamburgerMenu");
  nav = document.querySelector("nav");
  pages = Array.from(document.querySelectorAll(".page"));

  links = document.querySelectorAll("a");
  links.forEach((link) => link.addEventListener("click", linkClicked));

  toggleButton.addEventListener("click", openOrCloseMenu);

  notationButton = document.getElementById("notationButton");
  notation = document.querySelector(".notation");
  notationButton.addEventListener("click", () => {
    notation.classList.toggle("notation--open");
  });

  loadPage(window.location.pathname ?? "/");
  loadAnimations();
  new TechnologiesTableController();
}

class TechnologiesTableController {
  activeTabId;
  tabs;
  listsById;
  activeClass = "table__tab--active";
  tabClass = "table__tab";
  listClass = "table__body__list";
  listActiveClass = "table__body__list--active";

  // TODO: The following pattern happens repeatedly around the site:
  // We toggle active class on the new active element and subsequently we have to remove it from the old one.

  constructor() {
    this.tabs = document.querySelectorAll("." + this.tabClass);
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", this.handleTabClicked.bind(this));
      tab.classList.contains(this.activeClass) && (this.activeTabId = tab.id);
    });
    this.listsById = Array.from(document.querySelectorAll("." + this.listClass)).reduce((res, list) => {
      res[list.dataset.buttonId] = list;
      return res;
    }, {});
  }

  handleTabClicked(evt) {
    this.listsById[this.activeTabId].classList.remove(this.listActiveClass);
    this.tabs.forEach((tab) => {
      if (tab === evt.currentTarget) {
        tab.classList.add(this.activeClass);
        this.activeTabId = tab.id;
        this.listsById[tab.id].classList.add(this.listActiveClass);
      } else {
        tab.classList.remove(this.activeClass);
      }
    });
  }
}

function openOrCloseMenu() {
  if (toggleButton.checked) {
    nav.classList.add("open");
  } else {
    nav.classList.remove("open");
  }
}

// Handle navigation
function loadPage(newPathname) {
  if (activePathname == newPathname) return;
  activePathname = newPathname;
  if (baseUrl !== "http://127.0.0.1:8080") {
    window.history.pushState({}, "", newPathname);
  }
  pages.forEach((page) =>
    page.dataset.pathname === activePathname
      ? page.classList.add("page--active")
      : page.classList.remove("page--active")
  );
  links.forEach((link) => {
    const exact = link.dataset.exact;
    const addActiveClassToLink = exact ? link.pathname === newPathname : newPathname.startsWith(link.pathname);
    addActiveClassToLink ? link.classList.add("active-link") : link.classList.remove("active-link");
  });
  pageAnimation = anime({
    targets: ".page--active",
    opacity: 0,
    translateX: -32,
    duration: 1000,
    direction: "reverse",
    easing: "easeInCubic",
  });
}

function linkClicked(event) {
  if (event.currentTarget.origin !== window.location.origin) return;
  event.preventDefault();

  if (toggleButton.checked) {
    toggleButton.checked = false;
    openOrCloseMenu();
  }

  const {
    dataset: { redirect },
    pathname,
  } = event.currentTarget;

  loadPage(redirect ?? pathname);
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

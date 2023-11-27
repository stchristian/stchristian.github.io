export default class TechnologiesTableController {
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
      res[(list as HTMLElement).dataset.buttonId] = list;
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

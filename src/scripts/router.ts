type PageLoadFinished = () => any;

const LOCALHOST = "http://localhost:8080";

type Options = {
  onPageLoadFinished?: PageLoadFinished;
};

export default class Router {
  anchorElements: null | NodeListOf<HTMLAnchorElement> = null;
  activePathname: null | string = null;
  baseUrl = window.location.origin;
  pageLoadFinished: null | PageLoadFinished = null;
  pages: Array<HTMLElement>;
  options?: Options;

  constructor(options?: Options) {
    this.registerLinks();
    this.options = options;
    this.pages = Array.from(document.querySelectorAll(".page"));

    this.loadPage(window.location.pathname ?? "/");
  }

  private registerLinks() {
    this.anchorElements = document.querySelectorAll("a");
    this.anchorElements.forEach((link) => link.addEventListener("click", this.onLinkClicked.bind(this)));
  }

  onLinkClicked(ev: MouseEvent) {
    const anchor = ev.currentTarget as HTMLAnchorElement;
    if (anchor.origin !== window.location.origin) return; //Anchor is linking to another site

    ev.preventDefault();

    const {
      dataset: { redirect },
      pathname,
    } = anchor;

    this.loadPage(redirect ?? pathname);
  }

  loadPage(newPathname: string) {
    if (this.activePathname == newPathname) return;

    this.activePathname = newPathname;

    if (this.baseUrl !== LOCALHOST) {
      window.history.pushState({}, "", newPathname);
    }

    this.showActivePage();
    this.updateLinkActiveStyle();
    this.options?.onPageLoadFinished?.();
  }

  showActivePage() {
    this.pages.forEach((page) =>
      page.dataset.pathname === this.activePathname
        ? page.classList.add("page--active")
        : page.classList.remove("page--active")
    );
  }

  updateLinkActiveStyle() {
    this.anchorElements.forEach((link) => {
      const exact = link.dataset.exact;
      const addActiveClassToLink = exact
        ? link.pathname === this.activePathname
        : this.activePathname.startsWith(link.pathname);
      addActiveClassToLink ? link.classList.add("active-link") : link.classList.remove("active-link");
    });
  }
}

// Create a class for the element
// Attributes: type: work, confident, out-of-date
const typeToIconClass = {
  work: "fa-briefcase",
  confident: "fa-plus",
  "out-of-date": "fa-clock-rotate-left",
};

class TechBadge extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    let template = document.getElementById("tech-badge");
    let templateContent = template.content.cloneNode(true);

    this.appendChild(templateContent);

    const type = this.getAttribute("type");

    this.querySelector(".badge").classList.add("badge--" + type);
    this.querySelector(".fa-solid").classList.add(typeToIconClass[type]);
  }
}

customElements.define("tech-badge", TechBadge);

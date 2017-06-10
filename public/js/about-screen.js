// NOTE: We are expecting you to *create* an AudioPlayer, but we are *not*
// expecting you to modify the contents of this file.
class AboutScreen {
  constructor(containerElement) {
    this.containerElement = containerElement;
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

}

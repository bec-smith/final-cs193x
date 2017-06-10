
class App {
  constructor() {


    this._submitButtonClicked = this._submitButtonClicked.bind(this);
    this.goHome = this.goHome.bind(this);
    this.goAboutScreen = this.goAboutScreen.bind(this);

    const menuElement = document.querySelector('#menu');
    this.menu = new MenuScreen(menuElement,this._submitButtonClicked);
    this.menu.show();

    const aboutElement = document.querySelector('#aboutScreen');
    this.about = new AboutScreen(aboutElement);
    this.about.hide();

    const homeTab = document.querySelector('#home');
    homeTab.addEventListener('click', this.goHome);
    const aboutTab = document.querySelector('#aboutme');
    aboutTab.addEventListener('click', this.goAboutScreen);
    document.getElementById("header").classList.remove('inactive');

  }

  _submitButtonClicked(breed,location) {
    console.log("breed : "+ breed);
    console.log("location : "+ location);
    const adoptionElement = document.querySelector('#adoptionScreen');
    this.adoption = new AdoptScreen(adoptionElement,breed,location);
    this.adoption.loadDogs();
    this.adoption.show();
    this.about.hide();
    this.menu.hide();
    document.getElementById("header").classList.add('inactive');
  //  document.getElementById("nm").classList.add('inactive');

  }

  goHome(){
    this.menu.show();
    this.about.hide();
  }

  goAboutScreen(){
    this.menu.hide();
    this.about.show();
  }
}

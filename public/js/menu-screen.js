
class MenuScreen {
  constructor(containerElement,onClickedCallback) {

    this.onJsonReady = this.onJsonReady.bind(this);
    this.onResponse = this.onResponse.bind(this);
    this.populateChoices = this.populateChoices.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this.containerElement = containerElement;
    this.onClickedCallback = onClickedCallback;
    //use so duplicates won't be placed in the select bar
    this.breedArray = [];
    this.shelterArray = [];

    const JSON_URL = 'https://becnichelesmith.github.io/cs193x-dog-adoption/adoptable.json';
    this.populateChoices(JSON_URL);

    //submit form
    const form = document.querySelector('form');
    form.addEventListener('submit', this._onSubmit);
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  _onSubmit(event) {
    event.preventDefault();
    const breedSelectorElem = document.querySelector('#breed-selector');
    const shelterSelectorElem = document.querySelector('#shelter-selector');

    const breedindex = breedSelectorElem.selectedIndex;
    const shelterindex = shelterSelectorElem.selectedIndex;

    const breed = breedSelectorElem.options[breedindex].label;
    const shelter = shelterSelectorElem.options[shelterindex].label;
    console.log("form submitted!");

    this.onClickedCallback(breed,shelter);
  }

  onJsonReady(json)
  {
    const breedSelectorElem = document.querySelector('#breed-selector');
    const shelterSelectorElem = document.querySelector('#shelter-selector');
    const breedOption = document.createElement('option');
    const shelterOption = document.createElement('option');
    breedSelectorElem.appendChild(breedOption);
    shelterSelectorElem.appendChild(shelterOption);
    shelterOption.label = "ALL";
    breedOption.label = "ALL";

    const dogs = json;
    for (const dogName in dogs)
    {
      //populate selection elements with breeds and shelters
      const dog = json[dogName];
      if(!this.breedArray.includes(dog.breed))
      {
        this.breedArray.push(dog.breed);
        const breedOption = document.createElement('option');
        breedSelectorElem.appendChild(breedOption);
        breedOption.label = dog.breed;
      }
      if(!this.shelterArray.includes(dog.shelter))
      {
        this.shelterArray.push(dog.shelter);
        const shelterOption = document.createElement('option');
        shelterSelectorElem.appendChild(shelterOption);
        shelterOption.label = dog.shelter;
      }
    }
  }

  onResponse(response) {
    return response.json();
  }

  populateChoices(JSON_URL){
    fetch(JSON_URL)
        .then(this.onResponse)
        .then(this.onJsonReady);
  }

}

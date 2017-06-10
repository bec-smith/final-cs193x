// This class will represent the adoption screen, i.e. the screen that
// allows the user to enter a dog breed and location and then a sorted list of the results

const selectedDogs = [];

class AdoptScreen {
  constructor(containerElement,breed,location) {
    //bind
    this.loadDogs = this.loadDogs.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._renderDogs = this._renderDogs.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.expressmailer = this.expressmailer.bind(this);

    //setup
    this.containerElement = containerElement;
    this.breed = breed;
    this.shelter = location;
    this.dogArray = []; //to be emailed

    this.sendButton = document.getElementById('send');
    this.sendButton.addEventListener('click', this.sendEmail);

  }

  async sendEmail(event){
    event.preventDefault();
    console.log("sending email....");
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;

    //post request
    const params = {
      email: email,
      dogs: selectedDogs
    }
    const fetchOptions = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    };
    const result = await fetch('/save', fetchOptions);
    const json = await result.json();

   this.expressmailer();

  }

async expressmailer(){

    const text = selectedDogs.toString();
    const emailContainer = document.getElementById('email-input');
    const emailInput = emailContainer.value;
    console.log("email :"+emailInput);
    console.log("text :"+ text);

    const params = {
      userEmail: emailInput,
      emailText: text
    }
    const fetchOptions = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    };
    const result = await fetch('/mail', fetchOptions);
    const json = await result.json();

    if(json.message === 'error')
    {
      const failedMessage = document.querySelector('#failed');
      failedMessage.classList.remove('inactive');
    }
    else{
      const successMessage = document.querySelector('#success');
      successMessage.classList.remove('inactive');
    }


  }

  _renderDogs() {
    const dogContainer = document.getElementById('dog-container');
    dogContainer.innerHTML = '';

    for (const dogName in this.json)
    {
      const currDog = this.json[dogName];

      if(this.breed == "ALL" && this.shelter == currDog.shelter)
      {
        const dog = new Dog(dogContainer, currDog, dogName);
        this.dogArray.push(currDog);
      }
      if(this.breed == currDog.breed && this.shelter == "ALL")
      {
        const dog = new Dog(dogContainer, currDog, dogName);
        this.dogArray.push(currDog);
      }
      if(this.breed == "ALL" && this.shelter == "ALL")
      {
        const dog = new Dog(dogContainer, currDog, dogName);
        this.dogArray.push(currDog);
      }
      if(this.breed == currDog.breed && this.shelter == currDog.shelter)
      {
        const dog = new Dog(dogContainer, currDog, dogName);
        this.dogArray.push(currDog);
      }
    }
    if(this.dogArray.length == 0)
    {
      this.hide();
      const errorMessage = document.querySelector('#error');
      errorMessage.classList.remove('inactive');
    }

  }
  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  async loadDogs() {
    //TODO: change to heroku url
    const result = await fetch('/dogs');
    const json = await result.json();
    this.json = json;
    this._renderDogs();
  }

}


class Dog {
  constructor(dogContainer, currDog, dogName) {

    this.dogName = dogName;
    this.currDog = currDog;
    this.onClick = this.onClick.bind(this);
    this.onCheckboxClick = this.onCheckboxClick.bind(this);


    this.clicked = 0;
    this.checkBoxClicked = 0;

    this.div = document.createElement("div");
    this.div.setAttribute("id", dogName);

    const image = new Image();
    image.src = currDog.image;
    image.addEventListener('click', this.onClick);
    this.div.append(image);

    this.checkBox = new Image();
    this.checkBox.src = '/images/unchecked.png';
    this.checkBox.addEventListener('click', this.onCheckboxClick);
    this.checkBox.classList.add('checkbox');
    this.div.append(this.checkBox);


    let list = document.createElement("ul");
    let listItem1 = document.createElement("li");
    listItem1.textContent = "Name : "+ this.dogName;
    let listItem2 = document.createElement("li");
    listItem2.textContent = "Gender : "+ this.currDog.gender;
    let listItem3 = document.createElement("li");
    listItem3.textContent = "Age : "+ this.currDog.age;
    let listItem4 = document.createElement("li");
    listItem4.textContent = "Size : "+ this.currDog.size;
    let listItem5 = document.createElement("li");
    listItem5.textContent = "Breed : "+ this.currDog.breed;
    let listItem6 = document.createElement("li");
    listItem6.textContent = "Shelter : "+ this.currDog.shelter;
    list.appendChild( listItem1 );
    list.appendChild( listItem2 );
    list.appendChild( listItem3 );
    list.appendChild( listItem4 );
    list.appendChild( listItem5 );
    list.appendChild( listItem6 );
    this.div.append(list);

    list.classList.add('inactive');

    dogContainer.append(this.div);


  }

  onClick()
  {
    //  console.log(this.clicked);
    if(this.clicked === 0)
    {
      const divContainer = document.querySelector('#'+this.dogName);
      const list = divContainer.querySelector('ul');
      list.classList.remove('inactive');
      this.clicked = 1;

    }
    else if(this.clicked === 1)
    {
      const divContainer = document.querySelector('#'+this.dogName);
      const list = divContainer.querySelector('ul');
      list.classList.add('inactive');
      this.clicked = 0;
    }
  }

  onCheckboxClick(){
    if(this.checkBoxClicked === 0)
    {
      this.checkBox.src = '/images/checked.png';
      this.checkBoxClicked = 1;
      selectedDogs.push(this.dogName);
    }
    else if(this.checkBoxClicked === 1)
    {
      this.checkBox.src = '/images/unchecked.png';
      this.checkBoxClicked = 0;
      let index = selectedDogs.indexOf(this.dogName);
      selectedDogs.splice(index,1);
    }
  }

}

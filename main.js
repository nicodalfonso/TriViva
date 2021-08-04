let main = document.querySelector("#main");
let pageTitle = document.createElement("h1");
let subTitle = document.createElement("h2");
let scoreBoard = document.createElement("span");
scoreBoard.id = "scoreBoard";
let gameBoard = document.createElement("div");
gameBoard.id = "gameBoard";
let gameScreen = document.createElement("div");
gameScreen.id = "gameScreen";
let ui = document.createElement("div");
ui.id = "ui";
let button = document.createElement("button");

gameBoard.append(scoreBoard, gameScreen, ui);
main.append(pageTitle, subTitle, button);

class Game {
  isGameOver = false;
  category = null;
  clues = null;
  currentClue = null;
  score = 0;
  clickHandler = null;
  api = "https://www.jservice.io/api";

  init() {
    pageTitle.innerText = "¡TriViva!";
    subTitle.innerText = "Viva la Trivia, Baby";
    button.innerText = "Do you want to play a game?";
    // gameBoard.classList.toggle("hidden");
    // gameScreen.classList.toggle("hidden");
    button.classList.toggle("without-game-board");
    this.clickHandler = this.startGame;
    updateClickHandler(button, this, this.startGame);
  }

  // Arrow function binds `this` to the class instead of the button
  startGame = async () => {
    // gameBoard.classList.toggle("hidden");
    // gameScreen.classList.toggle("hidden");
    button.classList.toggle("without-game-board");
    this.addInput();
    ui.append(button);
    this.updateScore();
    main.append(gameBoard);
    button.innerText = "Submit";
    await this.handleFetchData();
    subTitle.innerText = this.category.title;
    this.displayClue();
    updateClickHandler(button, this, this.handleInput);
    console.log(this);
  };

  updateScore() {
    scoreBoard.innerText = `Score: ${this.score}`;
  }

  // Arrow function binds `this` to the class instead of the button
  handleInput = () => {
    const input = document.querySelector("#userInput");
    let userInput = input.value;
    input.value = "";
    if (this.isInputEqual(userInput, this.currentClue.answer)) {
      this.score++;
      this.updateScore();
      this.displayClue();
    } else {
      this.isGameOver = true;
      let finalScore = this.score;
      this.score = 0;
      this.updateScore();
      this.clearScreen();
      this.buildClue(`Game Over! Your final score was ${finalScore}`);
      button.innerText = "Play Again?";
    }
  };

  isInputEqual(userInput, answer) {
    return userInput.trim().toLowerCase() === answer.trim().toLowerCase();
  }

  async handleFetchData() {
    // fetch initial random clue

    this.category = await this.fetchCategory();
    this.clues = await this.fetchClues(this.category.id);
    console.log(this);
  }

  async fetchCategory() {
    let res = await fetch(`${this.api}/random`);
    // API returns array with single object
    let [data] = await res.json();
    return data.category;
  }

  async fetchClues(categoryID) {
    let res = await fetch(`${this.api}/category?id=${categoryID}`);
    let data = await res.json();
    return data.clues;
  }

  displayClue() {
    if (this.clues.length) {
      [this.currentClue] = this.selectClue();
      this.clearScreen();
      this.buildClue(this.currentClue.question);
    }
  }

  selectClue() {
    let i = Math.floor(Math.random() * this.clues.length);
    return this.clues.splice(i, 1);
  }

  clearScreen() {
    while (gameScreen.firstChild) {
      gameScreen.removeChild(gameScreen.firstChild);
    }
  }

  buildClue(text) {
    let clueEl = document.createElement("h3");
    clueEl.classList.add("clue");
    clueEl.innerText = text;
    gameScreen.prepend(clueEl);
  }

  addInput() {
    let input = document.createElement("input");
    input.type = "text";
    input.id = "userInput";
    input.placeholder = "Type your answer here";
    ui.prepend(input);
  }
}

let app = new Game();

window.addEventListener("load", () => {
  app.init();
});

const updateClickHandler = (elem, manager, newClickHandler) => {
  elem.removeEventListener("click", manager.clickHandler);
  manager.clickHandler = newClickHandler;
  elem.addEventListener("click", newClickHandler);
};

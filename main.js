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
    button.classList.toggle("without-game-board");
    this.clickHandler = updateClickHandler(button, this, this.startGame);
  }

  // Arrow function binds `this` to the class instead of the button
  startGame = async () => {
    if (this.isGameOver) {
      this.clearScreen();
      this.isGameOver = false;
      document.querySelector("#userInput").disabled = false;
    } else {
      button.classList.toggle("without-game-board");
      this.addInput();
      ui.append(button);
      main.append(gameBoard);
    }
    this.updateScore();
    button.innerText = "Submit";
    await this.handleFetchData();
    subTitle.innerText = this.category.title;
    this.displayClue();
    updateClickHandler(button, this, this.handleInput);
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
      this.endGame(false);
    }
  };

  isInputEqual(userInput, answer) {
    let strippedAnswer = this.stripHTML(answer);
    let strippedInput = this.stripHTML(userInput);
    return strippedInput.trim().toLowerCase() === strippedAnswer.trim().toLowerCase();
  }

  stripHTML(phrase) {
    let document = new DOMParser().parseFromString(phrase, "text/html") ?? "";
    let text = document.body.textContent ?? "";
    text = text.replaceAll(/"/ig, "");
    text = text.replaceAll(/\(.*\)/ig, "");
    return text;
  }

  async handleFetchData() {
    // fetch initial random clue

    this.category = await this.fetchCategory();
    this.clues = await this.fetchClues(this.category.id);
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
    console.log(this.clues);
    if (this.clues.length) {
      let [clue] = this.selectClue();
      clue.answer = this.stripHTML(clue.answer);
      this.currentClue = clue;
      this.clearScreen();
      if (this.score > 0) {
        this.buildClue("You got it, dude!\n\n" + this.currentClue.question);
      } else {
        this.buildClue(this.currentClue.question);
      }
    } else {
      this.endGame(true);
    }
  }

  selectClue() {
    let i = Math.floor(Math.random() * this.clues.length);
    let clue = this.clues.splice(i, 1);
    console.log(clue[0]);
    return clue;
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
    input.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.code === "Enter" || e.code === "Return") {
        this.clickHandler();
      }
    });
    ui.prepend(input);
  }

  endGame(hasUserWon) {
    this.isGameOver = true;
    this.clearScreen();

    if (hasUserWon) {
      this.buildClue(`Congratulations!\nYou've won!\nYour final score is ${this.score}.`);
    } else {
      this.buildClue(`Game Over!\nThe correct answer was:\n${this.currentClue.answer}\nYour final score was ${this.score}`);
      this.score = 0;
      this.updateScore();
    }

    document.querySelector("#userInput").disabled = true;
    button.innerText = "Play Again?";
    this.clickHandler = updateClickHandler(button, this, this.startGame);
    this.currentClue = null;
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
  return newClickHandler;
};

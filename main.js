let main = document.querySelector("#main")
let pageTitle = document.createElement("h1")
let subTitle = document.createElement("h2")
let gameBoard = document.createElement("div")
gameBoard.id = "gameBoard"
let gameScreen = document.createElement("div")
gameScreen.id = "gameScreen"
let button = document.createElement("button")

gameBoard.append(gameScreen)
main.append(pageTitle, subTitle, gameBoard, button)

class Game {
  constructor() {
    isGameOver: false;
    category: null;
    questions: null;
    clickHandler: null;
  }

  
  init() {
    pageTitle.innerText = "¡TriViva!"
    subTitle.innerText = "Viva la Trivia, Baby"
    button.innerText = "Do you want to play a game?"
    gameBoard.classList.toggle("hidden")
    gameScreen.classList.toggle("hidden")
    button.classList.toggle("without-game-board")
    this.clickHandler = this.startGame;
    // console.log(this.startGame)
    updateClickHandler(button, this, this.startGame);
  }
  
  // Arrow function binds `this` to the class instead of the button
  startGame = () => {
    gameBoard.classList.toggle("hidden")
    gameScreen.classList.toggle("hidden")
    button.classList.toggle("without-game-board")
    main.append("Welcome to the Jungle.")
    updateClickHandler(button, this, this.testFunction);
    gameBoard.append(button)
  }
  
  // Arrow function binds `this` to the class instead of the button
  testFunction = () => {
    console.log("ya got me")
    main.removeChild(main.lastChild)
  }
  
}



let app = new Game();

window.addEventListener("load", () => {
  app.init();
})

const updateClickHandler = (elem, manager, newClickHandler) => {
  console.log({ elem, manager, newClickHandler })
  elem.removeEventListener("click", manager.clickHandler)
  manager.clickHandler = newClickHandler
  elem.addEventListener("click", newClickHandler)
}
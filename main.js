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
  isGameOver = false;
  category = null;
  questions = null;
  clickHandler = null;
  api = "https://www.jservice.io/api";

  init() {
    pageTitle.innerText = "¡TriViva!"
    subTitle.innerText = "Viva la Trivia, Baby"
    button.innerText = "Do you want to play a game?"
    gameBoard.classList.toggle("hidden")
    gameScreen.classList.toggle("hidden")
    button.classList.toggle("without-game-board")
    this.clickHandler = this.startGame;
    updateClickHandler(button, this, this.startGame);
  }
  
  // Arrow function binds `this` to the class instead of the button
  startGame = async () => {
    gameBoard.classList.toggle("hidden")
    gameScreen.classList.toggle("hidden")
    button.classList.toggle("without-game-board")
    main.append("Welcome to the Jungle.")
    updateClickHandler(button, this, this.testFunction);
    gameBoard.append(button)
    await this.handleFetchData()
  }
  
  // Arrow function binds `this` to the class instead of the button
  testFunction = () => {
    console.log("click")
  }

  async handleFetchData() {
    // fetch initial random question
    
    this.category = await this.fetchCategory()
    this.questions = await this.fetchQuestions(this.category.id)
    console.log(this)
  }

  async fetchCategory(){
    let res = await fetch(`${this.api}/random`)
    // API returns array with single object
    let [data] = (await res.json())
    return data.category
  }

  async fetchQuestions(categoryID) {
    let res = await fetch(`${this.api}/category?id=${categoryID}`)
    let data = await res.json()
    return data.clues
  }
  
}



let app = new Game();


window.addEventListener("load", () => {
  app.init();
})

const updateClickHandler = (elem, manager, newClickHandler) => {
  elem.removeEventListener("click", manager.clickHandler)
  manager.clickHandler = newClickHandler
  elem.addEventListener("click", newClickHandler)
}


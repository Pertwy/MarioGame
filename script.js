/*
Problem Statement:

Design a maze with following rules.

1. Maze is divided into cells with custom width and height (Already Implemented).

2. Each cell of the maze can be either empty or Food for Mario (Already Implemented).

To Be Implemented:

1. Mario will be starting from a random cell once any of the direction arrow is pressed.

2. Mario should start moving cell by cell in the current direction.

3. If he hits the boundary of the maze he will get reflected in the opposite direction from which he is coming from.

4. He eats the food when he visits a cell which is having food.

5. The food will vanish once he collects it. Use arrows to change the direction. Count the total number of moves to collect all the food.

Constraints

A. 2 <= boardWidth, boardHeight <= 20.

B. Cells with food is generated automatically.

*/

$(document).ready(function() {

  // Setting game speed (msec)
  const gameSpeed = 300;


  // Function to generate random number
  function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

  // Getting board width and height
  const boardWidth = getRandomArbitrary(5,20);
  const boardHeight = getRandomArbitrary(5,20);
  $('#bWidth span').text(boardHeight);
  $('#bHeight span').text(boardWidth);

  //Instanciate the total moves to 0
  let totalMoves = 0

  // Generate food count with at max 1/10 th of cells
  let foodCount = parseInt((boardWidth * boardHeight) /10);

  // Generate random position.


  const startPosition = {
    x: getRandomArbitrary(0, boardWidth),
    y: getRandomArbitrary(0, boardHeight),
  };

  var board = new Array(boardWidth);

  for(var i = 0; i < boardWidth; i++) {
    board[i] = new Array(boardHeight);
  }

  // Array containing cells that has food
  let foodCell = [];

  // Filling food cell. same cell can be repeated due to random fn.
  for(var i = 0; i < foodCount; i++) {
    const positionX = getRandomArbitrary(0, boardWidth);
    const positionY = getRandomArbitrary(0, boardHeight);

    if(!(startPosition.x == positionX && startPosition.y == positionY)) {
      foodCell.push({
        x: positionX,
        y: positionY,
      });
    }
  }


  // App container
  let appContainer = $('.appContainer');

  // Make an empty board
  for(var i = 0; i < boardWidth; i++) {
    for(var j = 0; j < boardHeight; j++) {
      board[i][j] = {
        x: i,
        y: j,
        isHavingFood: false,
      }
    }
  }

  foodCount = 0;
  // Assign cells with food
  for(var i = 0; i < foodCell.length; i++) {
    if(!board[foodCell[i].x][foodCell[i].y].isHavingFood) {
      board[foodCell[i].x][foodCell[i].y].isHavingFood = true;
      foodCount = foodCount + 1;
    }
    board[foodCell[i].x][foodCell[i].y].isHavingFood = true;
  }

  // Generate Board content
  let boardContent = "<div class = 'board'>";

  for(var i = 0; i < boardWidth; i++) {
    let rowContent = "<div class = 'row row-" + i + "'>\n";
    for(var j = 0; j < boardHeight; j++) {
      const additionalClass = board[i][j].isHavingFood ? 'food' : '';
      rowContent += "<div class = 'cell " + "row-" + i + " col-" + j + " " + additionalClass + " '" + "></div>" + "\n";
    }
    rowContent += "</div>";
    boardContent += rowContent;
  }


  appContainer.html(boardContent);
  

  //Position of Mario. change this variable to make mario move
  let currentPosition = {
    x: startPosition.x,
    y: startPosition.y,
  };
  // Determines the direction mario move in. Starts standing still
  let currentDirection = {
    x: 0,
    y: 0,
  };

  
  //Initiate Mario
  let marioLocationClass = '.row-' + currentPosition.x + '.col-' + currentPosition.y;
  $(marioLocationClass).addClass('mario-location');


  //Move mario (add new class, remove previous)
  function moveMario(){
    let marioOldLocationClass = '.row-' + currentPosition.x + '.col-' + currentPosition.y;
    
    currentPosition.x += currentDirection.x
    currentPosition.y += currentDirection.y
    let marioLocationClass = '.row-' + currentPosition.x + '.col-' + currentPosition.y;

    $(marioOldLocationClass).removeClass('mario-location');
    $(marioLocationClass).addClass('mario-location');
  }


  //remove mushroom if stepped on
  function removeMushroom(){
    let foodArray = {"x":currentPosition.x, "y":currentPosition.y}

    if (foodCell.some(elem =>{ return JSON.stringify(foodArray) === JSON.stringify(elem)})){
      let foodLocation = '.row-' + currentPosition.x + '.col-' + currentPosition.y;
      $(foodLocation).removeClass('food');
    }
  }


  //Reverse marios direction if he hits a wall
  function reverseMovement(){
    if (currentDirection.x){
      if (currentPosition.x + currentDirection.x === -1) currentDirection.x = 1
      if (currentPosition.x + currentDirection.x === boardWidth) currentDirection.x = -1
    }
    if (currentDirection.y){
      if (currentPosition.y + currentDirection.y === -1) currentDirection.y = 1
      if (currentPosition.y + currentDirection.y === boardHeight) currentDirection.y = -1
    }
  }

  //Change the direction of Mario - using arrow keys
  //increases "Total moves"
  //input must be up, down. left or right
  function changeDirection(direction) {
    $('#marioMoves span').text(totalMoves += 1);

    let x = 0
    let y = 0
    if (direction === "left") y = -1
    else if (direction === "right") y = 1
    else if (direction === "up") x = -1
    else if (direction ==="down") x = 1
    
    currentDirection.x = x
    currentDirection.y = y
  }


  // Listen to arrow key press, then change marios direcrtion
  document.onkeydown = function(e) {
    switch(e.code) {
          case "ArrowLeft": // left
          changeDirection("left");
          break

          case "ArrowUp": // up
          changeDirection("up");
          break

          case "ArrowRight": // right
          changeDirection("right");
          break

          case "ArrowDown": // down
          changeDirection("down");
          break

          default: return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
  };


  //Main function which loops every "gameSpeed" msecs
  function startTimer(){
    reverseMovement()
    moveMario()
    removeMushroom()
    setTimeout(startTimer, gameSpeed)
  }

  startTimer()

});

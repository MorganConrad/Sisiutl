const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const {
  Board,
  cityBlocksBetween,
  samePoints,
} = require('./Board.js');

const DIRECTIONS = [ 'up', 'right', 'down', 'left'];

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

app.post('/start', (request, response) => {
  console.log("START");

  // Response data
  const data = {
    color: '#269272',
    headType: "regular",
    tailType: "regular"
  }

  return response.json(data)
})


/**
 * Main logic here
 */
app.post('/move', (request, response) => {
  var data = request.body;
  let myHead = data.you.body[0];

  let myBoard = Board(data);
  let move = null;

  // console.dir(data, { depth:99});

  let moves = possibleMoves(myHead);
  for (let d of DIRECTIONS) {  // eliminate bonehead moves
    let m = moves[d];
    m.ok = myBoard.isOnBoard(m) && myBoard.canMoveTo(m);
  }
  console.dir(moves);

  // if low health, look for food
  if (data.you.health < 20)
    move = tryToEat(myBoard, myHead, moves);

  // otherwise, attack!
  if (!move)
    move = tryToKill(myBoard, myHead, moves);

  // no good attacking moves, let's eat
  if (!move)
    move = tryToEat(myBoard, myHead, moves);

  // no good eating moves, just make a "safe" move
  if (!move)
    move = firstAvailableMove(moves);

  console.dir(move);
  return response.json({ move: move.dir })
});


function possibleMoves(p) {
  return {
    up:    { dir: 'up',    x: p.x, y: p.y - 1, ok: true },
    right: { dir: 'right', x: p.x + 1, y: p.y, ok: true },
    down:  { dir: 'down',  x: p.x, y: p.y + 1, ok: true },
    left:  { dir: 'left',  x: p.x - 1, y: p.y, ok: true },
  };
}


/**
 * Find any snakes smaller than us, sorted by distance
 * Then see if we have a good route to attack
 */
function tryToKill(board, myHead, moves) {
  console.log("tryToKill");
  let edibleSnakes = board.edibleSnakes(myHead);
  for (let snake of edibleSnakes) {
    let guess = board.guessSnakesNextPosition(snake);
    let routes = board.bestRoutes(myHead, guess);
    for (let r of routes) {
      if (moves[r].ok) {        // is it safe to head that way???
        console.dir(moves[r]);  // winner!
        return moves[r];
      }
    }
  }

  return null;
}

/**
 * Find food, sorted by distance
 * Then see fo we have a good route to it.
 */
function tryToEat(board, myHead, moves) {
  console.log("tryToEat");
  let food = board.findFood(myHead);
  console.dir(food);
  for (let f of food) {
    let routes = board.bestRoutes(myHead, f);
    for (let r of routes) {
      if (moves[r].ok) {        // is it safe to head that way???
        console.dir(moves[r]);  // winner!
        return moves[r];
      }
    }
  }

  return null;
}


function firstAvailableMove(moves) {
  console.log('firstAvailableMove');
  for (let d of DIRECTIONS) {
    if (moves[d].ok)
      return moves[d];
  }

  return null;  // we are in bad shape!
}


// This function is called when a game your snake was in ends.
// It's purely for informational purposes, you don't have to make any decisions here.
app.post('/end', (request, response) => {
  console.log("END");
  return response.json({ message: "ok" });
})

// The Battlesnake engine calls this function to make sure your snake is working.
app.post('/ping', (request, response) => {
  return response.json({ message: "pong" });
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})

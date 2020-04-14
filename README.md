# Sisiutl

![Sisiutl](https://upload.wikimedia.org/wikipedia/commons/5/51/Sisiutl_mask.jpg "Sisiutl")

The [sisiutl](https://en.wikipedia.org/wiki/Sisiutl) is a legendary creature found in many of the cultures of the Indigenous peoples of the Pacific Northwest Coast.

## An aggressive [Battlesnake AI](https://battlesnake.io) written in Javascript using NodeJS / Express.

 1. Don't go outside the ring or hit other snake bodies (including yourself)
 2. If health is low, go get food
 3. Otherwise, look for smaller competitors to attack
 4. If no smaller competitors, go eat food.
 5. However, if moving towards a snake or food looks unsafe, move in a "safe direction"

### Room for improvement
 - The search is only one ply deep.
 - the "guess" as to where an enemy snake will go is very simplistic.

### Try it

 - Running on repl.it: [Sisiutl](https://sisiutl--morganconrad.repl.co)
 - or find it as a "Public Battlesnake" via morganconrad/Sisiutl when you [Create a Game](https://play.battlesnake.com/account/games/create/) at play.battlesnake.com

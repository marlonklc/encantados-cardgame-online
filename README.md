## Available Scripts
To run this project in local, you must be on project directory and run the commands:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run server`
Launches the server (nodeJS) to test on development (running on 8000 port).\

## FIXES
- [x] avoid leprechauns cards be down with mimics cards (on down moves)
- [x] avoid to active cards abilities without 2 replicas of same creature (mimics doesn't work to active abilities)
- [x] avoid to down cards and don't have cards enough to discard on end turn
- [x] finish game when deck has no more cards
- [x] avoid song cards show modal without action (when need choose cards from discard, but there isn't)
- [x] avoid creature abilities show modal without action (when need chosse cards, but there isn't)
- [x] avoid to down 2 creatures of different groups
- [x] avoid to expand creature using just mimics

## IMPROVEMENTS
- [x] enable the cards expand on garden (including mimics cards too)
- [x] every change on hand player/enemy, sort cards by groups
- [x] improve colors of enemy player (maybe red more light, not so strong)
- [ ] create end game animation (to look better)
- [x] add sounds to have better imersion in the game
- [ ] show if enemy player is connected
- [ ] change the rule to select cards instead of discard them on make a search
- [ ] enable zoom on cards within garden
- [ ] show message of enemy playing his turn

## TECHNICAL DEBTS
- [ ] create components to improve easy maintenance [DOING]
- [ ] refactor code to use "ctx.activePlayers" to control current actions/stages on game instead of "G.currentAction"

## BACKLOG
- [ ] enable play the game multiple times until one player achieve 100 points
- [ ] able to play with more than two players (it changes a lot the game flow)
- [ ] i18n - internationalization
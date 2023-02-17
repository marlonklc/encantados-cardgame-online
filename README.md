## Available Scripts
In the project directory, you can run:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run server`
Launches the server (nodeJS) to test on development (running on 8000 port).\

### TODO LIST

- [ ] enable play the game multiple times until one player achieve 100 points
- [ ] enable the cards expand on garden (including mimics cards too)
- [ ] create components to improve easy maintenance
- [ ] able to play with more than two players (on future, because it changes a lot the game flow)
- [ ] i18n - internationalization

## FIXES
- [x] avoid leprechauns cards be down with mimics cards (on down moves)
- [ ] use "ctx.activePlayers" to control current actions/stages on game instead of "G.currentAction"
- [ ] avoid bug if song cards show modal without action (when need choose cards from discard, but there isn't)
- [ ] avoid to down 2 creatures of different groups
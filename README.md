[![wordguessr-heading-logo](https://github.com/user-attachments/assets/2b45a44d-41b0-46c0-8fa9-56b6a1a3bc4f)](https://wordguessr-765ac.web.app)
<hr/>

### <p align="center">The browser game for language learners and for those looking for a fun challenge!</p>
<div align="center">
  
|Languages|Technologies| 
|:---:|:---:|
|[![js-icon](https://skillicons.dev/icons?i=js)](https://en.wikipedia.org/wiki/JavaScript) [![html-icon](https://skillicons.dev/icons?i=html)](https://en.wikipedia.org/wiki/HTML) [![css-icon](https://skillicons.dev/icons?i=css)](https://en.wikipedia.org/wiki/CSS)|[![react-icon](https://skillicons.dev/icons?i=react)](https://react.dev/) [![firebase-icon](https://skillicons.dev/icons?i=firebase)](https://firebase.google.com/) [![bootstrap-icon](https://skillicons.dev/icons?i=bootstrap)](https://getbootstrap.com/)|

</div>

# About
WordGuessr can be played Solo, Online in a 1vs1 setting or in a Private lobby with up to 8 people!<br/>
Be the fastest to translate the words in one of the supported languages to English and earn the highest score to win the game.<br/><br/>
Currently supported languages: Japanese <img src="src/icons/japan.png" height="20px" align="center"></img> Korean <img src="src/icons/south-korea.png" height="20px" align="center"></img> German <img src="src/icons/germany.png" height="20px" align="center"></img> Italian <img src="src/icons/italy.png" height="20px" align="center"></img> French <img src="src/icons/france.png" height="20px" align="center"></img> Spanish <img src="src/icons/spain.png" height="20px" align="center"></img>

### Check out the live demo [here](https://wordguessr-765ac.web.app)!

# How it works
The following section will provide insight into how the game and its functionalities work. A gif is displayed in each sub-section to visually explain the content (This may take some time to load).
## Homepage
When the page is first loaded, the user is greeted with the homepage, where he can choose the game settings or navigate to other tabs.
- Enter code: Users can enter a lobby code to join a private lobby
- Leaderboard: Displays the top 50 players in the selected categories
- About: A simple about page
- Signin/Profile: If the user is not signed in yet, the signin-form will be displayed, else this tab will show the profile page 

[![homepage-demo](https://github.com/user-attachments/assets/468b3293-e641-4199-8b9c-ef42622a4d75)](https://wordguessr-765ac.web.app)

## Playing
If the user is logged in, either as a Guest or with an account, he can choose a gamemode and begin playing. The goal is to guess the displayed words as fast as possible to earn the highest score. If the maximum time per word of 10 seconds is over, the word is automatically skipped. As soon as all players have finished, the summary page is shown where the results of all players are displayed. The retry button on the bottom right restarts the game with the same settings but new words.

[![play-demo](https://github.com/user-attachments/assets/c1f7bc4e-ad2a-4be8-a06e-97077407c642)](https://wordguessr-765ac.web.app)

## Online
When selecting online mode, an opponent, which is also searching an online game with equivalent settings, will be searched for. If an opponent exists, the game will start, else the user will be put in queue until a matching opponent is found.

[![online-demo-part1](https://github.com/user-attachments/assets/5fcb9019-fece-4e19-a3c1-5cdf43deb38f)](https://wordguessr-765ac.web.app)

As soon as both players have finished, the summary screen will show where the scores of both players can be viewed. The same principle also applies to private lobbies with more than 2 players.

[![online-demo-part2](https://github.com/user-attachments/assets/5a7a1f71-560a-4b2a-b6f5-1c998ac29039)](https://wordguessr-765ac.web.app)

## Lobby
If the user wants to set up a private game to play with his friends, he can choose create a new lobby with the specified game settings. He will then be able to share the displayed lobby code with his friends which can, after signing up, join the lobby via the enter code tab. If all players in the lobby are ready, the game will start. 

[![lobby-demo](https://github.com/user-attachments/assets/5ede70b1-b0cb-49df-aa6a-bace362ea756)](https://wordguessr-765ac.web.app)

### Other features
For other features, please give the [live demo](https://wordguessr-765ac.web.app) a try!

# TODO
I made this project for fun and for practice reasons, which is why it isn't (and probably never will be) fully finished, but, as they say, good software is never finished!
## Known issues/todos
- [ ] Fix UI sizing on some (larger) screen sizes
- [ ] Improve password field with hidden letters and option to show/hide password via a button
- [ ] Input sanitization on input fields and filter sensitive language
- [ ] Allow users to still sign in with an actual account if they are in Guest mode
- [ ] Show info to the user on why they cannot interact with certain elements in certain states
- [ ] Notify users that their statistics like highscore etc. will not be saved if they are logged in as a Guest
- [ ] Show other players when a player completes a word or leaves the lobby (save the feedback to db)
- [ ] Let users guess in a specified language besides English
- [ ] Implement chat functionality
- [ ] Add a level to the player which increases with wins
- [ ] Add more metrics to the profile page
- [ ] Improve about page
- [ ] Improve change index functionality on mobile devices/slower browsers

# Credits
- Random word APIs:
  - [Random Word API](https://random-word-api.herokuapp.com/home)
  - [Rando](https://random-word-api.vercel.app/)
- Translation API: [Lingva Translate](https://github.com/thedaviddelta/lingva-translate)
- Icons: [Flaticon](https://www.flaticon.com/)
- Loaders: [ldrs](https://uiball.com/ldrs/)
- Routing: [react-router](https://reactrouter.com/)
- Confetti animation: [react-confetti](https://www.npmjs.com/package/react-confetti)
- Countup animation: [react-countup](https://www.npmjs.com/package/react-countup)

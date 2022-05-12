# Real Time App

## 📋 Table of Contents

* [Concept](https://github.com/dannyfrelink/higher-or-lower#-concept)
* [Process (Wiki)](https://github.com/dannyfrelink/higher-or-lower#%EF%B8%8F-process-wiki)
* [Data Modeling]()
* [Wishlist](https://github.com/dannyfrelink/pwa-foodie-app#-wishlist)
* [Installation](https://github.com/dannyfrelink/higher-or-lower#-installation)
* [License](https://github.com/dannyfrelink/higher-or-lower#-license)
* [Resources](https://github.com/dannyfrelink/higher-or-lower#-resources)

## 💡 Concept

Since the beginning of this subject, I wanted to create some sort of game. I had some games in mind and decided to make some [sketches](https://github.com/dannyfrelink/higher-or-lower/wiki/Proces#schetsen). Because of the requirement of the use of an API, some of the games weren't really fitting for this assignment. I found the [Deck of Cards API](https://deckofcardsapi.com/), which includes playing cards. Therefore, some sort of game including playing cards was possible.

I decided to go for my sketch at the bottom, which was a higher or lower game. The user gets to see one card and has to guess if the value of the next card will be higher or lower than the other one. If they guess correctly, they'll earn a point. At the end of the game, the person with the most points will be crowned the winner.

![Game screen](https://github.com/dannyfrelink/higher-or-lower/blob/main/public/images/game1.png)
![Finished screen (winner)](https://github.com/dannyfrelink/higher-or-lower/blob/main/public/images/won-message.png)

## ⚙️ Process (Wiki)

You can find all the progression of my work documented in my [Wiki](https://github.com/dannyfrelink/higher-or-lower/wiki/Proces).

## :pencil2: Data Modeling

To show all the requests and responses on my application, I decided to create a Data Model. I split my application into three parts, which are: the client, the server and the Deck of Cards API. I then added all connections between these three with arrows and explained what happend on this conncetion. Some of the data was getting stored locally, so these are shown on there as well. At last, I added the client interactions to the model as well.

![Data Modeling](https://github.com/dannyfrelink/higher-or-lower/blob/main/public/images/data-modeling-v2.jpg)

## 📝 Wishlist

Creating a real time application has proven to be more difficult than I originally thought it would be. I found it extremely frustrating to find myself getting stuck again and again. This means that there are a few things I would have liked to add to my project, but sadly wasn't able to.

For example, I wanted to create rooms for my game. These rooms were supposed to have a size of maximum four players. Players could choose to join a random room or join a specific one using a room code. This way, players would be able to create a private room for friends to join. As I said, I found it extremely difficult to make this work and eventually decided to put the rooms idea on the side to focus on finishing off the rest of the project.

## 🔧 Installation

If you want to use my code for your own, you can clone the repository as a local file:

```
    git clone https://github.com/dannyfrelink/drag-drop
```

You then need to install all NPM packages:

```
    npm install
```

Now you're able to start working with my project. Simply run the following line in your terminal:

```
    npm run dev
```

## 📄 License

I have used the [MIT License](https://github.com/dannyfrelink/higher-or-lower/blob/main/LICENSE) for this repository.

## 📚 Resources

Education, I. C. (2020, 25 augustus). Data Modeling. Ibm. Geraadpleegd op 25 april 2022, van https://www.ibm.com/cloud/learn/data-modeling

i learned today. (2021, 23 juni). All about Rooms In Node js Socket.io [Video]. YouTube. https://www.youtube.com/watch?v=xlHP13tWnuc

Coding With Chaim. (2020, 22 oktober). Socket IO Rooms Tutorial (Backend part 1) [Video]. YouTube. https://www.youtube.com/watch?v=NwHq1-FkQpU

Coding With Chaim. (2020, 30 oktober). Socket IO Rooms Tutorial (Part 2 Frontend) [Video]. YouTube. https://www.youtube.com/watch?v=o8x-nLc-V4o&t=647s

Oyong, A. (2022, 7 april). Sorting object property by values [Forumpost]. Stack Overflow. https://stackoverflow.com/questions/1069666/sorting-object-property-by-values

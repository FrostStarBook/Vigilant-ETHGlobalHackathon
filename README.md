# Vigilant-ETHGlobalHackathon


Vigilant is an on-chain world defined by runes, not just a game. Adventurers collect rune NFTs to craft game rules. We've created a card game to highlight runes' charm. Collect five runes to form battle cards and conquer in Vigilant's games.


## Project Description 

### Gameplay

Vigilant is a groundbreaking on-chain world, defined not just by its gaming elements, but by its intricate system of runes. These runes, which serve as the core rules and building blocks of this world, come in seven basic types: Attack, Health Points (HP), Defense, Speed, Magic, Antimatter, and Dark Matter. The value of each rune NFT varies depending on its rarity.

The foundational attributes of Vigilant are its basic rules, but the world also supports customized attributes, which are derived rules evolving from the basic ones. This gives users the power to shape and create within Vigilant, building not just games, but even systems such as transportation and auction houses using the runes.

Players and developers alike are invited to join the adventure, collecting their favored runes and building games without needing permission. As an emergent on-chain world, Vigilant will evolve into a complex universe through the collective efforts of its community, developers, and players.

To better illustrate the utility of rune NFTs, we've created a card game example within Vigilant. Players start with a blank card NFT and by exploring various terrains and treasures, they can collect different rune NFTs. These runes can then be combined on a card to generate a new battle-ready card.

Once players have created a sufficient number of cards, they can establish a battle deck for PvP card fights. In these battles, players must carefully select cards and master strategic tactics to emerge victorious. During a match, the HP determines if a character is alive, speed determines the order of actions, and attacks consume magic. Winners of card battles earn points for ranking on a leaderboard, with different rewards given at the end of each season based on rank.

Rune NFTs are versatile and can be used to build various games, such as digital collectible card games, life simulation games, Roguelike, and MMORPG. For example, a player can combine one Attack NFT, two Defense NFTs, and three HP NFTs to create a card NFT with 1 Attack, 2 Defense, and 3 HP. Players can use any image they like to represent the combined NFT and these card NFTs can be disassembled to retrieve the rune NFTs.

In essence, Vigilant is a captivating on-chain world built around rune NFTs, offering limitless opportunities for creativity. Special attributes such as Antimatter and Dark Matter may have different uses in different games, adding to the depth and complexity of this world. Here, life, speed, attack, defense, and magic interplay in a strategic dance, painting a vivid tableau of the enchanting world of Vigilant.

### Game Features

- Creation of Underlying Rules for Full Chain Games We only define the underlying data of the project. Ensure the data structures and calculation formulas are on-chain. Various types of products can be derived from the underlying rules.


- Composability of NFTs We define NFTs as atoms, the combination of which can produce different effects and generate new NFTs. NFTs can be disassembled, meaning that new NFTs obtained through combination can be split back into their original state. The metadata of the combined NFT can be applied in various game scenarios.


- Personalized NFTs We believe that the NFTs within the game should be co-created by the players, rather than the developers deciding all the properties of the in-game NFTs. We think it's cool for everyone to create a unique NFT in the game, and we hope that more personal creations and artworks can enter the game world.


- Permissionless extensibility Various game types can be created based on the underlying rules, including card games, RPG games, SLG games, tower defense games, etc. Free battles and events can be held in different game types, and we also warmly welcome individual developers to participate in the expansion of game types.

### How it's Made
- For this game, we carefully selected cutting-edge technologies and tools to ensure a robust, scalable, and efficient solution.


- Front-end: We use layaAir3 as our front-end display rendering engine, enabling us to build a fast-responding, modular, and visually appealing interface. This engine is based on the node.js runtime environment and can conveniently interact with the blockchain, update information, and sync status in the web3 development environment, with the aid of third-party libraries like the mud std-client.


- Back-end: We use Solidity for smart contract development, which is a popular and universal language suitable for Ethereum-based applications. For the issuance testing of NFTs, we use the powerful Remix development environment to compile, deploy, and test our contracts, ensuring their reliability and security. For game content development, we develop under the mud std-contract framework. With the foundry development environment, we can easily set up a local testing environment and debug code.


- Deployment: Our smart contracts are deployed on OP Stack, using the advantages of L2 to increase the speed of our contracts and reduce our gas fees. We also use NFT.storage (Filecoin, IPFS) to store our basic NFT metadata information and integrate the MUD framework to facilitate seamless interaction between our game and smart contracts.


- Unipass: We plan to integrate the account abstraction functionality of the Unipass SDK into our game, enabling users to log in easily with their email instead of the conventional wallet address. We believe that the latest account abstraction technology can provide a better experience for users.


- GPT-4 Assistance: To facilitate our development process, we occasionally seek help from OpenAI's advanced language model, GPT-4. GPT-4 provides valuable insights, suggestions, and ideas to improve our project throughout the entire development process.


- Midjourney: The frontend art assets of the game demo were generated by the Midjourney AI.
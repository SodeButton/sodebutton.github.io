/**
 * Author : Button501
 * License : MIT License
 */
"use strict";

let maze_size = 0;

do {
	maze_size = Number(prompt("迷路のサイズを入力してください（5~99奇数）"));
} while (maze_size % 2 !== 1 || maze_size < 5 || maze_size > 99);

const game_width = 32 * maze_size;
const game_height = 32 * maze_size;

let maze = [];
let timer = 0;
let x = 2,
	y = 2;
let complete = false;

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
	}

	preload() {
		this.load.setPath("./Resources");
		this.load.image("wall", "./Sprites/wall.png");
		this.load.image("ground", "./Sprites/ground.png");
	}

	create() {
		for (let i = 0; i < maze_size; i++)
			maze[i] = new Array(maze_size).fill(0);
		for (let i = 0; i < maze_size; i++) {
			maze[0][i] = 1;
			maze[i][0] = 1;
			maze[maze_size - 1][i] = 1;
			maze[i][maze_size - 1] = 1;
		}
		for (let i = 2; i < maze_size; i += 2) {
			for (let j = 2; j < maze_size; j += 2) {
				maze[i][j] = 1;
			}
		}
		this.draw();
	}

	draw() {
		for (let i = 0; i < maze_size; i++) {
			for (let j = 0; j < maze_size; j++) {
				if (maze[i][j] === 0) {
					this.add.sprite(i * 32 + 16, j * 32 + 16, "ground");
				} else if (maze[i][j] === 1) {
					this.add.sprite(i * 32 + 16, j * 32 + 16, "wall");
				}
			}
		}
	}

	update(time, delta) {
		timer += delta / 1000;
		if (timer >= 0.2 && !complete) {
			timer = 0;
			let dx = 0,
				dy = 0;
			do {
				let rand = Math.floor(Math.random() * 3);
				if (x === 2) rand = Math.floor(Math.random() * 4);
				switch (rand) {
					case 0:
						dx = 0;
						dy = 1;
						break;
					case 1:
						dx = 0;
						dy = -1;
						break;
					case 2:
						dx = 1;
						dy = 0;
						break;
					case 3:
						dx = -1;
						dy = 0;
						break;
				}
			} while (maze[x + dx][y + dy] !== 0);
			maze[x + dx][y + dy] = 1;
			if (maze[x + dx][y + dy] === 0) {
				this.add.sprite(
					(x + dx) * 32 + 16,
					(y + dy) * 32 + 16,
					"ground"
				);
			} else if (maze[x + dx][y + dy] === 1) {
				this.add.sprite((x + dx) * 32 + 16, (y + dy) * 32 + 16, "wall");
			}
			y += 2;
			if (y > maze_size - 2) {
				y = 2;
				x += 2;
				if (x > maze_size - 2) {
					complete = true;
				}
			}
		}
	}
}

const config = {
	type: Phaser.AUTO,
	parent: "canvas",
	width: game_width,
	height: game_height,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [GameScene]
};

const game = new Phaser.Game(config);

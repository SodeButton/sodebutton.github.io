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
let startPoint = null;
let endPoint = null;

let openNode = [];
let closedNode = [];

let isTouch = false;

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
	}

	preload() {
		this.load.setPath("./Resources");
		this.load.image("wall", "./Sprites/wall.png");
		this.load.image("ground", "./Sprites/ground.png");
		this.load.image("start_point", "./Sprites/startPoint.png");
		this.load.image("end_point", "./Sprites/endPoint.png");
		this.load.image("clear", "./Sprites/clear.png");
	}

	create() {
		//this.makeMaze();
		for (let i = 0; i < maze_size; i++) maze[i] = new Array(maze_size).fill(0);
		for (let i = 0; i < maze_size; i++) {
			maze[0][i] = 1;
			maze[i][0] = 1;
			maze[maze_size - 1][i] = 1;
			maze[i][maze_size - 1] = 1;
		}
		this.draw();
	}

	makeMaze() {
		for (let i = 0; i < maze_size; i++) maze[i] = new Array(maze_size).fill(0);
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

		for (let i = 2; i < maze_size - 1; i += 2) {
			for (let j = 2; j < maze_size - 1; j += 2) {
				let dx = 0,
					dy = 0;
				do {
					let rand = Math.floor(Math.random() * 3);
					if (i === 2) rand = Math.floor(Math.random() * 4);
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
				} while (maze[i + dx][j + dy] !== 0);
				maze[i + dx][j + dy] = 1;
			}
		}
	}

	draw() {
		for (let i = 0; i < maze_size; i++) {
			for (let j = 0; j < maze_size; j++) {
				switch (maze[i][j]) {
					case 0:
						this.add.sprite(i * 32 + 16, j * 32 + 16, "ground");
						break;
					case 1:
						this.add.sprite(i * 32 + 16, j * 32 + 16, "wall");
						break;
					case 4:
						this.add.sprite(i * 32 + 16, j * 32 + 16, "clear");
						break;
				}
			}
		}
	}

	setPoint() {
		if (endPoint == null) {
			let pointer = this.input.activePointer;
			if (pointer.isDown) {
				if (!isTouch) {
					for (let i = 0; i < maze_size; i++) {
						for (let j = 0; j < maze_size; j++) {
							if (
								pointer.x >= i * 32 &&
								pointer.x < i * 32 + 32 &&
								pointer.y >= j * 32 &&
								pointer.y < j * 32 + 32
							) {
								if (maze[i][j] === 0) {
									console.log(i, j);
									if (startPoint == null) {
										startPoint = { x: i, y: j };
										this.add.sprite(i * 32 + 16, j * 32 + 16, "start_point");
										maze[i][j] = 2;
									} else {
										endPoint = { x: i, y: j };
										this.add.sprite(i * 32 + 16, j * 32 + 16, "end_point");
										maze[i][j] = 3;
										this.research(startPoint, 1);
										this.draw();
										console.log(openNode);
									}
									isTouch = true;
									return;
								}
							}
						}
					}
				}
			} else {
				isTouch = false;
			}
		}
	}

	research(point, moveCost) {
		let min_score = null;
		let dx = 0,
			dy = 0;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i + j === -1 || i + j === 1) {
					if (maze[point.x + i][point.y + j] === 1) continue;
					let score =
						moveCost + Math.abs(endPoint.x - point.x) + Math.abs(endPoint.y - point.y);
					let object = {
						x: point.x + i,
						y: point.y + j,
						moveCost: moveCost,
						expectCost: Math.abs(endPoint.x - point.x) + Math.abs(endPoint.y - point.y),
						score: score,
					};
					if (min_score == null) {
						min_score = score;
						dx = i;
						dy = j;
					} else {
						if (min_score > score) {
							min_score = score;
							dx = i;
							dy = j;
						}
					}
					openNode.some((v, i) => {
						if (v.x === point.x && v.y === point.y) {
							openNode.splice(i, 1);
							closedNode.push(v);
						}
					});
					openNode.push(object);
				}
			}
		}
		let new_point = { x: point.x + dx, y: point.y + dy };
		if (new_point !== endPoint) this.research(new_point, moveCost + 1);
	}

	update(time, delta) {
		this.setPoint();
	}
}

const config = {
	type: Phaser.AUTO,
	parent: "canvas",
	width: game_width,
	height: game_height,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
	},
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [GameScene],
};

const game = new Phaser.Game(config);

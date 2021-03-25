/**
 * Author : Button501
 * License : MIT License
 */
"use strict";

let maze_size = 21;

const game_width = 32 * maze_size;
const game_height = 32 * maze_size;

let maze = [];

class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'gameScene'});
	}

	preload() {
		this.load.setPath("./Resources");
		this.load.image("wall", "./Sprites/wall.png");
		this.load.image("ground", "./Sprites/ground.png");
	}

	create() {
		for(let i = 0; i < maze_size; i++) maze[i] = new Array(maze_size).fill(0);
		for(let i = 0; i < maze_size; i++) {
			maze[0][i] = 1;
			maze[i][0] = 1;
			maze[maze_size - 1][i] = 1;
			maze[i][maze_size - 1] = 1;
		}
		for(let i = 2; i < maze_size; i += 2) {
			for(let j = 2; j < maze_size; j += 2) {
				maze[i][j] = 1;
			}
		}
		for(let i = 0; i < maze_size; i++) {
			for(let j = 0; j < maze_size; j++) {
				if(maze[i][j] === 0) {
					this.add.sprite(i * 32 + 16, j * 32 + 16, "ground");
				} else if(maze[i][j] === 1) {
					this.add.sprite(i * 32 + 16, j * 32 + 16, "wall");
				}
			}
		}
	}

	update(time, delta) {

	}
}

const config = {
	type: Phaser.AUTO,
	parent: 'canvas',
	width: game_width,
	height: game_height,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [GameScene]
};

const game = new Phaser.Game(config);
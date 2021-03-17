/**
 * Author : Button501
 * License : MIT License
 */
"use strict";

class StartScene extends Phaser.Scene {
	constructor() {
		super({key: 'startScene'});
	}

	preload() {
		this.load.setPath("./Resources/");
	}

	create() {
		let title = this.add.text(400, 200, "ShootingGame", {fontSize: "100px", fontFamily:"pixelFont"});
		title.x -= title.width / 2;
		title.y -= title.height / 2;
		let tapText = this.add.text(400, 1000, "Tap to Start", {fontSize: "40px", fontFamily:"pixelFont"});
		tapText.x -= tapText.width / 2;
		tapText.y -= tapText.height / 2;
		this.input.once('pointerup', function () {

			this.scene.start('gameScene');

		}, this);
	}
}

let player;
let player_bullets = [];

let enemies = [];
let enemy_bullets = [];

let distance = {x: 0, y: 0};
let isDown = false;

let score_text;
let heart = [];

class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'gameScene'});
	}

	preload() {
		this.load.setPath("./Resources/");
		this.load.image("player", "./Sprites/player.png");
		this.load.image("enemy", "./Sprites/enemy.png");
		this.load.image("heart", "./Sprites/heart.png");
		this.load.spritesheet("player_bullet", "./Sprites/missile1.png", {frameWidth: 10, frameHeight: 16});
		this.load.spritesheet("enemy_bullet", "./Sprites/missile2.png", {frameWidth: 10, frameHeight: 16});
	}

	create() {
		player = this.add.image(400, 800, "player");
		player.timer = 0;
		player.max_hp = 3;
		player.hp = player.max_hp;
		this.spawnTime = 0;
		this.score = 0;
		for(let i = player.max_hp - 1; i >= 0; i--) {
			heart[i] = this.add.image(this.scale.width - 64 * i - 32, 32, "heart");
			heart[i].scale = 2;
		}

		score_text = this.add.text(10, 10, "SCORE：" + this.score, {fontSize:"40px", fontFamily:"pixelFont"});
	}

	update(time, delta) {
		if(player.active) {
			console.log(player.hp);
			player.timer += delta / 1000;
			if(player.timer >= 0.1) {
				player.timer -= 0.1;
				let bullet = this.add.image(player.x, player.y, "player_bullet");
				bullet.dx = 0;
				bullet.dy = -10;
				bullet.angle = 180;
				player_bullets.push(bullet);
			}

			let pointer = this.input.activePointer;
			if (pointer.isDown) {
				if(!isDown) {
					isDown = true;
					distance.x = player.x - pointer.x;
					distance.y = player.y - pointer.y;
				} else {
					player.x = distance.x + pointer.x;
					player.y = distance.y + pointer.y;
				}
			} else {
				isDown = false;
			}

			if(player.x < player.width / 2) player.x = player.width / 2;
			if(player.x > 800 + player.width / 2) player.x = 800 - player.width / 2;
			if(player.y < player.height / 2) player.y = player.height / 2;
			if(player.y > 1200 + player.height / 2) player.y = 1200 - player.height / 2;

		}

		this.spawnTime += delta / 1000;
		if(this.spawnTime >= 2.0) {
			this.spawnTime -= 2.0;
			let enemy = this.add.image(Math.floor(Math.random() * 800), -32, "enemy");
			enemy.dx = 0;
			enemy.dy = 4;
			enemy.timer = 0;
			enemy.bulletAngle = [];
			enemy.bulletAngle[0] = 0;
			enemies.push(enemy);
		}

		for(let enemy of enemies) {
			if(enemy.active) {
				enemy.x += enemy.dx;
				enemy.y += enemy.dy;
				enemy.timer += delta / 1000;
				if(enemy.timer >= 1.0) {
					enemy.timer -= 1.0;

					for(let i = 0; i < 360; i+=30) {
						let bullet = this.add.image(enemy.x, enemy.y, "enemy_bullet");
						bullet.dx = 6 * Math.cos((enemy.bulletAngle[0] + i) * Math.PI / 180.0);
						bullet.dy = 6 * Math.sin((enemy.bulletAngle[0] + i) * Math.PI / 180.0);
						bullet.angle = (enemy.bulletAngle[0] + i) - 90;
						enemy_bullets.push(bullet);
					}
					//enemy.bulletAngle[0] += 1;
				}
				if(enemy.y > 1200 + enemy.height / 2) enemy.destroy();
			} else {
				enemies.some((v, i) => {
					if (v === enemy) enemies.splice(i,1);
				});
			}
		}

		for (let bullet of player_bullets) {
			if(bullet.active) {
				bullet.x += bullet.dx;
				bullet.y += bullet.dy;

				if (bullet.y > 1200 + bullet.height / 2 || bullet.y < 0 - bullet.height / 2 ||
					bullet.x > 800  + bullet.width  / 2 || bullet.x < 0 - bullet.width  / 2) bullet.destroy();

			} else {
				player_bullets.some((v, i) => {
					if (v === bullet) player_bullets.splice(i,1);
				});
			}

			for (let enemy of enemies) {
				if(enemy.active) {
					if (bullet.x - bullet.width  / 2 < enemy.x + enemy.width  / 2 && bullet.x + bullet.width  / 2 > enemy.x - enemy.width  / 2 &&
						bullet.y - bullet.height / 2 < enemy.y + enemy.height / 2 && bullet.y + bullet.height / 2 > enemy.y - enemy.height / 2) {
						bullet.destroy();
						enemy.destroy();
						this.score += 100;
						score_text.text = "SCORE：" + this.score;
						break;
					}
				}
			}
		}

		for (let bullet of enemy_bullets) {
			if(bullet.active) {
				bullet.x += bullet.dx;
				bullet.y += bullet.dy;

				if(bullet.y > 1200 + bullet.height / 2) bullet.destroy();

				if(player.active) {
					if (bullet.x - bullet.width  / 2 < player.x + player.width  / 2 && bullet.x + bullet.width  / 2 > player.x - player.width  / 2 &&
						bullet.y - bullet.height / 2 < player.y + player.height / 2 && bullet.y + bullet.height / 2 > player.y - player.height / 2) {
						bullet.destroy();
						player.hp--;
						heart[player.hp].destroy();
						if(player.hp <= 0) player.destroy();
					}
				}

			} else {
				enemy_bullets.some((v, i) => {
					if (v === bullet) enemy_bullets.splice(i,1);
				});
			}
		}
	}
}

const config = {
	type: Phaser.AUTO,
	parent: 'canvas',
	width: 800,
	height: 1200,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	render: {
		pixelArt: true
	},
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);

/**
 * Author : Button501
 * License : MIT License
 */
"use strict";

let isClick = false;
let fadeTime = 0;
let fade;
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
		fade = this.add.graphics();
		fade.fillStyle(0x000000, 1).fillRect(0, 0, this.scale.width, this.scale.height);
		fade.alpha = 0;
		this.input.once('pointerup', function () {
			this.tweens.add({
				targets: fade,
				alpha: 1,
				duration: 1000,
				ease: 'Power2'
			}, this);
			isClick = true;
		}, this);
	}
	update(time, delta) {
		if(isClick) {
			fadeTime += delta / 1000;
			if(fadeTime >= 1.0) {
				this.scene.start('gameScene');
			}
		}
	}
}

let player;
let player_bullets = [];

let enemies = [];
let enemy_bullets = [];

let explosions = [];

let distance = {x: 0, y: 0};
let isDown = false;

let score_text;
let heart = [];

let se = {};

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
		this.load.spritesheet("explosion", "./Sprites/explosion.png", {frameWidth: 32, frameHeight: 32});

		this.load.audio("shoot1", "./Audios/Shoot1.wav");
		this.load.audio("shoot4", "./Audios/Shoot4.wav");
		this.load.audio("explosion1", "./Audios/Explosion1.wav");
	}

	create() {
		this.spawnTime = 0;
		this.score = 0;

		player = this.add.sprite(400, 800, "player");
		player.timer = 0;
		player.max_hp = 3;
		player.hp = player.max_hp;
		player.cool_time = 0;
		for(let i = player.max_hp - 1; i >= 0; i--) {
			heart[i] = this.add.image(this.scale.width - 64 * i - 32, 32, "heart");
			heart[i].scale = 2;
		}

		se.shoot_1     = this.sound.add("shoot1");
		se.shoot_4     = this.sound.add("shoot4");
		se.explosion_1 = this.sound.add("explosion1");
		se.shoot_1.volume     = 0.2;
		se.shoot_4.volume     = 0.2;
		se.explosion_1.volume = 0.2;

		this.anims.create({
			key: 'explode',
			frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 6 }),
			frameRate: 10,
			repeat: 0
		});

		score_text = this.add.text(10, 10, "SCORE：" + this.score, {fontSize:"40px", fontFamily:"pixelFont"});
	}

	update(time, delta) {
		if(player.active) {
			player.timer += delta / 1000;
			if(player.cool_time > 0) {
				player.cool_time -= delta / 1000;
				if(player.cool_time <= 0) {
					player.cool_time = 0;
					player.alpha = 1;
				} else {
					player.alpha = Math.sin(player.cool_time * 90 * 15 * Math.PI / 180.0);
				}

			}
			if(player.timer >= 0.1) {
				player.timer -= 0.1;
				let bullet = this.add.sprite(player.x, player.y, "player_bullet");
				bullet.dx = 0;
				bullet.dy = -10;
				bullet.angle = 180;
				player_bullets.push(bullet);
				se.shoot_1.play();
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
			let enemy = this.add.sprite(Math.floor(Math.random() * 800), -32, "enemy");
			enemy.dx = 0;
			enemy.dy = 4;
			enemy.timer = 0;
			enemy.bulletAngle = [];
			enemy.bulletAngle[0] = 0;
			enemies.push(enemy);
		}

		for(let enemy of enemies) {
			if(enemy.active) {
				enemy.x += enemy.dx * delta * 0.1;
				enemy.y += enemy.dy * delta * 0.1;
				enemy.timer += delta / 1000;
				if(enemy.timer >= 1.0) {
					enemy.timer -= 1.0;

					for(let i = 0; i < 360; i+=30) {
						let bullet = this.add.sprite(enemy.x, enemy.y, "enemy_bullet");
						bullet.dx = 6 * Math.cos((enemy.bulletAngle[0] + i) * Math.PI / 180.0);
						bullet.dy = 6 * Math.sin((enemy.bulletAngle[0] + i) * Math.PI / 180.0);
						bullet.angle = (enemy.bulletAngle[0] + i) - 90;
						enemy_bullets.push(bullet);
						se.shoot_4.play();
					}
					//enemy.bulletAngle[0] += 1;
				}
				if(enemy.y > 1200 + enemy.height / 2) enemy.destroy();

				if(player.active && player.cool_time <= 0) {
					if (enemy.x - enemy.width  / 2 < player.x + player.width  / 2 && enemy.x + enemy.width  / 2 > player.x - player.width  / 2 &&
						enemy.y - enemy.height / 2 < player.y + player.height / 2 && enemy.y + enemy.height / 2 > player.y - player.height / 2) {
						enemy.destroy();
						player.hp--;
						heart[player.hp].destroy();
						if(player.hp <= 0) player.destroy();
						player.cool_time = 1.0;
						se.explosion_1.play();

						let effect = this.add.sprite(enemy.x, enemy.y, "explosion");
						effect.anims.play("explode", true);
						effect.endTime = 0.6;
						explosions.push(effect);
					}
				}
			} else {
				enemies.some((v, i) => {
					if (v === enemy) enemies.splice(i,1);
				});
			}
		}

		for (let bullet of player_bullets) {
			if(bullet.active) {
				bullet.x += bullet.dx * delta * 0.1;
				bullet.y += bullet.dy * delta * 0.1;

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
						se.explosion_1.play();
						let effect = this.add.sprite(enemy.x, enemy.y, "explosion");
						effect.anims.play("explode", true);
						effect.endTime = 0.6;
						explosions.push(effect);
						break;
					}
				}
			}
		}

		for (let bullet of enemy_bullets) {
			if(bullet.active) {
				bullet.x += bullet.dx * delta * 0.1;
				bullet.y += bullet.dy * delta * 0.1;

				if(bullet.y > 1200 + bullet.height / 2) bullet.destroy();

				if(player.active && player.cool_time <= 0) {
					if (bullet.x - bullet.width  / 2 < player.x + player.width  / 2 && bullet.x + bullet.width  / 2 > player.x - player.width  / 2 &&
						bullet.y - bullet.height / 2 < player.y + player.height / 2 && bullet.y + bullet.height / 2 > player.y - player.height / 2) {
						bullet.destroy();
						player.hp--;
						heart[player.hp].destroy();
						if(player.hp <= 0) player.destroy();
						player.cool_time = 1.0;
						se.explosion_1.play();
						let effect = this.add.sprite(player.x, player.y, "explosion");
						effect.anims.play("explode", true);
						effect.endTime = 0.6;
						explosions.push(effect);
					}
				}

			} else {
				enemy_bullets.some((v, i) => {
					if (v === bullet) enemy_bullets.splice(i,1);
				});
			}
		}

		for(let explosion of explosions) {
			if(explosion.active) {
				explosion.endTime -= delta / 1000;
				if(explosion.endTime <= 0) {
					explosion.destroy();
				}
			} else {
				explosions.some((v, i) => {
					if (v === explosion) explosions.splice(i,1);
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
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);

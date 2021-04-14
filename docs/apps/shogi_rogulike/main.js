/**
 * Author : Button501
 * License : MIT License
 */
"use strict";
const game_width = 64 * 10;
const game_height = 64 * 16;

let isClick = false;
let fadeTime = 0;
let fade;

class LoadScene extends Phaser.Scene {
	constructor() {
		super({ key: "loadScene" });
	}

	preload() {
		let progressBar = this.add.graphics();
		let progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(game_width / 2 - 250, game_height / 2 - 30, 500, 60);

		let text = this.add.text(game_width / 2, (game_height / 5) * 3, "load", {
			fontSize: "40px",
			fontFamily: "serif"
		});
		text.setOrigin(0.5, 0.5);

		//ロードが進行したときの処理
		this.load.on("progress", function (value) {
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(
				game.scale.width / 2 - 250,
				game.scale.height / 2 - 30,
				500 * value,
				60
			);
		});

		//ファイルのロードに入ったときの処理
		this.load.on("fileprogress", function(file) {
			text.text = file.key;
		});

		//すべてのロードが完了したときの処理
		this.load.on("complete", function() {
			text.text = "complete";
		});
		this.load.setPath("./Resources/Sprites");

		this.load.image("king", "./king.png");
		this.load.image("gyoku", "./gyoku.png");
		this.load.image("hisha", "./hisha.png");
		this.load.image("hisha_nari", "./hisha_nari.png");
		this.load.image("kaku", "./kaku.png");
		this.load.image("kaku_nari", "./kaku_nari.png");
		this.load.image("gold", "./gold.png");
		this.load.image("silver", "./silver.png");
		this.load.image("silver_nari", "./silver_nari.png");
		this.load.image("kema", "./kema.png");
		this.load.image("kema_nari", "./kema_nari.png");
		this.load.image("kyosha", "./kyosha.png");
		this.load.image("kyosha_nari", "./kyosha_nari.png");
		this.load.image("fu", "./fu.png");
		this.load.image("fu_nari", "./fu_nari.png");
		this.load.image("board_chip", "./board_chip.png");
		this.load.image("input_board_chip", "./input_board_chip.png");
		this.load.image("tatami", "./tatami.jpg");

		// this.load.audio("shoot1", "./Audios/Shoot1.wav");
		// this.load.audio("shoot4", "./Audios/Shoot4.wav");
		// this.load.audio("explosion1", "./Audios/Explosion1.wav");
		// this.load.audio("bgm1", "./Audios/bgm1.ogg");
	}

	create() {
		this.scene.start("startScene");
	}
}

let title, tapText, versionText, copyrightText;

class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: "startScene" });
	}

	create() {
		let background = this.add.image(0, 0, "tatami");
		background.setOrigin(0, 0);
		background.displayWidth = game_width;
		background.displayHeight = game_height;
		title = this.add.text(game_width / 2, game_height / 4, "将棋ローグライク", {
			fontSize: "60px",
			fontFamily: "serif",
			color: "#000000"
		});
		title.setOrigin(0.5, 0.5);

		tapText = this.add.text(game_width / 2, game_height * 0.7, "スタート", {
			fontSize: "30px",
			fontFamily: "serif",
			color: "#000000"
		});
		tapText.setOrigin(0.5, 0.5);

		versionText = this.add.text(25, game_height - 10, "Version：0.0.1", {
			fontSize: "30px",
			fontFamily: "serif",
			color: "#000000"
		});
		versionText.setOrigin(0, 1);

		copyrightText = this.add.text(game_width - 25, game_height - 10, "©2021 Button501", {
			fontSize: "30px",
			fontFamily: "serif",
			color: "#000000"
		});
		copyrightText.setOrigin(1, 1);

		fade = this.add.graphics();
		fade.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);
		fade.alpha = 0;
		this.input.once(
			"pointerdown",
			function() {
				this.tweens.add({
					targets: fade,
					alpha: 1,
					duration: 1000,
					ease: "Power2"
				});
				isClick = true;
			},
			this
		);
	}

	update(time, delta) {
		title.updateText();
		tapText.updateText();
		versionText.updateText();
		copyrightText.updateText();

		if (isClick) {
			fadeTime += delta / 1000;
			if (fadeTime >= 1.0) {
				fadeTime = 0;
				this.scene.start("gameScene");
			}
		}
	}
}

let board = [];
let player;
let isFade = false;
let isDown = false;
let select_object = null;
let input_board_chips = [];

for (let i = 0; i < 9; i++) board[i] = new Array(9).fill(0);

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
	}

	async create() {
		let background = this.add.image(0, 0, "tatami");
		background.setOrigin(0, 0);
		background.displayWidth = game_width;
		background.displayHeight = game_height;
		this.drawBoard();

		board[4][8] = this.add.image(256 + 64, 512 + 256, "king");
		board[4][8].name = "king";

		this.drawObject();

		let fade1 = this.add.graphics();
		fade1.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);
		fade1.alpha = 1;

		this.tweens.add({
			targets: fade1,
			alpha: 0,
			duration: 1000,
			ease: "Power2"
		});
	}

	drawBoard() {
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				if (board[x][y] === 0) this.add.image(x * 64 + 64, y * 64 + 256, "board_chip");
			}
		}
	}

	drawObject() {
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				switch (board[x][y].name) {
					case "king":
						board[x][y].destroy();
						board[x][y] = this.add.image(x * 64 + 64, y * 64 + 256, "king");
						board[x][y].name = "king";
						board[x][y].select = false;
						break;
				}
			}
		}
	}

	setup() {
	}

	update(time, delta) {
		if (!isFade) {
			fadeTime += delta / 1000;
			if (fadeTime >= 1.0) {
				fadeTime = 0;
				isFade = true;
			}
		} else {
			let pointer = this.input.activePointer;
			if (pointer.isDown) {
				if (!isDown) {
					isDown = true;
					let loop = false;
					//if touch shogi piece
					for (let x = 0; x < 9; x++) {
						for (let y = 0; y < 9; y++) {
							if (
								pointer.x >= x * 64 + 64 - 32 &&
								pointer.x < x * 64 + 64 + 32 &&
								pointer.y >= y * 64 + 256 - 32 &&
								pointer.y < y * 64 + 256 + 32
							) {
								if (!board[x][y].select) {
									board[x][y].select = true;
									switch (board[x][y].name) {
										case "king":
											for (let dx = -1; dx <= 1; dx++) {
												for (let dy = -1; dy <= 1; dy++) {
													if (dx === 0 && dy === 0) continue;
													if (
														x + dx >= 0 &&
														x + dx < 9 &&
														y + dy >= 0 &&
														y + dy < 9
													) {
														if (board[x + dx][y + dy] === 0) {
															let ibc = this.add.image(
																(x + dx) * 64 + 64,
																(y + dy) * 64 + 256,
																"input_board_chip"
															);
															ibc.select = false;
															ibc.name = "input_board_chip";
															ibc.select_object = board[x][y];
															board[x + dx][y + dy] = ibc;
														}
													}
												}
											}
											break;
										case "input_board_chip":
											let select_object = board[x][y].select_object;
											for (let x1 = 0; x1 < 9; x1++) {
												for (let y1 = 0; y1 < 9; y1++) {
													if (board[x1][y1].name === "input_board_chip") {
														if (board[x1][y1].select_object != null)
															board[x1][y1].select_object.destroy();
														board[x1][y1].destroy();
														board[x1][y1] = 0;
													}
												}
											}
											board[x][y] = select_object;
											this.drawBoard();
											this.drawObject();
											break;
									}
								} else if (board[x][y].select) {
									board[x][y].select = null;
									for (let x1 = 0; x1 < 9; x1++) {
										for (let y1 = 0; y1 < 9; y1++) {
											if (board[x1][y1].name === "input_board_chip") {
												board[x1][y1].destroy();
												board[x1][y1] = 0;
											}
										}
									}
									this.drawBoard();
									this.drawObject();
								}
								loop = true;
								break;
							}
						}
						if (loop) break;
					}
				}
			} else {
				isDown = false;
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
	scene: [LoadScene, StartScene, GameScene],
};

const game = new Phaser.Game(config);

"use strict";
const game_width = 64 * 10;
const game_height = 64 * 16;

let isClick = false;
let fadeTime = 0;
let fade;

let logo;

class LogoScene extends Phaser.Scene {
	constructor() {
		super({ key: "logoScene" });
	}

	preload() {
		this.load.setPath("./Resources/Logos");
		this.load.image("phaser_logo", "./PhaserLogo.png");
	}

	create() {
		logo = this.add.image(game_width / 2, game_height / 2, "phaser_logo");
		logo.setOrigin(0.5, 0.5);
		logo.alpha = 0;
		this.tweens.add({
			targets: logo,
			alpha: 1,
			duration: 1000,
			ease: "Power2",
		});
		isClick = true;
	}

	update(time, delta) {
		fadeTime += delta / 1000;
		if (isClick) {
			if (fadeTime >= 2) {
				fadeTime = 0;
				isClick = false;
				this.tweens.add({
					targets: logo,
					alpha: 0,
					duration: 1000,
					ease: "Power2",
				});
			}
		} else {
			if (fadeTime >= 1) {
				fadeTime = 0;
				isClick = false;
				this.scene.start("loadScene");
			}
		}
	}
}

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
			fontFamily: "mohitsuFont",
		});
		text.setOrigin(0.5, 0.5);

		//ロードが進行したときの処理
		this.load.on("progress", function (value) {
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(game.scale.width / 2 - 250, game.scale.height / 2 - 30, 500 * value, 60);
		});

		//ファイルのロードに入ったときの処理
		this.load.on("fileprogress", function (file) {
			text.text = file.key;
		});

		//すべてのロードが完了したときの処理
		this.load.on("complete", function () {
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
		this.load.image("enemy_board_chip", "./enemy_board_chip.png");
		this.load.image("tatami", "./tatami.jpg");
		this.load.image("window", "./window.png");

		this.load.setPath("./Resources/Audios");
		this.load.audio("se_shogi", "./se_shogi.wav");
		this.load.audio("se_kill", "./se_kill.mp3");
		this.load.audio("bgm_title", "./bgm_title.mp3");
		this.load.audio("bgm_game", "./bgm_game.mp3");
	}

	create() {
		this.scene.start("startScene");
	}
}

let title, tapText, versionText, copyrightText;

let bgm_title;

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
			fontFamily: "mohitsuFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		title.setOrigin(0.5, 0.5);

		tapText = this.add.text(game_width / 2, game_height * 0.7, "スタート", {
			fontSize: "30px",
			fontFamily: "mohitsuFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		tapText.setOrigin(0.5, 0.5);

		versionText = this.add.text(30, game_height - 10, "Ver beta0.0.3", {
			fontSize: "30px",
			fontFamily: "mohitsuFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		versionText.setOrigin(0, 1);

		copyrightText = this.add.text(game_width - 30, game_height - 10, "(c)2021 Button", {
			fontSize: "30px",
			fontFamily: "mohitsuFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		copyrightText.setOrigin(1, 1);

		bgm_title = this.sound.add("bgm_title");
		bgm_title.volume = 0.3;
		bgm_title.play();

		fade = this.add.graphics();
		fade.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);
		fade.alpha = 0;
		this.input.once(
			"pointerdown",
			function () {
				this.tweens.add({
					targets: fade,
					alpha: 1,
					duration: 1000,
					ease: "Power2",
				});
				this.tweens.add({
					targets: bgm_title,
					volume: 0,
					duration: 1000,
					ease: "Power2",
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
				bgm_title.stop();
				this.scene.start("gameScene");
			}
		}
	}
}

let board = [];
let shogiPiece = [];
let boardWait = new Array(9);
let shogiPieceWait = new Array(9);

let se = [];

let bgm_game;

let isFade = false;
let isDown = false;
let select_object = null;

let game_turn = "player";

for (let i = 0; i < 9; i++) {
	board[i] = new Array(9).fill(0);
	shogiPiece[i] = new Array(9).fill(null);
}
boardWait.fill(0);
shogiPieceWait.fill(0);

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
	}

	async create() {
		let background = this.add.image(0, 0, "tatami");
		background.setOrigin(0, 0);
		background.displayWidth = game_width;
		background.displayHeight = game_height;
		await this.drawBoard();

		shogiPiece[5][0] = this.add.image(5 * 64 + 64, 256, "fu");
		shogiPiece[5][0].piece_type = "enemy";
		shogiPiece[5][0].name = "fu";
		shogiPiece[5][0].select = false;

		shogiPiece[3][0] = this.add.image(3 * 64 + 64, 256, "fu");
		shogiPiece[3][0].piece_type = "enemy";
		shogiPiece[3][0].name = "fu";
		shogiPiece[3][0].select = false;

		shogiPiece[4][8] = this.add.image(4 * 64 + 64, 8 * 64 + 256, "king");
		shogiPiece[4][8].piece_type = "player";
		shogiPiece[4][8].name = "king";
		shogiPiece[4][8].select = false;

		await this.drawObject();

		let fade1 = this.add.graphics();
		fade1.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);
		fade1.alpha = 1;

		this.tweens.add({
			targets: fade1,
			alpha: 0,
			duration: 1000,
			ease: "Power2",
		});

		bgm_game = this.sound.add("bgm_game");
		bgm_game.volume = 0.3;
		bgm_game.play();

		se.shogi = this.sound.add("se_shogi");
		se.kill = this.sound.add("se_kill");
	}

	setup() {}

	drawBoard() {
		let background = this.add.image(0, 0, "tatami");
		background.setOrigin(0, 0);
		background.displayWidth = game_width;
		background.displayHeight = game_height;
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				switch (board[x][y]) {
					case 0:
						this.add.image(x * 64 + 64, y * 64 + 256, "board_chip");
						break;
					case 1:
						this.add.image(x * 64 + 64, y * 64 + 256, "input_board_chip");
						break;
					case 2:
						this.add.image(x * 64 + 64, y * 64 + 256, "enemy_board_chip");
						break;
				}
			}
		}

		for (let x = 0; x < 9; x++) {
			switch (boardWait[x]) {
				case 0:
					this.add.image(x * 64 + 64, 9 * 64 + 288, "board_chip");
					break;
				case 1:
					this.add.image(x * 64 + 64, 9 * 64 + 288, "input_board_chip");
					break;
				case 2:
					this.add.image(x * 64 + 64, 9 * 64 + 288, "enemy_board_chip");
					break;
			}
		}
	}

	drawObject() {
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				if (shogiPiece[x][y] != null) {
					let select = shogiPiece[x][y]?.select;
					let piece_type = shogiPiece[x][y].piece_type;
					let name = shogiPiece[x][y]?.name;
					shogiPiece[x][y].destroy();
					if (select) {
						let shadow = this.add.image(x * 64 + 64 + 8, y * 64 + 256 + 8, name);
						if (piece_type === "enemy") shogiPiece[x][y].angle = 180;
						shadow.tint = 0x000000;
						shadow.alpha = 0.6;
					}
					shogiPiece[x][y] = this.add.image(x * 64 + 64, y * 64 + 256, name);
					if (piece_type === "player") shogiPiece[x][y].angle = 0;
					else shogiPiece[x][y].angle = 180;
					shogiPiece[x][y].name = name;
					shogiPiece[x][y].select = select;
					shogiPiece[x][y].piece_type = piece_type;
				}
			}
		}
		let fu = this.add.image(64, 9 * 64 + 288, "fu");
		if (shogiPieceWait[0] <= 0) {
			fu.alpha = 0;
		} else {
			fu.alpha = 1;
			let text = this.add.text(64 + 12, 9 * 64 + 290, shogiPieceWait[0] + "", {
				fontSize: "40px",
				fontFamily: "mohitsuFont",
				color: "#00ff00",
				padding: { left: 0, right: 0, bottom: 0, top: 4 },
			});
			text.setOrigin(0, 0);
		}
	}

	searchMovementPos(pointer) {
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				if (
					pointer.x >= x * 64 + 64 - 32 &&
					pointer.x < x * 64 + 64 + 32 &&
					pointer.y >= y * 64 + 256 - 32 &&
					pointer.y < y * 64 + 256 + 32
				) {
					if (shogiPiece[x][y]?.piece_type === "player") {
						if (select_object == null) {
							switch (shogiPiece[x][y]?.name) {
								case "king":
									shogiPiece[x][y].select = true;
									select_object = shogiPiece[x][y];
									for (let dx = -1; dx <= 1; dx++) {
										for (let dy = -1; dy <= 1; dy++) {
											if (dx === 0 && dy === 0) continue;
											if (x + dx >= 0 && x + dx < 9 && y + dy >= 0 && y + dy < 9) {
												if (shogiPiece[x + dx][y + dy] == null) {
													board[x + dx][y + dy] = 1;
												} else if (shogiPiece[x + dx][y + dy].piece_type === "enemy") {
													board[x + dx][y + dy] = 2;
												}
											}
										}
									}
									break;
								case "fu":
									shogiPiece[x][y].select = true;
									select_object = shogiPiece[x][y];
									if (y - 1 >= 0) {
										if (shogiPiece[x][y - 1] == null) {
											board[x][y - 1] = 1;
										} else if (shogiPiece[x][y - 1].piece_type === "enemy") {
											board[x][y - 1] = 2;
										}
									}

									break;
							}
						} else {
							if (shogiPiece[x][y]?.select) {
								shogiPiece[x][y].select = false;
								select_object = null;
								for (let i = 0; i < 9; i++) {
									for (let j = 0; j < 9; j++) {
										board[i][j] = 0;
									}
								}
								se.shogi.play();
							}
						}
						this.drawBoard();
						this.drawObject();
						return;
					}
				}
			}

			if (
				shogiPieceWait[x] >= 1 &&
				pointer.x >= x * 64 + 64 - 32 &&
				pointer.x < x * 64 + 64 + 32 &&
				pointer.y >= 9 * 64 + 288 - 32 &&
				pointer.y < 9 * 64 + 288 + 32
			) {
				if (select_object == null) {
					switch (x) {
						case 0:
							select_object = "fu";
							for (let dx = 0; dx < 9; dx++) {
								for (let dy = 0; dy < 9; dy++) {
									if (shogiPiece[dx][dy] == null) {
										board[dx][dy] = 1;
									}
								}
							}
							break;
					}
				} else {
					select_object = null;
					for (let dx = 0; dx < 9; dx++) {
						for (let dy = 0; dy < 9; dy++) {
							board[dx][dy] = 0;
						}
					}
				}

				this.drawBoard();
				this.drawObject();
				return;
			}
		}
	}

	showNariWin() {
		let window = this.add.image(game_width / 2, game_height / 2, "window");
	}

	selectMovementPos(pointer) {
		if (select_object != null) {
			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 9; y++) {
					if (
						pointer.x >= x * 64 + 64 - 32 &&
						pointer.x < x * 64 + 64 + 32 &&
						pointer.y >= y * 64 + 256 - 32 &&
						pointer.y < y * 64 + 256 + 32
					) {
						if (board[x][y] !== 0) {
							switch (select_object) {
								case "fu":
									shogiPieceWait[0]--;
									shogiPiece[x][y] = this.add.image(x * 64 + 64, y * 64 + 256, "fu");
									shogiPiece[x][y].name = "fu";
									shogiPiece[x][y].piece_type = "player";
									shogiPiece[x][y].select = false;
									select_object = null;
									for (let i = 0; i < 9; i++) {
										for (let j = 0; j < 9; j++) {
											board[i][j] = 0;
										}
									}
									se.shogi.play();
									this.drawBoard();
									this.drawObject();
									return true;
							}
							for (let x1 = 0; x1 < 9; x1++) {
								for (let y1 = 0; y1 < 9; y1++) {
									if (shogiPiece[x1][y1]?.select) {
										game_turn = "enemy";
										if (board[x][y] === 1) {
											let name = shogiPiece[x1][y1].name;
											if (y <= 3) {
												switch (name) {
													case "fu":
														name += "_nari";
														break;
													case "kyosha":
														name += "_nari";
														break;
													case "kema":
														name += "_nari";
														break;
													case "silver":
														name += "_nari";
														break;
													case "kaku":
														name += "_nari";
														break;
													case "hisha":
														name += "_nari";
														break;
												}
											}
											shogiPiece[x][y] = this.add.image(x1 * 64 + 64, y1 * 64 + 256, name);
											shogiPiece[x][y].name = name;
											shogiPiece[x][y].piece_type = shogiPiece[x1][y1].piece_type;
											shogiPiece[x][y].select = false;
											shogiPiece[x1][y1].destroy();
											shogiPiece[x1][y1] = null;
											select_object = null;
											for (let i = 0; i < 9; i++) {
												for (let j = 0; j < 9; j++) {
													board[i][j] = 0;
												}
											}
											se.shogi.play();
											this.drawBoard();
											this.drawObject();
											return true;
										} else if (board[x][y] === 2) {
											let shogi = shogiPiece[x][y];
											shogiPiece[x][y] = this.add.image(
												x1 * 64 + 64,
												y1 * 64 + 256,
												shogiPiece[x1][y1].texture
											);

											shogiPiece[x][y].name = shogiPiece[x1][y1].name;
											shogiPiece[x][y].piece_type = "player";
											shogiPiece[x][y].select = false;
											switch (shogi.name) {
												case "fu":
													shogiPieceWait[0]++;
													break;
												case "fu_nari":
													shogiPieceWait[0]++;
													break;
												case "kyosha":
													shogiPieceWait[1]++;
													break;
												case "kyosha_nari":
													shogiPieceWait[1]++;
													break;
												case "kema":
													shogiPieceWait[2]++;
													break;
												case "kema_nari":
													shogiPieceWait[2]++;
													break;
												case "silver":
													shogiPieceWait[3]++;
													break;
												case "silver_nari":
													shogiPieceWait[3]++;
													break;
												case "gold":
													shogiPieceWait[4]++;
													break;
												case "kaku":
													shogiPieceWait[5]++;
													break;
												case "kaku_nari":
													shogiPieceWait[5]++;
													break;
												case "hisha":
													shogiPieceWait[6]++;
													break;
												case "hisha_nari":
													shogiPieceWait[6]++;
													break;
											}

											shogiPiece[x1][y1].destroy();
											shogiPiece[x1][y1] = null;
											select_object = null;
											for (let i = 0; i < 9; i++) {
												for (let j = 0; j < 9; j++) {
													board[i][j] = 0;
												}
											}
											se.kill.play();
											this.drawBoard();
											this.drawObject();
											return true;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return false;
	}

	enemyMove() {
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				if (shogiPiece[x][y]?.piece_type === "enemy" && !shogiPiece[x][y]?.select) {
					switch (shogiPiece[x][y].name) {
						case "fu":
							if (y + 1 >= 0 && y < 8) {
								if (shogiPiece[x][y + 1] == null) {
									shogiPiece[x][y + 1] = this.add.image(
										x * 64 + 64,
										(y + 1) * 64 + 256,
										shogiPiece[x][y].texture
									);
									shogiPiece[x][y + 1].name = shogiPiece[x][y].name;
									shogiPiece[x][y + 1].piece_type = "enemy";
									shogiPiece[x][y + 1].select = true;
									shogiPiece[x][y + 1].angle = 180;
									shogiPiece[x][y].destroy();
									shogiPiece[x][y] = null;
								}
							}
							break;
					}
				}
			}
		}
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				if (shogiPiece[x][y]?.piece_type === "enemy" && shogiPiece[x][y]?.select) {
					shogiPiece[x][y].select = false;
				}
			}
		}
	}

	update(time, delta) {
		if (!isFade) {
			fadeTime += delta / 1000;
			if (fadeTime >= 1.0) {
				fadeTime = 0;
				isFade = true;
			}
		} else {
			if (game_turn === "player") {
				let pointer = this.input.activePointer;
				if (pointer.isDown) {
					if (!isDown) {
						isDown = true;
						//ここかなりヤヴァイかも
						if (!this.selectMovementPos(pointer)) {
							this.searchMovementPos(pointer);
						}
					}
				} else {
					isDown = false;
				}
			} else if (game_turn === "enemy") {
				this.enemyMove();
				game_turn = "player";
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
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
	},
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [LogoScene, LoadScene, StartScene, GameScene],
};

const game = new Phaser.Game(config);

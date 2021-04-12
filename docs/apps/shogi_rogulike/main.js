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
for (let i = 0; i < 9; i++) board[i] = new Array(9).fill(0);

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
	}

	create() {
		let background = this.add.image(0, 0, "tatami");
		background.setOrigin(0, 0);
		background.displayWidth = game_width;
		background.displayHeight = game_height;

		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				this.add.image(x * 64 + 64, y * 64 + 256, "board_chip");
			}
		}

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

	setup() {
		board[4][9] = "king";

		// player = this.add.image();
	}

	update(time, delta) {
		fadeTime += delta / 1000;
		if (fadeTime >= 1.0) {
			fadeTime = 0;
			this.setup();
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

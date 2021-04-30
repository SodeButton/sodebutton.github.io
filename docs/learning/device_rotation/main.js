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

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
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

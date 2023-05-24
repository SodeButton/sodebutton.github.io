<template>
  <v-container>
    <v-sheet class="rounded-lg pa-8">
      <p>更新日：{{ updated }}</p>
      <h1 class="">Phaser + TypeScript + Viteの環境構築</h1>
      <h1 class="mt-10">Phaser3とは?</h1>
      <v-divider :thickness="2" class="mb-4"></v-divider>
      <p>Webゲームが作れるフレームワークです。</p>
      <v-card
        href="https://phaser.io"
        class="mt-6 rounded-lg"
        variant="outlined"
        title="Phaser"
        text="https://phaser.io"
      >
      </v-card>

      <h1 class="mt-10">環境</h1>
      <v-divider :thickness="2" class="mb-4"></v-divider>
      <ul class="pl-5">
        <li class="mb-2">
          Node.js (<a href="https://nodejs.org/ja/">https://nodejs.org/ja/</a>)
        </li>
        <li class="mb-2">
          Vite (<a href="https://ja.vitejs.dev/">https://ja.vitejs.dev/</a>)
        </li>
        <li class="mb-2">
          Phaser3 (<a href="https://phaser.io">https://phaser.io</a>)
        </li>
        <li class="mb-2">
          TypeScript (<a href="https://www.typescriptlang.org/"
            >https://www.typescriptlang.org/</a
          >)
        </li>
      </ul>

      <h1 class="mt-10">Viteのプロジェクト作成</h1>
      <v-divider :thickness="2" class="mb-4"></v-divider>
      <PreviewCommandLine
        code="npm init vite@latest"
        label="npm"
      ></PreviewCommandLine>
      <div class="mt-4"></div>
      <PreviewCommandLine
        code="yarn add vite"
        label="yarn"
      ></PreviewCommandLine>

      <p class="mt-10">自分の環境に合ったもので実行してください。</p>
      <p class="mt-5 mb-5">
        実行後にいくつ質問が出てくるので以下のように回答します。
      </p>
      <PreviewCommandLine
        output="2-4"
        :code="answer1"
        label="実行結果"
      ></PreviewCommandLine>

      <p class="mt-8">起動確認をします。</p>
      <PreviewCommandLine :code="command1_npm" label="npm"></PreviewCommandLine>
      <div class="mt-4"></div>
      <PreviewCommandLine
        :code="command1_yarn"
        label="yarn"
      ></PreviewCommandLine>

      <p class="mt-8">起動画面</p>
      <v-img :src="imgVtEnvironment" class="rounded-lg mt-2"></v-img>

      <h1 class="mt-10">TypeScriptとPhaserのインストール</h1>
      <v-divider :thickness="2" class="mb-4"></v-divider>
      <p class="mt-8">TypeScriptのインストール</p>
      <PreviewCommandLine
        code="npm install typescript --save-dev"
        label="npm"
      ></PreviewCommandLine>
      <div class="mt-4"></div>
      <PreviewCommandLine
        code="yarn add typescript -dev"
        label="yarn"
      ></PreviewCommandLine>
      <p class="mt-8">Phaserのインストール</p>
      <PreviewCommandLine
        code="npm install phaser --save"
        label="npm"
      ></PreviewCommandLine>
      <div class="mt-4"></div>
      <PreviewCommandLine
        code="yarn add phaser"
        label="yarn"
      ></PreviewCommandLine>

      <h1 class="mt-10">viteの設定</h1>
      <v-divider :thickness="2" class="mb-4"></v-divider>
      <p class="mt-8">
        viteのconfigファイルは自動生成されないので、作成します。
      </p>
      <p>プロジェクトのルート上にvite.config.tsを作成します。</p>
      <PreviewDirectoryTree :code="tree1"></PreviewDirectoryTree>
      <div class="mt-4"></div>
      <PreviewCode
        filename="vite.config.ts"
        type="typescript"
        :code="config1"
      ></PreviewCode>
      <h1 class="mt-10">Phaserの設定</h1>
      <v-divider :thickness="2" class="mb-4"></v-divider>
      <p class="mt-8">不要なファイルを削除。</p>
      <PreviewDirectoryTree :code="tree2"></PreviewDirectoryTree>

      <p class="mt-8">index.htmlを編集します。</p>
      <PreviewCode
        filename="index.html"
        type="html"
        :code="index1"
      ></PreviewCode>

      <p class="mt-8">main.tsを編集します。</p>
      <PreviewCode
        filename="main.ts"
        type="typescript"
        :code="main1"
      ></PreviewCode>

      <p class="mt-8">起動画面</p>
      <v-img :src="imgPhaserDev" class="rounded-lg mt-2"></v-img>
    </v-sheet>
  </v-container>
</template>
<script setup>
import "prismjs";
import "../../../../themes/prism-my.css";
import PreviewCode from "../../../../components/PreviewCode.vue";
import PreviewCommandLine from "../../../../components/PreviewCommandLine.vue";
import PreviewDirectoryTree from "../../../../components/PreviewDirectoryTree.vue";
import imgVtEnvironment from "./img/vt-environment.png";
import imgPhaserDev from "./img/phaser-dev.png";

const answer1 = `...
✔ Project name: … my-project
✔ Select a framework: › Vanilla
✔ Select a variant: › TypeScript`;

const command1_npm = `cd my-project
npm install
npm run dev`;

const command1_yarn = `cd my-project
yarn
yarn dev`;

const tree1 = `
 my-project/
 |-- node_modules/
 |-- public/
 |-- src/
 |-- .gitignore
 |-- index.html
 |-- package.json
 |-- tsconfig.json
+\`-- vite.config.ts`;

const tree2 = `
 my-project/
 |-- node_modules/
 |-- public/
-|   \`-- vite.svg
 |-- src/
-|   |-- counter.ts
 |   |-- main.ts
-|   |-- style.css
-|   |-- typescript.svg
-|   \`-- vite-env.d.ts
 |-- .gitignore
 |-- index.html
 |-- package.json
 |-- tsconfig.json
 \`-- vite.config.ts`;

const config1 = `import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        assetsInlineLimit: 0,
    },
});
`;

const index1 = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + TS + Phaser</title>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/${"main.ts"}">\</script\>;
</body>
</html>
`;

const main1 = `import Phaser from 'phaser';

class TestScene extends Phaser.Scene {
\tconstructor() {
\t\tsuper('testScene');
\t}
\tpreload() {
\t\tthis.load.setBaseURL('https://labs.phaser.io');

\t\tthis.load.image('sky', 'assets/skies/space3.png');
\t\tthis.load.image('logo', 'assets/sprites/phaser3-logo.png');
\t\tthis.load.image('red', 'assets/particles/red.png');
\t}

\tcreate() {
\t\tthis.add.image(400, 300, 'sky');

\t\tconst particles = this.add.particles('red');

\t\tconst emitter = particles.createEmitter({
\t\t\tspeed: 100,
\t\t\tscale: { start: 1, end: 0 },
\t\t\tblendMode: 'ADD',
\t\t});

\t\tconst logo = this.physics.add.image(400, 100, 'logo');

\t\tlogo.setVelocity(100, 200);
\t\tlogo.setBounce(1, 1);
\t\tlogo.setCollideWorldBounds(true);

\t\temitter.startFollow(logo);
\t}
}

const config: Phaser.Types.Core.GameConfig = {
\ttype: Phaser.AUTO,
\twidth: 800,
\theight: 600,
\tparent: 'app',
\tphysics: {
\t\tdefault: 'arcade',
\t\tarcade: {
\t\t\tgravity: { y: 200 },
\t\t},
\t},
\tscene: TestScene,
};

new Phaser.Game(config);
`;
</script>
<script>
export default {
  name: "environment-ptv",
  data: () => ({
    updated: "",
  }),
  async mounted() {
    await fetch(
      "https://api.github.com/repos/sodebutton/sodebutton.github.io/commits?path=src/views/articles/environments/ptv.vue"
    )
      .then((response) => response.json())
      .then((info) => info[0]["commit"]["committer"]["date"])
      .then((d) => {
        console.log(d);
        const date = new Date(d);
        this.updated =
          date.getFullYear() +
          "年" +
          (date.getMonth() + 1) +
          "月" +
          date.getDate() +
          "日";
      });
  },
};
</script>

<style scoped></style>

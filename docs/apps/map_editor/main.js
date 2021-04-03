/**
 * Author : Button501
 * License : MIT License
 */
"use strict";

let map = [];
let map_width = 640;
let map_height = 640;
let frame_size = 32;
let palette_width;
let palette_height;
let select_frame = 0;

let palette = new Image();
palette.src = "./Resources/sprites/default_chip.png";
palette.onload = function () {
    palette_width = palette.naturalWidth;
    palette_height = palette.naturalHeight;
    palette_update();
    select_frame = 0;

    let canvas = $("#palette_canvas");
    let ctx = canvas[0].getContext("2d");

    ctx.strokeStyle = "rgb(255,0,0,1)";
    ctx.lineWidth = 6;

    ctx.strokeRect(0, 0, frame_size, frame_size);
};

for (let i = 0; i < map_width / frame_size; i++)
    map[i] = new Array(map_height / frame_size).fill(-1);

$(document).on("change", "#map_width", function () {
    $("#main_canvas").attr("width", "" + this.value);
    map_width = Number(this.value);
    canvas_update();
});

$(document).on("change", "#map_height", function () {
    $("#main_canvas").attr("height", "" + this.value);
    map_height = Number(this.value);
    canvas_update();
});

$(document).on("change", "#frame_size", function () {
    frame_size = Number(this.value);
    canvas_update();
    if (palette != null) {
        palette_update();
    }
});

$(document).on("change", "#map_chip", function () {
    palette = new Image();
    palette.src = window.URL.createObjectURL(this.files[0]);
    palette.onload = function () {
        palette_width = palette.naturalWidth;
        palette_height = palette.naturalHeight;
        palette_update();
        select_frame = null;
    };
});

$(document).on("click", "#eraser_btn", function () {
    select_frame = -1;
    palette_update();
});

$(document).on("change", "#auto_generation", function () {
    let option = $("#auto_option");
    switch (this.value) {
        case "none":
            option.replaceWith(`
                <p id="auto_option"></p>
            `);
            break;
        case "maze":
            option.replaceWith(`
                <p id="auto_option">
                    <label>floor frame</label>
                    <label>
                        <input type="number" id="maze_floor" value="0">
                    </label>
                    <label>wall frame</label>
                    <label>
                        <input type="number" id="maze_wall" value="1">
                    </label>
                    <label>
                        <input type="button" id="generate_btn" value="Generate!">
                    </label>
                </p>
            `);
            break;
    }
});

$(document).on("click", "#generate_btn", function () {
    if (palette != null) {
        let floor = Number($("#maze_floor").val());
        let wall = Number($("#maze_wall").val());
        if (floor === wall) return false;
        let maze_width = map_width / frame_size;
        let maze_height = map_height / frame_size;
        let maze = [];
        for (let i = 0; i < maze_width; i++) {
            maze[i] = new Array(maze_height).fill(floor);
        }

        maze_width = maze_width % 2 === 0 ? maze_width - 1 : maze_width;
        maze_height = maze_height % 2 === 0 ? maze_height - 1 : maze_height;

        for (let i = 0; i < maze_width; i++) {
            maze[i][0] = wall;
            maze[i][maze_height - 1] = wall;
        }
        for (let i = 0; i < maze_height; i++) {
            maze[0][i] = wall;
            maze[maze_width - 1][i] = wall;
        }
        for (let i = 2; i <= maze_width - 2; i += 2) {
            for (let j = 2; j <= maze_height - 2; j += 2) {
                maze[i][j] = wall;
            }
        }
        for (let i = 2; i <= maze_width - 2; i += 2) {
            for (let j = 2; j <= maze_height - 2; j += 2) {
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
                } while (maze[i + dx][j + dy] === wall);
                maze[i + dx][j + dy] = wall;
            }
        }
        map = maze;
        drawMap();
    }
});

//マップチップの選択
$(document).on("click", "#palette_canvas", function (e) {
    let rect = e.target.getBoundingClientRect();
    let canvasX = Math.floor(
        (e.clientX - rect.left) / (this.clientWidth / this.width) / frame_size
    );
    let canvasY = Math.floor(
        (e.clientY - rect.top) / (this.clientWidth / this.width) / frame_size
    );
    console.log(canvasX, canvasY);

    let canvas = $("#palette_canvas");
    let ctx = canvas[0].getContext("2d");

    palette_update();

    ctx.strokeStyle = "rgb(255,0,0,1)";
    ctx.lineWidth = 6;

    let isSelect = false;

    for (let i = 0; i < palette_width / frame_size; i++) {
        for (let j = 0; j < palette_height / frame_size; j++) {
            if (canvasX === i && canvasY === j) {
                isSelect = true;
                ctx.strokeRect(
                    i * frame_size,
                    j * frame_size,
                    frame_size,
                    frame_size
                );
                select_frame = i + j * (palette_width / frame_size);
                break;
            }
        }
        if (isSelect) break;
    }
});

//マップチップの配置
let isDragging = false;
$(document).on("touchstart", "#main_canvas", function () {
    isDragging = true;
});
$(document).on("touchend", "#main_canvas", function () {
    isDragging = false;
});
$(document).on("touchmove", "#main_canvas", function (e) {
    if (palette == null) return;
    let rect = e.target.getBoundingClientRect();
    let canvasX = Math.floor(
        (e.changedTouches[0].clientX - rect.left) /
            (this.clientWidth / this.width) /
            frame_size
    );
    let canvasY = Math.floor(
        (e.changedTouches[0].clientY - rect.top) /
            (this.clientWidth / this.width) /
            frame_size
    );
    let isSelect = false;

    if (!isDragging) return;

    for (let i = 0; i < map_width / frame_size; i++) {
        for (let j = 0; j < map_height / frame_size; j++) {
            if (canvasX === i && canvasY === j) {
                isSelect = true;
                map[i][j] = select_frame;
                break;
            }
        }
        if (isSelect) break;
    }
    drawMap();
});

$(document).on("mousedown", "#main_canvas", function () {
    isDragging = true;
});
$(document).on("mouseup", "#main_canvas", function () {
    isDragging = false;
});
$(document).on("mousemove", "#main_canvas", function (e) {
    if (palette == null) return;
    let rect = e.target.getBoundingClientRect();
    let canvasX = Math.floor(
        (e.clientX - rect.left) / (this.clientWidth / this.width) / frame_size
    );
    let canvasY = Math.floor(
        (e.clientY - rect.top) / (this.clientWidth / this.width) / frame_size
    );

    let isSelect = false;

    if (!isDragging) return;

    for (let i = 0; i < map_width / frame_size; i++) {
        for (let j = 0; j < map_height / frame_size; j++) {
            if (canvasX === i && canvasY === j) {
                isSelect = true;
                map[i][j] = select_frame;
                break;
            }
        }
        if (isSelect) break;
    }
    drawMap();
});

$(document).on("click", "#output_btn", function () {
    let link, blob;
    switch ($("#output_format").val()) {
        case "json file":
            blob = new Blob([JSON.stringify(map, null, "\t")], {
                type: "json",
            });
            link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "map.json";
            link.click();
            break;
        case "text":
            $("#output_text").text(JSON.stringify(map, null, "\t"));
            break;
        case "image":
            let canvas = $("#main_canvas");
            let ctx = canvas[0].getContext("2d");

            ctx.clearRect(0, 0, map_width, map_height);

            if (frame_size <= 0) return false;

            for (let i = 0; i < map_width / frame_size; i++) {
                for (let j = 0; j < map_height / frame_size; j++) {
                    if (map[i][j] >= 0) {
                        let y = Math.floor(
                            map[i][j] / (palette_width / frame_size)
                        );
                        let x = Math.floor(
                            map[i][j] - (palette_width / frame_size) * y
                        );
                        ctx.drawImage(
                            palette,
                            x * frame_size,
                            y * frame_size,
                            frame_size,
                            frame_size,
                            i * frame_size,
                            j * frame_size,
                            frame_size,
                            frame_size
                        );
                    }
                }
            }
            link = document.createElement("a");
            link.href = canvas[0].toDataURL();
            link.download = "map.png";
            link.click();
            drawMap();
            break;
    }
});

function canvas_update() {
    let canvas = $("#main_canvas");
    let ctx = canvas[0].getContext("2d");

    ctx.clearRect(0, 0, map_width, map_height);
    ctx.strokeStyle = "rgb(0,0,0,0.3)";

    if (frame_size <= 0) return false;

    for (let i = frame_size; i < map_width; i += frame_size) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, map_height);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = frame_size; i < map_height; i += frame_size) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(map_width, i);
        ctx.closePath();
        ctx.stroke();
    }
    map = new Array(map_width / frame_size);
    for (let i = 0; i < map_width / frame_size; i++)
        map[i] = new Array(map_height / frame_size).fill(-1);

    return true;
}

function palette_update() {
    let canvas = $("#palette_canvas");
    canvas
        .attr("width", "" + palette_width)
        .attr("height", "" + palette_height);

    let ctx = canvas[0].getContext("2d");

    ctx.clearRect(0, 0, palette_width, palette_height);

    ctx.drawImage(palette, 0, 0);

    ctx.strokeStyle = "rgb(0,0,0,0.3)";
    for (let i = frame_size; i < palette_width; i += frame_size) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, palette_height);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = frame_size; i < palette_height; i += frame_size) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(palette_width, i);
        ctx.closePath();
        ctx.stroke();
    }

    return true;
}

function drawMap() {
    let canvas = $("#main_canvas");
    let ctx = canvas[0].getContext("2d");

    ctx.clearRect(0, 0, map_width, map_height);

    if (frame_size <= 0) return false;

    for (let i = 0; i < map_width / frame_size; i++) {
        for (let j = 0; j < map_height / frame_size; j++) {
            if (map[i][j] >= 0) {
                let y = Math.floor(map[i][j] / (palette_width / frame_size));
                let x = Math.floor(
                    map[i][j] - (palette_width / frame_size) * y
                );
                ctx.drawImage(
                    palette,
                    x * frame_size,
                    y * frame_size,
                    frame_size,
                    frame_size,
                    i * frame_size,
                    j * frame_size,
                    frame_size,
                    frame_size
                );
            }
        }
    }

    ctx.strokeStyle = "rgb(0,0,0,0.3)";

    for (let i = frame_size; i < map_width; i += frame_size) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, map_height);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = frame_size; i < map_height; i += frame_size) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(map_width, i);
        ctx.closePath();
        ctx.stroke();
    }
    return true;
}

window.onload = function () {
    canvas_update();
};

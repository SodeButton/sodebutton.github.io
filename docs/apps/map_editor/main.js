/**
 * Author : Button501
 * License : MIT License
 */
"use strict";

let map_width = 640;
let map_height = 640;
let frame_width = 32;
let frame_height = 32;
let palette = null;
let palette_width;
let palette_height;

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

$(document).on("change", "#frame_width", function () {
    frame_width = Number(this.value);
    canvas_update();
    if (palette != null) {
        palette_update();
    }
});

$(document).on("change", "#frame_height", function () {
    frame_height = Number(this.value);
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
    };
});

function canvas_update() {
    let canvas = $("#main_canvas");
    let ctx = canvas[0].getContext("2d");

    ctx.clearRect(0, 0, map_width, map_height);
    ctx.strokeStyle = "rgb(0,0,0,0.3)";

    if (frame_width <= 0 || frame_height <= 0) return false;

    for (let i = frame_width; i < map_width; i += frame_width) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, map_height);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = frame_height; i < map_height; i += frame_height) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(map_width, i);
        ctx.closePath();
        ctx.stroke();
    }
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
    for (let i = frame_width; i < palette_width; i += frame_width) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, palette_height);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = frame_height; i < palette_height; i += frame_height) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(palette_width, i);
        ctx.closePath();
        ctx.stroke();
    }

    return true;
}

window.onload = function () {
    canvas_update();
};

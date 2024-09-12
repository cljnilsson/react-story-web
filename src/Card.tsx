import { useState, useEffect, useRef } from "react";

export default function Card({
	ctx,
	x,
	y,
	width,
	height,
	title,
	text
}: {
	ctx: CanvasRenderingContext2D;
	x: number;
	y: number;
	width: number;
	height: number;
	title: string;
	text: string;
}) {
	// Function to draw the card with rounded corners, title, and text
	function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, title: string, text: string) {
		drawRoundedRect(ctx, x, y, width, height, 20);
		drawTitle(ctx, x, y, width, title);
		drawMoreText(ctx, x, y + 100, width, text);
	}

	// Function to draw a rounded rectangle
	function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		ctx.fillStyle = "#ffffff";
		ctx.fill();
		ctx.strokeStyle = "#e0e0e0";
		ctx.stroke();
	}

	// Function to draw the title text
	function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, text: string) {
		ctx.font = "bold 20px Arial";
		ctx.fillStyle = "#333";
		ctx.textAlign = "center";
		ctx.fillText(text, x + width / 2, y + 40);
		ctx.beginPath();
		ctx.moveTo(x + 20, y + 50);
		ctx.lineTo(x + width - 20, y + 50);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#333";
		ctx.stroke();
	}

	// Function to draw additional text
	function drawMoreText(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, text: string) {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#666";
		ctx.textAlign = "center";
		ctx.fillText(text, x + width / 2, y);
	}

	// Actually perform the drawing when the component is used
	drawCard(ctx, x, y, width, height, title, text);
}

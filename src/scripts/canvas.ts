import Card from "./Card";
import type { CardData } from "../types/cardData";

export default class CanvasHelper {
	static getEdgePoint(card: { x: number; y: number; width: number; height: number }, otherCard: { x: number; y: number; width: number; height: number }) {
		// Calculate the center points of both cards
		const cardCenterX = card.x + card.width / 2;
		const cardCenterY = card.y + card.height / 2;
		const otherCenterX = otherCard.x + otherCard.width / 2;
		const otherCenterY = otherCard.y + otherCard.height / 2;

		const dx = otherCenterX - cardCenterX;
		const dy = otherCenterY - cardCenterY;

		// Special case for near-vertical or near-horizontal alignment
		if (Math.abs(dx) < 0.01) {
			// Cards are aligned vertically, snap to top/bottom edges
			if (dy > 0) {
				return { startX: cardCenterX, startY: card.y + card.height }; // Bottom edge
			} else {
				return { startX: cardCenterX, startY: card.y }; // Top edge
			}
		}

		if (Math.abs(dy) < 0.01) {
			// Cards are aligned horizontally, snap to left/right edges
			if (dx > 0) {
				return { startX: card.x + card.width, startY: cardCenterY }; // Right edge
			} else {
				return { startX: card.x, startY: cardCenterY }; // Left edge
			}
		}

		// Calculate the slope of the line from the center of the card to the other card
		const epsilon = 1e-10; // Small value to avoid division by zero
		const slope = dy / (dx + epsilon);

		// Determine which edge the line intersects with
		let edgeX, edgeY;

		if (Math.abs(dx) > Math.abs(dy)) {
			// Horizontal case: intersect with left or right edge
			if (dx > 0) {
				// Other card is to the right, use the right edge
				edgeX = card.x + card.width;
			} else {
				// Other card is to the left, use the left edge
				edgeX = card.x;
			}
			// Calculate corresponding y at this x
			edgeY = cardCenterY + slope * (edgeX - cardCenterX);
			edgeY = Math.max(card.y, Math.min(card.y + card.height, edgeY)); // Clamp to card's vertical edges
		} else {
			// Vertical case: intersect with top or bottom edge
			if (dy > 0) {
				// Other card is below, use the bottom edge
				edgeY = card.y + card.height;
			} else {
				// Other card is above, use the top edge
				edgeY = card.y;
			}
			// Calculate corresponding x at this y
			edgeX = cardCenterX + (edgeY - cardCenterY) / (slope + epsilon);
			edgeX = Math.max(card.x, Math.min(card.x + card.width, edgeX)); // Clamp to card's horizontal edges
		}

		return { startX: edgeX, startY: edgeY };
	}

	static drawCard(canvas: CanvasRenderingContext2D, card: { x: number; y: number; width: number; height: number; title: string; text: string }) {
		console.table(card);
		Card({
			ctx: canvas,
			x: card.x,
			y: card.y,
			width: card.width,
			height: card.height,
			title: card.title,
			text: card.text
		});
	}

	static drawLinesBetweenCards(ctx: CanvasRenderingContext2D, cardData: CardData[]) {
		ctx.strokeStyle = "#333"; // Line color
		ctx.lineWidth = 2; // Line width

		// Create a map for quick access to card positions by title
		const cardMap = new Map<string, { x: number; y: number; width: number; height: number }>();
		for (const card of cardData) {
			cardMap.set(card.title, { x: card.x, y: card.y, width: card.width, height: card.height });
		}

		for (const card of cardData) {
			for (const attachedTitle of card.attachedTo) {
				const attachedCard = cardMap.get(attachedTitle);
				if (attachedCard) {
					// Calculate the start point (on card edge)
					const { startX, startY } = CanvasHelper.getEdgePoint(card, attachedCard);

					// Calculate the end point (on attachedCard edge)
					const { startX: endX, startY: endY } = CanvasHelper.getEdgePoint(attachedCard, card);

					// Draw line between the edge points
					ctx.beginPath();
					ctx.moveTo(startX, startY);
					ctx.lineTo(endX, endY);
					ctx.stroke();
				}
			}
		}
	}

	static drawCards(canvas: CanvasRenderingContext2D, canvasRef: HTMLCanvasElement, cardData: CardData[]) {
		if (!canvas || !canvasRef) {
			console.error("Can't draw");
			return;
		}

		canvas.clearRect(0, 0, canvasRef.width, canvasRef.height);

		cardData.forEach((card) => {
			CanvasHelper.drawCard(canvas, card);
		});

		CanvasHelper.drawLinesBetweenCards(canvas, cardData);
	}

	// Get the closest points between the corners or edges of two rectangles
	static getClosestPoints(rect1: DOMRect, rect2: DOMRect) {
		type Point = { x: number; y: number };
		type PointMap = {
			left: Point;
			right: Point;
			top: Point;
			bottom: Point;
			topLeft: Point;
			topRight: Point;
			bottomLeft: Point;
			bottomRight: Point;
		};

		// Calculate the center points of the sides for rect1
		const rect1Points: PointMap = {
			left: { x: rect1.left, y: (rect1.top + rect1.bottom) / 2 },
			right: { x: rect1.right, y: (rect1.top + rect1.bottom) / 2 },
			top: { x: (rect1.left + rect1.right) / 2, y: rect1.top },
			bottom: { x: (rect1.left + rect1.right) / 2, y: rect1.bottom },
			topLeft: { x: rect1.left, y: rect1.top },
			topRight: { x: rect1.right, y: rect1.top },
			bottomLeft: { x: rect1.left, y: rect1.bottom },
			bottomRight: { x: rect1.right, y: rect1.bottom }
		};

		// Calculate the center points of the sides for rect2
		const rect2Points: PointMap = {
			left: { x: rect2.left, y: (rect2.top + rect2.bottom) / 2 },
			right: { x: rect2.right, y: (rect2.top + rect2.bottom) / 2 },
			top: { x: (rect2.left + rect2.right) / 2, y: rect2.top },
			bottom: { x: (rect2.left + rect2.right) / 2, y: rect2.bottom },
			topLeft: { x: rect2.left, y: rect2.top },
			topRight: { x: rect2.right, y: rect2.top },
			bottomLeft: { x: rect2.left, y: rect2.bottom },
			bottomRight: { x: rect2.right, y: rect2.bottom }
		};

		// Find the closest pair of points (either from corners or edges)
		let minDistance = Infinity;
		let startX = 0,
			startY = 0,
			endX = 0,
			endY = 0;

		(Object.keys(rect1Points) as (keyof PointMap)[]).forEach((key1) => {
			(Object.keys(rect2Points) as (keyof PointMap)[]).forEach((key2) => {
				const p1 = rect1Points[key1];
				const p2 = rect2Points[key2];
				const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

				if (distance < minDistance) {
					minDistance = distance;
					startX = p1.x;
					startY = p1.y;
					endX = p2.x;
					endY = p2.y;
				}
			});
		});

		return { startX, startY, endX, endY };
	}
}

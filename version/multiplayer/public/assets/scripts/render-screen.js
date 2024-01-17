export default function controller(gameState) {
  const screen = document.getElementById("screen");
  const context = screen.getContext("2d");
  const colors = {
    evenArea: "#04BF8A",
    oddArea: "#04D99D",
    star: "yellow",
    player: "black",
  };
  let playerY = 0;
  let areasStyle = [];

  function calcAreasStyle(areas, canvas) {
    areasStyle = [];

    for (let count = 1; count <= areas; count++) {
      const color = count % 2 == 0 ? colors.evenArea : colors.oddArea;
      const x = canvas.width * (count - 1);

      areasStyle.push({
        x,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        color,
      });
    }
  }

  function setup() {
    const { availableAreas, canvas } = gameState;

    screen.style.width = `${canvas.width * availableAreas * 20}px`;
    screen.style.height = `${canvas.height * 20}px`;
    screen.width = canvas.width * availableAreas;
    screen.height = canvas.height;

    playerY = canvas.height - 1;

    calcAreasStyle(availableAreas, canvas);
  }

  function drawRect(rect) {
    context.fillStyle = rect.color;
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  function render() {
    areasStyle.forEach(drawRect);

    console.log("\n\nrender:", gameState);

    for (const areaId in gameState.areas) {
      const { player, stars } = gameState.areas[areaId];

      stars.forEach((star) => {
        const rect = {
          x: star.x,
          y: star.y,
          width: 1,
          height: 1,
          color: colors.star,
        };

        drawRect(rect);
      });

      drawRect({
        x: player.x,
        y: playerY,
        width: 1,
        height: 1,
        color: colors.player,
      });
    }

    if (gameState.running) {
      requestAnimationFrame(() => {
        render(gameState);
      });
    }
  }

  return {
    render,
    setup,
  };
}

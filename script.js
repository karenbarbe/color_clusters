const loadColors = async () => {
  try {
    const response = await fetch("./data/WAM01-clusters.json");
    const colorData = await response.json();
    return colorData;
  } catch (error) {
    console.error("Error loading color data:", error);
  }
};

const init = async () => {
  const colors = await loadColors();
  const container = document.querySelector(".color-sample__list");

  for (let i = 0; i < Object.keys(colors).length; i++) {
    let hexColor = colors[i + 1]["corrected"]["hex"];
    let pixelRatio = colors[i + 1]["ratio"] * 100;
    console.log(hexColor);
    const chip = document.createElement("div");
    chip.style.backgroundColor = hexColor;
    chip.style.width = `${pixelRatio}rem`;
    container.appendChild(chip);
  }
};

init();

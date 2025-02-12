// TO START: Update const imageName to match the image slug.

const imageName = "WAM01";

const loadColors = async () => {
  try {
    const response = await fetch(`./data/${imageName}-clusters.json`);
    const colorData = await response.json();
    return colorData;
  } catch (error) {
    console.error("Error loading color data:", error);
  }
};

const init = async () => {
  const colors = await loadColors();
  const container = document.querySelector(".color-sample__list");
  const swatchRow = document.getElementById("swatch-row");
  const hexRow = document.getElementById("hex-row");
  const hueRow = document.getElementById("hue-row");
  const saturationRow = document.getElementById("saturation-row");
  const lightnessRow = document.getElementById("lightness-row");

  for (let i = 0; i < Object.keys(colors).length; i++) {
    let hexColor = colors[i + 1]["corrected"]["hex"];
    let hue = colors[i + 1]["corrected"]["hsl"][0];
    let saturation = colors[i + 1]["corrected"]["hsl"][1];
    let lightness = colors[i + 1]["corrected"]["hsl"][2];
    let pixelRatio = colors[i + 1]["ratio"] * 100;

    // Creates color clusters by ratio
    const chip = document.createElement("div");
    chip.style.backgroundColor = hexColor;
    chip.style.width = `${pixelRatio}rem`;
    container.appendChild(chip);

    // Creates swatch row cells
    const tdSwatch = document.createElement("td");
    tdSwatch.style.backgroundColor = hexColor;
    swatchRow.appendChild(tdSwatch);
    // Creates hex row cells
    const tdHex = document.createElement("td");
    tdHex.textContent = hexColor;
    hexRow.appendChild(tdHex);
    // Creates hue row cells
    const tdHue = document.createElement("td");
    tdHue.textContent = hue;
    hueRow.appendChild(tdHue);
    // Creates saturation row cells
    const tdSaturation = document.createElement("td");
    tdSaturation.textContent = saturation;
    saturationRow.appendChild(tdSaturation);
    // Creates lightness row cells
    const tdLightness = document.createElement("td");
    tdLightness.textContent = lightness;
    lightnessRow.appendChild(tdLightness);
  }

  const img = document.createElement("img");
  img.src = `./images/${imageName}.jpg`;
  img.classList.add("image");
  img.alt = "Sample image";
  img.loading = "lazy";
  const imageContainer = document.getElementById("sample-image");
  imageContainer.appendChild(img);
};

init();

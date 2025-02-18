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

const loadSortedColors = async () => {
  try {
    const response = await fetch(`./data/${imageName}-sorted.json`);
    const colorData = await response.json();
    return colorData;
  } catch (error) {
    console.error("Error loading sorted color data:", error);
  }
};

function copyColorToClipboard(color, element) {
  navigator.clipboard.writeText(color);
  element.classList.add("confirmation");
  setTimeout(() => {
    element.classList.remove("confirmation");
  }, 1000);
}

function createSection(heading) {
  const sectionElement = document.createElement("section");
  sectionElement.classList.add("wrapper", "section");
  const h2Container = document.createElement("div");
  h2Container.classList.add("h2-container");
  const h2Heading = document.createElement("h2");
  h2Heading.textContent = heading;
  h2Container.appendChild(h2Heading);
  sectionElement.appendChild(h2Container);

  return sectionElement;
}

const init = async () => {
  const colors = await loadColors();
  const sortedColors = await loadSortedColors();
  const colorKeys = Object.keys(colors);
  const clusterGroups = ["corrected", "original"];
  const colorMoods = ["original", "lighter", "darker", "colorful"];
  const sections = ["Corrected color clusters", "Original API colors"];
  const rows = [
    "Color swatch",
    "Hex color",
    "Hue",
    "Saturation",
    "Lightness",
    "Perceptual lightness (CIELAB)",
    "Chroma (LCH)",
  ];

  const main = document.getElementById("main");
  const container = document.querySelector(".color-sample__list");
  const colormoodSection = document.getElementById("color-moods");

  // Creates color clusters by ratio
  colorKeys.forEach((colorKey) => {
    let hexColor = colors[colorKey]["corrected"]["hex"];
    let pixelRatio = colors[colorKey]["ratio"] * 100;
    const chip = document.createElement("div");
    chip.style.backgroundColor = hexColor;
    chip.style.width = `${pixelRatio}vw`;
    container.appendChild(chip);
  });

  // Creates image element and loads jpg image into it
  const imageContainer = document.getElementById("sample-image");
  const img = document.createElement("img");
  img.src = `./images/${imageName}.jpg`;
  img.classList.add("image");
  img.alt = "Sample image";
  img.loading = "lazy";
  imageContainer.appendChild(img);

  // Creates sections for corrected and original color clusters
  sections.forEach((section, i) => {
    const sectionElement = createSection(section);
    // Creates table
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container", "overflow-x");
    const table = document.createElement("table");
    table.classList.add("table");
    // Creates rows elements
    rows.forEach((row, j) => {
      const trElement = document.createElement("tr");
      const thElement = document.createElement("th");
      thElement.textContent = row;
      trElement.appendChild(thElement);
      // Creates table cells
      colorKeys.forEach((colorKey) => {
        let hexColor = colors[colorKey][clusterGroups[i]]["hex"];
        let hue = colors[colorKey][clusterGroups[i]]["hsl"][0];
        let saturation = colors[colorKey][clusterGroups[i]]["hsl"][1];
        let lightness = colors[colorKey][clusterGroups[i]]["hsl"][2];
        let perceptualLightness = colors[colorKey][clusterGroups[i]]["lab"][0];
        let chroma = colors[colorKey][clusterGroups[i]]["lch"][1];
        const values = [
          hexColor,
          hue,
          saturation,
          lightness,
          perceptualLightness,
          chroma,
        ];
        const tdElement = document.createElement("td");

        if (row === "Color swatch") {
          trElement.classList.add("swatch-row");
          tdElement.classList.add("swatch");
          tdElement.style.backgroundColor = hexColor;
          tdElement.addEventListener("click", () =>
            copyColorToClipboard(hexColor, tdElement)
          );
          trElement.appendChild(tdElement);
        } else {
          tdElement.textContent = values[j - 1];
          trElement.appendChild(tdElement);
        }
      });
      table.appendChild(trElement);
    });
    tableContainer.appendChild(table);
    sectionElement.appendChild(tableContainer);
    main.insertBefore(sectionElement, colormoodSection);
  });

  // Creates color moods

  const paletteWrapper = document.createElement("div");
  paletteWrapper.classList.add("colormood-wrapper");

  colorMoods.forEach((mood) => {
    // Creates headings
    const heading = document.createElement("h3");
    const headingContent = `${mood.charAt(0).toUpperCase()}${mood.slice(
      1
    )} mood`;
    heading.textContent = headingContent;
    paletteWrapper.appendChild(heading);

    const paletteContainer = document.createElement("div");
    paletteContainer.classList.add("colormood-container");

    // Creates palette elements
    colorKeys.forEach((colorKey, j) => {
      let hexColor = sortedColors[mood][j]["hex"];
      let pixelRatio = colors[colorKey]["ratio"] * 100;
      const chip = document.createElement("div");
      chip.style.backgroundColor = hexColor;
      chip.style.width = `${pixelRatio}%`;
      paletteContainer.appendChild(chip);
    });
    paletteWrapper.appendChild(paletteContainer);
  });

  colormoodSection.appendChild(paletteWrapper);
};

init();

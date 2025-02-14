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

function copyColorToClipboard(color) {
  navigator.clipboard.writeText(color);
}

const init = async () => {
  const colors = await loadColors();
  const colorKeys = Object.keys(colors);
  const clusterGroups = ["corrected", "original"];
  const sections = ["Corrected color clusters", "Original API colors"];
  const rows = ["Color swatch", "Hex color", "Hue", "Saturation", "Lightness"];

  const main = document.getElementById("main");
  const container = document.querySelector(".color-sample__list");

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
    const sectionElement = document.createElement("section");
    sectionElement.classList.add("wrapper", "section");
    // Creates heading container
    const h2Container = document.createElement("div");
    h2Container.classList.add("h2-container");
    const h2Heading = document.createElement("h2");
    h2Heading.textContent = section;
    h2Container.appendChild(h2Heading);
    sectionElement.appendChild(h2Container);
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
        const values = [hexColor, hue, saturation, lightness];
        const tdElement = document.createElement("td");

        if (row === "Color swatch") {
          trElement.classList.add("swatch-row");
          tdElement.classList.add("swatch");
          tdElement.style.backgroundColor = hexColor;
          tdElement.addEventListener("click", () =>
            copyColorToClipboard(hexColor)
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
    main.appendChild(sectionElement);
  });
};

init();

// for (let i = 0; i < Object.keys(colors).length; i++) {
//   let hexColor = colors[i + 1]["corrected"]["hex"];
//   let hue = colors[i + 1]["corrected"]["hsl"][0];
//   let saturation = colors[i + 1]["corrected"]["hsl"][1];
//   let lightness = colors[i + 1]["corrected"]["hsl"][2];
//   let pixelRatio = colors[i + 1]["ratio"] * 100;

//   // Creates color clusters by ratio
//   const chip = document.createElement("div");
//   chip.style.backgroundColor = hexColor;
//   chip.style.width = `${pixelRatio}rem`;
//   container.appendChild(chip);

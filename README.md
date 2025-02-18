# Color Clusters

Capture beautiful color palettes from images!
Color Clusters use the set of colors obtained with Image Color Summarizer API and adjusts their saturation and lightness to create an enticing color palette.

The API reports accurate hues, but the saturation and lightness values can appear muddy if the intention is to use the resulting palette in a visual project.

The following color corrections aim at enhacing the palette:

Hue

- Original hue value

Saturation

- Light colors (L ≥ 70): Increase by ~25%
- Mid-range colors (40 ≤ L < 70): Increase by ~20%
- Dark colors (L < 40): Increase by ~13%

Lightness

- Light colors: Increase by 5-6 points
- Mid-range colors: Increase by 13-14 points
- Dark colors: Increase by 10 points

## Live site

[Color Clusters](https://karenbarbe.github.io/color_clusters/) on GitHub Pages

## Technical implementation

**Layout**:

- Responsive CSS

**Data pipeline**:

- Python script requests API to get a JSON file with color clusters data
- JavaScript fetches and renders the JSON data into HTML

## Built with

- HTML5
- CSS3
- JavaScript
- Python

## Getting started

To run this project locally:

1. Clone this repository
2. Create a virtual environment and install packages:

```
python3 -m venv .venv
source .venv/bin/activate

pip install requirements.txt
```

3. Update `image_name` and/or `url` to match the image location in `main.py`.

```
image_name = "WAM01"
url = f"raw.githubusercontent.com/karenbarbe/color_clusters/refs/heads/main/images"

```

4. Update `imageName` variable in `script.js`

```
const imageName = "WAM01";
```

5. Run `main.py`

```
python3 main.py run
```

6. Open `index.html` in your preferred browser

## Project status

Feedback and suggestions are welcome through GitHub issues.

## Acknowledgments

- This project utilizes the color sets obtained with the [Image Color Summarizer](https://mk.bcgsc.ca/colorsummarizer/) by Martin Krzywinski
- Featured image belongs to [We Animals Media stock photography](https://stock.weanimals.org/)

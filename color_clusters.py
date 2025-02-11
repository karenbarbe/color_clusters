import json, requests
from color_corrector import correct_hsl_colors, hex_to_hsl, hsl_to_hex

image_name = "WAM01"
image_url = f"raw.githubusercontent.com/karenbarbe/colour-confident-stitching/refs/heads/main/images/{image_name}.jpg"
precision_type = "low"
num = 7

output = f"./data/{image_name}-clusters.json"


def get_clusters():
    """
    Requests Image Color Summarizer API as json file.

    Returns:
    dict: Hex color and pixels ratio values organized by color cluster ('1', '2', etc)
    """
    url = f"http://mkweb.bcgsc.ca/color-summarizer/?url={image_url}&precision={precision_type}&json=1&num_clusters={str(num)}"

    r = requests.get(url)

    if r.status_code == 200:
        print(f"\nStatus code: {r.status_code}")
        r_dict = r.json()
        clusters = r_dict["clusters"]

        return {
            str(i + 1): {
                "hex": clusters[str(i)]["hex"][0],
                "ratio": clusters[str(i)]["f"],
            }
            for i in range(len(clusters))
        }

    else:
        print(f"\nStatus code: {r.status_code}")
        return None


def correct_clusters():
    """Converts each original hex color to hsl, corrects values and converts back to hex.

    Return:
    dict: Original and corrected hex and hsl values and original pixel ratio value organized by color cluster ('1', '2', etc)
    """
    try:
        clusters = get_clusters()
    except AttributeError:
        print("Can't get clusters")
    else:
        hex_colors = [clusters[str(i + 1)]["hex"] for i in range(len(clusters))]
        hsl_colors = [hex_to_hsl(hex_color) for hex_color in hex_colors]
        corrected_hsl = correct_hsl_colors(hsl_colors)
        corrected_hex = [hsl_to_hex(hsl) for hsl in corrected_hsl]

        return {
            str(i + 1): {
                "original": {"hex": hex_colors[i], "hsl": hsl_colors[i]},
                "corrected": {"hex": corrected_hex[i], "hsl": corrected_hsl[i]},
                "ratio": clusters[str(i + 1)]["ratio"],
            }
            for i in range(len(hex_colors))
        }


def create_clusters_json():
    clusters = correct_clusters()
    with open(output, "w") as f:
        json.dump(clusters, f, indent=2)


create_clusters_json()

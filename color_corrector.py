import math


def correct_hsl_colors(hsl_list):
    """
    Corrects original API colors based on analyzed patterns to achieve more vibrant and true-to-eye colors.

    Parameters:
    hsl_list (list): List of HSL color tuples. Each tuple should contain (hue, saturation, lightness)
                     where:
                     - hue is 0-360
                     - saturation is 0-100
                     - lightness is 0-100

    Returns:
    list: List of corrected HSL color tuples

    Example:
    >>> colors = [(280, 4, 84), (327, 6, 70), (0, 29, 63)]
    >>> corrected = correct_hsl_colors(colors)
    """
    corrected_colors = []

    for hue, saturation, lightness in hsl_list:
        # Keep original hue unless it needs specific adjustment
        new_hue = hue

        # Initialize new saturation and lightness
        new_saturation = saturation
        new_lightness = lightness

        # Apply saturation boost based on lightness range
        if lightness >= 70:  # Light colors
            new_saturation = min(100, saturation + 25)
            new_lightness = min(100, lightness + 5)
        elif lightness >= 40:  # Mid-range colors
            new_saturation = min(100, saturation + 20)
            new_lightness = min(100, lightness + 13)
        else:  # Dark colors
            new_saturation = min(100, saturation + 13)
            new_lightness = min(100, lightness + 7)  # was 10

        # Create corrected color tuple
        corrected_color = (new_hue, new_saturation, new_lightness)
        corrected_colors.append(corrected_color)

    return corrected_colors


def hex_to_hsl(hex_color):
    """
    Convert a hex color string to HSL values.

    Parameters:
    hex_color (str): Color in hex format (e.g., '#FF0000' or 'FF0000')

    Returns:
    tuple: (hue, saturation, lightness)

    Example:
    >>> hex_to_hsl('#FF0000')
    (0, 100, 50)
    """

    hex_color = hex_color.lstrip("#")

    # Convert hex to RGB
    r = int(hex_color[:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:], 16) / 255.0

    # Find min and max values
    cmin = min(r, g, b)
    cmax = max(r, g, b)
    delta = cmax - cmin

    # Calculate hue
    if delta == 0:
        hue = 0
    elif cmax == r:
        hue = 60 * (((g - b) / delta) % 6)
    elif cmax == g:
        hue = 60 * ((b - r) / delta + 2)
    else:
        hue = 60 * ((r - g) / delta + 4)

    # Make sure hue is positive
    hue = round(hue % 360)

    lightness = (cmax + cmin) / 2

    saturation = 0 if delta == 0 else delta / (1 - abs(2 * lightness - 1))

    saturation = round(saturation * 100)
    lightness = round(lightness * 100)

    return (hue, saturation, lightness)


def hsl_to_hex(hsl):
    """
    Convert HSL values to hex color string.

    Parameters:
    hsl (tuple): (hue, saturation, lightness) where:
                 - hue is 0-360
                 - saturation is 0-100
                 - lightness is 0-100

    Returns:
    str: Color in hex format with # prefix

    Example:
    >>> hsl_to_hex((0, 100, 50))
    '#FF0000'
    """
    h, s, l = hsl

    # Convert to 0-1 range
    h = h / 360
    s = s / 100
    l = l / 100

    def hue_to_rgb(p, q, t):
        if t < 0:
            t += 1
        if t > 1:
            t -= 1
        if t < 1 / 6:
            return p + (q - p) * 6 * t
        if t < 1 / 2:
            return q
        if t < 2 / 3:
            return p + (q - p) * (2 / 3 - t) * 6
        return p

    if s == 0:
        r = g = b = l
    else:
        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = hue_to_rgb(p, q, h + 1 / 3)
        g = hue_to_rgb(p, q, h)
        b = hue_to_rgb(p, q, h - 1 / 3)

    # Convert to hex
    r = round(r * 255)
    g = round(g * 255)
    b = round(b * 255)

    return f"#{r:02x}{g:02x}{b:02x}".upper()


def rgb_to_xyz(r, g, b):
    """Convert RGB to XYZ color space."""
    r = r / 255
    g = g / 255
    b = b / 255

    # Convert to linear RGB
    r = ((r + 0.055) / 1.055) ** 2.4 if r > 0.04045 else r / 12.92
    g = ((g + 0.055) / 1.055) ** 2.4 if g > 0.04045 else g / 12.92
    b = ((b + 0.055) / 1.055) ** 2.4 if b > 0.04045 else b / 12.92

    # Convert to XYZ
    x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
    z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041

    return x, y, z


def xyz_to_lab(x, y, z):
    """Convert XYZ to LAB color space."""
    # Reference values (D65 illuminant)
    xn, yn, zn = 0.95047, 1.00000, 1.08883

    # Normalize values
    x = x / xn
    y = y / yn
    z = z / zn

    # Convert to LAB
    def f(t):
        return t ** (1 / 3) if t > 0.008856 else (7.787 * t) + (16 / 116)

    fx = f(x)
    fy = f(y)
    fz = f(z)

    L = (116 * fy) - 16
    a = 500 * (fx - fy)
    b = 200 * (fy - fz)

    return L, a, b


def lab_to_lch(L, a, b):
    """Convert LAB to LCH color space."""
    C = math.sqrt(a**2 + b**2)  # Chroma
    h = math.atan2(b, a)  # Hue angle in radians

    # Convert hue to degrees
    h = math.degrees(h)
    if h < 0:
        h += 360

    L = round(L)
    C = round(C)
    h = round(h)

    return L, C, h


def hex_to_lab(hex_color):
    """Convert hex color to LAB values."""
    # Remove '#' if present
    hex_color = hex_color.lstrip("#")

    # Convert hex to RGB
    r = int(hex_color[:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:], 16)

    # Convert RGB to XYZ
    x, y, z = rgb_to_xyz(r, g, b)

    # Convert XYZ to LAB
    L, a, b = xyz_to_lab(x, y, z)

    return round(L), round(a), round(b)

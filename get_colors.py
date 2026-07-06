import sys
try:
    from PIL import Image
    img = Image.open('src/assets/logo.jpeg')
    img = img.convert('RGB')
    
    # Simple color quantization to find dominant colors
    # We will just ignore near-black colors to find the text/accent color
    colors = img.getcolors(img.size[0] * img.size[1])
    
    non_blacks = []
    for count, color in colors:
        r, g, b = color
        if (r > 30 or g > 30 or b > 30):
            non_blacks.append((count, color))
            
    sorted_non_blacks = sorted(non_blacks, key=lambda t: t[0], reverse=True)
    
    print("Top non-black colors:")
    for count, color in sorted_non_blacks[:10]:
        hex_color = '#%02x%02x%02x' % color[:3]
        print(f"Count: {count}, Color: {hex_color} {color}")
except Exception as e:
    print("Error:", e)

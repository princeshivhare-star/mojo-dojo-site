from PIL import Image, ImageDraw, ImageFilter
import random, math

random.seed(42)

W, H = 900, 640

# Brand red duotone palette variants (dark -> bright red)
palettes = [
    ((92,20,18), (223,70,52)),
    ((84,16,16), (232,88,58)),
    ((98,24,20), (210,60,46)),
    ((88,18,16), (226,78,54)),
    ((80,15,15), (216,64,48)),
    ((94,22,19), (236,96,62)),
]

def make_thumb(idx, dark, bright, seed_shift):
    img = Image.new('RGB', (W, H), dark)
    px = img.load()
    cx, cy = W * (0.5 + 0.15*math.sin(seed_shift)), H * 0.42
    max_r = math.hypot(W, H) * 0.62
    for y in range(H):
        for x in range(0, W, 2):
            d = math.hypot(x-cx, y-cy) / max_r
            d = max(0, min(1, d))
            t = 1 - d
            t = t ** 1.4
            r = int(dark[0] + (bright[0]-dark[0]) * t)
            g = int(dark[1] + (bright[1]-dark[1]) * t)
            b = int(dark[2] + (bright[2]-dark[2]) * t)
            px[x, y] = (r, g, b)
            if x+1 < W:
                px[x+1, y] = (r, g, b)
    img = img.filter(ImageFilter.GaussianBlur(1.2))
    draw = ImageDraw.Draw(img, 'RGBA')

    # simple abstracted portrait silhouette (head + shoulders), slightly off-center
    head_cx = W * (0.62 + 0.06*math.cos(seed_shift*1.3))
    head_cy = H * 0.40
    head_r = H * 0.19
    shadow = (max(dark[0]-14,0), max(dark[1]-8,0), max(dark[2]-8,0))
    # shoulders
    draw.ellipse([head_cx-head_r*2.1, head_cy+head_r*0.85, head_cx+head_r*2.1, head_cy+head_r*3.4],
                 fill=(*shadow, 190))
    # head
    draw.ellipse([head_cx-head_r, head_cy-head_r, head_cx+head_r, head_cy+head_r],
                 fill=(*shadow, 190))

    img = img.filter(ImageFilter.GaussianBlur(3))

    # grain
    noise = Image.effect_noise((W, H), 24).convert('L')
    noise_rgba = Image.merge('RGBA', (noise, noise, noise, Image.new('L', (W,H), 18)))
    img = img.convert('RGBA')
    img = Image.alpha_composite(img, noise_rgba)

    # light vignette only at extreme edges
    vign = Image.new('L', (W, H), 255)
    vd = ImageDraw.Draw(vign)
    vd.ellipse([-W*0.35, -H*0.4, W*1.35, H*1.4], fill=0)
    vign = vign.filter(ImageFilter.GaussianBlur(140))
    black = Image.new('RGBA', (W, H), (10,3,4,255))
    img = Image.composite(black, img, vign)

    img.convert('RGB').save(f'assets/testimonial-{idx}.jpg', quality=85)

for i, (dark, bright) in enumerate(palettes, start=1):
    make_thumb(i, dark, bright, i*1.1)

print('thumbnails done')

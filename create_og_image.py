#!/usr/bin/env python3
"""
Create Open Graph preview image with viridis gradient.
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_og_preview():
    """Create an Open Graph preview image."""
    # Create image with proper OG dimensions
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), '#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Viridis colors (subset for gradient)
    viridis_colors = [
        '#440154', '#482777', '#3f4a8a', '#31678e', '#26838f',
        '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'
    ]
    
    # Draw title
    try:
        font_large = ImageFont.truetype('/System/Library/Fonts/Arial.ttf', 48)
        font_small = ImageFont.truetype('/System/Library/Fonts/Arial.ttf', 24)
    except:
        # Fallback to default font
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Title
    draw.text((50, 50), "Colormap Visualization", fill='#213547', font=font_large)
    draw.text((50, 110), "Interactive colormap analysis with perceptual evaluation", fill='#666', font=font_small)
    
    # Draw viridis gradient
    gradient_y = 180
    gradient_height = 80
    gradient_width = width - 100
    
    for i in range(gradient_width):
        # Map position to color
        t = i / (gradient_width - 1)
        color_idx = int(t * (len(viridis_colors) - 1))
        color_idx = min(color_idx, len(viridis_colors) - 1)
        
        # Draw vertical line
        draw.rectangle([50 + i, gradient_y, 51 + i, gradient_y + gradient_height], 
                      fill=viridis_colors[color_idx])
    
    # Add labels
    draw.text((50, gradient_y + gradient_height + 20), "Viridis Colormap", fill='#333', font=font_small)
    
    # Add feature highlights
    features = [
        "• Perceptual derivative analysis (ΔE 2000)",
        "• Color vision deficiency simulation", 
        "• Authentic Mt. St. Helens test data",
        "• 3D L*a*b* color space visualization"
    ]
    
    start_y = 320
    for i, feature in enumerate(features):
        draw.text((50, start_y + i * 40), feature, fill='#555', font=font_small)
    
    # Save
    img.save('public/og-preview.png', 'PNG', quality=95)
    print("Created public/og-preview.png")

if __name__ == "__main__":
    create_og_preview()
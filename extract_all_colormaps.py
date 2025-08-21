#!/usr/bin/env python3
"""
Extract all matplotlib colormaps to JSON files.
This script extracts colormap data at 256-point resolution for web usage.
"""

import json
import os
from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np


def get_all_colormaps():
    """Get all available matplotlib colormaps grouped by category."""
    # Get all available colormap names
    all_cmaps = plt.colormaps()
    
    # Categorize colormaps (matplotlib's standard categories)
    categories = {
        'perceptually_uniform': [
            'viridis', 'plasma', 'inferno', 'magma', 'cividis'
        ],
        'sequential': [
            'Greys', 'Purples', 'Blues', 'Greens', 'Oranges', 'Reds',
            'YlOrBr', 'YlOrRd', 'OrRd', 'PuRd', 'RdPu', 'BuPu',
            'GnBu', 'PuBu', 'YlGnBu', 'PuBuGn', 'BuGn', 'YlGn'
        ],
        'sequential2': [
            'binary', 'gist_yarg', 'gist_gray', 'gray', 'bone', 'pink',
            'spring', 'summer', 'autumn', 'winter', 'cool', 'Wistia',
            'hot', 'afmhot', 'gist_heat', 'copper'
        ],
        'diverging': [
            'PiYG', 'PRGn', 'BrBG', 'PuOr', 'RdGy', 'RdBu',
            'RdYlBu', 'RdYlGn', 'Spectral', 'coolwarm', 'bwr', 'seismic'
        ],
        'cyclic': [
            'twilight', 'twilight_shifted', 'hsv'
        ],
        'qualitative': [
            'Pastel1', 'Pastel2', 'Paired', 'Accent',
            'Dark2', 'Set1', 'Set2', 'Set3',
            'tab10', 'tab20', 'tab20b', 'tab20c'
        ],
        'miscellaneous': [
            'flag', 'prism', 'ocean', 'gist_earth', 'terrain', 'gist_stern',
            'gnuplot', 'gnuplot2', 'CMRmap', 'cubehelix', 'brg',
            'gist_rainbow', 'rainbow', 'jet', 'turbo', 'nipy_spectral',
            'gist_ncar'
        ]
    }
    
    # Filter to only include available colormaps
    available_categories = {}
    for category, cmap_names in categories.items():
        available_categories[category] = [name for name in cmap_names if name in all_cmaps]
    
    return available_categories


def extract_colormap_data(cmap_name, num_points=256):
    """Extract RGB data from a matplotlib colormap."""
    try:
        cmap = plt.get_cmap(cmap_name)
        
        # Generate colors at specified resolution
        colors = []
        for i in range(num_points):
            t = i / (num_points - 1)  # 0 to 1
            rgba = cmap(t)
            # Convert to RGB (0-1 range) and round to reasonable precision
            rgb = {
                'r': round(rgba[0], 6),
                'g': round(rgba[1], 6), 
                'b': round(rgba[2], 6)
            }
            colors.append(rgb)
        
        return {
            'name': cmap_name,
            'colors': colors,
            'metadata': {
                'source': 'matplotlib',
                'num_points': num_points,
                'type': 'continuous'
            }
        }
    except Exception as e:
        print(f"Error extracting {cmap_name}: {e}")
        return None


def main():
    # Create output directories
    output_dir = Path("public/colormaps")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    license_dir = Path("LICENSE")
    license_dir.mkdir(exist_ok=True)
    
    # Get all colormaps
    categorized_cmaps = get_all_colormaps()
    
    all_colormaps = []
    extracted_count = 0
    
    print("Extracting matplotlib colormaps...")
    
    for category, cmap_names in categorized_cmaps.items():
        print(f"\n--- {category.upper()} ---")
        
        for cmap_name in cmap_names:
            print(f"Extracting {cmap_name}...", end=" ")
            
            colormap_data = extract_colormap_data(cmap_name)
            if colormap_data:
                # Add category to metadata
                colormap_data['metadata']['category'] = category
                
                # Save individual JSON file
                filename = f"{cmap_name}.json"
                filepath = output_dir / filename
                
                with open(filepath, 'w') as f:
                    json.dump(colormap_data, f, indent=2)
                
                all_colormaps.append(colormap_data)
                extracted_count += 1
                print("✓")
            else:
                print("✗")
    
    # Create index file with all colormaps
    index_data = {
        'colormaps': all_colormaps,
        'categories': categorized_cmaps,
        'metadata': {
            'total_count': extracted_count,
            'source': 'matplotlib',
            'extraction_date': str(np.datetime64('now')),
            'license': 'matplotlib license (see LICENSE/matplotlib.txt)'
        }
    }
    
    with open(output_dir / "index.json", 'w') as f:
        json.dump(index_data, f, indent=2)
    
    print(f"\n✓ Successfully extracted {extracted_count} colormaps")
    print(f"✓ Saved to {output_dir}/")
    print(f"✓ Created index file at {output_dir}/index.json")
    
    # Download matplotlib license
    print("\nDownloading matplotlib license...")
    try:
        import urllib.request
        license_url = "https://raw.githubusercontent.com/matplotlib/matplotlib/main/LICENSE/LICENSE"
        license_path = license_dir / "matplotlib.txt"
        
        urllib.request.urlretrieve(license_url, license_path)
        print(f"✓ Downloaded matplotlib license to {license_path}")
        
        # Create README for license folder
        readme_content = """# Licenses

## matplotlib.txt
This contains the license for matplotlib, which is the source of the colormap data used in this application.

The colormap data was extracted from matplotlib colormaps using matplotlib's public API.
All colormap data retains matplotlib's original licensing terms.

Source: https://github.com/matplotlib/matplotlib
License URL: https://raw.githubusercontent.com/matplotlib/matplotlib/main/LICENSE/LICENSE
"""
        
        with open(license_dir / "README.md", 'w') as f:
            f.write(readme_content)
        
        print(f"✓ Created license README at {license_dir}/README.md")
        
    except Exception as e:
        print(f"✗ Failed to download license: {e}")
        print("Please manually download the matplotlib license from:")
        print("https://raw.githubusercontent.com/matplotlib/matplotlib/main/LICENSE/LICENSE")


if __name__ == "__main__":
    main()
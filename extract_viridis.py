#!/usr/bin/env python3
# /// script
# dependencies = []
# ///
import urllib.request
import re

# Download the matplotlib source file
url = "https://raw.githubusercontent.com/matplotlib/matplotlib/3a8ad1d68a9f4a6f81cc2773619889154f5b6c57/lib/matplotlib/_cm_listed.py"
with urllib.request.urlopen(url) as response:
    content = response.read().decode('utf-8')

# Find the viridis data
lines = content.split('\n')
in_viridis = False
viridis_data = []

for line in lines:
    if '_viridis_data = [' in line:
        in_viridis = True
        # Extract any data on the same line
        start = line.find('[') + 1
        if start > 0:
            remainder = line[start:]
            # Look for RGB tuples
            matches = re.findall(r'\[([\d.]+),\s*([\d.]+),\s*([\d.]+)\]', remainder)
            for match in matches:
                r, g, b = map(float, match)
                viridis_data.append((r, g, b))
        continue
    
    if in_viridis and line.strip() == ']':
        break
    
    if in_viridis:
        # Extract RGB tuples from this line
        matches = re.findall(r'\[([\d.]+),\s*([\d.]+),\s*([\d.]+)\]', line)
        for match in matches:
            r, g, b = map(float, match)
            viridis_data.append((r, g, b))

# Generate TypeScript
print("const officialViridisColors: RGB[] = [")
for i, (r, g, b) in enumerate(viridis_data):
    if i < len(viridis_data) - 1:
        print(f"  {{r: {r}, g: {g}, b: {b}}},")
    else:
        print(f"  {{r: {r}, g: {g}, b: {b}}}")
print("];")

print(f"\n// Found {len(viridis_data)} colors")
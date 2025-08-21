# viscm-web Development Guide

A TypeScript implementation of colormap visualization functionality inspired by the [viscm package](https://github.com/matplotlib/viscm).

## Development Server

The development server is already running via `npm run dev`. Changes will be automatically reflected in the browser.

## Architecture Principles

### Library-First Approach
**Always prefer existing libraries over custom implementations** to keep the codebase simple and reliable:

- **Color Science**: Use `color.js` for color space conversions and perceptual calculations (deltaE 2000)
- **Statistics**: Use `simple-statistics` for mathematical operations like RMS calculations
- **Array Operations**: Use `d3-array` for data manipulation (pairs, sum, min, max, etc.)
- **Visualization**: Use `Plotly.js` for interactive plots and 3D visualizations
- **Color Blindness**: Use `@bjornlu/colorblind` for accurate simulations

### Project Structure
```
src/
├── colormaps.ts     # Colormap data (official matplotlib sources)
├── analysis.ts      # Color analysis functions using libraries
├── visualizations.ts # Plotting functions using Plotly.js
├── main.ts          # Main application with CSS Grid layout
└── types.ts         # TypeScript interfaces
```

## Key Implementation Notes

### Color Analysis
- Use `deltaE 2000` for accurate perceptual color differences
- Convert colors through L*a*b* space for proper analysis
- Leverage `d3.pairs()` for adjacent color calculations
- Use library statistics functions instead of manual calculations

### Colormap Data
- Use official matplotlib colormap data extracted from source
- Extract via Python script with `uv` for consistency
- 256-point resolution for smooth analysis

### Visualization Layout
- CSS Grid layout matching viscm's 4x10 structure
- Responsive design with proper canvas sizing
- Plotly.js for interactive derivative plots and 3D color space

## Development Workflow

### Making Changes
1. Edit source files - dev server will auto-reload
2. Test visualizations for accuracy vs viscm reference
3. Ensure derivative plots show expected patterns (flat for uniform colormaps)
4. Commit regularly with descriptive messages

### Adding New Colormaps
1. Extract official data using Python script pattern
2. Add to `colormaps.ts` with proper typing
3. Update colormap selector in `main.ts`

### Color Analysis Functions
- Always use established color science libraries
- Prefer L*a*b* color space for perceptual accuracy
- Use deltaE 2000 for color difference calculations
- Leverage d3-array for data transformations

## Build and Deployment
```bash
npm run build    # Creates dist/ folder
npm run preview  # Preview production build
```

## Testing
- Visual comparison with viscm reference plots
- Verify derivative plots show expected uniformity patterns
- Test color blindness simulations for accuracy
- Check 3D color space visualizations match L*a*b* coordinates

## Accuracy Requirements

### Color Blindness Simulation
**CRITICAL**: Always use proper color vision deficiency simulation libraries, never simplified approximations.

- **Required**: Use `@bjornlu/colorblind` library for all colorblind simulations
- **Forbidden**: Manual RGB matrix transformations or simplified blending approaches
- **Reason**: Scientific accuracy is essential for colormap accessibility analysis
- **Implementation**: Use `simulate(rgb, 'deuteranopia')` etc. from the library

### Color Science Calculations
- **Required**: Use established color science libraries (`color.js`)
- **Required**: Use proper color space conversions (L*a*b*, deltaE 2000)
- **Forbidden**: Custom color distance approximations
- **Reason**: Perceptual accuracy is fundamental to colormap evaluation

## Best Practices
- Keep implementations simple using proven libraries
- Regular git commits during development
- Use TypeScript for type safety
- Follow existing code patterns and naming conventions
- Prioritize accuracy over custom implementations
- **Always prefer library implementations over manual calculations**
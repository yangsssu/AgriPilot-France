AgriPilot France - Digital Twin of French Agriculture

👨‍💻 Author
Yang Su
Institution: École Normale Supérieure - PSL
Contact: yang.su@ens.fr

AgriPilot France is an interactive desktop application designed to simulate and analyze agricultural scenarios across the diverse regions of France. Serving as a "Digital Twin," it allows farmers, students, and policymakers to explore the economic and ecological impacts of various farming decisions under fluctuating climate conditions.

🎯 What is this for?

This software is built to bridge the gap between agronomic data and decision-making. It calibrates data using models from Agreste (French Ministry of Agriculture statistics) and Cerfrance, providing a realistic sandbox to:

Estimate Yields: Based on regional soil quality and crop specifications.

Analyze Economics: Calculate gross income, subsidies (PAC), and operational costs to determine net margins.

Assess Risks: Visualize the impact of drought, floods, and diseases (e.g., Late Blight, Fusarium).

Compare Practices: Evaluate the trade-offs between Conventional, Organic (AB), Conservation (ACS), and Precision farming.

🚀 How to Use

Select a Region: Click on the interactive map or the list to choose one of the 12 French regions (e.g., Hauts-de-France for beets, Nouvelle-Aquitaine for corn).

Choose a Crop: Select from major crops like Winter Wheat, Barley, Corn, Sunflower, Rapeseed, Sugar Beet, or Potatoes.

Define Practice: Switch between farming methods (Standard, Precision, HVE, Conservation, Organic) to see how costs and eco-scores change.

Set Climate Scenario: Toggle between Normal, Drought, or Excess Rain to test crop resilience.

Analyze Results:

View key metrics: Yield (t/ha), Net Margin (€/ha), and Eco-Score.

Check the "Economic Breakdown" chart for detailed cost structures.

Use the "Regional Profitability Comparison" at the bottom to see how the selected crop performs across France.




Select your region:
<img width="1674" height="1082" alt="image" src="https://github.com/user-attachments/assets/b9a57ed6-aac6-4892-8a92-2063eea22bd7" />

Choose your crop species, climate scenario and farming practice:
<img width="2239" height="1142" alt="image" src="https://github.com/user-attachments/assets/02263b64-dce4-4f5e-b58a-404cbc1644ee" />

Check the details:
<img width="2224" height="858" alt="image" src="https://github.com/user-attachments/assets/848bd690-a23e-4d16-bf10-a6a69df0b413" />


🛠️ Technical Details: React + TypeScript + Vite

This project is built using a modern web stack packaged for desktop via Electron.

React + TypeScript + Vite Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

@vitejs/plugin-react uses Babel (or oxc when used in rolldown-vite) for Fast Refresh

@vitejs/plugin-react-swc uses SWC for Fast Refresh

React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see this documentation.

Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])


You can also install eslint-plugin-react-x and eslint-plugin-react-dom for React-specific lint rules:

// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])


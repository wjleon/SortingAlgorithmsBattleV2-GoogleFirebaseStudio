# **App Name**: SortVisualizer

## Core Features:

- Algorithm Selection: Two independent dropdown menus to select sorting algorithms for the left and right panels.
- Element Count Input: A numeric input field to specify the number of elements (bars) to be sorted, with validation to ensure it's within the allowed range (10-200).
- Distribution Selection: A radio button group to select the initial distribution of elements (Random, Ascending, Descending, Split Ascending, Split Descending).
- Animation Controls: Control buttons to start, pause, and reset the sorting animation. Buttons are disabled appropriately based on the animation state.
- Audio Feedback Toggle: A toggle button to enable or disable audio feedback during the sorting process.
- Animation Speed Control: A slider to adjust the animation speed.
- Metrics Display: Real-time display of metrics (number of comparisons, time elapsed) for each algorithm, and a completion message upon finishing.

## Style Guidelines:

- Primary color: Slate Blue (#708090) provides a calm and sophisticated feel.
- Background color: Very light gray (#F0F0F0) offers a clean and unobtrusive backdrop.
- Accent color: Soft orange (#FFB347) for highlighting active elements or controls, drawing attention without overwhelming the user.
- Body and headline font: 'Inter' sans-serif font to ensure clear and readable text, contributing to a modern and functional UI.
- Simple, geometric icons for controls (play, pause, reset, sound) for clarity and ease of use.
- Two-panel layout for simultaneous visualization of sorting algorithms. Responsive design adapts to different screen sizes.
- Smooth CSS transitions for bar swaps and updates to clearly visualize the sorting process. Highlight bars being compared.
# SortVisualizer

SortVisualizer is a Next.js web application that allows users to visualize various sorting algorithms operating side-by-side on the same dataset. Users can configure the number of elements, their initial distribution, select different algorithms for comparison, control animation speed, and toggle audio feedback.

> **Note**: This repository is part of the blog post ["What a Comeback: Google Firebase Studio Strikes Back This Time, Lovable Still Performs Flawlessly"](https://medium.com/@wjleon/what-a-comeback-google-firebase-studio-strikes-back-this-time-lovable-still-performs-flawlessly-cc9aafabaf6c) on Medium.

## Features

-   **Dual Visualization Panels**: Compare two sorting algorithms simultaneously.
-   **Algorithm Selection**: Choose from a wide range of sorting algorithms for each panel.
-   **Configurable Dataset**:
    -   Set the number of elements (10-200).
    -   Choose the initial distribution (Random, Sorted Ascending/Descending, Split Ascending/Descending).
-   **Animation Controls**: Start, Pause, and Reset sorting animations.
-   **Speed Control**: Adjust animation speed with a slider.
-   **Audio Feedback**: Optional sound cues for comparisons and swaps.
-   **Real-time Metrics**: Track comparisons and time elapsed for each algorithm.
-   **Responsive Design**: Adapts to various screen sizes.

## Tech Stack

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   Shadcn/ui components
-   Lucide React Icons
-   Web Audio API (for sound effects)

## Getting Started

### Prerequisites

-   Node.js (version 18.x or later recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd SortVisualizer
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running the Development Server

To run the application locally:

```bash
npm run dev
# or
# yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal, typically 9002 if using the provided `dev` script) in your browser to see the application.

## Project Structure

-   `src/app/`: Main application pages and layout.
-   `src/components/`: Reusable UI components.
    -   `config/`: Components for global configuration controls.
    -   `visualization/`: Components for the sorting visualization area.
    -   `ui/`: Shadcn/ui components.
-   `src/hooks/`: Custom React hooks for managing state and logic.
-   `src/lib/`: Utility functions.
-   `src/config/`: Application-wide constants (algorithm names, defaults).
-   `src/types/`: TypeScript type definitions.
-   `src/utils/`:
    -   `arrayGenerator.ts`: Functions for generating initial arrays.
    -   `sortingAlgorithms/`: Implementations of sorting algorithms.
    -   `sortingAlgorithmMap.ts`: Mapping algorithm names to functions.

## Deployment

This application is designed to be deployed as a static site on platforms like Vercel or Netlify.
To build the application for production:
```bash
npm run build
```
This will create an optimized production build in the `.next` folder.

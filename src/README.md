# CancerCure (CC) | Tri-Stream Melanoma AI Diagnostic System

A sleek, high-fidelity responsive landing page replication of **CancerCure (CC)**, featuring interactive genetic analytics, timeline navigation, real-time heart rate scanning visualizations, and custom laboratory finding modules.

---

## 🎨 Design Philosophy & Aesthetic Core
- **Space Grotesk & Inter**: Bold geometric sans display headings paired with highly legible, modern body copy.
- **JetBrains Mono**: Used for clinical parameters, index numbers, telemetry statistics, and systemic badges.
- **Interactive 3D Elements**:
  - **3D Canvas DNA Helix**: High-performance interactive vertical particle helix on the hero header responsive to pointer coordinate updates.
  - **Concentric Diagnostics Path**: Clickable nested concentric loops isolating target medical analysis phases.
  - **3D Interactive business card**: Contact card utilizing 2.5D mouse-coordinate vector perspectives.
- **Micro Audio Synths**: Integrated synthesized clinical chimes (`AudioEngine.ts` utilizing native HTML5 Web Audio oscillators) for physical mouse-hover or selection triggers.

---

## 🛠️ Tech Stack & Setup
- **Framework**: React 19 + TypeScript (Fully Type-Safe)
- **Bundler & Build**: Vite + Tailwind CSS v4
- **Animation Engine**: `motion` (`motion/react`) for smooth spring vectors and slide layouts.

### 🏃 Local Launch Instructions
1. **Clone the project & run in directory**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application launches instantly at `http://localhost:3000`.

3. **Build production static assets**:
   ```bash
   npm run build
   ```

---

## ⚙️ Customizing Animation Timings

Animation sequences and speed intervals can be modified as follows:

1. **Varying DNA Helix Speed**:
   Adjust the `speed` prop on `<DNAHelixCanvas speed={1.1} />` inside `src/components/Hero.tsx`.
2. **Ticker Loop Rates**:
   Modify the animation timing inside `src/index.css` under `.animate-infinite-scroll` (currently configured at `40s` for elegant, slower text-pacing).
   ```css
   .animate-infinite-scroll {
     animation: infinite-scroll 40s linear infinite;
   }
   ```
3. **Oscilloscope Wave intervals**:
   Adjust the cycle duration (`period = 55`) inside the `ecgWaveform` generator function in `src/components/Visualizer.tsx` to accelerate or decelerate heartrate visual cycles.

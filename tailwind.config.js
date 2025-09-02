/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'neutral-light': '#f5f5f5',
        'neutral-dark': '#22223b',
        'primary': '#2563eb',
        'secondary': '#64748b',
        'fitness-green': '#32cd32',
        'fitness-blue': '#1e90ff',
        'fitness-orange': '#ff8c00',
        'fitness-pink': '#ff4f81',
        'fitness-dark': '#18181b',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, #1e90ff 0%, #32cd32 50%, #ff8c00 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'pulse-heart': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        "fade-in-0": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-0": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-1": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-1": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-2": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-2": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-3": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-3": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-4": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-4": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-5": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-5": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-6": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-6": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-7": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-7": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-8": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-8": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-9": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-9": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-10": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-10": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-11": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-11": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-12": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out-12": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in-from-top-1": {
          "0%": { transform: "translateY(-0.25rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-2": {
          "0%": { transform: "translateY(-0.5rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-3": {
          "0%": { transform: "translateY(-0.75rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-4": {
          "0%": { transform: "translateY(-1rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-5": {
          "0%": { transform: "translateY(-1.25rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-6": {
          "0%": { transform: "translateY(-1.5rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-7": {
          "0%": { transform: "translateY(-1.75rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-8": {
          "0%": { transform: "translateY(-2rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-9": {
          "0%": { transform: "translateY(-2.25rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-10": {
          "0%": { transform: "translateY(-2.5rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-11": {
          "0%": { transform: "translateY(-2.75rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-top-12": {
          "0%": { transform: "translateY(-3rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-1": {
          "0%": { transform: "translateY(0.25rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-2": {
          "0%": { transform: "translateY(0.5rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-3": {
          "0%": { transform: "translateY(0.75rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-4": {
          "0%": { transform: "translateY(1rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-5": {
          "0%": { transform: "translateY(1.25rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-6": {
          "0%": { transform: "translateY(1.5rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-7": {
          "0%": { transform: "translateY(1.75rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-8": {
          "0%": { transform: "translateY(2rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-9": {
          "0%": { transform: "translateY(2.25rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-10": {
          "0%": { transform: "translateY(2.5rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-11": {
          "0%": { transform: "translateY(2.75rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-12": {
          "0%": { transform: "translateY(3rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left-1": {
          "0%": { transform: "translateX(-0.25rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-2": {
          "0%": { transform: "translateX(-0.5rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-3": {
          "0%": { transform: "translateX(-0.75rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-4": {
          "0%": { transform: "translateX(-1rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-5": {
          "0%": { transform: "translateX(-1.25rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-6": {
          "0%": { transform: "translateX(-1.5rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-7": {
          "0%": { transform: "translateX(-1.75rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-8": {
          "0%": { transform: "translateX(-2rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-9": {
          "0%": { transform: "translateX(-2.25rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-10": {
          "0%": { transform: "translateX(-2.5rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-11": {
          "0%": { transform: "translateX(-2.75rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left-12": {
          "0%": { transform: "translateX(-3rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-1": {
          "0%": { transform: "translateX(0.25rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-2": {
          "0%": { transform: "translateX(0.5rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-3": {
          "0%": { transform: "translateX(0.75rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-4": {
          "0%": { transform: "translateX(1rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-5": {
          "0%": { transform: "translateX(1.25rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-6": {
          "0%": { transform: "translateX(1.5rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-7": {
          "0%": { transform: "translateX(1.75rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-8": {
          "0%": { transform: "translateX(2rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-9": {
          "0%": { transform: "translateX(2.25rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-10": {
          "0%": { transform: "translateX(2.5rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-11": {
          "0%": { transform: "translateX(2.75rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-12": {
          "0%": { transform: "translateX(3rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "zoom-in-50": {
          "0%": { transform: "scale(0.5)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-75": {
          "0%": { transform: "scale(0.75)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-90": {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-95": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-100": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-105": {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-110": {
          "0%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-125": {
          "0%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-in-150": {
          "0%": { transform: "scale(1.5)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-out-50": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.5)" },
        },
        "zoom-out-75": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.75)" },
        },
        "zoom-out-90": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.9)" },
        },
        "zoom-out-95": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.95)" },
        },
        "zoom-out-100": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-out-105": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        "zoom-out-110": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
        "zoom-out-125": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.25)" },
        },
        "zoom-out-150": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.5)" },
        },
        "spin-1": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-2": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-3": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-4": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-5": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-6": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-7": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-8": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-9": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-10": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-11": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-12": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "ping-1": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-2": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-3": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-4": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-5": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-6": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-7": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-8": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-9": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-10": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-11": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "ping-12": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "bounce-1": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-2": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-3": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-4": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-5": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-6": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-7": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-8": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-9": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-10": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-11": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "bounce-12": {
          "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-in',
        'pulse-heart': 'pulse-heart 1s infinite',
        "fade-in-0": "fade-in-0 0.5s ease-out",
        "fade-out-0": "fade-out-0 0.5s ease-in",
        "fade-in-1": "fade-in-1 0.5s ease-out",
        "fade-out-1": "fade-out-1 0.5s ease-in",
        "fade-in-2": "fade-in-2 0.5s ease-out",
        "fade-out-2": "fade-out-2 0.5s ease-in",
        "fade-in-3": "fade-in-3 0.5s ease-out",
        "fade-out-3": "fade-out-3 0.5s ease-in",
        "fade-in-4": "fade-in-4 0.5s ease-out",
        "fade-out-4": "fade-out-4 0.5s ease-in",
        "fade-in-5": "fade-in-5 0.5s ease-out",
        "fade-out-5": "fade-out-5 0.5s ease-in",
        "fade-in-6": "fade-in-6 0.5s ease-out",
        "fade-out-6": "fade-out-6 0.5s ease-in",
        "fade-in-7": "fade-in-7 0.5s ease-out",
        "fade-out-7": "fade-out-7 0.5s ease-in",
        "fade-in-8": "fade-in-8 0.5s ease-out",
        "fade-out-8": "fade-out-8 0.5s ease-in",
        "fade-in-9": "fade-in-9 0.5s ease-out",
        "fade-out-9": "fade-out-9 0.5s ease-in",
        "fade-in-10": "fade-in-10 0.5s ease-out",
        "fade-out-10": "fade-out-10 0.5s ease-in",
        "fade-in-11": "fade-in-11 0.5s ease-out",
        "fade-out-11": "fade-out-11 0.5s ease-in",
        "fade-in-12": "fade-in-12 0.5s ease-out",
        "fade-out-12": "fade-out-12 0.5s ease-in",
        "slide-in-from-top-1": "slide-in-from-top-1 0.5s ease-out",
        "slide-in-from-top-2": "slide-in-from-top-2 0.5s ease-out",
        "slide-in-from-top-3": "slide-in-from-top-3 0.5s ease-out",
        "slide-in-from-top-4": "slide-in-from-top-4 0.5s ease-out",
        "slide-in-from-top-5": "slide-in-from-top-5 0.5s ease-out",
        "slide-in-from-top-6": "slide-in-from-top-6 0.5s ease-out",
        "slide-in-from-top-7": "slide-in-from-top-7 0.5s ease-out",
        "slide-in-from-top-8": "slide-in-from-top-8 0.5s ease-out",
        "slide-in-from-top-9": "slide-in-from-top-9 0.5s ease-out",
        "slide-in-from-top-10": "slide-in-from-top-10 0.5s ease-out",
        "slide-in-from-top-11": "slide-in-from-top-11 0.5s ease-out",
        "slide-in-from-top-12": "slide-in-from-top-12 0.5s ease-out",
        "slide-in-from-bottom-1": "slide-in-from-bottom-1 0.5s ease-out",
        "slide-in-from-bottom-2": "slide-in-from-bottom-2 0.5s ease-out",
        "slide-in-from-bottom-3": "slide-in-from-bottom-3 0.5s ease-out",
        "slide-in-from-bottom-4": "slide-in-from-bottom-4 0.5s ease-out",
        "slide-in-from-bottom-5": "slide-in-from-bottom-5 0.5s ease-out",
        "slide-in-from-bottom-6": "slide-in-from-bottom-6 0.5s ease-out",
        "slide-in-from-bottom-7": "slide-in-from-bottom-7 0.5s ease-out",
        "slide-in-from-bottom-8": "slide-in-from-bottom-8 0.5s ease-out",
        "slide-in-from-bottom-9": "slide-in-from-bottom-9 0.5s ease-out",
        "slide-in-from-bottom-10": "slide-in-from-bottom-10 0.5s ease-out",
        "slide-in-from-bottom-11": "slide-in-from-bottom-11 0.5s ease-out",
        "slide-in-from-bottom-12": "slide-in-from-bottom-12 0.5s ease-out",
        "slide-in-from-left-1": "slide-in-from-left-1 0.5s ease-out",
        "slide-in-from-left-2": "slide-in-from-left-2 0.5s ease-out",
        "slide-in-from-left-3": "slide-in-from-left-3 0.5s ease-out",
        "slide-in-from-left-4": "slide-in-from-left-4 0.5s ease-out",
        "slide-in-from-left-5": "slide-in-from-left-5 0.5s ease-out",
        "slide-in-from-left-6": "slide-in-from-left-6 0.5s ease-out",
        "slide-in-from-left-7": "slide-in-from-left-7 0.5s ease-out",
        "slide-in-from-left-8": "slide-in-from-left-8 0.5s ease-out",
        "slide-in-from-left-9": "slide-in-from-left-9 0.5s ease-out",
        "slide-in-from-left-10": "slide-in-from-left-10 0.5s ease-out",
        "slide-in-from-left-11": "slide-in-from-left-11 0.5s ease-out",
        "slide-in-from-left-12": "slide-in-from-left-12 0.5s ease-out",
        "slide-in-from-right-1": "slide-in-from-right-1 0.5s ease-out",
        "slide-in-from-right-2": "slide-in-from-right-2 0.5s ease-out",
        "slide-in-from-right-3": "slide-in-from-right-3 0.5s ease-out",
        "slide-in-from-right-4": "slide-in-from-right-4 0.5s ease-out",
        "slide-in-from-right-5": "slide-in-from-right-5 0.5s ease-out",
        "slide-in-from-right-6": "slide-in-from-right-6 0.5s ease-out",
        "slide-in-from-right-7": "slide-in-from-right-7 0.5s ease-out",
        "slide-in-from-right-8": "slide-in-from-right-8 0.5s ease-out",
        "slide-in-from-right-9": "slide-in-from-right-9 0.5s ease-out",
        "slide-in-from-right-10": "slide-in-from-right-10 0.5s ease-out",
        "slide-in-from-right-11": "slide-in-from-right-11 0.5s ease-out",
        "slide-in-from-right-12": "slide-in-from-right-12 0.5s ease-out",
        "zoom-in-50": "zoom-in-50 0.5s ease-out",
        "zoom-in-75": "zoom-in-75 0.5s ease-out",
        "zoom-in-90": "zoom-in-90 0.5s ease-out",
        "zoom-in-95": "zoom-in-95 0.5s ease-out",
        "zoom-in-100": "zoom-in-100 0.5s ease-out",
        "zoom-in-105": "zoom-in-105 0.5s ease-out",
        "zoom-in-110": "zoom-in-110 0.5s ease-out",
        "zoom-in-125": "zoom-in-125 0.5s ease-out",
        "zoom-in-150": "zoom-in-150 0.5s ease-out",
        "zoom-out-50": "zoom-out-50 0.5s ease-in",
        "zoom-out-75": "zoom-out-75 0.5s ease-in",
        "zoom-out-90": "zoom-out-90 0.5s ease-in",
        "zoom-out-95": "zoom-out-95 0.5s ease-in",
        "zoom-out-100": "zoom-out-100 0.5s ease-in",
        "zoom-out-105": "zoom-out-105 0.5s ease-in",
        "zoom-out-110": "zoom-out-110 0.5s ease-in",
        "zoom-out-125": "zoom-out-125 0.5s ease-in",
        "zoom-out-150": "zoom-out-150 0.5s ease-in",
        "spin-1": "spin-1 1s linear infinite",
        "spin-2": "spin-2 1s linear infinite",
        "spin-3": "spin-3 1s linear infinite",
        "spin-4": "spin-4 1s linear infinite",
        "spin-5": "spin-5 1s linear infinite",
        "spin-6": "spin-6 1s linear infinite",
        "spin-7": "spin-7 1s linear infinite",
        "spin-8": "spin-8 1s linear infinite",
        "spin-9": "spin-9 1s linear infinite",
        "spin-10": "spin-10 1s linear infinite",
        "spin-11": "spin-11 1s linear infinite",
        "spin-12": "spin-12 1s linear infinite",
        "ping-1": "ping-1 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-2": "ping-2 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-3": "ping-3 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-4": "ping-4 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-5": "ping-5 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-6": "ping-6 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-7": "ping-7 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-8": "ping-8 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-9": "ping-9 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-10": "ping-10 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-11": "ping-11 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-12": "ping-12 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "bounce-1": "bounce-1 1s infinite",
        "bounce-2": "bounce-2 1s infinite",
        "bounce-3": "bounce-3 1s infinite",
        "bounce-4": "bounce-4 1s infinite",
        "bounce-5": "bounce-5 1s infinite",
        "bounce-6": "bounce-6 1s infinite",
        "bounce-7": "bounce-7 1s infinite",
        "bounce-8": "bounce-8 1s infinite",
        "bounce-9": "bounce-9 1s infinite",
        "bounce-10": "bounce-10 1s infinite",
        "bounce-11": "bounce-11 1s infinite",
        "bounce-12": "bounce-12 1s infinite",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}


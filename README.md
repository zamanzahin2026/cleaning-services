# AuraClean - Premium Cleaning Services

A production-quality, responsive single-page marketing website built for **AuraClean**, a home and commercial office cleaning company based in San Francisco, CA.

## ✨ Features

- **Fluid Modern Design System**: Built with custom design tokens, fluid typography (`clamp()`), and responsive layouts.
- **Micro-Animations & Smooth Motion**:
  - Lenis smooth momentum scrolling.
  - GSAP 3 + ScrollTrigger for `BlurCharReveal` headings, clip-path image reveals, and staggered card entrances.
  - Hero collage with continuous sine floating, mouse cursor parallax, and scroll parallax.
- **Interactive Components**:
  - **Before & After Slider**: Interactive vertical split comparison slider with touch-action isolation, mouse drag, and keyboard arrow controls.
  - **Services Dark Carousel**: Swiper 11 carousel with momentum drag and pagination.
  - **Testimonials Carousel**: Synchronized with a live 2px progress bar track.
  - **Continuous Routine Marquee**: Infinite linear photography strip with hover pause.
  - **Transparent Pricing Rows**: Lift-on-hover interaction with button state swap.
- **Supabase Integration**:
  - Live client-side booking submissions linked directly to Supabase (`bookings` table).
  - Instant toast notification and client-side form validation.
  - Database schema with Row Level Security (RLS) included in `supabase_schema.sql`.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS (`styles.css`), Vanilla JavaScript (`main.js`)
- **Libraries**:
  - [GSAP 3](https://greensock.com/gsap/) + ScrollTrigger
  - [Lenis](https://lenis.darkroom.engineering/)
  - [Swiper 11](https://swiperjs.com/)
  - [Lucide Icons](https://lucide.dev/)
  - [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction)
- **Deployment**: [Vercel](https://vercel.com/) with GitHub Continuous Deployment

## 🗄️ Supabase Setup

To initialize the database table for bookings:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/oujjldbyjzofzbjecxwx).
2. Go to **SQL Editor** -> **New Query**.
3. Paste the contents of `supabase_schema.sql` and click **Run**.

## 🚀 Local Development

```bash
# Serve locally using any static file server
npx serve .
# or
python -m http.server 8080
```

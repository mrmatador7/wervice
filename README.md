# Wervice - Moroccan Wedding Planning

A modern, multilingual wedding planning platform specializing in authentic Moroccan weddings. Discover and book traditional Moroccan wedding services including venues, catering, photography, henna ceremonies, and more.

## 🌟 Features

- **Multilingual Support**: Full internationalization with English, French, and Arabic
- **Traditional Moroccan Services**: Venues, catering, photography, henna ceremonies, decor, music, and dresses
- **Location-Based Search**: Find services in Marrakech, Casablanca, Agadir, Tangier, Rabat, and Fes
- **Featured Deals**: Exclusive discounts on premium wedding packages
- **Premium Membership**: Advanced planning tools and priority vendor access
- **Responsive Design**: Optimized for all devices
- **Modern UI**: Clean, elegant interface with Moroccan-inspired design elements

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Fonts**: Rubik (English/French), Readex Pro (Arabic), Allan (decorative)
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wervice
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌍 Supported Languages

- **English (en)**: `/en` or `/`
- **Français (fr)**: `/fr`
- **العربية (ar)**: `/ar`

## 📁 Project Structure

```
wervice/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # Root layout with i18n
│   │   │   ├── page.tsx           # Home page
│   │   │   └── home/
│   │   │       └── components/    # Home page components
│   │   └── globals.css           # Global styles & fonts
│   ├── components/
│   │   ├── layout/               # Header, Footer
│   │   └── ui/                   # Reusable UI components
│   ├── lib/
│   │   ├── constants.ts          # App constants
│   │   ├── i18n.ts              # i18n configuration
│   │   └── utils.ts             # Utility functions
│   └── models/
│       └── types.ts             # TypeScript types
├── messages/                     # Translation files
│   ├── en.json
│   ├── fr.json
│   └── ar.json
└── public/                      # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Fonts
- **English/French**: Rubik (sans-serif)
- **Arabic**: Readex Pro (optimized for Arabic text)
- **Decorative**: Allan (headings, accents)

### Colors
- **Primary**: Lime (#d9ff0a)
- **Text**: Black (#000000)
- **Background**: White/gray tones

### Components
- Modern card-based layouts
- Responsive grid systems
- Interactive search interface
- Moroccan pattern backgrounds

## 🌐 Internationalization

The app uses next-intl for internationalization with:

- Client-side language switching
- Server-side rendering support
- Automatic locale detection
- Fallback to English for missing translations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Manual Build

```bash
npm run build
npm run start
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Moroccan wedding traditions and cultural elements
- Next.js and Vercel for the amazing framework and platform
- The open-source community for the tools and libraries used

---

Built with ❤️ for authentic Moroccan weddings

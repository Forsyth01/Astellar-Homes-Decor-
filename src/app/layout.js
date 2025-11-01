import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Better for performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// SEO Metadata - Comprehensive for Astellar Homes & Decor
export const metadata = {
  title: {
    default: "Astellar Homes & Decor | Beautiful Interior Design & Home Styling",
    template: "%s | Astellar Homes & Decor"
  },
  description: "Transform your space with Astellar Homes & Decor. Discover interior design inspiration, home styling tips, DIY projects, and eco-friendly living ideas. Create beautiful, comfortable spaces that feel like home.",
  keywords: [
    "interior design", "home decor", "home styling", "DIY home projects", 
    "home renovation", "interior styling", "home organization", "eco-friendly living",
    "home inspiration", "decorating tips", "home makeover", "living room design",
    "bedroom decor", "kitchen design", "home office setup", "sustainable living"
  ].join(", "),
  authors: [{ name: "Astellar Homes & Decor" }],
  creator: "Astellar Homes & Decor",
  publisher: "Astellar Homes & Decor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://astellarhomes.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Astellar Homes & Decor | Beautiful Interior Design & Home Styling",
    description: "Transform your space with beautiful interior design ideas, home styling tips, and eco-friendly living inspiration.",
    url: 'https://astellarhomes.com',
    siteName: 'Astellar Homes & Decor',
    images: [
      {
        url: '/og-image.jpg', // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Astellar Homes & Decor - Beautiful Interior Design',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Astellar Homes & Decor | Interior Design Inspiration",
    description: "Beautiful home decor ideas, styling tips, and interior design inspiration.",
    creator: '@astellarhomes', // Replace with your Twitter handle
    images: ['/twitter-image.jpg'], // Create this image (1200x600px)
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

// Structured data for organization
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Astellar Homes & Decor',
  description: 'Professional interior design and home styling services',
  url: 'https://astellarhomes.com',
  logo: 'https://astellarhomes.com/logo.png',
  sameAs: [
    // Add your social media profiles
    // 'https://www.facebook.com/astellarhomes',
    // 'https://www.instagram.com/astellarhomes',
    // 'https://www.pinterest.com/astellarhomes',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '', // Add your phone number
    contactType: 'customer service',
    areaServed: 'US', // Adjust based on your service area
    availableLanguage: 'en',
  },
  address: {
    '@type': 'PostalAddress',
    // Add your address if applicable
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Peralta&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" 
          rel="stylesheet"
        />
        
        {/* Favicon & App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color for Mobile */}
        <meta name="theme-color" content="#F59E0B" />
        <meta name="msapplication-TileColor" content="#F59E0B" />
        
        {/* Viewport Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Geo and Location Meta */}
        <meta name="geo.region" content="US" /> {/* Adjust based on your location */}
        <meta name="geo.placename" content="City, State" /> {/* Add your location */}
        <meta name="geo.position" content="latitude;longitude" /> {/* Add coordinates if applicable */}
        <meta name="ICBM" content="latitude, longitude" /> {/* Add coordinates if applicable */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {/* <Navbar /> */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Schema Markup for WebPage */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: 'Astellar Homes & Decor',
                description: 'Interior design inspiration and home styling tips',
                url: 'https://astellarhomes.com',
                publisher: {
                  '@type': 'Organization',
                  name: 'Astellar Homes & Decor'
                }
              })
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
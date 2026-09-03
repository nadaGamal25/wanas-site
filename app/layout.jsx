import './globals.css'
import { LocaleProvider } from '../context/LocaleContext'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'وَنَس | Wanas',
  description: 'قطع يدوية مميزة من الديكور والإكسسوارات — Handmade decor & accessories',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Tajawal:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LocaleProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}

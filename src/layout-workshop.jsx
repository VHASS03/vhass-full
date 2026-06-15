import './globals.css'

export const metadata = {
  title: 'VHASS Workshops',
  description: 'VHASS Softwares - Cybersecurity and Entrepreneurship Workshops',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
} 
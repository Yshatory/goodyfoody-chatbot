export const metadata = {
  title: 'The Goody Foody - Customer Service',
  description: 'Chat with us',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}

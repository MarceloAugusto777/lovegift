import type { Metadata } from 'next'

interface GiftParams {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: GiftParams): Promise<Metadata> {
  const { slug } = await params

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/gifts?slug=${slug}`, { cache: 'no-store' })
    const data = await res.json()

    if (!data.success || !data.gift) {
      return {
        title: 'LoveGift — Presente não encontrado',
        description: 'Este presente não existe ou foi removido.',
      }
    }

    const gift = data.gift
    const title = `${gift.coupleName} — LoveGift`
    const description = gift.message
      ? gift.message.substring(0, 155) + (gift.message.length > 155 ? '...' : '')
      : `Presente personalizado de ${gift.coupleName}. Uma história de amor criada com carinho.`

    const firstPhoto = (() => {
      try {
        const photos = typeof gift.photos === 'string' ? JSON.parse(gift.photos) : gift.photos
        return photos?.[0] || null
      } catch { return null }
    })()

    const ogImage = firstPhoto || `${baseUrl}/og-default.png`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/gift/${slug}`,
        siteName: 'LoveGift',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${gift.coupleName} — LoveGift`,
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  } catch {
    return {
      title: 'LoveGift',
      description: 'Presentes personalizados com amor.',
    }
  }
}

export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StatVidya Workforce Intelligence',
    short_name: 'StatVidya',
    description: 'Workforce competency assessment and intelligence platform for MoSPI',
    start_url: '/',
    display: 'standalone',
    background_color: '#F2E6D8',
    theme_color: '#555934',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

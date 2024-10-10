import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { width = 300, height = 200 } = req.query

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#CCCCCC"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#666666" text-anchor="middle" dy=".3em">${width}x${height}</text>
    </svg>
  `

  res.setHeader('Content-Type', 'image/svg+xml')
  res.status(200).send(svg)
}
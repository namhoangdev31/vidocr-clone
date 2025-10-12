/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				// Apply to all routes
				source: '/:path*',
				headers: [
					{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
					{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
				],
			},
		]
	},
}

module.exports = nextConfig
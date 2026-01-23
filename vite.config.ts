import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ポート必須化: --portオプションを指定しないと起動しない（devコマンドのみ）
const isBuildOrPreview = process.argv.includes('build') || process.argv.includes('preview')
const isDevCommand = !isBuildOrPreview

// --port引数からポート番号を取得
function getPortFromArgs(): number | undefined {
  const portIndex = process.argv.findIndex(arg => arg === '--port')
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    return parseInt(process.argv[portIndex + 1])
  }
  const portArg = process.argv.find(arg => arg.startsWith('--port='))
  if (portArg) {
    return parseInt(portArg.split('=')[1])
  }
  return undefined
}

const port = getPortFromArgs() ?? (process.env.PORT ? parseInt(process.env.PORT) : undefined)

if (isDevCommand && !port) {
  console.error('\n❌ Error: --port オプションを指定してください')
  console.error('   例: pnpm dev -- --port 4001\n')
  process.exit(1)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: port,
  },
})

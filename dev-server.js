// dev-simple.js - 支持 00-slides-* 格式
import { spawn } from 'child_process'
import fs from 'fs'

console.log('🚀 启动所有 Slidev 演示文稿\n')

// 获取幻灯片文件 - 支持你的命名规则
const slideFiles = fs.readdirSync('.')
  .filter(file => {
    // 匹配: slides.md, slides-*.md, 00-slides-*.md, 01-slides-*.md 等
    return /^(?:\d{2}-)?slides(?:-[^\.]+)?\.md$/.test(file)
  })
  .sort() // 按文件名排序

if (slideFiles.length === 0) {
  console.error('❌ 没有找到幻灯片文件')
  console.log('当前目录的文件:')
  fs.readdirSync('.').forEach(file => console.log(`  ${file}`))
  process.exit(1)
}

console.log(`📄 找到 ${slideFiles.length} 个幻灯片文件:\n`)

// 显示文件列表
slideFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file}`)
})

console.log('\n🌐 启动中...\n')

// 启动每个幻灯片
const processes = []
let startPort = 3030

slideFiles.forEach((file, index) => {
  const port = startPort + index
  // 从文件名提取友好名称
  const name = extractNameFromFile(file)
  
  console.log(`启动 ${index + 1}. ${name}`)
  console.log(`   文件: ${file}`)
  console.log(`   地址: http://localhost:${port}\n`)
  
  const child = spawn('npx', ['slidev', file, '--port', port.toString()], {
    stdio: 'inherit',
    shell: true,
    detached: true
  })
  
  child.on('error', (error) => {
    console.error(`❌ ${name} 启动失败:`, error.message)
  })
  
  processes.push(child)
})

console.log('✅ 所有幻灯片已启动')
console.log('\n📋 访问列表:')
console.log('='.repeat(50))
slideFiles.forEach((file, index) => {
  const port = startPort + index
  const name = extractNameFromFile(file)
  console.log(`${index + 1}. ${name}`)
  console.log(`   地址: http://localhost:${port}`)
  console.log(`   文件: ${file}\n`)
})
console.log('='.repeat(50))
console.log('\n📝 操作提示:')
console.log('  按 Ctrl+C 停止所有服务')
console.log('  每个服务独立运行，修改文件会自动热重载')

// 清理
process.on('SIGINT', () => {
  console.log('\n🛑 正在停止所有进程...')
  processes.forEach(child => {
    try {
      child.kill('SIGINT')
    } catch (e) {
      // 忽略错误
    }
  })
  setTimeout(() => process.exit(0), 1000)
})

// 辅助函数：从文件名提取友好名称
function extractNameFromFile(filename) {
  // 移除数字前缀和扩展名
  let name = filename.replace(/^\d{2}-/, '').replace('.md', '')
  
  // 如果是 slides.md，返回 "主演示"
  if (name === 'slides') return '主演示'
  
  // 移除 slides- 前缀
  name = name.replace('slides-', '')
  
  // 将连字符转换为空格，并首字母大写
  name = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return name
}
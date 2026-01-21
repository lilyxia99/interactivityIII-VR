// dev-simple.js - 支持 00-slides-* 格式
import { spawn } from 'child_process'
import fs from 'fs'

console.log('🚀 启动所有 Slidev 演示文稿\n')

// 获取幻灯片文件 - 支持你的命名规则
let slideFiles = []
try {
  const allFiles = fs.readdirSync('.')
  console.log('📁 当前目录所有文件:')
  allFiles.forEach(file => console.log(`  ${file}`))
  console.log('')
  
  slideFiles = allFiles
    .filter(file => {
      // 匹配: slides.md, slides-*.md, 00-slides-*.md, 01-slides-*.md, 01--slides--*.md 等
      const matches = /^(?:\d{2}-)?slides(?:-[^\.]+)?\.md$/.test(file) || 
                     /^\d{2}--slides--.*\.md$/.test(file) ||  // 支持 01--slides--SetUp.md 格式
                     file.endsWith('.md') && file.includes('slide')
      if (matches) {
        console.log(`✅ 匹配到幻灯片文件: ${file}`)
      }
      return matches
    })
    .sort() // 按文件名排序
} catch (error) {
  console.error('❌ 读取目录失败:', error.message)
  process.exit(1)
}

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
  
  const child = spawn('npx', ['@slidev/cli', file, '--port', port.toString()], {
    stdio: ['inherit', 'inherit', 'inherit'],
    shell: true,
    detached: false
  })
  
  child.on('error', (error) => {
    console.error(`❌ ${name} 启动失败:`, error.message)
  })
  
  child.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`❌ ${name} 异常退出，代码: ${code}, 信号: ${signal}`)
    }
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
      if (!child.killed) {
        child.kill('SIGTERM')
        setTimeout(() => {
          if (!child.killed) {
            child.kill('SIGKILL')
          }
        }, 2000)
      }
    } catch (e) {
      console.error('停止进程时出错:', e.message)
    }
  })
  setTimeout(() => process.exit(0), 3000)
})

// 防止未捕获的异常导致程序崩溃
process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获的异常:', error.message)
  console.error(error.stack)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未处理的 Promise 拒绝:', reason)
})

// 辅助函数：从文件名提取友好名称
function extractNameFromFile(filename) {
  // 移除扩展名
  let name = filename.replace('.md', '')
  
  // 处理 01--slides--SetUp 格式
  if (name.includes('--slides--')) {
    name = name.split('--slides--')[1] || name
  }
  // 处理 00-slides-intro, 02-slides-Scan 格式
  else if (name.match(/^\d{2}-slides-/)) {
    name = name.replace(/^\d{2}-slides-/, '')
  }
  // 处理 slides.md
  else if (name === 'slides') {
    return '主演示'
  }
  // 移除数字前缀
  else {
    name = name.replace(/^\d{2}--?/, '')
    name = name.replace(/^slides-/, '')
  }
  
  // 将连字符和下划线转换为空格，并首字母大写
  name = name
    .replace(/[-_&]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return name || '未命名演示'
}

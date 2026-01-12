// build-simple.js - 修复 ReferenceError: title is not defined
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 构建 Slidev 演示文稿...\n')

// 辅助函数：从 Slidev 文件中提取标题
function extractTitleFromSlideFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    // 方法1：从 frontmatter 提取
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1]
      const titleMatch = frontmatter.match(/title:\s*(.+)/i)
      if (titleMatch) {
        return titleMatch[1].trim().replace(/^['"]|['"]$/g, '')
      }
    }
    // 方法2：从第一个 # 标题提取
    const h1Match = content.match(/^#\s+(.+)/m)
    if (h1Match) {
      return h1Match[1].trim()
    }
  } catch (error) {
    console.warn(`⚠️ 无法读取文件 ${filePath}:`, error.message)
  }
  return null
}

// 辅助函数：格式化标题
function formatTopicToTitle(topic) {
  if (!topic) return '主演示文稿'
  return topic
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 查找所有幻灯片文件
const slideFiles = []
const files = fs.readdirSync('.')

files.forEach(file => {
  const isSlideFile = 
    file === 'slides.md' || 
    /^\d{2}-slides\.md$/.test(file) ||
    file.startsWith('slides-') && file.endsWith('.md') ||
    /^\d{2}-slides-.*\.md$/.test(file)
  
  if (isSlideFile) {
    const match = file.match(/^(\d{2}-)?(slides)(?:-(.*))?\.md$/)
    if (match) {
      const [, prefix, , topic] = match
      const order = prefix ? parseInt(prefix) : 999
      const name = topic || 'main'
      
      // 提取标题
      const extractedTitle = extractTitleFromSlideFile(file)
      const title = extractedTitle || formatTopicToTitle(topic)
      
      slideFiles.push({
        file,
        name,
        title,      // 确保有 title 属性
        order,
        prefix: prefix || ''
      })
      
      console.log(`📝 发现: ${file} -> 标题: "${title}"`)
    }
  }
})

// 按数字顺序排序
slideFiles.sort((a, b) => a.order - b.order)

console.log(`\n📄 找到 ${slideFiles.length} 个幻灯片文件:`)
slideFiles.forEach((s, i) => {
  console.log(`  ${i + 1}. ${s.file} (标题: ${s.title})`)
})

// 如果没有找到幻灯片文件，显示警告
if (slideFiles.length === 0) {
  console.log('⚠️  没有找到幻灯片文件！')
  console.log('   支持的格式: slides.md, 01-slides.md, slides-topic.md, 01-slides-topic.md')
  process.exit(0)
}

// 清理 dist 目录
const distDir = 'dist'
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true })
}
fs.mkdirSync(distDir, { recursive: true })

const builtPresentations = []

// 构建每个演示文稿
for (const slide of slideFiles) {
  console.log(`\n📦 构建: ${slide.title} (${slide.file})...`)
  
  try {
    const outputDir = slide.name === 'main' ? distDir : path.join(distDir, slide.name)
    const basePath = slide.name === 'main' ? '/' : `/${slide.name}/`
    
    execSync(`npx slidev build ${slide.file} --out ${outputDir} --base ${basePath}`, {
      stdio: 'inherit',
      shell: true
    })
    
    builtPresentations.push(slide)
    console.log(`✅ ${slide.title} 构建完成`)
    
  } catch (error) {
    console.error(`❌ ${slide.title} 构建失败:`, error.message)
  }
}

// 创建简洁导航页面
console.log('\n🔗 创建导航页面...')
const navHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slidev 演示集</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      max-width: 1000px; 
      margin: 0 auto; 
      padding: 40px 20px; 
      line-height: 1.6; 
      color: #333; 
      background: #f8f9fa;
    }
    .header { 
      text-align: center; 
      margin-bottom: 50px; 
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .header h1 { 
      font-size: 2.5rem; 
      margin-bottom: 10px; 
      color: #2c3e50; 
    }
    .header p { 
      color: #666; 
      font-size: 1.1rem; 
    }
    .cards { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
      gap: 25px; 
    }
    .card { 
      background: #fff; 
      border-radius: 12px; 
      padding: 25px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
      border: 1px solid #e9ecef; 
      text-decoration: none; 
      color: inherit; 
      transition: all 0.2s ease; 
      display: block;
    }
    .card:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 8px 20px rgba(0,0,0,0.12); 
      border-color: #3ab9d5; 
    }
    .card-title { 
      font-size: 1.3rem; 
      margin: 0 0 10px 0; 
      color: #2c3e50; 
      font-weight: 600;
    }
    .card-description { 
      color: #666; 
      margin: 0 0 15px 0; 
      font-size: 0.95rem; 
      line-height: 1.5;
    }
    .card-path { 
      font-size: 0.85rem; 
      color: #3ab9d5; 
      font-family: 'SF Mono', 'Fira Code', monospace; 
      background: #f1faff; 
      padding: 4px 8px; 
      border-radius: 4px; 
      display: inline-block; 
    }
    .footer { 
      text-align: center; 
      margin-top: 50px; 
      padding-top: 20px; 
      border-top: 1px solid #e9ecef; 
      color: #888; 
      font-size: 0.9rem; 
    }
    .footer a { 
      color: #3ab9d5; 
      text-decoration: none; 
    }
    .footer a:hover { 
      text-decoration: underline; 
    }
    @media (max-width: 768px) { 
      .cards { 
        grid-template-columns: 1fr; 
      } 
      .header h1 { 
        font-size: 2rem; 
      }
      body {
        padding: 20px 15px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Interactivity II Slides</h1>
    <p>Total of ${builtPresentations.length} slides to check out</p>
  </div>
  
  <div class="cards">
    ${builtPresentations.map(pres => `
      <a href="${pres.name === 'main' ? './' : './' + pres.name + '/'}" class="card">
        <h3 class="card-title">${pres.title || '未命名演示'}</h3>
        <p class="card-description">点击查看完整的 ${pres.title || '演示'} 幻灯片</p>
        <span class="card-path">${pres.name === 'main' ? '/' : '/' + pres.name}</span>
      </a>
    `).join('')}
  </div>
  
  <div class="footer">
    <p>使用 <a href="https://sli.dev" target="_blank">Slidev</a> 构建 • 部署于 Vercel</p>
    <p style="margin-top: 5px;">构建时间: ${new Date().toLocaleString('zh-CN')}</p>
  </div>
  
  <script>
    // 确保链接正确工作
    document.addEventListener('DOMContentLoaded', function() {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.addEventListener('click', function(e) {
          console.log('导航到:', this.getAttribute('href'));
        });
      });
    });
  </script>
</body>
</html>`

fs.writeFileSync(path.join(distDir, 'index.html'), navHtml)
console.log('✅ 导航页面创建完成')

// 显示构建信息
console.log('\n🎉 构建完成！')
console.log('\n📂 输出目录: dist/')
console.log(`   ├── index.html        # 导航页`)
builtPresentations.forEach(pres => {
  const dirName = pres.name === 'main' ? '(根目录)' : `${pres.name}/`
  console.log(`   ├── ${dirName.padEnd(15)} # ${pres.title}`)
})

console.log('\n🌐 访问路径:')
console.log(`   导航页: /`)
builtPresentations.forEach(pres => {
  console.log(`   ${pres.title}: ${pres.name === 'main' ? '/' : '/' + pres.name}`)
})

console.log('\n🚀 本地预览:')
console.log(`   cd dist && npx serve`)
console.log(`   浏览器打开: http://localhost:3000`)
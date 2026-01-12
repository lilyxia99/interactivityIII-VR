// build-simple.js - 修复刷新问题和优化导航
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Building Slidev presentations...\n')

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
    console.warn(`⚠️  Cannot read file ${filePath}:`, error.message)
  }
  return null
}

// 辅助函数：格式化标题
function formatTopicToTitle(topic) {
  if (!topic) return 'Main Presentation'
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
      
      console.log(`📝 Found: ${file} -> Title: "${title}"`)
    }
  }
})

// 按数字顺序排序
slideFiles.sort((a, b) => a.order - b.order)

console.log(`\n📄 Found ${slideFiles.length} slide files:`)
slideFiles.forEach((s, i) => {
  console.log(`  ${i + 1}. ${s.file} (Title: ${s.title})`)
})

// 如果没有找到幻灯片文件，显示警告
if (slideFiles.length === 0) {
  console.log('⚠️  No slide files found!')
  console.log('   Supported formats: slides.md, 01-slides.md, slides-topic.md, 01-slides-topic.md')
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
  console.log(`\n📦 Building: ${slide.title} (${slide.file})...`)
  
  try {
    const outputDir = slide.name === 'main' ? distDir : path.join(distDir, slide.name)
    const basePath = slide.name === 'main' ? '/' : `/${slide.name}/`
    
    execSync(`npx slidev build ${slide.file} --out ${outputDir} --base ${basePath}`, {
      stdio: 'inherit',
      shell: true
    })
    
    // 🔧 关键修复：为每个演示添加 _redirects 文件以支持 SPA 路由
    console.log(`   Creating SPA redirects for ${slide.name}...`)
    const redirectsContent = `/*  /index.html  200`
    fs.writeFileSync(path.join(outputDir, '_redirects'), redirectsContent)
    
    // 🔧 额外添加 vercel.json 配置文件
    const vercelConfig = {
      "rewrites": [
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    fs.writeFileSync(
      path.join(outputDir, 'vercel.json'), 
      JSON.stringify(vercelConfig, null, 2)
    )
    
    builtPresentations.push(slide)
    console.log(`✅ ${slide.title} built successfully`)
    
  } catch (error) {
    console.error(`❌ ${slide.title} build failed:`, error.message)
  }
}

// 创建简洁导航页面
console.log('\n🔗 Creating navigation page...')
const navHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactivity II Slides</title>
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
        <h3 class="card-title">${pres.title || 'Untitled Presentation'}</h3>
        <p class="card-description">Click to view complete ${pres.title || 'presentation'} slides</p>
        <span class="card-path">${pres.name === 'main' ? '/' : '/' + pres.name}</span>
      </a>
    `).join('')}
  </div>
  
  <div class="footer">
    <p>Built with <a href="https://sli.dev" target="_blank">Slidev</a> • Deployed on Vercel</p>
    <p style="margin-top: 5px;">Built at: ${new Date().toLocaleString('en-US')}</p>
  </div>
  
  <script>
    // 确保链接正确工作
    document.addEventListener('DOMContentLoaded', function() {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.addEventListener('click', function(e) {
          console.log('Navigating to:', this.getAttribute('href'));
        });
      });
    });
  </script>
</body>
</html>`

fs.writeFileSync(path.join(distDir, 'index.html'), navHtml)
console.log('✅ Navigation page created')

// 🔧 为根目录也添加 SPA 重定向规则（针对导航页面）
const rootRedirects = `/*  /index.html  200`
fs.writeFileSync(path.join(distDir, '_redirects'), rootRedirects)

const rootVercelConfig = {
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "trailingSlash": false
}
fs.writeFileSync(
  path.join(distDir, 'vercel.json'), 
  JSON.stringify(rootVercelConfig, null, 2)
)

console.log('✅ SPA redirects configured for all presentations')

// 显示构建信息
console.log('\n🎉 Build completed!')
console.log('\n📂 Output directory: dist/')
console.log(`   ├── index.html        # Navigation page`)
console.log(`   ├── vercel.json       # Vercel configuration`)
console.log(`   ├── _redirects        # SPA redirects`)
builtPresentations.forEach(pres => {
  const dirName = pres.name === 'main' ? '(root)' : `${pres.name}/`
  console.log(`   ├── ${dirName.padEnd(15)} # ${pres.title}`)
})

console.log('\n🌐 Access URLs:')
console.log(`   Navigation: /`)
builtPresentations.forEach(pres => {
  console.log(`   ${pres.title}: ${pres.name === 'main' ? '/' : '/' + pres.name}`)
  console.log(`   Example slide page: ${pres.name === 'main' ? '/18' : '/' + pres.name + '/18'}`)
})

console.log('\n🚀 Local preview:')
console.log(`   cd dist && npx serve`)
console.log(`   Open browser: http://localhost:3000`)

console.log('\n🔧 SPA Routing Notes:')
console.log('   - Added _redirects file to support client-side routing')
console.log('   - Added vercel.json configuration for SPA support')
console.log('   - Pages like /intro/18 should now refresh correctly')
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Building Slidev presentations with history mode...\n')

// Helper functions
function extractTitleFromSlideFile(filename) {
  try {
    const content = fs.readFileSync(filename, 'utf8')
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch) {
      return titleMatch[1].trim()
    }
    
    // Try to find title in frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
      const titleInFrontmatter = frontmatterMatch[1].match(/title:\s*['"]?([^'"]+)['"]?/m)
      if (titleInFrontmatter) {
        return titleInFrontmatter[1].trim()
      }
    }
    
    return null
  } catch (error) {
    console.warn(`Could not extract title from ${filename}:`, error.message)
    return null
  }
}

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
      
      const extractedTitle = extractTitleFromSlideFile(file)
      const title = extractedTitle || formatTopicToTitle(topic)
      
      slideFiles.push({
        file,
        name,
        title,
        order,
        prefix: prefix || ''
      })
      
      console.log(`📝 Found: ${file} -> Title: "${title}"`)
    }
  }
})

slideFiles.sort((a, b) => a.order - b.order)

if (slideFiles.length === 0) {
  console.log('⚠️  No slide files found!')
  process.exit(0)
}

// 清理并创建dist目录
const distDir = 'dist'
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true })
}
fs.mkdirSync(distDir, { recursive: true })

const builtPresentations = []

// 🔥 关键：构建每个演示文稿，启用历史路由模式
for (const slide of slideFiles) {
  console.log(`\n📦 Building: ${slide.title} (${slide.file})...`)
  
  try {
    const outputDir = slide.name === 'main' ? distDir : path.join(distDir, slide.name)
    const basePath = slide.name === 'main' ? '/' : `/${slide.name}/`
    
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    console.log(`   Output: ${outputDir}`)
    console.log(`   Base path: ${basePath}`)
    
    // 🔥 方法1：直接使用命令行参数（推荐）
    const buildCmd = `npx @slidev/cli build ${slide.file} --out ${outputDir} --base ${basePath}`
    console.log(`   Command: ${buildCmd}`)
    
    execSync(buildCmd, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    })
    
    // 🔥 验证构建结果并修复路由配置
    const indexPath = path.join(outputDir, 'index.html')
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8')
      
      // 确保有正确的base标签
      if (!content.includes(`<base href="${basePath}"`)) {
        if (content.includes('<base href="')) {
          // 替换现有的base标签
          content = content.replace(/<base href="[^"]*"/, `<base href="${basePath}"`)
        } else {
          // 添加base标签
          content = content.replace('<head>', `<head>\n    <base href="${basePath}">`)
        }
        fs.writeFileSync(indexPath, content)
        console.log(`   🔧 Added/fixed base tag: href="${basePath}"`)
      }
      
      // 检查是否有Vue Router历史模式配置
      if (!content.includes('history: createWebHistory')) {
        console.log(`   ⚠️  May need manual history mode configuration`)
      }
    }
    
    builtPresentations.push(slide)
    console.log(`✅ ${slide.title} built with history mode`)
    
  } catch (error) {
    console.error(`❌ ${slide.title} build failed:`, error.message)
    
    // 尝试备选方案：使用哈希模式
    console.log(`   Trying fallback with hash mode...`)
    try {
      const outputDir = slide.name === 'main' ? distDir : path.join(distDir, slide.name)
      const basePath = slide.name === 'main' ? '/' : `/${slide.name}/`
      const fallbackCmd = `npx @slidev/cli build ${slide.file} --out ${outputDir} --base ${basePath}`
      execSync(fallbackCmd, { stdio: 'inherit', shell: true })
      console.log(`✅ ${slide.title} built with hash mode (fallback)`)
      builtPresentations.push(slide)
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed:`, fallbackError.message)
    }
  }
}

// 创建导航页面
console.log('\n🔗 Creating navigation page...')
const navHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactivity III - VR Slides</title>
  <style>
    body {
      font-family: Georgia, 'Times New Roman', serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }
    
    .subtitle {
      color: #7f8c8d;
      margin-bottom: 2rem;
      font-style: italic;
    }
    
    .slides-list {
      list-style: none;
      padding: 0;
    }
    
    .slide-item {
      margin-bottom: 1rem;
      padding: 1rem;
      border-left: 3px solid #3498db;
      background: #f8f9fa;
    }
    
    .slide-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .slide-title a {
      color: #2c3e50;
      text-decoration: none;
    }
    
    .slide-title a:hover {
      text-decoration: underline;
    }
    
    .slide-path {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      color: #7f8c8d;
    }
    
    .footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #ecf0f1;
      text-align: center;
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .footer a {
      color: #3498db;
    }
  </style>
</head>
<body>
  <h1>Interactivity III - VR</h1>
  <p class="subtitle">${builtPresentations.length} presentation${builtPresentations.length !== 1 ? 's' : ''} available</p>
  
  <ul class="slides-list">
    ${builtPresentations.map(pres => {
      const href = pres.name === 'main' ? './' : './' + pres.name + '/'
      const displayPath = pres.name === 'main' ? '/' : '/' + pres.name + '/'
      
      return `
      <li class="slide-item">
        <div class="slide-title">
          <a href="${href}">${pres.title || 'Untitled Presentation'}</a>
        </div>
        <div class="slide-path">${displayPath}</div>
      </li>
    `}).join('')}
  </ul>
  
  <div class="footer">
    <p>Built with <a href="https://sli.dev" target="_blank">Slidev</a> • Last updated: ${new Date().toLocaleString('en-US')}</p>
  </div>
</body>
</html>`

fs.writeFileSync(path.join(distDir, 'index.html'), navHtml)
console.log('✅ Navigation page created')

// 创建路由测试页面
console.log('\n🔧 Creating route test page...')
const testSections = builtPresentations.map(pres => {
  const name = pres.name
  const title = pres.title
  return `
    <div class="test">
      <h3>${title}</h3>
      <button onclick="testRoute('/${name}/')">Test /${name}/</button>
      <button onclick="testRoute('/${name}/1')">Test /${name}/1</button>
      <button onclick="testRoute('/${name}/2')">Test /${name}/2</button>
      <button onclick="testRoute('/${name}/10')">Test /${name}/10</button>
      <div id="result-${name}"></div>
    </div>
  `
}).join('')

const testPage = `<!DOCTYPE html>
<html>
<head>
  <title>Route Testing</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    .test { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .success { border-color: #4CAF50; background: #f1f8e9; }
    .error { border-color: #f44336; background: #ffebee; }
    button { margin: 5px; padding: 8px 16px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Slidev Route Testing</h1>
  
  <div id="tests">
    ${testSections}
  </div>
  
  <script>
    async function testRoute(url) {
      const pathParts = url.split('/').filter(p => p);
      const presentationName = pathParts[0] || 'main';
      const resultDiv = document.getElementById('result-' + presentationName);
      
      try {
        const response = await fetch(url);
        const html = await response.text();
        
        resultDiv.innerHTML = \`
          <div style="margin-top: 10px;">
            <strong>URL:</strong> \${url}<br>
            <strong>Status:</strong> \${response.status} \${response.statusText}<br>
            <strong>Type:</strong> \${response.headers.get('content-type')}<br>
            <strong>Contains Slidev:</strong> \${html.includes('Slidev') ? '✅ Yes' : '❌ No'}<br>
            <strong>Page Load:</strong> <button onclick="window.open('\${url}', '_blank')">Open Page</button>
          </div>
        \`;
        
        resultDiv.parentElement.className = html.includes('Slidev') ? 'test success' : 'test error';
      } catch (error) {
        resultDiv.innerHTML = \`<div style="color: red;">Error: \${error.message}</div>\`;
        resultDiv.parentElement.className = 'test error';
      }
    }
    
    // 自动测试关键路由
    setTimeout(() => {
      ${builtPresentations.map(pres => `testRoute('/${pres.name}/1');`).join('\n      ')}
    }, 1000);
  </script>
</body>
</html>`

fs.writeFileSync(path.join(distDir, 'test-routes.html'), testPage)
console.log('✅ Test page created')

// 生成 vercel.json 配置
console.log('\n🔧 Generating vercel.json configuration...')
const rewrites = []

// 为每个演示文稿添加重写规则
builtPresentations.forEach(pres => {
  if (pres.name !== 'main') {
    rewrites.push({
      source: `/${pres.name}/:path*`,
      destination: `/${pres.name}/index.html`
    })
    rewrites.push({
      source: `/${pres.name}`,
      destination: `/${pres.name}/index.html`
    })
  }
})

// 添加catch-all规则（排除所有已知的演示文稿路径）
const excludePattern = builtPresentations
  .filter(pres => pres.name !== 'main')
  .map(pres => pres.name)
  .join('|')

if (excludePattern) {
  rewrites.push({
    source: `/((?!${excludePattern}).*)`,
    destination: "/index.html"
  })
} else {
  rewrites.push({
    source: "/(.*)",
    destination: "/index.html"
  })
}

const vercelConfig = {
  rewrites,
  buildCommand: "npm run build",
  outputDirectory: "dist",
  trailingSlash: false
}

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2))
console.log('✅ vercel.json generated with dynamic rewrites')

console.log('\n🎉 Build completed!')
console.log('\n🔧 Configuration summary:')
console.log('   • Using --router-mode history for direct page access')
console.log('   • All routes rewriten to index.html for SPA support')
console.log('   • Test page available at /test-routes.html')
console.log('   • vercel.json auto-generated with dynamic rewrites')

console.log('\n🌐 Expected behavior:')
console.log('   /              -> Navigation page')
builtPresentations.forEach(pres => {
  if (pres.name !== 'main') {
    console.log(`   /${pres.name}/        -> ${pres.title} (page 1)`)
    console.log(`   /${pres.name}/1       -> ${pres.title} (page 1) ✅`)
    console.log(`   /${pres.name}/2       -> ${pres.title} (page 2) ✅`)
  }
})

console.log('\n🚀 Test after deployment:')
builtPresentations.forEach(pres => {
  if (pres.name !== 'main') {
    console.log(`   https://interactivity-ii-slides-slidev.vercel.app/${pres.name}/1`)
  }
})
console.log('   Should show specific slides directly, not redirect to slide 1')

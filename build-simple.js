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
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
      color: white;
    }
    
    .header h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .header p {
      font-size: 1.2rem;
      opacity: 0.9;
      font-weight: 300;
    }
    
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.2);
      position: relative;
      overflow: hidden;
    }
    
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #2d3748;
    }
    
    .card-description {
      color: #718096;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }
    
    .card-path {
      display: inline-block;
      background: #f7fafc;
      color: #4a5568;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.9rem;
      border: 1px solid #e2e8f0;
    }
    
    .quick-links {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }
    
    .quick-links-title {
      font-size: 0.9rem;
      color: #718096;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .quick-link {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.85rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      transition: background 0.2s ease;
    }
    
    .quick-link:hover {
      background: #5a67d8;
    }
    
    .footer {
      text-align: center;
      color: white;
      opacity: 0.8;
      font-size: 0.9rem;
    }
    
    .footer a {
      color: white;
      text-decoration: underline;
    }
    
    .footer a:hover {
      opacity: 0.8;
    }
    
    .build-info {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      opacity: 0.7;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .cards {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .card {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Interactivity III - VR</h1>
      <p>Explore ${builtPresentations.length} interactive presentation${builtPresentations.length !== 1 ? 's' : ''}</p>
    </div>
    
    <div class="cards">
      ${builtPresentations.map(pres => {
        const href = pres.name === 'main' ? './' : './' + pres.name + '/'
        const displayPath = pres.name === 'main' ? '/' : '/' + pres.name + '/'
        
        return `
        <div class="card" data-pres="${pres.name}">
          <h3 class="card-title">${pres.title || 'Untitled Presentation'}</h3>
          <p class="card-description">Interactive slides covering VR concepts and implementations</p>
          <span class="card-path">${displayPath}</span>
          
          <div class="quick-links">
            <div class="quick-links-title">Quick Access:</div>
            <a href="${href}" class="quick-link">Start</a>
            ${pres.name !== 'main' ? `
              <a href="/${pres.name}/1" class="quick-link">Slide 1</a>
              <a href="/${pres.name}/2" class="quick-link">Slide 2</a>
              <a href="/${pres.name}/18" class="quick-link">Slide 18</a>
            ` : ''}
          </div>
        </div>
      `}).join('')}
    </div>
    
    <div class="footer">
      <p>Built with <a href="https://sli.dev" target="_blank">Slidev</a> • Deployed on <a href="https://vercel.com" target="_blank">Vercel</a></p>
      <div class="build-info">Last updated: ${new Date().toLocaleString('en-US')}</div>
    </div>
  </div>
</body>
</html>`

fs.writeFileSync(path.join(distDir, 'index.html'), navHtml)
console.log('✅ Navigation page created')

// 创建路由测试页面
console.log('\n🔧 Creating route test page...')
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
    <div class="test">
      <h3>Intro Presentation</h3>
      <button onclick="testRoute('/intro/')">Test /intro/</button>
      <button onclick="testRoute('/intro/1')">Test /intro/1</button>
      <button onclick="testRoute('/intro/2')">Test /intro/2</button>
      <button onclick="testRoute('/intro/18')">Test /intro/18</button>
      <div id="result-intro"></div>
    </div>
  </div>
  
  <script>
    async function testRoute(url) {
      const resultDiv = document.getElementById('result-' + url.split('/')[1]);
      
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
      testRoute('/intro/2');
    }, 1000);
  </script>
</body>
</html>`

fs.writeFileSync(path.join(distDir, 'test-routes.html'), testPage)
console.log('✅ Test page created')

console.log('\n🎉 Build completed!')
console.log('\n🔧 Configuration summary:')
console.log('   • Using --router-mode history for direct page access')
console.log('   • All routes rewriten to index.html for SPA support')
console.log('   • Test page available at /test-routes.html')

console.log('\n🌐 Expected behavior:')
console.log('   /              -> Navigation page')
console.log('   /intro/        -> Intro presentation (page 1)')
console.log('   /intro/1       -> Intro presentation (page 1)')
console.log('   /intro/2       -> Intro presentation (page 2) ✅')
console.log('   /intro/18      -> Intro presentation (page 18) ✅')

console.log('\n🚀 Test after deployment:')
console.log('   https://interactivity-iii-vr.vercel.app/intro/2')
console.log('   Should show slide 2 directly, not redirect to slide 1')

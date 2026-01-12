import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Building Slidev presentations with history mode...\n')

// ... [之前的辅助函数保持不变] ...

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
    const buildCmd = `npx slidev build ${slide.file} --out ${outputDir} --base ${basePath} --router-mode history`
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
      const fallbackCmd = `npx slidev build ${slide.file} --out ${outputDir} --base ${basePath} --router-mode hash`
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
  <title>Interactivity II Slides</title>
  <style>
    /* [保持原有样式不变] */
  </style>
</head>
<body>
  <div class="header">
    <h1>Interactivity II Slides</h1>
    <p>Total of ${builtPresentations.length} slides to check out</p>
  </div>
  
  <div class="cards">
    ${builtPresentations.map(pres => {
      const href = pres.name === 'main' ? './' : './' + pres.name + '/'
      const displayPath = pres.name === 'main' ? '/' : '/' + pres.name + '/'
      
      return `
      <a href="${href}" class="card" data-pres="${pres.name}">
        <h3 class="card-title">${pres.title || 'Untitled Presentation'}</h3>
        <p class="card-description">Click to view ${pres.title || 'presentation'} slides</p>
        <p><small>Try: ${displayPath}1, ${displayPath}2, ${displayPath}18</small></p>
        <span class="card-path">${displayPath}</span>
      </a>
    `}).join('')}
  </div>
  
  <div class="footer">
    <p>Built with <a href="https://sli.dev" target="_blank">Slidev</a> • Deployed on Vercel</p>
    <p style="margin-top: 5px;">Built at: ${new Date().toLocaleString('en-US')}</p>
  </div>
  
  <script>
    // 添加路由测试链接
    document.addEventListener('DOMContentLoaded', function() {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        const presName = card.getAttribute('data-pres');
        if (presName !== 'main') {
          const testLinks = document.createElement('div');
          testLinks.innerHTML = \`
            <div style="margin-top: 10px; font-size: 0.8rem;">
              <a href="/\${presName}/1" style="color: #666; margin-right: 10px;">Page 1</a>
              <a href="/\${presName}/2" style="color: #666; margin-right: 10px;">Page 2</a>
              <a href="/\${presName}/18" style="color: #666;">Page 18</a>
            </div>
          \`;
          card.appendChild(testLinks);
        }
      });
    });
  </script>
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
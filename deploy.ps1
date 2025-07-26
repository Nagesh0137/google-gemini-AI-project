# Deploy to Netlify Script

# 1. Zip your project files (excluding .git folder)
$sourceFolder = "d:\full stack\Projects\gemini_api_clone"
$zipFile = "d:\full stack\Projects\gemini-ai-clone-deploy.zip"

# Create zip file excluding git folder and other unnecessary files
Compress-Archive -Path "$sourceFolder\*" -DestinationPath $zipFile -Force -CompressionLevel Optimal

Write-Host "==========================================" -ForegroundColor Green
Write-Host "    Deployment Package Created!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Deploy to Netlify:" -ForegroundColor Yellow
Write-Host "1. Go to https://netlify.com" -ForegroundColor White
Write-Host "2. Drag and drop: $zipFile" -ForegroundColor White
Write-Host "3. Your site will be live instantly!" -ForegroundColor White
Write-Host ""
Write-Host "Deploy to Vercel:" -ForegroundColor Yellow  
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Import from GitHub after pushing" -ForegroundColor White
Write-Host "3. Select 'Other' framework" -ForegroundColor White
Write-Host ""
Write-Host "GitHub Pages:" -ForegroundColor Yellow
Write-Host "1. Push to GitHub first" -ForegroundColor White
Write-Host "2. Go to repo Settings > Pages" -ForegroundColor White
Write-Host "3. Deploy from main branch" -ForegroundColor White
Write-Host ""
Write-Host "Zip file created at: $zipFile" -ForegroundColor Cyan

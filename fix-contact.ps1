$filePath = "src\app\[locale]\contact\page.tsx"
$content = Get-Content $filePath | Out-String

# Replace the email link with a container that has both the email and the jobs button
$pattern = '(<a\s+href="mailto:hello@madeinbugs\.com\.br"\s+className="inline-block text-lg md:text-xl font-semibold text-green-600 hover:text-green-800 transition-colors duration-200 hover:scale-105 transform"\s*>\s*hello@madeinbugs\.com\.br\s*</a>)'
$replacement = '<div className="flex flex-col items-center space-y-3">`n$1`n<a href={`/$' + '{locale}/about#jobs`} className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 hover:scale-105 transform">{locale === "en" ? "View Open Positions" : "Ver Vagas Abertas"}</a>`n</div>'

$newContent = $content -replace $pattern, $replacement
$newContent | Set-Content $filePath -NoNewline
Write-Host "Fixed contact page!"

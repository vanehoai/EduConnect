$ErrorActionPreference = "Continue"

Write-Host "=== LINT ==="
npm run lint
$lintExit = $LASTEXITCODE

Write-Host "`n=== TYPECHECK ==="
npm run typecheck
$typecheckExit = $LASTEXITCODE

Write-Host "`n=== TEST ==="
npm run test
$testExit = $LASTEXITCODE

Write-Host "`n=== BUILD ==="
npm run build
$buildExit = $LASTEXITCODE

Write-Host "`n=== PRISMA VALIDATE ==="
npm exec --workspace=@school/api -- prisma validate
$prismaExit = $LASTEXITCODE

Write-Host "`n--- SUMMARY ---"
Write-Host "Lint: $lintExit"
Write-Host "Typecheck: $typecheckExit"
Write-Host "Test: $testExit"
Write-Host "Build: $buildExit"
Write-Host "Prisma: $prismaExit"

# One-time setup: create tables on Neon and seed admin user.
# Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts/setup-neon.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Removing empty migration folders (leftover from SQLite)..." -ForegroundColor Cyan
Get-ChildItem "prisma\migrations" -Directory -ErrorAction SilentlyContinue |
  Where-Object { -not (Test-Path (Join-Path $_.FullName "migration.sql")) } |
  ForEach-Object {
    Write-Host "  deleting $($_.Name)"
    Remove-Item $_.FullName -Recurse -Force
  }

Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "Applying migrations to Neon..." -ForegroundColor Cyan
npx prisma migrate deploy

Write-Host "Seeding admin user..." -ForegroundColor Cyan
npm run db:seed

Write-Host "Done. Run: npm run dev" -ForegroundColor Green

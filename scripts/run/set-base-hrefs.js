#!/usr/bin/env node
/**
 * Build script that sets the correct base href for each framework when building for the comparison website
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
const appsDir = path.join(rootDir, 'apps');

// Files that don't belong in the dist of an app without a build step
const STATIC_COPY_IGNORE = new Set([
  'node_modules', 'dist', 'package.json', 'package-lock.json', 'README.md', 'eslint.config.js'
]);

const skipped = [];
const failed = [];

// Note a framework that couldn't be built, and say why
function skip(id, reason) {
  skipped.push(id);
  console.log(`⚠️  Skipping ${id}, ${reason}`);
}

// Read the frameworks and their build settings from frameworks.json
function getFrameworks() {
  const configPath = path.join(rootDir, 'frameworks.json');
  const { frameworks } = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  return frameworks.map(fw => ({
    id: fw.id,
    dir: fw.dir || fw.id,
    buildCommand: (fw.build && fw.build.buildCommand) || ''
  }));
}

// Work out how an app needs to be built, from its build command
function resolveStrategy(framework) {
  const { buildCommand, dir } = framework;

  if (!buildCommand || buildCommand.includes('echo')) {
    return 'static';
  }
  if (buildCommand.includes('ng build')) {
    return 'angular';
  }
  if (buildCommand.includes('astro build')) {
    return 'astro';
  }
  if (fs.existsSync(path.join(appsDir, dir, 'svelte.config.js'))) {
    return 'svelte';
  }
  return 'vite';
}

function buildViteForComparison({ id, dir }) {
  const frameworkPath = path.join(appsDir, dir);
  const configPath = path.join(frameworkPath, 'vite.config.js');
  const base = `/${id}/app/`;

  if (!fs.existsSync(configPath)) {
    skip(id, 'no vite.config.js found');
    return;
  }

  // Read current config
  const originalConfig = fs.readFileSync(configPath, 'utf8');

  // Replace base: './' with base: '/framework/app/'
  const config = originalConfig.replace(
    /base:\s*['"]\.\/['"],?/g,
    `base: '${base}',`
  );

  // Warn if there was no base to replace, as the assets won't resolve
  if (config === originalConfig) {
    console.log(`⚠️  No "base: './'" found in ${id}/vite.config.js, assets may resolve to the wrong path`);
  }

  // For Qwik, also modify CSS imports in root.tsx
  let rootTsxPath, originalRootTsx;
  if (id === 'qwik') {
    rootTsxPath = path.join(frameworkPath, 'src', 'root.tsx');
    if (fs.existsSync(rootTsxPath)) {
      originalRootTsx = fs.readFileSync(rootTsxPath, 'utf8');
      const modifiedRootTsx = originalRootTsx.replace(
        /href="styles\//g,
        `href="${base}styles/`
      );
      fs.writeFileSync(rootTsxPath, modifiedRootTsx);
    }
  }

  try {
    // Write temporary config
    fs.writeFileSync(configPath, config);

    // Build
    console.log(`🔨 Building ${id} for comparison website...`);
    execSync('npm run build', {
      cwd: frameworkPath,
      stdio: 'inherit'
    });

    // Post-build fix for Qwik: update generated HTML and JS files to use correct asset paths
    if (id === 'qwik') {
      const distHtmlPath = path.join(frameworkPath, 'dist', 'index.html');
      if (fs.existsSync(distHtmlPath)) {
        let html = fs.readFileSync(distHtmlPath, 'utf8');
        // Convert relative paths to absolute paths for the base
        html = html.replace(/src="\.\//g, `src="${base}`);
        html = html.replace(/href="\.\//g, `href="${base}`);
        fs.writeFileSync(distHtmlPath, html);
        console.log(`🔧 Fixed Qwik asset paths in generated HTML`);
      }

      // Also fix CSS paths in the generated JS files
      const buildDir = path.join(frameworkPath, 'dist', 'build');
      if (fs.existsSync(buildDir)) {
        const jsFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.js'));
        jsFiles.forEach(jsFile => {
          const jsPath = path.join(buildDir, jsFile);
          let jsContent = fs.readFileSync(jsPath, 'utf8');
          // Fix CSS paths in the JavaScript bundles
          jsContent = jsContent.replace(/href:"styles\//g, `href:"${base}styles/`);
          fs.writeFileSync(jsPath, jsContent);
        });
        console.log(`🔧 Fixed CSS paths in ${jsFiles.length} Qwik JS files`);
      }
    }

    console.log(`✅ ${id} built successfully`);
  } finally {
    // Restore original config
    fs.writeFileSync(configPath, originalConfig);

    // Restore original root.tsx for Qwik
    if (id === 'qwik' && rootTsxPath && originalRootTsx) {
      fs.writeFileSync(rootTsxPath, originalRootTsx);
    }
  }
}

function buildAngularForComparison({ id, dir }) {
  // The base href is set by the comparison configuration in angular.json
  console.log(`🔨 Building ${id} for comparison website...`);
  execSync('npx ng build --configuration=comparison', {
    cwd: path.join(appsDir, dir),
    stdio: 'inherit'
  });
  console.log(`✅ ${id} built successfully`);
}

function buildSvelteForComparison({ id, dir }) {
  const sveltePath = path.join(appsDir, dir);
  const configPath = path.join(sveltePath, 'svelte.config.js');

  // Read current config
  const originalConfig = fs.readFileSync(configPath, 'utf8');

  // Add paths.base configuration to kit object (correct property for SvelteKit)
  const config = originalConfig.replace(
    /prerender:\s*{([^}]*)}/,
    `paths: {\n      base: '/${id}/app'\n    },\n    prerender: {$1}`
  );

  try {
    // Write temporary config
    fs.writeFileSync(configPath, config);

    console.log(`🔨 Building ${id} for comparison website...`);
    execSync('npm run build', {
      cwd: sveltePath,
      stdio: 'inherit'
    });
    console.log(`✅ ${id} built successfully`);
  } finally {
    // Restore original config
    fs.writeFileSync(configPath, originalConfig);
  }
}

function buildAstroForComparison({ id, dir }) {
  // Astro already emits relative asset paths (see assetsPrefix), so there's nothing to rewrite
  console.log(`🔨 Building ${id} for comparison website...`);
  execSync('npm run build', {
    cwd: path.join(appsDir, dir),
    stdio: 'inherit'
  });
  console.log(`✅ ${id} built successfully`);
}

function buildStaticForComparison({ id, dir }) {
  const frameworkPath = path.join(appsDir, dir);
  const htmlPath = path.join(frameworkPath, 'index.html');
  const base = `/${id}/app/`;

  if (!fs.existsSync(htmlPath)) {
    skip(id, 'no index.html found');
    return;
  }

  // Read current HTML
  const originalHtml = fs.readFileSync(htmlPath, 'utf8');

  // Add base href and convert relative paths to absolute
  let html = originalHtml.replace(/<head>/, `<head>\n    <base href="${base}">`);

  // Replace relative asset paths with absolute paths
  html = html.replace(/href="(?:\.\/)?public\//g, `href="${base}public/`);
  html = html.replace(/href="(?:\.\/)?styles\.css"/g, `href="${base}styles.css"`);
  html = html.replace(/src="(?:\.\/)?js\//g, `src="${base}js/`);

  try {
    // Write temporary HTML
    fs.writeFileSync(htmlPath, html);

    console.log(`🔨 Building ${id} for comparison website...`);

    // Create dist directory and copy files
    const distPath = path.join(frameworkPath, 'dist');
    fs.rmSync(distPath, { recursive: true, force: true });
    fs.mkdirSync(distPath, { recursive: true });

    // Copy everything but the dependencies and project files
    fs.readdirSync(frameworkPath)
      .filter(item => !item.startsWith('.') && !STATIC_COPY_IGNORE.has(item))
      .forEach(item => {
        fs.cpSync(path.join(frameworkPath, item), path.join(distPath, item), { recursive: true });
      });

    console.log(`✅ ${id} built successfully`);
  } finally {
    // Restore original HTML
    fs.writeFileSync(htmlPath, originalHtml);
  }
}

// The build to run for each strategy that resolveStrategy can return
const builders = {
  vite: buildViteForComparison,
  angular: buildAngularForComparison,
  svelte: buildSvelteForComparison,
  astro: buildAstroForComparison,
  static: buildStaticForComparison
};

// Build all frameworks for comparison
console.log('🚀 Building all frameworks for comparison website...\n');

const frameworks = getFrameworks();

frameworks.forEach(framework => {
  if (!fs.existsSync(path.join(appsDir, framework.dir))) {
    skip(framework.id, `no apps/${framework.dir} directory found`);
    return;
  }

  try {
    builders[resolveStrategy(framework)](framework);
  } catch (error) {
    failed.push(framework.id);
    console.error(`❌ ${framework.id} failed to build: ${error.message}`);
  }
});

// Report what happened, and fail the run if any framework didn't build
if (failed.length > 0) {
  console.error(`\n💥 ${failed.length}/${frameworks.length} frameworks failed: ${failed.join(', ')}`);
  process.exit(1);
}

if (skipped.length > 0) {
  console.log(`\n⚠️  Built ${frameworks.length - skipped.length}/${frameworks.length} frameworks, skipped: ${skipped.join(', ')}`);
} else {
  console.log(`\n🎉 All ${frameworks.length} frameworks built for comparison website!`);
}

console.log('💡 To build for standalone development, use the regular npm run build commands.');

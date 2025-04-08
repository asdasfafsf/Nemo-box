import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { glob } from 'glob';
import path from 'path';


const args = process.argv.slice(2);
const targetFileArg = args.find(arg => arg.startsWith('--file='));
const targetFile = targetFileArg ? targetFileArg.split('=')[1] : null;

let nemoFiles = glob.sync('src/script/**/nemo.*.ts');

// 특정 파일만 빌드하는 경우
if (targetFile) {
  const targetPattern = `src/script/**/nemo.${targetFile}.ts`;
  const matchedFiles = glob.sync(targetPattern);
  
  if (matchedFiles.length === 0) {
    console.error(`Error: No files matching pattern for ${targetFile}`);
    process.exit(1);
  }
  
  nemoFiles = matchedFiles;
}


export default defineConfig(
  nemoFiles.map((file) => {
    const filename = path.basename(file);
    const filenameWithoutExtension = filename.replace('.ts', '');
    const onlyFileName = filenameWithoutExtension.split('.')[1];

    return {
      input: file,
      output: {
        file: `dist/${onlyFileName}.js`,
        format: 'esm',
        sourcemap: true,
      },
      plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
          tsconfig: './tsconfig.json',
        }),
      ],
      external: [
        '@aws-sdk/client-s3',
        '@aws-sdk/lib-storage',
        '@aws-sdk/middleware-retry',
        'axios',
        'dotenv',
      ],
    };
  })
);

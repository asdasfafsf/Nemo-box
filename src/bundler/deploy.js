#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

// 커맨드 라인 인수 가져오기
const fileName = process.argv[2];

if (!fileName) {
  console.error('Error: File name is required');
  console.error('Usage: pnpm deploy <fileName>');
  process.exit(1);
}

// S3 설정 확인
const requiredEnvVars = ['S3_REGION', 'S3_BUCKET_NAME', 'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_ENDPOINT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please add them to your .env file');
  process.exit(1);
}

// 빌드 함수
async function buildFile(fileName) {
  return new Promise((resolve, reject) => {
    console.log(`Building file: ${fileName} before deployment...`);
    try {
      execSync(`pnpm build:file ${fileName}`, {
        stdio: 'inherit'
      });
      console.log('Build completed successfully!');
      resolve();
    } catch (error) {
      console.error('Build failed:', error.message);
      reject(error);
    }
  });
}

// 메인 함수
async function main() {
  try {
    // 빌드 실행
    await buildFile(fileName);
    
    // 빌드 성공 후 배포
    await deployToS3(fileName);
  } catch (error) {
    console.error('Deployment process failed:', error.message);
    process.exit(1);
  }
}

// S3에 파일 업로드 함수
async function deployToS3(fileName) {
  console.log(`Deploying ${fileName} to S3...`);
  
  const filePath = `dist/${fileName}.js`;
  
  // 파일이 존재하는지 확인
  try {
    await fsPromises.access(filePath, fs.constants.F_OK);
  } catch (error) {
    throw new Error(`Built file ${filePath} not found`);
  }
  
  // S3 클라이언트 생성
  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY
    },
    forcePathStyle: true // MinIO는 path style URL 사용
  });
  
  try {
    // 파일 읽기
    const fileContent = await fsPromises.readFile(filePath);
    
    // S3 업로드 설정
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `script/${fileName}.js`,
      Body: fileContent,
      ContentType: 'application/javascript'
    };
    
    // S3에 업로드
    const upload = new Upload({
      client: s3Client,
      params: uploadParams
    });
    
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
    });
    
    await upload.done();
    
    // MinIO URL 형식 (path 스타일)
    const deployUrl = `${process.env.S3_ENDPOINT}/script/${fileName}.js`;
    console.log(`Successfully deployed to: ${deployUrl}`);
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}

// 실행
main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});

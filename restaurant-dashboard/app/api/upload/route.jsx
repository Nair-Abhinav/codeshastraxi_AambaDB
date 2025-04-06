import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify exec for async/await usage
const execPromise = promisify(exec);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    
    // Check file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only CSV and XLSX files are allowed' },
        { status: 400 }
      );
    }
    
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Delete old uploads directory if it exists
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }
    
    // Create fresh uploads directory
    fs.mkdirSync(uploadDir, { recursive: true });
    
    // Create unique filename
    const timestamp = new Date().getTime();
    const newFilename = `${timestamp}-${filename}`;
    const filepath = path.join(uploadDir, newFilename);
    
    // Write file to uploads directory
    await writeFile(filepath, buffer);
    
    // Immediately trigger vector database creation via API call to Flask backend
    try {
      // Prepare form data for the Flask API
      const formData = new FormData();
      formData.append('file', new Blob([buffer]), filename);
      
      // Send the file to the Flask backend for immediate processing
      const response = await fetch('http://localhost:5000/process_file', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        console.error('Error from Flask API:', await response.text());
        // We don't return an error here because the file upload was successful
        // The vector DB creation is considered a background task
      } else {
        const vectorDbResult = await response.json();
        console.log('Vector DB created successfully:', vectorDbResult);
      }
    } catch (vectorDbError) {
      console.error('Failed to create vector DB:', vectorDbError);
      // We continue despite the error because the file upload was successful
    }
    
    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        filename: newFilename,
        vectorDbStatus: 'Vector DB creation initiated'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
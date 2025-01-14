import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // Import the MongoDB connection utility

export async function POST(req) {
  try {
    const data = await req.json(); // Parse incoming JSON request
    
    const db = await connectToDatabase(); // Connect to MongoDB
    const collection = db.collection('temperature'); // Access the 'temperature' collection

    const newtemperatureCapture = await collection.insertOne({
      tempLevel: data.data,
      createdAt: new Date(),
    });

    return NextResponse.json({ captureId: newtemperatureCapture.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error saving capture:', error);
    return NextResponse.json({ error: 'Failed to save capture' }, { status: 500 });
  }
}

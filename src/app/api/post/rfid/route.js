import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // Import the MongoDB connection utility

export async function POST(req) {
  try {
    const data = await req.json(); // Parse incoming JSON request
    
    const db = await connectToDatabase(); // Connect to MongoDB
    const collection = db.collection('rfid'); // Access the 'rfid' collection

    const newRFIDCapture = await collection.insertOne({
      uid: data.data,
      createdAt: new Date(),
    });

    return NextResponse.json({ captureId: newRFIDCapture.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error saving capture:', error);
    return NextResponse.json({ error: 'Failed to save capture' }, { status: 500 });
  }
}

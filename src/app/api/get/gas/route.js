import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // Import the MongoDB connection utility

export async function GET(req) {
  try {
    const url = new URL(req.url);
    let NLastHours = parseInt(url.searchParams.get('time'), 10);
    
    if (isNaN(NLastHours) || NLastHours <= 0) {
      NLastHours = 1;
    }

    const db = await connectToDatabase(); // Connect to MongoDB
    const collection = db.collection('gas');
    
    const records =  await collection.find({ createdAt: { $gte: new Date(Date.now() - NLastHours * 60 * 60 * 1000) } }).toArray();
    return NextResponse.json(records);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

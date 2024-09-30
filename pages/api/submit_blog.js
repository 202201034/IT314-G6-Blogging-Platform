import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = 'your_database_name';
const db = client.db(dbName);
const collection = db.collection('blogs');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content, hashtags, imageUrl, idToken } = req.body;

    try {
      // Authenticate user
      // (Firebase Admin SDK or another method to verify ID token)

      // Save blog post to MongoDB
      const result = await collection.insertOne({
        title,
        content,
        hashtags,
        imageUrl,
        createdAt: new Date(),
      });

      res.status(201).json({ id: result.insertedId });
    } catch (error) {
      console.error('Error submitting blog:', error);
      res.status(500).json({ error: 'Failed to submit blog' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

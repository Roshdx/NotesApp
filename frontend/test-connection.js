import { MongoClient } from "mongodb";

  async function test() {
    const client = new MongoClient('mongodb://127.0.0.1:27017');

    try {
      await client.connect();
      console.log('✓ Connected successfully');

      const db = client.db('notesdb');

      // Get users
      const users = await db.collection('users').find().toArray();
      console.log('\nUsers:', JSON.stringify(users, null, 2));

      // Get notes (collection name is 'notes' plural, not 'note' singular)
      const notes = await db.collection('notes').find().toArray();
      console.log('\nNotes:', JSON.stringify(notes, null, 2));

    } catch (err) {
      console.error('✗ Error:', err.message);
    } finally {
      await client.close();
    }
  }

  test();
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env.production' });

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://vhass0310:Uday_123@cluster0.zndptf0.mongodb.net/vhass?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', mongoUri.replace(/:([^:@]+)@/, ':****@'));

const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose.connect(mongoUri, connectionOptions)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Connection state:', mongoose.connection.readyState);
    
    // Test a simple operation
    return mongoose.connection.db.admin().listDatabases();
  })
  .then((result) => {
    console.log('✅ Database list retrieved successfully');
    console.log('Available databases:', result.databases.map(db => db.name));
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error codeName:', error.codeName);
    
    if (error.code === 8000) {
      console.log('\n🔍 This is an authentication error. Possible solutions:');
      console.log('1. Check if the username/password is correct');
      console.log('2. Verify the database user exists in MongoDB Atlas');
      console.log('3. Check if the user has the right permissions');
    } else if (error.code === 18) {
      console.log('\n🔍 This is a network error. Possible solutions:');
      console.log('1. Check if MongoDB Atlas allows connections from all IP addresses');
      console.log('2. Go to MongoDB Atlas > Network Access > Add IP Address');
      console.log('3. Add 0.0.0.0/0 to allow all IP addresses');
    }
    
    process.exit(1);
  });

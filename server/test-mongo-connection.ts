import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env file (try multiple paths)
const envPaths = [
  path.resolve(__dirname, ".env"),           // server/.env
  path.resolve(__dirname, "../.env"),       // root/.env
  path.resolve(process.cwd(), ".env"),      // current directory
];

for (const envPath of envPaths) {
  if (require("fs").existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`📄 Loaded .env from: ${envPath}`);
    break;
  }
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gitdata";

async function testConnection() {
  console.log("🔍 Testing MongoDB connection...");
  console.log(`📋 URI: ${MONGODB_URI.replace(/:[^:@]+@/, ":****@")}`);
  console.log(`📋 Database: ${MONGODB_DB_NAME}`);
  console.log("");

  let client: MongoClient | null = null;

  try {
    // Create MongoDB client
    client = new MongoClient(MONGODB_URI);

    // Connect to MongoDB
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();

    console.log("✅ Successfully connected to MongoDB!");

    // Test database access
    const db = client.db(MONGODB_DB_NAME);
    const collections = await db.listCollections().toArray();
    console.log(`✅ Database '${MONGODB_DB_NAME}' is accessible`);
    console.log(`📊 Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log("   Collections list:");
      collections.forEach((col) => {
        console.log(`   - ${col.name}`);
      });
    }

    // Test ping
    await db.admin().ping();
    console.log("✅ Server ping successful");

    console.log("");
    console.log("🎉 MongoDB connection test passed!");

  } catch (error: any) {
    console.error("");
    console.error("❌ MongoDB connection test failed!");
    console.error(`Error: ${error.message}`);
    
    if (error.message.includes("authentication") || error.message.includes("Authentication failed")) {
      console.error("");
      console.error("💡 Tip: Check your username and password in .env file");
      console.error(`   Current URI: ${MONGODB_URI.replace(/:[^:@]+@/, ":****@")}`);
      console.error("   Make sure:");
      console.error("   1. Username and password are correct");
      console.error("   2. User exists in MongoDB");
      console.error("   3. User has proper permissions");
      console.error("   4. authSource parameter is correct");
    } else if (error.message.includes("ECONNREFUSED") || error.message.includes("timed out")) {
      console.error("");
      console.error("💡 Tip: Make sure MongoDB is running");
      console.error("   macOS: brew services start mongodb-community");
      console.error("   Linux: sudo systemctl start mongod");
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("");
      console.log("🔌 Connection closed");
    }
  }
}

testConnection();


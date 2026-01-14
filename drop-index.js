import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collection = db.collection('members');

        // List indexes
        const indexes = await collection.indexes();
        console.log("Indexes:", indexes);

        // Check for documents with id field
        const docsWithIdField = await collection.find({ id: { $exists: true } }).toArray();
        console.log("Documents with id field:", docsWithIdField.length);
        if (docsWithIdField.length > 0) {
            console.log("Sample:", docsWithIdField[0]);
        }

        // Unset id field from all documents
        const result = await collection.updateMany({}, { $unset: { id: 1 } });
        console.log("Unset id field from", result.modifiedCount, "documents");

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

connectDB();
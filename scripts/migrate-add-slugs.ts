import mongoose from "mongoose";
import Directory from "../models/Directory"; // Adjust path as needed

// Function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Function to ensure slug uniqueness
async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingDirectory = await Directory.findOne({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });

    if (!existingDirectory) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

const MONGODB_URI =
  "mongodb+srv://antonyefanov:9E9f3a4Antongogi@cluster0.xd3no.mongodb.net/prod?retryWrites=true&w=majority&appName=Cluster0";

async function migrateDirectories() {
  try {
    console.log("🚀 Starting migration to add slugs...");

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get all directories that don't have a slug
    const directories = await Directory.find({ slug: { $exists: false } });
    console.log(`📊 Found ${directories.length} directories to migrate`);

    if (directories.length === 0) {
      console.log("✅ No directories need migration");
      return;
    }

    // Process each directory
    for (let i = 0; i < directories.length; i++) {
      const directory = directories[i];
      const baseSlug = generateSlug(directory.name);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, directory._id);

      // Update the directory with the slug
      await Directory.findByIdAndUpdate(directory._id, { slug: uniqueSlug });

      console.log(
        `✅ [${i + 1}/${directories.length}] Updated "${directory.name}" with slug: "${uniqueSlug}"`,
      );
    }

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateDirectories()
    .then(() => {
      console.log("✅ Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateDirectories, generateSlug, ensureUniqueSlug };

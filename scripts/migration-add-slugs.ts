import mongoose from "mongoose";
import { Startup } from "@/models/Startup";
import { generateSlug } from "@/utils/generateSlug";

// Function to ensure slug uniqueness
async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingStartup = await Startup.findOne({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });

    if (!existingStartup) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

const MONGODB_URI =
  "mongodb+srv://antonyefanov:9E9f3a4Antongogi@cluster0.xd3no.mongodb.net/prod?retryWrites=true&w=majority&appName=Cluster0";

async function migrateStartups() {
  try {
    console.log("🚀 Starting migration to add slugs...");

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get all startups that don't have a slug
    const startups = await Startup.find({ slug: { $exists: false } });
    console.log(`📊 Found ${startups.length} startups to migrate`);

    if (startups.length === 0) {
      console.log("✅ No startups need migration");
      return;
    }

    // Process each startup
    for (let i = 0; i < startups.length; i++) {
      const startup = startups[i];
      const baseSlug = generateSlug(startup.name);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, startup._id);

      // Update the startup with the slug
      await Startup.findByIdAndUpdate(startup._id, { slug: uniqueSlug });

      console.log(
        `✅ [${i + 1}/${startups.length}] Updated "${startup.name}" with slug: "${uniqueSlug}"`,
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
  migrateStartups()
    .then(() => {
      console.log("✅ Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateStartups, generateSlug, ensureUniqueSlug };

// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // Add any custom metadata (optional)
      return { userId: "test-user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", file, "for user", metadata.userId);
    }),
} satisfies FileRouter;

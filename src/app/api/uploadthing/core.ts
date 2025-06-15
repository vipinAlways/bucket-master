import { createUploadthing} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();
const auth = () => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB" },
  }).middleware(async () => {
    const user = auth();
    if (!user) throw new UploadThingError("Unauthorized");
    return { userId: user.id };
  })
};




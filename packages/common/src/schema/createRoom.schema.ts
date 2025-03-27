import z from "zod";

const createRoomSchema = z.object({
    slug: z.string({
        message: "Slug is required",
    }),
});

export default createRoomSchema;
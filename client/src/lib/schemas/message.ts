import { ContentType } from "@prisma/client";
import { z } from "zod";

export const MessageCreateSchema = z.object({
  content: z.string().min(1, "Message cannot be empty!"),
  contentType: z.nativeEnum(ContentType),
  roomId: z.string().uuid("Invalid roomId ,please check again"),
  toId: z.string().uuid("Invalid toId ,please check again"),
});
export type MessageCreateInput = z.infer<typeof MessageCreateSchema>;

import * as z from "zod";

const traitSchema = z.object({
  type: z.string().min(1, "Trait type is required"),
  value: z.string().min(1, "Trait value is required"),
});

export const formScheme = z.object({
  tokenId: z.number().optional(),
  name: z.string(),
  description: z.string().max(255).optional(),
  image: z.instanceof(File),
  traits: z.array(traitSchema).optional(),
  collection: z.string().min(1, "Collection is required"),
});

import * as z from "zod";

export const formScheme = z.object({
  name: z.string(),
  symbol: z.string().max(10),
  image: z.instanceof(File),
});

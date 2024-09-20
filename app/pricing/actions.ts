"use server";
import { z } from "zod";

export async function newDayOff(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    offType: z.string(),
    offDate: z.string().nullable(),
    endOff: z.string().nullable(),
    startOff: z.string().nullable(),
    note: z.string(),
  });

  const parse = schema.safeParse({
    offType: formData.get("offType"),
    offDate: formData.get("offDate"),
    endOff: formData.get("endOff"),
    startOff: formData.get("startOff"),
    note: formData.get("note"),
  });

  console.log(parse.error);
  

  if (!parse.success) {
    return { message: "Parse failed!" };
  }

  const data = parse.data;

  console.log(data);

  return { message: "test"};
  

  // try {

  //   console.log(data);
    

  //   return { message: "Form successfully submitted" };
  // } catch (error) {
  //   return { message: "Internal error:" + error };
  // }
}

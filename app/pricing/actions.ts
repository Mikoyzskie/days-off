"use server";
import { z } from "zod";

import { createOffDays } from "@/libs/directus";

type ParsedDataType = {
  offType: string;
  offDate: string | null;
  endOff: string | null;
  startOff: string | null;
  note: string | null;
};

type creationPayload = {
  user: number;
  single: boolean;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  type: string;
};

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
    note: z.string().nullable(),
  });

  const parse = schema.safeParse({
    offType: formData.get("offType"),
    offDate: formData.get("offDate"),
    endOff: formData.get("endOff"),
    startOff: formData.get("startOff"),
    note: formData.get("note"),
  });

  if (!parse.success) {
    return { message: "Parse failed!" };
  }

  const data: ParsedDataType = parse.data;
  let isSingle = false;

  if (!data.offDate) {
    isSingle = true;
  }

  const actionPayload: creationPayload = {
    user: 22,
    single: isSingle,
    startDate: isSingle ? data.startOff : data.offDate,
    endDate: data.endOff ?? null,
    notes: data.note,
    type: data.offType,
  };

  try {
    const response = await createOffDays(actionPayload);

    if (!response) {
      return { messsage: "Directus error" };
    }

    return { message: "Off day added successfully!" };
  } catch (error) {
    return { message: "Internal error:" + error };
  }
}

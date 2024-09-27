"use server";
import { z } from "zod";

import { createOffDays, getUser, verifyPin } from "@/libs/directus";

type ParsedDataType = {
  offType: string;
  offDate: string | null;
  endOff: string | null;
  startOff: string | null;
  note: string | null;
  user: string;
};

type creationPayload = {
  user: number;
  single: boolean;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  type: string;
};

type UserDto = {
  id: number;
  Employee_Username: string;
  employee_pin: string;
};

export async function login(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    name: z.string(),
    password: z.string(),
  });

  const parse = schema.safeParse({
    name: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parse.success) {
    return { message: "Parse error", user_id: 0 };
  }

  const data = parse.data;

  try {
    const user = await getUser(data.name);
    const userData: UserDto[] = JSON.parse(user);

    if (userData.length === 0) {
      return { message: "User not found", user_id: 0 };
    }

    const isPasswordValid = await verifyPin(
      data.password,
      userData[0].employee_pin,
    );

    if (!isPasswordValid) {
      return { message: "Invalid Password", user_id: 0 };
    }

    return { message: "Login", user_id: userData[0].id };
  } catch (error) {
    return { message: "Internal Server Error", user_id: 0 };
  }
}

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
    user: z.string(),
  });

  const parse = schema.safeParse({
    offType: formData.get("offType"),
    offDate: formData.get("offDate"),
    endOff: formData.get("endOff"),
    startOff: formData.get("startOff"),
    note: formData.get("note"),
    user: formData.get("user"),
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
    await createOffDays(actionPayload);

    return { message: "Off day added successfully!" };
  } catch (error) {
    return { message: "Internal error:" + error };
  }
}

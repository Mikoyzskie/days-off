import { createDirectus, staticToken, rest, createItem } from "@directus/sdk";

const apiClient = process.env.DIRECTUS_API_KEY
  ? createDirectus("https://data.zanda.info")
      .with(staticToken("YQRwVAFUn-LlC_IOPoOkpVLeH75QBlyI"))
      .with(rest({ credentials: "include" }))
  : undefined;

const offDays: any = "Employee_Days_Off";

type creationPayload = {
  user: number;
  single: boolean;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  type: string;
};

export async function createOffDays(payload: creationPayload) {
  try {
    const data = await apiClient?.request(
      createItem(offDays, {
        Employee: payload.user,
        Single_Day: payload.single,
        Start_Day: payload.startDate,
        End_Date: payload.endDate,
        Notes: payload.notes,
        Day_Off_Type: payload.type,
      }),
    );

    return JSON.stringify(data);
  } catch (error) {
    return `${error}`;
  }
}

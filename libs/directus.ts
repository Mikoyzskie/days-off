import { createDirectus, staticToken, rest, createItem } from "@directus/sdk";

const apiClient = process.env.DIRECTUS_API_KEY
  ? createDirectus("https://data.zanda.info")
      .with(staticToken("YQRwVAFUn-LlC_IOPoOkpVLeH75QBlyI"))
      .with(rest({ credentials: "include" }))
  : undefined;

const offDays: any = "Employee_Days_Off";

export async function createOffDays(
  user: number,
  single: false,
  startDate: string,
  endDate: string,
  notes: string | null,
  type: string,
) {
  try {
    const data = await apiClient?.request(
      createItem(offDays, {
        Employee: user,
        Single_Day: single,
        Start_Day: startDate,
        End_Date: endDate,
        Notes: notes,
        Day_Off_Type: type,
      }),
    );

    return JSON.stringify(data);
  } catch (error) {
    return `${error}`;
  }
}

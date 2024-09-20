"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { DatePicker, DateRangePicker } from "@nextui-org/date-picker";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getLocalTimeZone, today } from "@internationalized/date";

import { newDayOff } from "./actions";

const offTypes = [
  { type: "Leave Day" },
  { type: "Points Off Day" },
  { type: "Travel Day" },
  { type: "Travel and Points Off Day" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="border-[]"
      isDisabled={pending}
      radius="full"
      type="submit"
      variant="ghost"
    >
      {pending ? "Submitting" : "Submit"}
    </Button>
  );
}

type InitialState = {
  message: string;
};

const initialState: InitialState = {
  message: "",
};

export default function PricingPage() {
  const [isSingle, setIsSingle] = useState<boolean>(false);
  const [state, formAction] = useFormState(newDayOff, initialState);
  const [message, setMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      setMessage(state.message);
    }
  }, [state]);

  return (
    <div className="w-full">
      <form
        ref={formRef}
        action={formAction}
        className="flex justify-center flex-col gap-5 max-w-[320px] w-full mx-auto"
      >
        <Select
          isRequired
          className="max-w-xs"
          label="Day Off Type"
          name="offType"
          placeholder="Select a type"
        >
          {offTypes.map((types) => (
            <SelectItem key={types.type.toLocaleLowerCase()}>
              {types.type}
            </SelectItem>
          ))}
        </Select>
        <div className="flex justify-between items-center flex-row">
          <span className="ml-2">Single Day</span>
          <Switch isSelected={isSingle} onValueChange={setIsSingle} />
        </div>
        {isSingle ? (
          <DatePicker
            isRequired
            label="Off Date"
            minValue={today(getLocalTimeZone())}
            name="offDate"
          />
        ) : (
          <DateRangePicker
            isRequired
            endName="endOff"
            label="Off Duration"
            minValue={today(getLocalTimeZone())}
            startName="startOff"
            visibleMonths={2}
          />
        )}
        <Textarea
          className="max-w-xs"
          label="Note"
          labelPlacement="outside"
          name="note"
          placeholder="Enter your description"
          variant="bordered"
        />
        <span>{message}</span>
        <SubmitButton />
      </form>
    </div>
  );
}

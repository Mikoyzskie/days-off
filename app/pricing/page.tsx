"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { DatePicker, DateRangePicker } from "@nextui-org/date-picker";
import { Textarea, Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getLocalTimeZone, today } from "@internationalized/date";

import { newDayOff, login } from "./actions";

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

type InitialLeaveState = {
  message: string;
};

const initialLeaveState: InitialLeaveState = {
  message: "",
};

type InitialLoginState = {
  user_id: number;
  message: string;
};

const initialLoginState: InitialLoginState = {
  user_id: 0,
  message: "",
};

export default function PricingPage() {
  const [isSingle, setIsSingle] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<number>(0);
  const [leaveState, leaveFormAction] = useFormState(
    newDayOff,
    initialLeaveState,
  );
  const [loginState, loginFormAction] = useFormState(login, initialLoginState);
  const [message, setMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (leaveState.message) {
      setMessage(leaveState.message);
    }
  }, [leaveState]);

  useEffect(() => {
    if (loginState.user_id) {
      setCurrentUser(loginState.user_id);
      localStorage.setItem("currentUser", loginState.user_id.toString());
    }
  }, [leaveState]);

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUser");

    if (currentUserId) {
      setCurrentUser(Number(currentUserId));
    }
  }, []);

  const handleSignout = useCallback(() => {
    setCurrentUser(0);
    localStorage.removeItem("currentUser");
  }, []);

  return (
    <div className="w-full">
      {currentUser !== 0 ? (
        <form
          ref={formRef}
          action={leaveFormAction}
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
          <input name="user" type="hidden" value={currentUser} />
          <span>{message}</span>
          <SubmitButton />
          <Button onClick={handleSignout}>Sign Out</Button>
        </form>
      ) : (
        <form
          action={loginFormAction}
          className="flex justify-center flex-col gap-5 max-w-[320px] w-full mx-auto"
        >
          <Input
            isRequired
            label="Username"
            name="username"
            placeholder="Enter your clock in username"
          />
          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your clock in pin"
            type="password"
          />
          <SubmitButton />
        </form>
      )}
    </div>
  );
}

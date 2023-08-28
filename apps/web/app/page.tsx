import { Button, Header } from "ui";
import { UmiTerminalModal } from "@umi-ag/terminal";

export default function Page(): JSX.Element {
  return (
    <>
      <Header text="Web" />
      <Button />
      <UmiTerminalModal isOpen />
    </>
  );
}

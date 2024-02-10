import { redirect } from 'next/navigation';
import { Button, Header } from 'ui';

export default function Page(): JSX.Element {
  redirect('/swap');

  return (
    <>
      <Header text="Web2" />
      <Button />
    </>
  );
}

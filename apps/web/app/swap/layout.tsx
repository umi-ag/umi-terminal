export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // return <>{children}</>;
  return (
    <div style={{ background: '#efefef', height: '100vh' }}>
      {children}
    </div>
  )
}
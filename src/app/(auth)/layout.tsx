export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2E6D8] text-[#2d1f17] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 antialiased selection:bg-[#555934] selection:text-white">
      {children}
    </div>
  );
}

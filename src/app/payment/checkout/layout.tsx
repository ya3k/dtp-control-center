import Image from "next/image";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <footer className="relative mx-auto max-w-6xl py-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Image
            width={400}
            height={400}
            src="/images/binhdinhtour3.png"
            alt="logo"
            priority
            className="h-10 w-auto object-cover"
          />
        </div>
        <p className="text-xs text-[#101010]">
          © {new Date().getFullYear()} binhdinhtour. All rights reserved.
        </p>
      </footer>
    </>
  );
}

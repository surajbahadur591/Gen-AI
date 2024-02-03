export default function authLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex items-center justify-center h-full">{children}</div>
    );
}

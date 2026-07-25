import MenuNavbar from "@/components/menu/menu-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
    <MenuNavbar/>
    {children}
    </section>
}
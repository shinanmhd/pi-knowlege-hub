import { LandlordShell } from '@/components/layout/landlord-shell'

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return <LandlordShell>{children}</LandlordShell>
}

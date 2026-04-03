import { LandlordShell } from '@/components/layout/landlord-shell'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function LandlordLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  return <LandlordShell user={session.user}>{children}</LandlordShell>
}

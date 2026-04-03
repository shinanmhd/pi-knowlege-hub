import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const metadata = { title: 'Login | Pinetworks Admin' }

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-canvas p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-ink">Welcome Back</CardTitle>
          <CardDescription>Sign in to the Pinetworks Landlord Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server"
              await signIn("azure-ad", { redirectTo: "/dashboard" })
            }}
          >
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dim text-white">
              Sign in with Microsoft
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

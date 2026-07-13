import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Welcome to Incipit.</h1>
            <FieldDescription>
                Don&apos;t have an account? Contact your system administrator.
            </FieldDescription>
            </div>
            <Field>
            <Button>
              <a href="/auth/login">Continue with SSO</a>
            </Button>
            </Field>
        </FieldGroup>
    </div>
  )
}

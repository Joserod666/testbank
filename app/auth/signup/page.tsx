import { MPCAuth } from "@/components/auth/mpc-auth"

export default function SignUpPage() {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<MPCAuth mode="signup" />
		</div>
	)
}


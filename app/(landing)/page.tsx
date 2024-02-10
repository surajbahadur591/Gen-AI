'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";


const LandingPage = () => {
    const router = useRouter();
    const userId = localStorage.getItem('clerk-db-jwt')
    if (userId) {
        router.push('/dashboard')
    }
    return (
        <div>
            LandingPage (unprotected)
            <Link href='sign-up'>
                <Button>Register</Button>

            </Link>

            <Link href='sign-in'>
                <Button>Login</Button>

            </Link>

        </div>
    );
}

export default LandingPage;

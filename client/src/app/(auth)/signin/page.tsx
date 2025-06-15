"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { UserSigninSchema } from "@/lib/schemas/user";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/c";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  async function HandleSubmit() {
    console.log(`${email.trim().toLowerCase()} ${password.trim()}`);

    setLoader(true);
    try {
      const zodCheck = UserSigninSchema.safeParse({ email, password });
      if (!zodCheck.error) {
        toast.error(`${zodCheck.error}`);
        console.log(zodCheck.error);
        return;
      }
      const response = await signIn("credentials", {
        redirect: false,
        email: String(email).trim().toLowerCase(),
        password: String(password).trim(),
        callbackUrl,
      });

      console.log("response", response);

      if (response?.error) {
        if (response.error === "CredentialsSignin") {
          toast.error("Invalid email or password");
          setLoader(false);
          return;
        }
      }
      if (response.ok) {
        toast.success("Login successful✅");
        setLoader(false);
        console.log(callbackUrl);

        router.replace(callbackUrl);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  return (
    <div>
      <div>
        <Button onClick={() => signIn("google", { redirectTo: "/c" })}>
          Sign in with Google
        </Button>
      </div>
      <div>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="email"
        />
      </div>
      <div>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          placeholder="password"
        />
      </div>
      <div>
        <Button onClick={HandleSubmit} className="cursor-pointer">
          {loader ? <Spinner /> : "Sign in"}
        </Button>
      </div>
      <Link href={"/signup"}>Signup here</Link>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  async function HandleSubmit() {
    console.log(`${email.trim().toLowerCase()} ${password.trim()}`);

    setLoader(true);
    try {
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
          Sign in
        </Button>
      </div>
    </div>
  );
}

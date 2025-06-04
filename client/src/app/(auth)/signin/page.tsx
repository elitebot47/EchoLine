"use client";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import Router from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  async function HandleSubmit() {
    const response = await signIn("credentials", {
      redirect: false,
      email: email.trim().toLowerCase(),
      password: password.trim(),
      callbackUrl,
    });

    if (response?.error) {
      if (response.error === "CredentialsSignin") {
        toast.error("Invalid email or password");
      }
    }
    if (response.ok) {
      toast.success("Login successful✅");
      Router.replace(callbackUrl);
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

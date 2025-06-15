"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { UserCreateSchema } from "@/lib/schemas/user";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  async function HandleSignup() {
    setLoader(true);
    const zodCheck = UserCreateSchema.safeParse({ email, password, name });
    if (!zodCheck.error) {
      toast.error(`${zodCheck.error}`);
      console.log(zodCheck.error);
      setLoader(false);
      return;
    }

    try {
      const res = await axios.post(`/api/signup`, {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        name: name.trim(),
      });
      console.log(`response form signup route:${res.data.message}`);
      toast.success(res.data.message);

      setLoader(false);
      router.push("/signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("User already exists!,try logging in.");
      } else {
        toast.error("Network error. Check your connection.");
      }
    } finally {
      setLoader(false);
    }
  }
  return (
    <div>
      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="name"
        />
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
        <Button onClick={HandleSignup}>
          {loader ? <Spinner /> : "Signup"}
        </Button>
      </div>
      <Link href={"/signin"}>Signup here</Link>
    </div>
  );
}

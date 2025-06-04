"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loader, setLoader] = useState(false);

  async function HandleSignup() {
    setLoader(true);
    if (!email || !password || !name) {
      toast.error("All fields are required!");
      setLoader(false);
      return;
    }
    try {
      const res = await axios.post(`/api/signup`, {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        name: name.trim(),
      });
      console.log(`response form signup route:${res.data}`);

      toast.success(res.data.message);
      setLoader(false);
    } catch (error) {
      console.log(`${error}`);

      toast.error(`${error}`);
      setLoader(false);
      return;
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
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function HandleSignup() {
    if (!email || !password || !name) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const res = await axios.post(`/signup`, {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        name: name.trim(),
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(`${error}`);
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
        <Button onClick={HandleSignup}>Signup</Button>
      </div>
    </div>
  );
}

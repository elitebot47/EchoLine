"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { UserCreateSchema } from "@/lib/schemas/user";
import axios from "axios";
import { Check } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function HandleSignup() {
    setLoader(true);
    const zodCheck = UserCreateSchema.safeParse({ email, password, name });
    if (!zodCheck.success) {
      toast.error(zodCheck.error.errors[0].message);
      setLoader(false);
      return;
    }
    try {
      const res = await axios.post(`/api/signup`, {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        name: name.trim(),
      });
      toast.success(res.data.message);
      router.push("/signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("User already exists! Try logging in.");
      } else {
        toast.error("Network error. Check your connection.");
      }
    } finally {
      setLoader(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      HandleSignup();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Sign up to access exclusive features and connect with thousands of
            users.
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Easy to use interface
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Secure and private
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              24/7 customer support
            </li>
          </ul>
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Sign up with your email or Google
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full cursor-pointer flex items-center justify-center gap-2 mb-6 border-gray-300"
            onClick={() => signIn("google", { callbackUrl })}
          >
            <div className="gap-2 flex items-center">
              <Image
                width={20}
                height={20}
                alt="Google"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIvPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiwxNC42OTFsNi41NzEsNC44MTlDMTQuNjU1LDE1LjEwOCwxOC45NjEsMTIsMjQsMTJjMy4wNTksMCw1Ljg0MiwxLjE1NCw3Ljk2MSwzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYsNi4wNTMsMjkuMjY4LDQsMjQsNEMxNi4zMTgsNCw5LjY1Niw4LjMzNyw2LjMwNiwxNC42OTF6Ii8+PHBhdGggZmlsbD0iIzRDQUY1MCIgZD0iTTI0LDQ0YzUuMTY2LDAsOS44Ni0xLjk3NywxMy40MDktNS4xOTJsLTYuMTktNS4yMzhDMjkuMjExLDM1LjA5MSwyNi43MTUsMzYsMjQsMzZjLTUuMjAyLDAtOS42MTktMy4zMTctMTEuMjgzLTcuOTQ2bC02LjUyMiw1LjAyNUM5LjUwNSwzOS41NTYsMTYuMjI3LDQ0LDI0LDQ0eiIvPjxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIvPjwvc3ZnPg=="
              />
              <div>Continue with Google </div>
            </div>
          </Button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <div className="space-y-5">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Full Name"
              className="px-4 py-3 text-lg"
              required
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              type="email"
              placeholder="Email"
              className="px-4 py-3 text-lg"
              required
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              type="password"
              placeholder="Password"
              className="px-4 py-3 text-lg"
              required
              minLength={6}
            />
            <Button
              className="w-full cursor-pointer py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              disabled={loader}
              onClick={HandleSignup}
            >
              {loader ? <Spinner className="mr-2" /> : "Sign Up"}
            </Button>
          </div>

          <div className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

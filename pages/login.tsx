"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Input  from "@/components/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tractor, Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import useLogin from "@/hooks/useLogin";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const router = useRouter();
  const { errors, touched, getFieldProps, loading, onSubmit } = useLogin();

  useEffect(() => {
    const userSessionToken = localStorage.getItem("user_session");
    if (userSessionToken) {
      router.push("/dashboard");
    }
  }, [router]);
  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     // In a real app, this would be an API call to authenticate the user
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // Simulate successful login
  //     if (
  //       formData.email === "demo@hellotractor.com" &&
  //       formData.password === "password"
  //     ) {
  //       router.push("/dashboard");
  //     } else {
  //       setError(
  //         "Invalid email or password. Try using demo@hellotractor.com / password"
  //       );
  //     }
  //   } catch (err) {
  //     setError(err + "An error occurred during login. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Tractor className="h-10 w-10 text-orange-500" />
            <h1 className="text-3xl font-bold text-orange-600">
              Hello Tractor
            </h1>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => router.push("/register")}
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        isDirty={
                          errors.username && touched.username ? true : false
                        }
                        fieldProps={getFieldProps("username")}
                        error={errors.username}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-orange-600 hover:text-orange-800"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  isDirty={errors.password && touched.password ? true : false}
                  fieldProps={getFieldProps("password")}
                  error={errors.password}
                />{" "}
                <div
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </div>
              </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleChange("rememberMe", !!checked)
                      }
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Remember me for 30 days
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={loading} onClick={onSubmit}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            <div className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                Sign up
              </Link>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500">
              Demo credentials: demo@hellotractor.com / password
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
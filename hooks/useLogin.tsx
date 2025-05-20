// hooks/useLogin.tsx
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const validationSchema = yup.object({
  username: yup.string().email().required("Email or username required"),
  password: yup.string().required("Password is required"),
});

export default function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { errors, touched, getFieldProps, values } = useFormik({
    validationSchema,
    initialValues: { username: "", password: "" },
    onSubmit: loginUser,
  });

  async function loginUser() {
    setLoading(true);
    try {
      const res = await axios.post("/api/login", {
        email: values.username,
        password: values.password,
      });
      
      setLoading(false);
      if (res.data?.token) {
        const { token } = res.data;
        localStorage.setItem("user_session", token);

        // Remove token after 1 hour
        setTimeout(() => {
          localStorage.removeItem("user_session");
        }, 3600000); // 1 hour in milliseconds

        router.push("/dashboard");
        toast.success("Logged in successfully");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("An error occurred while logging in");
    }
  }

  return {
    loading,
    onSubmit: loginUser,
    errors,
    touched,
    getFieldProps,
    values,
  };
}

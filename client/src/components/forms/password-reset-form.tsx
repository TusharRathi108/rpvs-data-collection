//* package imports
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

//* file imports
import {
  resetPasswordSchema,
  type resetPasswordFormValues,
} from "@/schemas/reset-password.schema";

//* api imports
import {
  useLogoutMutation,
  useResetPasswordMutation,
} from "@/store/services/auth.api";

//* component imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form-error";
import CardWrapper from "@/components/card-wrapper";
import FormSuccess from "@/components/form-success";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { clearUser } from "@/store/slices/auth-slice";
import { useDispatch } from "react-redux";

const PasswordReset = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [logout] = useLogoutMutation();

  const form = useForm<resetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      username: "",
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values: resetPasswordFormValues) => {
    try {
      setError("");
      setSuccess("");

      // Reset password
      const response = await resetPassword(values).unwrap();
      setSuccess(response.message || "Password updated successfully");

      // Logout immediately
      await logout().unwrap();
      dispatch(clearUser());

      // Redirect to login
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <CardWrapper headerLabel="Update Password">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="username"
                      className="focus-visible:ring-1 focus-visible:ring-blue-800"
                      placeholder="john.doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="focus-visible:ring-1 focus-visible:ring-blue-800"
                        placeholder="**********"
                      />
                      {showPassword ? (
                        <FaRegEyeSlash
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-[10px] top-[10px]"
                        />
                      ) : (
                        <FaRegEye
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-[10px] top-[10px]"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="focus-visible:ring-1 focus-visible:ring-blue-800"
                        placeholder="**********"
                      />
                      {showPassword ? (
                        <FaRegEyeSlash
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-[10px] top-[10px]"
                        />
                      ) : (
                        <FaRegEye
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-[10px] top-[10px]"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full bg-black text-white">
            {isLoading ? "Updating password...." : "Update Password"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default PasswordReset;

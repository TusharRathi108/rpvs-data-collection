//* package imports
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

//* file imports
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { type RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form-error";
import { setUser } from "@/store/slices/auth-slice";
import CardWrapper from "@/components/card-wrapper";
import FormSuccess from "@/components/form-success";
import { LoginSchema } from "@/schemas/login-form.schema";
import { useLoginMutation } from "@/store/services/auth.api";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { DataTable } from "@/components/data-table/data-table";
import { getDistrictProposalColumns } from "@/components/data-table/columns";
import { useGetDistrictWiseProposalCountQuery } from "@/store/services/proposal.api";

// const districtProposalData = [
//   { district_name: "Amritsar", proposal_entered_count: 52 },
//   { district_name: "Ludhiana", proposal_entered_count: 74 },
//   { district_name: "Bathinda", proposal_entered_count: 39 },
// ];

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blockLogin = import.meta.env.VITE_LOCK_LOGIN === "true";
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: proposalCount } = useGetDistrictWiseProposalCountQuery();

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: { username: string; password: string }) => {
    setError("");
    setSuccess("");

    try {
      const result = await login(values).unwrap();
      const user = result.records;

      // console.log("USER IN LOGIN FORM: ", user);

      dispatch(
        setUser({
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role_name: user.role_name,
          password_reset: user.password_reset,
          state_code: "03",
          state_name: "Punjab",
          district_code: user.district_code,
          district_name: user.district_name,
          district: user.district,
        })
      );

      setSuccess("Success!");
      toast.success("Login successful");
      navigate("/homePage", { replace: true });
    } catch (error: any) {
      setError("Failed!");
      // console.log(error)
      toast.error(error.data || "Login failed");
    } finally {
      setError("");
      setSuccess("");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/homepage", { replace: true });
    }
  }, [user, navigate]);

  return (
    <main className="relative h-screen flex flex-col justify-center items-center gap-7 bg-[radial-gradient(ellipse_at_top,theme(colors.sky.400),theme(colors.blue.800))] text-white">
      {blockLogin ? (
        ""
      ) : (
        <h1 className="bg-yellow-300 rounded-2xl p-5 text-black text-3xl text-center border-3 border-dotted border-black">
          {/* <p>Data Entry for testing allowed till 1 PM ( Today )</p> */}
          {/* <p>Live entries shall be started from 3 PM ( 8th October 2025 )</p> */}
          <p>Portal enabled for 'LIVE ENTRIES'</p>
        </h1>
      )}
      <h1 className="text-5xl font-semibold text-white drop-shadow-md">
        Rangla Punjab Vikas Scheme
      </h1>
      <div className="flex flex-col lg:flex-row gap-10">
        <CardWrapper headerLabel="Login">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  disabled={blockLogin ? true : false}
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
                  disabled={blockLogin ? true : false}
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
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
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardWrapper>
        <DataTable
          columns={getDistrictProposalColumns()}
          data={proposalCount?.records || []}
          searchKey="district_name"
          showColumnSelector={false}
          defaultPageSize={10}
        />
      </div>
    </main>
  );
};

export default LoginPage;

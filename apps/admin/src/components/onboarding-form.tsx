import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import Loader from "./loader";
import { useEffect } from "react";

export default function OnboardingForm() {
  const navigate = useNavigate({ from: "/register/onboarding" });
  const { refetch, data } = authClient.useSession()

  const updateChurch = useMutation(
    trpc.admin.church.update.mutationOptions({
      onSuccess: () => {
        toast.success("Church details saved successfully!");
        navigate({ to: "/dashboard" });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to save church details");
      },
    })
  );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Kenya",
      website: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      await updateChurch.mutateAsync(value);
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(3, "Church name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Valid phone number is required"),
        address: z.string(),
        city: z.string(),
        country: z.string().min(2, "Country is required"),
        website: z.string().url("Invalid URL").or(z.literal("")),
        description: z.string(),
      }),
    },
  });

  useEffect(() => {
    refetch()
  }, [])

  console.log({ data })

  if (updateChurch.isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Church Details</h1>
        <p className="text-muted-foreground mt-2">
          Tell us more about your church to complete the setup.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="col-span-full">
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Church Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Grace Community Church"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error: any) => (
                  <p key={error} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Church Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="info@church.org"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error: any) => (
                  <p key={error} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="phone">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Phone Number</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="+254 700 000000"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error: any) => (
                  <p key={error} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div className="col-span-full">
          <form.Field name="address">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Physical Address</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Opposite Plaza, Street Name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="city">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>City</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Nairobi"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="country">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Country</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Kenya"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="col-span-full">
          <form.Field name="website">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Website (Optional)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="https://church.org"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error: any) => (
                  <p key={error} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div className="col-span-full">
          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Short Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="About our church..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="col-span-full mt-4">
          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full text-lg h-12"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}

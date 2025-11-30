import { trpc } from "@/utils/trpc"
import { useMutation } from "@tanstack/react-query"

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function InviteForm() {
  const { mutateAsync, isPending } = useMutation(trpc.invites.create.mutationOptions())

	const form = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			await mutateAsync({
				email: value.email,
      }, {
					onSuccess: () => {
						toast.success("Added to waitlist!", {
              description: "You'll be notified when Church Manager is ready to use.",
            });
            form.reset();
					},
					onError: (error) => {
						toast.error(error.message);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-500">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>
				<form.Subscribe>
					{(state) => (
						<Button
							type="submit"
							className="w-full"
							disabled={!state.canSubmit || state.isSubmitting}
              variant={state.isSubmitting ? "outline" : "secondary"}
						>
							{state.isSubmitting ? "Submitting..." : "Get Notified"}
						</Button>
					)}
				</form.Subscribe>
			</form>
	);
}

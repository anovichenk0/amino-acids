import { useForm } from "react-hook-form";
import { schema } from "./model";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "../form";
import { Input } from "../input";
import { Button } from "../button";
import type { z } from "zod";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useAminoContext } from "../AminoContext";

type Props = ComponentProps<"form"> & {
    onFormSubmit?: (values: z.infer<typeof schema>) => void;
};

const AminoForm = ({ className, onFormSubmit, ...props }: Props) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            aminoFirst: "",
            aminoSecond: "",
        },
    });
    const { setAminos } = useAminoContext();

    const onSubmit = (values: z.infer<typeof schema>) => {
        onFormSubmit?.(values);
        setAminos(values);
    };

    return (
        <Form {...props} {...form}>
            <form
                id="amino-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, "space-y-5")}
                {...props}
            >
                <div className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="aminoFirst"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex-1">
                                    Первая аминокислота
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="aminoSecond"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Вторая аминокислота</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button form="amino-form" type="submit">
                        Обновить
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AminoForm;

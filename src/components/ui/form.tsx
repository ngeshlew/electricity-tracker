import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = FormProvider as unknown as <TFieldValues extends FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined>(props: React.PropsWithChildren<{ value: import('react-hook-form').UseFormReturn<TFieldValues, TContext, TTransformedValues> }>) => React.ReactElement

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return <Controller {...props} />
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  ({ className, ...props }, ref) => <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium", className)} {...props} />
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
))
FormControl.displayName = "FormControl"

const FormMessage = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const body = children ? String(children) : null
  return body ? <p className={cn("text-sm text-destructive", className)}>{body}</p> : null
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }


import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  FileText,
  Send,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  clientId: z.string().min(1, { message: "Client is required" }),
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, { message: "Description is required" }),
        quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
        unitPrice: z
          .number()
          .min(0, { message: "Unit price must be at least 0" }),
        taxRate: z.number().min(0, { message: "Tax rate must be at least 0" }),
      }),
    )
    .min(1, { message: "At least one item is required" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  initialData?: FormValues;
  clients?: { id: string; name: string }[];
  onSubmit?: (data: FormValues) => void;
  onGeneratePdf?: (data: FormValues) => void;
  onSendEmail?: (data: FormValues) => void;
}

const InvoiceForm = ({
  initialData,
  clients = [
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "Wayne Enterprises" },
    { id: "3", name: "Stark Industries" },
  ],
  onSubmit = () => {},
  onGeneratePdf = () => {},
  onSendEmail = () => {},
}: InvoiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const defaultValues: FormValues = initialData || {
    clientId: "",
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    items: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
      },
    ],
    notes: "",
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  const calculateSubtotal = () => {
    return watchItems.reduce((total, item) => {
      return total + (item.quantity || 0) * (item.unitPrice || 0);
    }, 0);
  };

  const calculateTax = () => {
    return watchItems.reduce((total, item) => {
      return (
        total +
        ((item.quantity || 0) * (item.unitPrice || 0) * (item.taxRate || 0)) /
          100
      );
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePdf = async () => {
    const data = await handleSubmit((formData) => formData)();
    if (data) {
      setIsGeneratingPdf(true);
      try {
        await onGeneratePdf(data);
      } finally {
        setIsGeneratingPdf(false);
      }
    }
  };

  const handleSendEmail = async () => {
    const data = await handleSubmit((formData) => formData)();
    if (data) {
      setIsSendingEmail(true);
      try {
        await onSendEmail(data);
      } finally {
        setIsSendingEmail(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl">Create Invoice</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Controller
                control={control}
                name="clientId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="clientId"
                      className={cn(errors.clientId && "border-red-500")}
                    >
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.clientId && (
                <p className="text-sm text-red-500">
                  {errors.clientId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                {...register("invoiceNumber")}
                className={cn(errors.invoiceNumber && "border-red-500")}
              />
              {errors.invoiceNumber && (
                <p className="text-sm text-red-500">
                  {errors.invoiceNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Controller
                control={control}
                name="issueDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          errors.issueDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.issueDate && (
                <p className="text-sm text-red-500">
                  {errors.issueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          errors.dueDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    taxRate: 0,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-2 p-4 bg-muted text-sm font-medium">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Tax Rate (%)</div>
                <div className="col-span-1"></div>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 p-4 border-t items-center"
                >
                  <div className="col-span-5">
                    <Input
                      {...register(`items.${index}.description` as const)}
                      className={cn(
                        errors.items?.[index]?.description && "border-red-500",
                      )}
                      placeholder="Item description"
                    />
                    {errors.items?.[index]?.description && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.items?.[index]?.description?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      {...register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                      })}
                      className={cn(
                        "text-center",
                        errors.items?.[index]?.quantity && "border-red-500",
                      )}
                      min="1"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.items?.[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unitPrice` as const, {
                        valueAsNumber: true,
                      })}
                      className={cn(
                        "text-center",
                        errors.items?.[index]?.unitPrice && "border-red-500",
                      )}
                      min="0"
                    />
                    {errors.items?.[index]?.unitPrice && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.items?.[index]?.unitPrice?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`items.${index}.taxRate` as const, {
                        valueAsNumber: true,
                      })}
                      className={cn(
                        "text-center",
                        errors.items?.[index]?.taxRate && "border-red-500",
                      )}
                      min="0"
                    />
                    {errors.items?.[index]?.taxRate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.items?.[index]?.taxRate?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1 text-center">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="p-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register("notes")}
              className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Additional notes or payment instructions"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Invoice"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isGeneratingPdf ? "Generating..." : "Generate PDF"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSendingEmail ? "Sending..." : "Send via Email"}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InvoiceForm;

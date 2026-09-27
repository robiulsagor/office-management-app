"use client";

import { useEffect, useState } from "react";
import { createExpense } from "@/actions/expenses/create-expense";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExpenseCategoryData,
  getExpenseCategories,
} from "@/actions/expenses/get-expense-categories";
import toast from "react-hot-toast";

type ExpenseFormProps = {
  onSuccess?: () => void;
};

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [categories, setCategories] = useState<ExpenseCategoryData[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const categoryItems = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true);

      const result = await getExpenseCategories();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.message || "Failed to load expense categories.");
      }

      setIsLoadingCategories(false);
    }

    loadCategories();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!date) {
      setError("Expense date is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select an expense category.");
      return;
    }

    if (!amount) {
      setError("Expense amount is required.");
      return;
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numericAmount < 0) {
      setError("Expense amount cannot be negative.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createExpense({
        date,
        categoryId,
        amount: numericAmount,
        description: description.trim() || undefined,
      });

      if (!result.success) {
        setError(result.message || "Failed to create expense.");
        return;
      }

      setMessage(result.message);

      setDate(new Date().toISOString().split("T")[0]);
      setCategoryId("");
      setAmount("");
      setDescription("");

      onSuccess?.();
      toast.success("Expense created successfully!");
    } catch (error) {
      console.error("Create expense form error:", error);
      setError("Something went wrong while creating the expense.");
      toast.error("Failed to create expense.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date */}
      <div className="space-y-2">
        <label htmlFor="expense-date" className="text-sm font-medium">
          Expense Date
        </label>

        <Input
          id="expense-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>

        <Select
          items={categoryItems}
          value={categoryId}
          onValueChange={(value) => setCategoryId(value ?? "")}
          disabled={isSubmitting || isLoadingCategories}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingCategories
                  ? "Loading categories..."
                  : "Select category"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="expense-amount" className="text-sm font-medium">
          Amount
        </label>

        <Input
          id="expense-amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="expense-description" className="text-sm font-medium">
          Description
        </label>

        <Textarea
          id="expense-description"
          placeholder="Optional description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isSubmitting}
          rows={4}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {message}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting || isLoadingCategories}>
        {isSubmitting ? "Saving..." : "Add Expense"}
      </Button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createExpense } from "@/actions/expenses/create-expense";
import { updateExpense } from "@/actions/expenses/update-expense";
import {
  getExpenseCategories,
  type ExpenseCategoryData,
} from "@/actions/expenses/get-expense-categories";
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
import toast from "react-hot-toast";

type ExpenseItemForm = {
  rowId: number;
  categoryId: string;
  amount: string;
  description: string;
};

type ExpenseFormProps = {
  mode?: "add" | "edit";
  expense?: {
    id: string;
    date: string;
    categoryId: string;
    amount: number;
    description?: string;
  };
  onSuccess?: () => void;
};

export default function ExpenseForm({
  mode = "add",
  expense,
  onSuccess,
}: ExpenseFormProps) {
  const [categories, setCategories] = useState<ExpenseCategoryData[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [date, setDate] = useState(
    expense?.date ?? new Date().toISOString().split("T")[0],
  );
  const [items, setItems] = useState<ExpenseItemForm[]>([
    {
      rowId: 1,
      categoryId: expense?.categoryId ?? "",
      amount: expense ? String(expense.amount) : "",
      description: expense?.description ?? "",
    },
  ]);
  const [nextRowId, setNextRowId] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categoryItems = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getExpenseCategories();

        if (result.success) {
          setCategories(result.data);
        } else {
          setError(result.message || "Failed to load expense categories.");
        }
      } catch {
        setError("Failed to load expense categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function updateItem(
    rowId: number,
    field: "categoryId" | "amount" | "description",
    value: string,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.rowId === rowId ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        rowId: nextRowId,
        categoryId: "",
        amount: "",
        description: "",
      },
    ]);
    setNextRowId((current) => current + 1);
  }

  function removeItem(rowId: number) {
    setItems((current) => current.filter((item) => item.rowId !== rowId));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!date) {
      setError("Expense date is required.");
      return;
    }

    if (items.length === 0) {
      setError("Add at least one expense item.");
      return;
    }

    for (const item of items) {
      if (!item.categoryId) {
        setError("Please select a category for every item.");
        return;
      }

      if (item.amount.trim() === "") {
        setError("Please enter an amount for every item.");
        return;
      }

      const amount = Number(item.amount);

      if (!Number.isFinite(amount) || amount < 0) {
        setError("Please enter a valid non-negative amount for every item.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result =
        mode === "edit" && expense
          ? await updateExpense({
              id: expense.id,
              date,
              categoryId: items[0].categoryId,
              amount: Number(items[0].amount),
              description: items[0].description.trim() || undefined,
            })
          : await createExpense({
              date,
              items: items.map((item) => ({
                categoryId: item.categoryId,
                amount: Number(item.amount),
                description: item.description.trim() || undefined,
              })),
            });

      if (!result.success) {
        setError(result.message || "Failed to save expenses.");
        return;
      }

      toast.success(result.message || "Expenses saved successfully.");

      if (mode === "add") {
        setDate(new Date().toISOString().split("T")[0]);
        setItems([
          {
            rowId: nextRowId,
            categoryId: "",
            amount: "",
            description: "",
          },
        ]);
        setNextRowId((current) => current + 1);
      }

      onSuccess?.();
    } catch (submitError) {
      console.error("Expense form error:", submitError);
      setError("Something went wrong while saving expenses.");
      toast.error("Failed to save expenses.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div className="space-y-2">
        <label htmlFor="expense-date" className="text-sm font-medium">
          Expense Date
        </label>
        <Input
          className="text-sm"
          id="expense-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {items.map((item, index) => (
        <div key={item.rowId} className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Expense Item {index + 1}</h3>

            {mode === "add" && items.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeItem(item.rowId)}
                disabled={isSubmitting}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 lg:gap-4 sm:grid-cols-2 lg:grid-cols-5 ">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                items={categoryItems}
                value={item.categoryId}
                onValueChange={(value) =>
                  updateItem(item.rowId, "categoryId", value ?? "")
                }
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

            <div className="space-y-2 text-sm">
              <label
                htmlFor={`expense-amount-${item.rowId}`}
                className="text-sm font-medium"
              >
                Amount
              </label>
              <Input
                className="text-sm"
                id={`expense-amount-${item.rowId}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={item.amount}
                onChange={(event) =>
                  updateItem(item.rowId, "amount", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2 lg:col-span-3 text-sm">
              <label
                htmlFor={`expense-description-${item.rowId}`}
                className="text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                className="text-sm"
                id={`expense-description-${item.rowId}`}
                placeholder="Optional description"
                value={item.description}
                onChange={(event) =>
                  updateItem(item.rowId, "description", event.target.value)
                }
                disabled={isSubmitting}
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}

      {mode === "add" && (
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          disabled={isSubmitting || isLoadingCategories}
        >
          + Add Another Item
        </Button>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || isLoadingCategories}
        className="ms-2"
      >
        {isSubmitting
          ? "Saving..."
          : mode === "edit"
            ? "Update Expense"
            : "Save Expenses"}
      </Button>
    </form>
  );
}

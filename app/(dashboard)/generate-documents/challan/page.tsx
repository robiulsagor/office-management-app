"use client";

const CHALLAN_DRAFT_KEY = "challan-draft";
const CHALLAN_PRINT_KEY = "challan-print-data";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, FileText, CalendarDays, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChallanData, QuantityType } from "@/types/challan";
import { useRouter } from "next/navigation";

type ChallanItem = {
  id: string;
  description: string;
  packageCount: string;
  packageType: "roll" | "ctn";
  quantity: string;
  quantityType: QuantityType | "";
  remarks: string;
};

const createEmptyItem = (): ChallanItem => ({
  id: "initial",
  description: "",
  packageCount: "",
  packageType: "roll",
  quantity: "",
  quantityType: "",
  remarks: "",
});

const quantityTypes: QuantityType[] = [
  "pcs",
  "yards",
  "kgs",
  "meters",
  "dozens",
];

const GenerateChallan = () => {
  const [challanNumber, setChallanNumber] = useState("");
  const [date, setDate] = useState("");
  const [factoryName, setFactoryName] = useState("");
  const [factoryAddress, setFactoryAddress] = useState("");

  // const [items, setItems] = useState<ChallanItem[]>([createEmptyItem()]);
  const [items, setItems] = useState<ChallanItem[]>([
  {
    id: "initial",
    description: "",
    packageCount: "",
    packageType: "roll",
    quantity: "",
    quantityType: "",
    remarks: "",
  },
]);

  const addItem = () => {
  setItems((prev) => [
    ...prev,
    {
     id: "initial",
      description: "",
      packageCount: "",
      packageType: "roll",
      quantity: "",
      quantityType: "",
      remarks: "",
    },
  ]);
}

  const removeItem = (id: string) => {
    setItems((prev) => {
      // Don't allow the form to have zero items
      if (prev.length === 1) return prev;

      return prev.filter((item) => item.id !== id);
    });
  };

  const updateItem = (id: string, field: keyof ChallanItem, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  /*
   * Total number of rolls/cartons.
   *
   * Note:
   * We can safely sum these even if some items are rolls
   * and others are cartons.
   */
  const totalPackages = useMemo(() => {
    return items.reduce((total, item) => {
      return total + (Number(item.packageCount) || 0);
    }, 0);
  }, [items]);

  /*
   * Quantity totals are grouped by quantity type.
   *
   * Example:
   * 500 PCS
   * 200 YARDS
   * 40 KGS
   */
  const quantityTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    items.forEach((item) => {
      if (!item.quantityType) return;

      const quantity = Number(item.quantity) || 0;

      totals[item.quantityType] = (totals[item.quantityType] || 0) + quantity;
    });

    return totals;
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const challanData: ChallanData = {
      challanNumber,
      date,
      factoryName,
      factoryAddress,

      items: items.map((item) => {
        if (!item.quantityType) {
          throw new Error("Quantity type is required");
        }

        return {
          id: item.id,
          description: item.description,
          packageCount: Number(item.packageCount),
          packageType: item.packageType,
          quantity: Number(item.quantity),
          quantityType: item.quantityType,
          remarks: item.remarks,
        };
      }),
    };

    sessionStorage.setItem(CHALLAN_PRINT_KEY, JSON.stringify(challanData));

    window.open("/print", "_blank");
  };

  return (
    <div className="mx-auto w-full space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
            <FileText className="size-5" />
          </div>

          <div>
            <h1 className="text-lg md:text-2xl font-bold tracking-tight">
              Generate Challan
            </h1>

            <p className="text-sm text-muted-foreground">
              Create a new challan for factory dispatch.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Challan Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            {/* Challan Number */}
            <div className="space-y-2">
              <Label htmlFor="challanNumber">Challan Number</Label>

              <Input
                id="challanNumber"
                placeholder="e.g. CH-2026-001"
                value={challanNumber}
                onChange={(e) => setChallanNumber(e.target.value)}
                className="text-sm md:text-base"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>

              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pr-10 "
                />

                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Factory Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="factoryName">Factory Name</Label>

              <Input
                id="factoryName"
                placeholder="Enter factory name"
                value={factoryName}
                className="text-sm md:text-base"
                onChange={(e) => setFactoryName(e.target.value)}
              />
            </div>

            {/* Factory Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="factoryAddress">Factory Address</Label>

              <Textarea
                id="factoryAddress"
                placeholder="Enter complete factory address"
                value={factoryAddress}
                className="text-sm md:text-base"
                onChange={(e) => setFactoryAddress(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Challan Items</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add all items included in this challan.
                </p>
              </div>

              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="mr-2 size-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Desktop item editor */}
            <div className="hidden overflow-x-auto lg:block">
              <div className="min-w-[850px]">
                {/* Table Header */}
                <div className="grid grid-cols-[40px_2fr_100px_110px_110px_110px_1.5fr_40px] items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <div>#</div>
                  <div>Description</div>
                  <div>Number</div>
                  <div>Type</div>
                  <div>Quantity</div>
                  <div>Unit</div>
                  <div>Remarks</div>
                  <div />
                </div>

                {/* Items */}
                <div className="divide-y">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[40px_2fr_100px_110px_110px_110px_1.5fr_40px] items-start gap-3 py-3"
                    >
                      <div className="pt-2 text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </div>

                      {/* Description */}
                      <Input
                        placeholder="e.g. Denim Fabric"
                        value={item.description}
                        className="text-sm md:text-base"
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                      />

                      {/* Package Count */}
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.packageCount}
                        className="text-sm md:text-base"
                        onChange={(e) =>
                          updateItem(item.id, "packageCount", e.target.value)
                        }
                      />

                      {/* Package Type */}
                      <Select
                        value={item.packageType}
                        onValueChange={(value) =>
                          value
                            ? updateItem(item.id, "packageType", value)
                            : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="roll">Roll</SelectItem>

                          <SelectItem value="ctn">Ctn</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Quantity */}
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={item.quantity}
                        className="text-sm md:text-base"
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                      />

                      {/* Quantity Type */}
                      <Select
                        value={item.quantityType}
                        onValueChange={(value) =>
                          updateItem(item.id, "quantityType", value ?? "")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>

                        <SelectContent>
                          {quantityTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Remarks */}
                      <Input
                        placeholder="Optional"
                        value={item.remarks}
                        className="text-sm md:text-base"
                        onChange={(e) =>
                          updateItem(item.id, "remarks", e.target.value)
                        }
                      />

                      {/* Remove */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={items.length === 1}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile / Tablet item cards */}
            <div className="space-y-4 lg:hidden">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border bg-slate-50/50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-teal-600/10 text-xs font-semibold text-teal-700">
                        {index + 1}
                      </div>

                      <span className="text-sm font-semibold">
                        Item {index + 1}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      disabled={items.length === 1}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="e.g. Denim Fabric"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Number</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.packageCount}
                        onChange={(e) =>
                          updateItem(item.id, "packageCount", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={item.packageType}
                        onValueChange={(value) =>
                          value
                            ? updateItem(item.id, "packageType", value)
                            : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="roll">Roll</SelectItem>

                          <SelectItem value="ctn">Ctn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity Type</Label>
                      <Select
                        value={item.quantityType}
                        onValueChange={(value) =>
                          updateItem(item.id, "quantityType", value ?? "")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>

                        <SelectContent>
                          {quantityTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Remarks</Label>
                      <Input
                        placeholder="Optional remarks"
                        value={item.remarks}
                        onChange={(e) =>
                          updateItem(item.id, "remarks", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="size-5 text-teal-600" />
              Challan Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Package total */}
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm text-muted-foreground">Total Packages</p>

                <p className="mt-1 text-2xl font-bold">{totalPackages}</p>
              </div>

              {/* Quantity totals */}
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm text-muted-foreground">Total Quantity</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(quantityTotals).length === 0 ? (
                    <span className="text-sm text-muted-foreground">
                      No quantity entered
                    </span>
                  ) : (
                    Object.entries(quantityTotals).map(([type, total]) => (
                      <span
                        key={type}
                        className="rounded-full bg-teal-600/10 px-3 py-1.5 text-sm font-semibold text-teal-700"
                      >
                        {total} {type.toUpperCase()}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline">
            Cancel
          </Button>

          <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
            <FileText className="mr-2 size-4" />
            Generate Challan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GenerateChallan;

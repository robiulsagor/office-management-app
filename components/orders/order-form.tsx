"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  orderFormSchema,
  type OrderFormValues,
} from "./order-form-schema";

import { createOrder } from "@/actions/order/create-order";

import BuyerCombobox from "./buyer-combobox";
import ProgrammeCombobox from "./programme-combobox";
import PurchaseOrderMultiCombobox from "./purchase-order-multi-combobox";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

export default function OrderForm() {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),

    defaultValues: {
      buyerId: "",
      programmeId: "",
      purchaseOrderIds: [],

      styleNumber: "",
      color: "",
      factory: "",

      qtySet: undefined,
      qtyPiece: undefined,

      actualPrice: undefined,
      factoryPrice: undefined,

      shipDate: "",

      status: "PENDING",

      remarks: "",
    },
  });

  const buyerId = useWatch({
    control: form.control,
    name: "buyerId",
  });

  const programmeId = useWatch({
    control: form.control,
    name: "programmeId",
  });

  const purchaseOrderIds = useWatch({
    control: form.control,
    name: "purchaseOrderIds",
  });

  async function onSubmit(values: OrderFormValues) {
    const result = await createOrder(values);

    console.log(result);

    if (result.success) {
      form.reset();
      toast.success("Order created successfully!");
    } else {
      toast.error(result.message ?? "Failed to create order.");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Basic Information */}
      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Buyer */}
          <div>
            <label
              htmlFor="buyerId"
              className="mb-2 block text-sm font-medium"
            >
              Buyer
            </label>

            <BuyerCombobox
              value={buyerId}
              onChange={(value) => {
                form.setValue("buyerId", value, {
                  shouldValidate: true,
                });

                form.setValue("programmeId", "", {
                  shouldValidate: true,
                });

                form.setValue("purchaseOrderIds", [], {
                  shouldValidate: true,
                });
              }}
            />

            {form.formState.errors.buyerId && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.buyerId.message}
              </p>
            )}
          </div>

          {/* Programme */}
          <div>
            <label
              htmlFor="programmeId"
              className="mb-2 block text-sm font-medium"
            >
              Programme
            </label>

            <ProgrammeCombobox
              buyerId={buyerId}
              value={programmeId}
              onChange={(value) => {
                form.setValue("programmeId", value, {
                  shouldValidate: true,
                });

                form.setValue("purchaseOrderIds", [], {
                  shouldValidate: true,
                });
              }}
            />

            {form.formState.errors.programmeId && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.programmeId.message}
              </p>
            )}
          </div>

          {/* Purchase Orders */}
          <div>
            <label
              htmlFor="purchaseOrderIds"
              className="mb-2 block text-sm font-medium"
            >
              PO Number
            </label>

            <PurchaseOrderMultiCombobox
              programmeId={programmeId}
              value={purchaseOrderIds}
              onChange={(value) =>
                form.setValue("purchaseOrderIds", value, {
                  shouldValidate: true,
                })
              }
            />

            {form.formState.errors.purchaseOrderIds && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.purchaseOrderIds.message}
              </p>
            )}
          </div>

          {/* Style Number */}
          <div>
            <label
              htmlFor="styleNumber"
              className="mb-2 block text-sm font-medium"
            >
              Style Number
            </label>

            <input
              id="styleNumber"
              type="text"
              {...form.register("styleNumber")}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="Style number"
            />

            {form.formState.errors.styleNumber && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.styleNumber.message}
              </p>
            )}
          </div>

          {/* Color */}
          <div>
            <label
              htmlFor="color"
              className="mb-2 block text-sm font-medium"
            >
              Color
            </label>

            <input
              id="color"
              type="text"
              {...form.register("color")}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="Color"
            />

            {form.formState.errors.color && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.color.message}
              </p>
            )}
          </div>

          {/* Factory */}
          <div>
            <label
              htmlFor="factory"
              className="mb-2 block text-sm font-medium"
            >
              Factory
            </label>

            <input
              id="factory"
              type="text"
              {...form.register("factory")}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="Factory name"
            />
          </div>
        </div>
      </section>

      {/* Quantity & Price */}
      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Quantity & Pricing
        </h2>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {/* Qty Set */}
          <div>
            <label
              htmlFor="qtySet"
              className="mb-2 block text-sm font-medium"
            >
              Qty (Set)
            </label>

            <input
              id="qtySet"
              type="number"
              min="0"
              {...form.register("qtySet", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="0"
            />

            {form.formState.errors.qtySet && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.qtySet.message}
              </p>
            )}
          </div>

          {/* Qty Piece */}
          <div>
            <label
              htmlFor="qtyPiece"
              className="mb-2 block text-sm font-medium"
            >
              Qty (Piece)
            </label>

            <input
              id="qtyPiece"
              type="number"
              min="0"
              {...form.register("qtyPiece", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="0"
            />

            {form.formState.errors.qtyPiece && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.qtyPiece.message}
              </p>
            )}
          </div>

          {/* Actual Price */}
          <div>
            <label
              htmlFor="actualPrice"
              className="mb-2 block text-sm font-medium"
            >
              Actual Price
            </label>

            <input
              id="actualPrice"
              type="number"
              min="0"
              step="0.01"
              {...form.register("actualPrice", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="0.00"
            />

            {form.formState.errors.actualPrice && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.actualPrice.message}
              </p>
            )}
          </div>

          {/* Factory Price */}
          <div>
            <label
              htmlFor="factoryPrice"
              className="mb-2 block text-sm font-medium"
            >
              Factory Price
            </label>

            <input
              id="factoryPrice"
              type="number"
              min="0"
              step="0.01"
              {...form.register("factoryPrice", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="0.00"
            />

            {form.formState.errors.factoryPrice && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.factoryPrice.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Shipping & Status
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Ship Date */}
          <div>
            <label
              htmlFor="shipDate"
              className="mb-2 block text-sm font-medium"
            >
              Ship Date
            </label>

            <input
              id="shipDate"
              type="date"
              {...form.register("shipDate")}
              className="h-10 w-full rounded-md border px-3 text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium"
            >
              Status
            </label>

            <select
              id="status"
              {...form.register("status")}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PRODUCTION">
                In Production
              </option>
              <option value="READY_TO_SHIP">
                Ready to Ship
              </option>
              <option value="SHIPPED">Shipped</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Remarks */}
      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label
            htmlFor="remarks"
            className="mb-2 block text-sm font-medium"
          >
            Remarks
          </label>

          <textarea
            id="remarks"
            rows={4}
            {...form.register("remarks")}
            className="w-full resize-none rounded-md border px-3 py-2 text-sm"
            placeholder="Enter any additional remarks..."
          />
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end border-t pt-6">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Reset
          </Button>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
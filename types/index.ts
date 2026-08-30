import type {LucideIcon} from "lucide-react";

export const NOTIFICATION_TYPE = {
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    USER_CREATED: "user_created",
    NEW_DEVICE_LOGIN: "new_device_login",
    SALARY_GENERATED: "salary_generated",
    LEAVE_REQUEST: "leave_request",
    CASH_DEPOSIT: "cash_deposit",
    ORDER_UPDATED: "order_updated",
    BAZAR_REPORT: "bazar_report",
    SYSTEM_MAINTENANCE: "system_maintenance"
  } 

  // for sidebar menu type
  export type MenuTypes = {
    id: number,
    path: string,
    icon: LucideIcon,
    label: string,
    roles: string[]
  }

  // for print challan page, data type
  export type ChallanTypes = {
    id: number | string;
    description: string;
    rollsOrCtns: number | string,
    quantity: number | string,
    remarks: string,
  }
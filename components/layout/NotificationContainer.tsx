import { NOTIFICATION_TYPE } from "@/types";
import { Button } from "../ui/button";
import Notification from "./Notification";

const notifications = [
  {
    id: "noti_001",
    type: NOTIFICATION_TYPE.USER_CREATED,
    title: "New user added",
    message: "A new employee account was created.",
    link: "/employees",
    createdAt: "2026-08-23T17:42:00",
  },

  {
    id: "noti_002",
    type: NOTIFICATION_TYPE.NEW_DEVICE_LOGIN,
    title: "New device login",
    message: "A new device logged into your account.",
    link: null,
    createdAt: "2026-08-23T16:20:00",
  },

  {
    id: "noti_003",
    type: NOTIFICATION_TYPE.BAZAR_REPORT,
    title: "Monthly bazar report generated",
    message: "The February 2026 bazar report is ready to view.",
    link: "/bazar/report?month=2&year=2026",
    createdAt: "2026-08-23T14:10:00",
  },

  {
    id: "noti_004",
    type: NOTIFICATION_TYPE.SALARY_GENERATED,
    title: "Salary sheet generated",
    message: "August salary sheet has been generated.",
    link: "/salary",
    createdAt: "2026-08-23T11:45:00",
  },

  {
    id: "noti_005",
    type: NOTIFICATION_TYPE.CASH_DEPOSIT,
    title: "New cash deposit",
    message: "৳15,000 cash has been deposited for office expenses.",
    link: "/finance/cash-service",
    createdAt: "2026-08-22T18:30:00",
  },

  {
    id: "noti_006",
    type: NOTIFICATION_TYPE.LEAVE_REQUEST,
    title: "New leave request",
    message: "An employee has submitted a leave request.",
    link: "/leave/requests",
    createdAt: "2026-08-22T15:05:00",
  },

  {
    id: "noti_007",
    type: NOTIFICATION_TYPE.ORDER_UPDATED,
    title: "Order status updated",
    message: "Order #ORD-2026-018 has been updated.",
    link: "/orders/ORD-2026-018",
    createdAt: "2026-08-22T12:40:00",
  },

  {
    id: "noti_008",
    type: NOTIFICATION_TYPE.SYSTEM_MAINTENANCE,
    title: "System maintenance scheduled",
    message: "The system will undergo maintenance tonight at 11 PM.",
    link: null,
    createdAt: "2026-08-21T20:00:00",
  },
];

const NotificationContainer = () => {
  return (
    <>
      <div className="">
        {notifications.map((item) => (
          <Notification
            key={item.id}
            title={item.title}
            message={item.message}
            link={item.link}
          />
        ))}

        <Button
          size={"xs"}
          variant={"secondary"}
          className="mt-2 cursor-pointer hover:underline"
        >
          View All Notifications...
        </Button>
      </div>
    </>
  );
};

export default NotificationContainer;

import { NotificationFilter } from "@/types/notifications/notification";
import { useState } from "react";

const OPTIONS: { key: NotificationFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

export default function FilterDropdown({
  value,
  onChange,
}: {
  value: NotificationFilter;
  onChange: (v: NotificationFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = OPTIONS.find(o => o.key === value)?.label ?? "All";
}

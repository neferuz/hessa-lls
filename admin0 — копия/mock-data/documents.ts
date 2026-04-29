export type Document = {
  id: string;
  name: string;
  size: string;
  author: string;
  authorAvatar: string;
  uploadedAt: string;
  icon: string;
};

export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Order #8421 - Salmon Set",
    size: "$45.00",
    author: "Artem",
    authorAvatar: "https://api.dicebear.com/9.x/glass/svg?seed=artem",
    uploadedAt: "5 mins ago",
    icon: "checklist",
  },
  {
    id: "2",
    name: "Order #8420 - Dragon Roll",
    size: "$18.50",
    author: "Elena",
    authorAvatar: "https://api.dicebear.com/9.x/glass/svg?seed=elena",
    uploadedAt: "12 mins ago",
    icon: "checklist",
  },
  {
    id: "3",
    name: "Order #8419 - Miso Soup x2",
    size: "$12.00",
    author: "Ivan",
    authorAvatar: "https://api.dicebear.com/9.x/glass/svg?seed=ivan",
    uploadedAt: "25 mins ago",
    icon: "checklist",
  },
  {
    id: "4",
    name: "Order #8418 - Philadelpia",
    size: "$22.00",
    author: "Maria",
    authorAvatar: "https://api.dicebear.com/9.x/glass/svg?seed=maria",
    uploadedAt: "40 mins ago",
    icon: "checklist",
  },
  {
    id: "5",
    name: "Order #8417 - California",
    size: "$16.50",
    author: "Dmitry",
    authorAvatar: "https://api.dicebear.com/9.x/glass/svg?seed=dmitry",
    uploadedAt: "1 hour ago",
    icon: "checklist",
  },
];


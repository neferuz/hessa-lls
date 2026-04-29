export type Person = {
  id: string;
  name: string;
  loyaltyStatus: "Gold" | "Silver" | "Bronze";
  status: "active" | "offline" | "away";
  email: string;
  phone: string;
  preferences: string[];
  address: string;
  avatar: string;
};

export const mockPeople: Person[] = [
  {
    id: "1",
    name: "Alexander",
    loyaltyStatus: "Gold",
    status: "active",
    email: "alex@mail.com",
    phone: "+998 90 123 45 67",
    preferences: ["Rolls", "Sushi"],
    address: "Tashkent, Uzbekistan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=alex",
  },
  {
    id: "2",
    name: "Dilnoza",
    loyaltyStatus: "Silver",
    status: "offline",
    email: "dilnoza@gmail.com",
    phone: "+998 91 234 56 78",
    preferences: ["Drinks", "Miso Soup"],
    address: "Samarkand, Uzbekistan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=dilnoza",
  },
  {
    id: "3",
    name: "Ruslan",
    loyaltyStatus: "Bronze",
    status: "active",
    email: "ruslan@chef.io",
    phone: "+998 93 345 67 89",
    preferences: ["Sets", "Spicy"],
    address: "Bukhara, Uzbekistan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=ruslan",
  },
];


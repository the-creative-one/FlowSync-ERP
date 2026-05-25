const mongoose = require("mongoose");

const sampleOrders = [
{
  customerName: "Ankit Mishra",
  product: "Mechanical Keyboard",
  quantity: 2,
  amount: 14000,
  status: "processing",
  createdAt: new Date("2025-01-08"),
  updatedAt: new Date("2025-01-10"),
},

{
  customerName: "Riya Sen",
  product: "Smartphone",
  quantity: 3,
  amount: 75000,
  status: "delivered",
  createdAt: new Date("2025-01-20"),
  updatedAt: new Date("2025-01-24"),
},

{
  customerName: "Manav Joshi",
  product: "External HDD",
  quantity: 4,
  amount: 24000,
  status: "pending",
  createdAt: new Date("2025-02-03"),
  updatedAt: new Date("2025-02-03"),
},

{
  customerName: "Simran Kaur",
  product: "Gaming Chair",
  quantity: 1,
  amount: 28000,
  status: "shipped",
  createdAt: new Date("2025-02-14"),
  updatedAt: new Date("2025-02-17"),
},

{
  customerName: "Abhishek Roy",
  product: "Monitor Stand",
  quantity: 5,
  amount: 12500,
  status: "processing",
  createdAt: new Date("2025-02-26"),
  updatedAt: new Date("2025-03-01"),
},

{
  customerName: "Pallavi Sharma",
  product: "iPad",
  quantity: 2,
  amount: 98000,
  status: "delivered",
  createdAt: new Date("2025-03-09"),
  updatedAt: new Date("2025-03-14"),
},

{
  customerName: "Tushar Meena",
  product: "HDMI Cable",
  quantity: 15,
  amount: 9000,
  status: "pending",
  createdAt: new Date("2025-03-21"),
  updatedAt: new Date("2025-03-21"),
},

{
  customerName: "Nandini Rao",
  product: "Webcam",
  quantity: 6,
  amount: 21000,
  status: "shipped",
  createdAt: new Date("2025-04-05"),
  updatedAt: new Date("2025-04-08"),
},

{
  customerName: "Keshav Arora",
  product: "CPU Cabinet",
  quantity: 2,
  amount: 18000,
  status: "processing",
  createdAt: new Date("2025-04-19"),
  updatedAt: new Date("2025-04-21"),
},

{
  customerName: "Rohit Patil",
  product: "Graphic Tablet",
  quantity: 1,
  amount: 32000,
  status: "delivered",
  createdAt: new Date("2025-05-02"),
  updatedAt: new Date("2025-05-06"),
},

{
  customerName: "Ibrahim Khan",
  product: "Tripod Stand",
  quantity: 8,
  amount: 16000,
  status: "pending",
  createdAt: new Date("2025-05-16"),
  updatedAt: new Date("2025-05-16"),
},

{
  customerName: "Divya Nair",
  product: "MacBook Sleeve",
  quantity: 5,
  amount: 17500,
  status: "shipped",
  createdAt: new Date("2025-06-01"),
  updatedAt: new Date("2025-06-04"),
},

{
  customerName: "Aryan Gupta",
  product: "UPS Battery",
  quantity: 2,
  amount: 22000,
  status: "processing",
  createdAt: new Date("2025-06-13"),
  updatedAt: new Date("2025-06-15"),
},

{
  customerName: "Mitali Bose",
  product: "Laptop Cooling Pad",
  quantity: 7,
  amount: 14000,
  status: "delivered",
  createdAt: new Date("2025-06-25"),
  updatedAt: new Date("2025-06-29"),
},

{
  customerName: "Aditya Verma",
  product: "USB Keyboard",
  quantity: 10,
  amount: 20000,
  status: "pending",
  createdAt: new Date("2025-07-09"),
  updatedAt: new Date("2025-07-09"),
},

{
  customerName: "Sana Ali",
  product: "Portable SSD",
  quantity: 3,
  amount: 36000,
  status: "shipped",
  createdAt: new Date("2025-07-20"),
  updatedAt: new Date("2025-07-24"),
},

{
  customerName: "Krishna Yadav",
  product: "WiFi Extender",
  quantity: 4,
  amount: 12000,
  status: "processing",
  createdAt: new Date("2025-08-03"),
  updatedAt: new Date("2025-08-05"),
},

{
  customerName: "Ayesha Siddiqui",
  product: "DSLR Camera",
  quantity: 1,
  amount: 92000,
  status: "delivered",
  createdAt: new Date("2025-08-18"),
  updatedAt: new Date("2025-08-22"),
},

{
  customerName: "Rajat Malhotra",
  product: "Office Desk",
  quantity: 2,
  amount: 40000,
  status: "pending",
  createdAt: new Date("2025-09-04"),
  updatedAt: new Date("2025-09-04"),
},

{
  customerName: "Neeraj Sinha",
  product: "AirPods",
  quantity: 4,
  amount: 64000,
  status: "shipped",
  createdAt: new Date("2025-09-19"),
  updatedAt: new Date("2025-09-22"),
},

{
  customerName: "Charu Bhatt",
  product: "Bluetooth Keyboard",
  quantity: 5,
  amount: 22500,
  status: "processing",
  createdAt: new Date("2025-10-02"),
  updatedAt: new Date("2025-10-05"),
},

{
  customerName: "Lavanya Iyer",
  product: "Tablet Cover",
  quantity: 12,
  amount: 18000,
  status: "delivered",
  createdAt: new Date("2025-10-17"),
  updatedAt: new Date("2025-10-20"),
},

{
  customerName: "Mohit Chawla",
  product: "Smart TV",
  quantity: 2,
  amount: 125000,
  status: "pending",
  createdAt: new Date("2025-11-06"),
  updatedAt: new Date("2025-11-06"),
},

{
  customerName: "Ananya Desai",
  product: "Docking Station",
  quantity: 3,
  amount: 27000,
  status: "shipped",
  createdAt: new Date("2025-11-21"),
  updatedAt: new Date("2025-11-24"),
},

{
  customerName: "Vivek Rana",
  product: "LED Monitor",
  quantity: 2,
  amount: 38000,
  status: "processing",
  createdAt: new Date("2025-12-08"),
  updatedAt: new Date("2025-12-11"),
},

{
  customerName: "Sakshi Tiwari",
  product: "Bluetooth Earbuds",
  quantity: 6,
  amount: 30000,
  status: "delivered",
  createdAt: new Date("2025-12-22"),
  updatedAt: new Date("2025-12-27"),
},

{
  customerName: "Harsh Agrawal",
  product: "Office Sofa",
  quantity: 1,
  amount: 55000,
  status: "pending",
  createdAt: new Date("2026-01-07"),
  updatedAt: new Date("2026-01-07"),
},

{
  customerName: "Preeti Kulshrestha",
  product: "Wireless Charger",
  quantity: 9,
  amount: 27000,
  status: "shipped",
  createdAt: new Date("2026-01-19"),
  updatedAt: new Date("2026-01-22"),
},

{
  customerName: "Nikhil Tomar",
  product: "Laptop Stand",
  quantity: 5,
  amount: 15000,
  status: "processing",
  createdAt: new Date("2026-02-03"),
  updatedAt: new Date("2026-02-05"),
},

{
  customerName: "Vaishnavi Rao",
  product: "Gaming Headset",
  quantity: 4,
  amount: 26000,
  status: "delivered",
  createdAt: new Date("2026-02-18"),
  updatedAt: new Date("2026-02-21"),
},

{
  customerName: "Siddharth Jain",
  product: "USB Dock",
  quantity: 7,
  amount: 21000,
  status: "pending",
  createdAt: new Date("2026-03-05"),
  updatedAt: new Date("2026-03-05"),
},

{
  customerName: "Meera Pillai",
  product: "Ring Light",
  quantity: 8,
  amount: 32000,
  status: "shipped",
  createdAt: new Date("2026-03-20"),
  updatedAt: new Date("2026-03-23"),
},

{
  customerName: "Karan Bedi",
  product: "Mechanical Mouse",
  quantity: 3,
  amount: 19500,
  status: "processing",
  createdAt: new Date("2026-04-04"),
  updatedAt: new Date("2026-04-06"),
},

{
  customerName: "Shreya Menon",
  product: "Laptop Backpack",
  quantity: 6,
  amount: 33000,
  status: "delivered",
  createdAt: new Date("2026-04-18"),
  updatedAt: new Date("2026-04-22"),
}
];

module.exports = sampleOrders;

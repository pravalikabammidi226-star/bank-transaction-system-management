/**
 * Sample Banking Transactions Dataset
 * Realistic Indian banking transactions with amounts in ₹ (INR),
 * realistic dates, categories, types, and statuses.
 */

const sampleTransactions = [
    {
        id: "TXN-2026-001",
        accountHolder: "Rajesh Sharma",
        type: "Deposit",
        amount: 85000,
        date: "2026-01-05T09:15:00",
        category: "Salary",
        status: "Completed",
        description: "Monthly executive salary credit"
    },
    {
        id: "TXN-2026-002",
        accountHolder: "Priya Patel",
        type: "Payment",
        amount: 3200,
        date: "2026-01-08T14:30:00",
        category: "Utilities",
        status: "Completed",
        description: "Electricity bill payment"
    },
    {
        id: "TXN-2026-003",
        accountHolder: "Amit Verma",
        type: "Transfer",
        amount: 25000,
        date: "2026-01-12T18:45:00",
        category: "Rent",
        status: "Completed",
        description: "Apartment rental transfer"
    },
    {
        id: "TXN-2026-004",
        accountHolder: "Neha Gupta",
        type: "Withdrawal",
        amount: 5000,
        date: "2026-01-15T11:20:00",
        category: "Cash",
        status: "Completed",
        description: "ATM cash withdrawal"
    },
    {
        id: "TXN-2026-005",
        accountHolder: "Vikram Malhotra",
        type: "Payment",
        amount: 1450,
        date: "2026-01-18T20:10:00",
        category: "Dining",
        status: "Completed",
        description: "Restaurant weekend dinner"
    },
    {
        id: "TXN-2026-006",
        accountHolder: "Ananya Iyer",
        type: "Payment",
        amount: 4500,
        date: "2026-01-22T16:05:00",
        category: "Shopping",
        status: "Completed",
        description: "Apparel store purchase"
    },
    {
        id: "TXN-2026-007",
        accountHolder: "Rohan Deshmukh",
        type: "Deposit",
        amount: 45000,
        date: "2026-01-25T10:00:00",
        category: "Freelance",
        status: "Completed",
        description: "Web development contract milestone"
    },
    {
        id: "TXN-2026-008",
        accountHolder: "Deepika Rao",
        type: "Transfer",
        amount: 12000,
        date: "2026-01-29T13:40:00",
        category: "Investment",
        status: "Completed",
        description: "Mutual fund SIP installment"
    },
    {
        id: "TXN-2026-009",
        accountHolder: "Suresh Menon",
        type: "Payment",
        amount: 850,
        date: "2026-02-02T08:15:00",
        category: "Groceries",
        status: "Completed",
        description: "Supermarket weekly groceries"
    },
    {
        id: "TXN-2026-010",
        accountHolder: "Pooja Reddy",
        type: "Transfer",
        amount: 35000,
        date: "2026-02-05T17:25:00",
        category: "Rent",
        status: "Completed",
        description: "Commercial shop lease payment"
    },
    {
        id: "TXN-2026-011",
        accountHolder: "Karan Johar",
        type: "Deposit",
        amount: 125000,
        date: "2026-02-10T12:00:00",
        category: "Investment",
        status: "Completed",
        description: "Equity dividend dividend payout"
    },
    {
        id: "TXN-2026-012",
        accountHolder: "Sunita Kapoor",
        type: "Payment",
        amount: 9800,
        date: "2026-02-14T15:50:00",
        category: "Healthcare",
        status: "Completed",
        description: "Medical lab tests & pharmacy"
    },
    {
        id: "TXN-2026-013",
        accountHolder: "Manish Agarwal",
        type: "Withdrawal",
        amount: 10000,
        date: "2026-02-18T19:30:00",
        category: "Cash",
        status: "Completed",
        description: "Bank counter cash withdrawal"
    },
    {
        id: "TXN-2026-014",
        accountHolder: "Kavita Nair",
        type: "Payment",
        amount: 1200,
        date: "2026-02-22T11:10:00",
        category: "Entertainment",
        status: "Completed",
        description: "Movie tickets & snacks"
    },
    {
        id: "TXN-2026-015",
        accountHolder: "Aditya Roy",
        type: "Transfer",
        amount: 18000,
        date: "2026-02-26T14:45:00",
        category: "Education",
        status: "Completed",
        description: "Semester coaching tuition fee"
    },
    {
        id: "TXN-2026-016",
        accountHolder: "Sneha Mukherjee",
        type: "Payment",
        amount: 450,
        date: "2026-03-01T09:20:00",
        category: "Utilities",
        status: "Completed",
        description: "Broadband internet bill"
    },
    {
        id: "TXN-2026-017",
        accountHolder: "Rajesh Sharma",
        type: "Deposit",
        amount: 92000,
        date: "2026-03-05T09:10:00",
        category: "Salary",
        status: "Completed",
        description: "Monthly salary + performance incentive"
    },
    {
        id: "TXN-2026-018",
        accountHolder: "Gaurav Joshi",
        type: "Payment",
        amount: 28000,
        date: "2026-03-08T16:15:00",
        category: "Shopping",
        status: "Pending",
        description: "Electronics appliance purchase"
    },
    {
        id: "TXN-2026-019",
        accountHolder: "Meera Sen",
        type: "Transfer",
        amount: 5500,
        date: "2026-03-12T13:00:00",
        category: "Groceries",
        status: "Completed",
        description: "Organic supplies bulk order"
    },
    {
        id: "TXN-2026-020",
        accountHolder: "Arjun Singhania",
        type: "Deposit",
        amount: 175000,
        date: "2026-03-15T11:30:00",
        category: "Investment",
        status: "Completed",
        description: "Fixed deposit maturity credit"
    },
    {
        id: "TXN-2026-021",
        accountHolder: "Bhavna Trivedi",
        type: "Payment",
        amount: 1850,
        date: "2026-03-19T21:40:00",
        category: "Dining",
        status: "Failed",
        description: "Gateway timeout at bakery"
    },
    {
        id: "TXN-2026-022",
        accountHolder: "Harish Pillai",
        type: "Withdrawal",
        amount: 7000,
        date: "2026-03-24T10:15:00",
        category: "Cash",
        status: "Completed",
        description: "ATM withdrawal airport kiosk"
    },
    {
        id: "TXN-2026-023",
        accountHolder: "Swati Bhatt",
        type: "Payment",
        amount: 6400,
        date: "2026-03-28T17:50:00",
        category: "Shopping",
        status: "Completed",
        description: "Footwear & accessories"
    },
    {
        id: "TXN-2026-024",
        accountHolder: "Naveen Choudhury",
        type: "Transfer",
        amount: 15000,
        date: "2026-04-02T15:20:00",
        category: "Rent",
        status: "Completed",
        description: "Hostel accommodation fee"
    },
    {
        id: "TXN-2026-025",
        accountHolder: "Tanvi Saxena",
        type: "Deposit",
        amount: 38000,
        date: "2026-04-06T10:45:00",
        category: "Freelance",
        status: "Completed",
        description: "UI/UX consultation project"
    },
    {
        id: "TXN-2026-026",
        accountHolder: "Vijay Nambiar",
        type: "Payment",
        amount: 1800,
        date: "2026-04-10T19:00:00",
        category: "Utilities",
        status: "Completed",
        description: "Piped gas utility invoice"
    },
    {
        id: "TXN-2026-027",
        accountHolder: "Pallavi Kulkarni",
        type: "Transfer",
        amount: 22000,
        date: "2026-04-14T12:35:00",
        category: "Healthcare",
        status: "Completed",
        description: "Dental surgery clinic payment"
    },
    {
        id: "TXN-2026-028",
        accountHolder: "Sanjay Dixit",
        type: "Payment",
        amount: 3500,
        date: "2026-04-18T14:10:00",
        category: "Entertainment",
        status: "Completed",
        description: "Theme park family tickets"
    },
    {
        id: "TXN-2026-029",
        accountHolder: "Ritu Singhal",
        type: "Deposit",
        amount: 60000,
        date: "2026-04-22T16:40:00",
        category: "Salary",
        status: "Completed",
        description: "Corporate consulting salary"
    },
    {
        id: "TXN-2026-030",
        accountHolder: "Ashok Sundaram",
        type: "Withdrawal",
        amount: 4000,
        date: "2026-04-26T08:50:00",
        category: "Cash",
        status: "Completed",
        description: "Emergency cash withdrawal"
    },
    {
        id: "TXN-2026-031",
        accountHolder: "Divya Namboodiri",
        type: "Payment",
        amount: 890,
        date: "2026-04-30T18:15:00",
        category: "Groceries",
        status: "Completed",
        description: "Dairy & fresh vegetables"
    },
    {
        id: "TXN-2026-032",
        accountHolder: "Kiran Sethi",
        type: "Transfer",
        amount: 50000,
        date: "2026-05-04T11:00:00",
        category: "Investment",
        status: "Completed",
        description: "Sovereign Gold Bonds allocation"
    },
    {
        id: "TXN-2026-033",
        accountHolder: "Farhan Qureshi",
        type: "Payment",
        amount: 2400,
        date: "2026-05-08T20:30:00",
        category: "Dining",
        status: "Completed",
        description: "Family dinner weekend"
    },
    {
        id: "TXN-2026-034",
        accountHolder: "Geeta Somani",
        type: "Payment",
        amount: 15400,
        date: "2026-05-12T13:25:00",
        category: "Shopping",
        status: "Completed",
        description: "Designer ethnic wear"
    },
    {
        id: "TXN-2026-035",
        accountHolder: "Manoj Tiwari",
        type: "Transfer",
        amount: 28000,
        date: "2026-05-17T15:45:00",
        category: "Rent",
        status: "Completed",
        description: "Residential rent June advance"
    },
    {
        id: "TXN-2026-036",
        accountHolder: "Aarti Mehra",
        type: "Deposit",
        amount: 32000,
        date: "2026-05-21T10:10:00",
        category: "Freelance",
        status: "Completed",
        description: "Copywriting retainer payout"
    },
    {
        id: "TXN-2026-037",
        accountHolder: "Prateek Chadha",
        type: "Payment",
        amount: 4100,
        date: "2026-05-25T16:30:00",
        category: "Utilities",
        status: "Completed",
        description: "Municipal water bill & taxes"
    },
    {
        id: "TXN-2026-038",
        accountHolder: "Siddharth Roy",
        type: "Deposit",
        amount: 140000,
        date: "2026-05-30T09:30:00",
        category: "Salary",
        status: "Completed",
        description: "Quarterly bonus & salary"
    },
    {
        id: "TXN-2026-039",
        accountHolder: "Shalini Dewan",
        type: "Payment",
        amount: 6200,
        date: "2026-06-03T17:15:00",
        category: "Healthcare",
        status: "Pending",
        description: "Physiotherapy recurring sessions"
    },
    {
        id: "TXN-2026-040",
        accountHolder: "Vikram Malhotra",
        type: "Transfer",
        amount: 80000,
        date: "2026-06-07T14:00:00",
        category: "Investment",
        status: "Completed",
        description: "Treasury bill purchase"
    },
    {
        id: "TXN-2026-041",
        accountHolder: "Rohan Deshmukh",
        type: "Payment",
        amount: 750,
        date: "2026-06-11T12:00:00",
        category: "Groceries",
        status: "Completed",
        description: "Online fast grocery delivery"
    },
    {
        id: "TXN-2026-042",
        accountHolder: "Ananya Iyer",
        type: "Withdrawal",
        amount: 6000,
        date: "2026-06-15T18:20:00",
        category: "Cash",
        status: "Completed",
        description: "Branch counter cash debit"
    },
    {
        id: "TXN-2026-043",
        accountHolder: "Amit Verma",
        type: "Payment",
        amount: 3200,
        date: "2026-06-19T21:00:00",
        category: "Dining",
        status: "Completed",
        description: "Casual bistro dinner"
    },
    {
        id: "TXN-2026-044",
        accountHolder: "Priya Patel",
        type: "Deposit",
        amount: 48000,
        date: "2026-06-24T10:15:00",
        category: "Freelance",
        status: "Completed",
        description: "Architectural design fee"
    },
    {
        id: "TXN-2026-045",
        accountHolder: "Sunita Kapoor",
        type: "Payment",
        amount: 1999,
        date: "2026-06-28T19:40:00",
        category: "Entertainment",
        status: "Completed",
        description: "Annual streaming music & video pass"
    },
    {
        id: "TXN-2026-046",
        accountHolder: "Aditya Roy",
        type: "Payment",
        amount: 9500,
        date: "2026-07-02T13:30:00",
        category: "Shopping",
        status: "Completed",
        description: "Smart wristwatch & headphones"
    },
    {
        id: "TXN-2026-047",
        accountHolder: "Kavita Nair",
        type: "Transfer",
        amount: 27000,
        date: "2026-07-07T16:10:00",
        category: "Rent",
        status: "Completed",
        description: "House rent transfer via NEFT"
    },
    {
        id: "TXN-2026-048",
        accountHolder: "Deepika Rao",
        type: "Deposit",
        amount: 72000,
        date: "2026-07-12T09:05:00",
        category: "Salary",
        status: "Completed",
        description: "Senior Data Analyst monthly credit"
    },
    {
        id: "TXN-2026-049",
        accountHolder: "Suresh Menon",
        type: "Payment",
        amount: 5100,
        date: "2026-07-16T15:00:00",
        category: "Utilities",
        status: "Completed",
        description: "Commercial power billing"
    },
    {
        id: "TXN-2026-050",
        accountHolder: "Manish Agarwal",
        type: "Transfer",
        amount: 42000,
        date: "2026-07-21T11:45:00",
        category: "Investment",
        status: "Completed",
        description: "Index fund portfolio rebalancing"
    },
    {
        id: "TXN-2026-051",
        accountHolder: "Kiran Sethi",
        type: "Payment",
        amount: 2900,
        date: "2026-07-26T20:00:00",
        category: "Dining",
        status: "Completed",
        description: "Fine dining restaurant"
    },
    {
        id: "TXN-2026-052",
        accountHolder: "Harish Pillai",
        type: "Withdrawal",
        amount: 8000,
        date: "2026-07-30T10:30:00",
        category: "Cash",
        status: "Completed",
        description: "ATM cash withdrawal"
    },
    {
        id: "TXN-2026-053",
        accountHolder: "Neha Gupta",
        type: "Payment",
        amount: 1100,
        date: "2026-08-04T12:15:00",
        category: "Groceries",
        status: "Completed",
        description: "Organic milk and grocery store"
    },
    {
        id: "TXN-2026-054",
        accountHolder: "Pooja Reddy",
        type: "Deposit",
        amount: 65000,
        date: "2026-08-09T09:40:00",
        category: "Freelance",
        status: "Completed",
        description: "Full-stack mobile app delivery"
    },
    {
        id: "TXN-2026-055",
        accountHolder: "Vijay Nambiar",
        type: "Payment",
        amount: 14200,
        date: "2026-08-14T17:30:00",
        category: "Healthcare",
        status: "Completed",
        description: "Eye clinic laser consultation"
    },
    {
        id: "TXN-2026-056",
        accountHolder: "Sneha Mukherjee",
        type: "Transfer",
        amount: 31000,
        date: "2026-08-19T14:50:00",
        category: "Rent",
        status: "Completed",
        description: "Bungalow maintenance and rent"
    },
    {
        id: "TXN-2026-057",
        accountHolder: "Gaurav Joshi",
        type: "Payment",
        amount: 8700,
        date: "2026-08-23T19:10:00",
        category: "Shopping",
        status: "Completed",
        description: "Festival clothing and gifts"
    },
    {
        id: "TXN-2026-058",
        accountHolder: "Ashok Sundaram",
        type: "Deposit",
        amount: 115000,
        date: "2026-08-28T11:00:00",
        category: "Salary",
        status: "Completed",
        description: "VP Operations salary credit"
    },
    {
        id: "TXN-2026-059",
        accountHolder: "Bhavna Trivedi",
        type: "Payment",
        amount: 3600,
        date: "2026-09-02T16:20:00",
        category: "Entertainment",
        status: "Completed",
        description: "Concert festival live pass"
    },
    {
        id: "TXN-2026-060",
        accountHolder: "Rajesh Sharma",
        type: "Payment",
        amount: 2250,
        date: "2026-09-07T13:40:00",
        category: "Utilities",
        status: "Completed",
        description: "Mobile postpaid family bill"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = sampleTransactions;
}
if (typeof window !== 'undefined') {
    window.sampleTransactions = sampleTransactions;
}

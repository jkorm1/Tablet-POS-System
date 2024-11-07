export const cards = [
    {
      orderId: "123456",
      queueNumber: 1,
      numberOfOrders: 5,
      timeOrdered: "12:30 PM",
      amount: "$50.00",
      items: [
        {
          name: "Pizza",
          content: "Cheese pizza with olives and peppers.",
          message: "Please add extra cheese.",
          components: [
            {
              name: "Pizza base",
              price: "$10.00",
            },
            {
              name: "Olives",
              price: "$2.00",
            },
            {
              name: "Peppers",
              price: "$3.00",
            },
          ],
        
        },
        {
          name: "Pasta",
          content: "Pasta with tomato sauce.",
          message: "Please I want more Shito.",
          components: [
            {
              name: "Pasta",
              price: "$7.00",
            },
            {
              name: "Tomato sauce",
              price: "$3.00",
            },
          ],
         
        },
        {
          name: "Pasta",
          content: "Pasta with tomato sauce.",
          message: "Please Don't add cabbage.",
          components: [
            {
              name: "Waakye",
              price: "$7.00",
            },
            {
              name: "Gari",
              price: "$10.00",
            },
          ],
        
        },
      ],
    },
    {
      orderId: "654321",
      queueNumber: 2,
      numberOfOrders: 3,
      timeOrdered: "1:00 PM",
      amount: "$30.00",
      items: [
        {
          name: "Salad",
          content: "Caesar salad with croutons.",
          message: "Ei, it is your customer Attippoe oo.",
          components: [
            {
              name: "Salad base",
              price: "$5.00",
            },
            {
              name: "Croutons",
              price: "$3.00",
            },
            {
              name: "Dressing",
              price: "$2.00",
            },
          ],
         
        },
      ],
    },
    {
      orderId: "789012",
      queueNumber: 3,
      numberOfOrders: 2,
      timeOrdered: "1:30 PM",
      amount: "$20.00",
      items: [
        {
          name: "Burger",
          content: "Beef burger with cheese.",
          message: "Please do me fine.",
          components: [
            {
              name: "Burger patty",
              price: "$8.00",
            },
            {
              name: "Cheese",
              price: "$2.00",
            },
            {
              name: "Bun",
              price: "$1.00",
            },
          ],
         
        },
        
        {
          name: "Fries",
          content: "French fries.",
          components: [
            {
              name: "Potatoes",
              price: "$2.00",
            },
            {
              name: "Oil",
              price: "$1.00",
            },
          ],
          
        },
        
      ],
    },
    {
      orderId: "345678",
      queueNumber: 4,
      numberOfOrders: 4,
      timeOrdered: "2:00 PM",
      amount: "$45.00",
      items: [
        {
          name: "Tacos",
          content: "Tacos with various fillings.",
          message: "Chale make I feel oo.",
          components: [
            { name: "Taco shell", price: "$1.00" },
            { name: "Beef", price: "$5.00" },
            { name: "Lettuce", price: "$1.00" },
            { name: "Cheese", price: "$2.00" },
          ],
          
        },
      ],
    },
    {
      orderId: "876543",
      queueNumber: 5,
      numberOfOrders: 1,
      timeOrdered: "2:30 PM",
      amount: "$15.00",
      items: [
        {
          name: "Sushi",
          content: "Sushi rolls with salmon.",
          message: "Please give me more Gari.",
          components: [
            { name: "Rice", price: "$5.00" },
            { name: "Salmon", price: "$7.00" },
            { name: "Seaweed", price: "$3.00" },
          ],
        
        },
      ],
    },
    {
      orderId: "101112",
      queueNumber: 6,
      numberOfOrders: 2,
      timeOrdered: "3:00 PM",
      amount: "$60.00",
      items: [
        {
          name: "Steak",
          content: "Grilled steak with sides.",
          message: "Please reduce the grilling.",
          components: [
            { name: "Steak", price: "$40.00" },
            { name: "Mashed Pot", price: "$10.00" },
            { name: "Vegetables", price: "$10.00" },
          ],
          
        },
      ],
    }
  ];
const menuList = document.getElementById('menu-list');
const home = document.getElementById('home');
const menu = document.getElementById('menu');

// Function to fetch menu items from JSON
function getMenu() {
  fetch('https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - ${item.price}`;
        menuList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching menu:', error));
}

// Function to simulate taking order (randomly selects 3 burgers)
function takeOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const menu = JSON.parse(localStorage.getItem('menu')); // Get menu data from local storage
      const burgers = menu.filter(item => item.category === 'Burger');
      const selectedBurgers = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * burgers.length);
        selectedBurgers.push(burgers[randomIndex]);
      }
      resolve({ order: selectedBurgers });
    }, 2500);
  });
}

// Function to simulate order preparation
function orderPrep(order) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ orderStatus: true, paid: false });
    }, 1500);
  });
}

// Function to simulate payment
function payOrder(orderStatus) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (orderStatus.orderStatus) {
        resolve({ orderStatus: true, paid: true });
      } else {
        reject(new Error('Order not ready yet!'));
      }
    }, 1000);
  });
}

// Function to display thank you message
function thankyouFnc() {
  alert('Thank you for eating with us today!');
}

// Function to handle UI changes
function goToMenu() {
  home.style.display = 'none';
  menu.style.display = 'block';
  getMenu(); // Call getMenu on menu load
}

// Promise chaining with error handling
async function handleOrder() {
  try {
    const order = await takeOrder();
    localStorage.setItem('order', JSON.stringify(order.order)); // Store order in local storage
    const prepStatus = await orderPrep(order);
    const paymentStatus = await payOrder(prepStatus);
    if (paymentStatus.paid) {
      thankyouFnc();
    }
  } catch (error) {
    console.error('Error processing order:', error);
    alert('An error occurred while processing your order. Please try again.');
  }
}

// Run the order process when the 'Place Your Order' button is clicked
document.getElementById('menu').addEventListener('click', function() {
  if (event.target.textContent === 'Place Your Order') {
    handleOrder();
  }
});
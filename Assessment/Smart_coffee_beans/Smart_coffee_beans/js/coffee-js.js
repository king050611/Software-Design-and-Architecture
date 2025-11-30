// 获取 .login 元素
let Login = document.querySelector('.login');

// 当 #loginIcon 被点击时，添加 'active' 类到 .login 元素
document.querySelector('#loginIcon').onclick = function () {
    Login.classList.add('active');
}

// 当 #close 被点击时，从 .login 元素移除 'active' 类
document.querySelector('#close1').onclick = function () {
    Login.classList.remove('active');
}

// 获取 #menu-btn 和 .header .navigation 元素
let menu = document.querySelector("#menu-btn");
let navbar = document.querySelector(".header .navigation");

// 当 #menu-btn 被点击时，切换 'fa-times' 类和 'active' 类
menu.onclick = () => {
    menu.classList.toggle("fa-times");
    navbar.classList.toggle("active");
}

// 当窗口滚动时，执行以下函数
window.onscroll = function () {
    menu.classList.remove("fa-times");
    navbar.classList.remove("active");
    if (window.scrollY > 0) { // 如果页面滚动
        document.querySelector('.header').classList.add('active'); // 添加 'active' 类到 .header 元素，显示导航栏
    } else {
        document.querySelector('.header').classList.remove('active'); // 否则移除 'active' 类，隐藏导航栏
    }
}

// let mockDatabase = {
//     users: []
// };

// 获取.signup-button
let signup = document.querySelector(".signup");

// 当点击sign up按钮时，给.signup添加active并移除.login的active
document.querySelector(".signup-button").onclick = function () {
    signup.classList.add("active");
    Login.classList.remove("active");
};

// 当点击关闭按钮的时候，移除.signup的active
document.querySelector('#close2').onclick = function () {
    signup.classList.remove('active');
};

// 当点击login按钮的时候，给.login添加active并移除.signup的active
document.querySelector(".login-button").onclick = function () {
    Login.classList.add("active");
    signup.classList.remove("active");
};

// 获取表单元素
const submit_signup = document.querySelector(".signup-submitButton");
let signupusername = document.querySelector("#signup-username");
let signupemail = document.querySelector("#signup-email");
let signuppassword1 = document.querySelector("#signup-password1");
let signuppassword2 = document.querySelector("#signup-password2");
const signuperror = document.querySelector(".signuperror");
const signupsuccess = document.querySelector(".signupsuccess");

submit_signup.addEventListener("click", validsignup);

function validsignup(event) {
    event.preventDefault(); // 防止表单提交刷新页面

    // 获取输入的用户名邮箱和密码
    const username = signupusername.value;
    const email = signupemail.value;
    const password1 = signuppassword1.value;
    const password2 = signuppassword2.value;

    // 检查密码是否一致且不为空
    if (password1 && password2 && getHash(password1) === getHash(password2)) {
        // 检查邮箱是否已经存在于模拟数据库中
        const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { users: [] };
        const userExists = storedDatabase.users.some(user => user.email === email || user.username === username);

        if (!userExists) {
            // 添加新用户到模拟数据库
            mockDatabase.users.push({
                username: username,
                email: email,
                password: getHash(password1),
            });
            localStorage.setItem('mockDatabase' , JSON.stringify(mockDatabase));

            // 显示成功信息
            signupsuccess.style.opacity = 1;
            signupsuccess.style.transform = "translate(-50%, -50%)";

            // 隐藏错误信息
            signuperror.style.opacity = 0;
            signuperror.style.transform = "translate(-50%, -50%)";

            // 等待1.5秒后跳转回登录界面
            setTimeout(() => {
                signupsuccess.style.opacity = 0;
                signupsuccess.style.transform = "translate(-50%, -50%)";
                Login.classList.add("active");
                signup.classList.remove("active");
            }, 1500);
        } else {
            // 显示错误信息：用户已存在
            // signuperror.textContent = "User already exists";
            signuperror.style.opacity = 1;
            signuperror.style.transform = "translate(-50%,-50%)";

            // 清空输入框
            signupusername.value = "";
            signupemail.value = "";
            signuppassword1.value = "";
            signuppassword2.value = "";
        }
    } else {
        // 显示错误信息：密码不一致或为空
        // signuperror.textContent = "Passwords do not match or are empty";
        signuperror.style.opacity = 1;
        signuperror.style.transform = "translate(-50%,-50%)";

        // 清空输入框
        signupusername.value = "";
        signupemail.value = "";
        signuppassword1.value = "";
        signuppassword2.value = "";
    }
}


// function getHash(value) {
//     return CryptoJS.SHA256(value).toString();
// }

// 获取 .forget-password 元素
let forgetPassword = document.querySelector('.forget-password');

// 当点击 forget password 链接时，显示 forget-password 界面
document.querySelector('.forget-password-link').onclick = function () {
    forgetPassword.classList.add('active');
    Login.classList.remove('active');
};

// 当 #close3 被点击时，从 .forget-password 元素移除 'active' 类
document.querySelector('#close3').onclick = function () {
    forgetPassword.classList.remove('active');
};

// 当.signup-button被点击时，给.signup添加active并移除.forget-password的active
document.querySelectorAll(".signup-button").forEach(button => {
    button.onclick = function () {
        signup.classList.add("active");
        forgetPassword.classList.remove("active");
        Login.classList.remove("active");
    };
});

// 获取表单元素
const sendCodeButton = document.querySelector(".send-code-button");
const verifyCodeButton = document.querySelector(".verify-code-button");
let forgetEmail = document.querySelector("#forget-email");
let verificationCodeInput = document.querySelector("#verification-code");
const forgeterror = document.querySelector(".forgeterror");
const forgetsuccess = document.querySelector(".forgetsuccess");

let generatedCode = null;

sendCodeButton.addEventListener("click", sendVerificationCode);
verifyCodeButton.addEventListener("click", verifyCode);

function sendVerificationCode(event) {
    event.preventDefault(); // 防止表单提交刷新页面

    // 获取输入的邮箱
    const email = forgetEmail.value;

    // 检查邮箱是否存在于模拟数据库中
    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { users: [] };
    const userExists = storedDatabase.users.some(user => user.email === email);

    if (userExists) {
        // 生成验证码
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 显示成功信息
        // forgetsuccess.textContent = `Verification code sent: ${generatedCode}`;
        forgetsuccess.style.opacity = 1;
        forgetsuccess.style.transform = "translate(-50%, -50%)";

        // 隐藏错误信息
        forgeterror.style.opacity = 0;
        forgeterror.style.transform = "translate(-50%, -50%)";

        // 将生成的验证码插入到 span 元素中
        document.getElementById("generated-code").textContent = generatedCode;
    } else {
        // 显示错误信息：邮箱不存在
        // forgeterror.textContent = "Email does not exist";
        forgeterror.style.opacity = 1;
        forgeterror.style.transform = "translate(-50%,-50%)";

        // 清空输入框
        forgetEmail.value = "";
    }
}

function verifyCode(event) {
    event.preventDefault(); // 防止表单提交刷新页面

    // 获取输入的验证码
    const code = verificationCodeInput.value;

    // 检查验证码是否匹配
    if (code === generatedCode) {
        // 生成token并存储在localStorage
        // const token = generateToken();
        // localStorage.setItem("authToken", token);
         // 获取输入的新密码和确认密码
        const newPasswordValue = document.querySelector("#new-password").value;
        const confirmPasswordValue = document.querySelector("#confirm-password").value;
         // 获取输入的邮箱
        const email = forgetEmail.value;
        const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { users: [] };
        // 检查新密码是否一致且不为空，并且与旧密码不同
        if (newPasswordValue && confirmPasswordValue && newPasswordValue === confirmPasswordValue) {
            // 查找用户
            const userIndex = storedDatabase.users.findIndex(user => user.email === email);
            if  (userIndex !== -1) {
                if (storedDatabase.users[userIndex].password !== getHash(newPasswordValue)) {
                    // 更新密码
                    storedDatabase.users[userIndex].password = getHash(newPasswordValue);
                    localStorage.setItem('mockDatabase', JSON.stringify(storedDatabase));

                    // 显示成功信息
                    forgetsuccess.style.opacity = 0;
                    forgeterror.style.opacity = 0;
                    forgetsuccess.style.opacity = 1;
                    forgetsuccess.style.transform = "translate(-50%, -50%)"; 

                    // 等待1.5秒后返回登录界面
                    setTimeout(() => {
                        forgetsuccess.style.opacity = 0;
                        forgetsuccess.style.transform = "translate(-50%, -50%)";
                        forgetPassword.classList.remove("active");
                        Login.classList.add("active");
                    }, 1500);
                } else {
                    // 显示错误信息：新密码与旧密码相同
                    forgetsuccess.style.opacity = 0;
                    forgeterror.style.opacity = 0;
                    forgeterror.style.opacity = 1;
                    forgeterror.style.transform = "translate(-50%,-50%)";

                    // 清空输入框
                    document.querySelector("#new-password").value = "";
                    document.querySelector("#confirm-password").value = "";
                }
            }
        } else {
            // 显示错误信息：新密码不一致或为空
            forgetsuccess.style.opacity = 0;
            forgeterror.style.opacity = 0;
            forgeterror.style.opacity = 1;
            forgeterror.style.transform = "translate(-50%,-50%)";

            // 清空输入框
            document.querySelector("#new-password").value = "";
            document.querySelector("#confirm-password").value = "";
        }
    } else {
        // 显示错误信息：验证码不匹配
        forgeterror.style.opacity = 0;
        forgetsuccess.style.opacity = 0;
        forgeterror.style.opacity = 1;
        forgeterror.style.transform = "translate(-50%,-50%)";

        // 清空输入框
        verificationCodeInput.value = "";
    }
}

// 获取表单元素
const submit_login = document.querySelector(".login-submitButton");
let loginemail = document.querySelector("#login-email");
let loginpassword = document.querySelector("#login-password");
const loginerror = document.querySelector(".loginerror");
const loginsuccess = document.querySelector(".loginsuccess");

submit_login.addEventListener("click", validlogin);

function validlogin(event) {
    event.preventDefault(); // 防止表单提交刷新页面

    // 获取输入的邮箱和密码
    const email = loginemail.value;
    const password = loginpassword.value;
    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { users: [] };

    // 检查邮箱和密码是否匹配
    const user = storedDatabase.users.find(user => user.email === email && user.password === getHash(password));

    if (user) {
        // 生成token并存储在localStorage
        const token = generateToken();
        localStorage.setItem("authToken", token);
        localStorage.setItem("user'sname", user.username); 

        // 显示成功信息
        loginsuccess.style.opacity = 1;
        loginsuccess.style.transform = "translate(-50%, -50%)";

        // 隐藏错误信息
        loginerror.style.opacity = 0;
        loginerror.style.transform = "translate(-50%, -50%)";

        // 等待1.5秒后跳转回首页
        setTimeout(() => {
            loginsuccess.style.opacity = 0;
            loginsuccess.style.transform = "translate(-50%, -50%)";
            Login.classList.remove("active");
        }, 1500);
    } else {
        // 显示错误信息：邮箱或密码不匹配
        // loginerror.textContent = "Email or password is incorrect";
        loginerror.style.opacity = 1;
        loginerror.style.transform = "translate(-50%,-50%)";

        // 清空输入框
        loginemail.value = "";
        loginpassword.value = "";
    }
}

// 生成token的函数
function generateToken() {
    return Math.random().toString(36).substr(2);
}

// 检查是否存在token
// function checkAuthToken() {
//     const token = localStorage.getItem("authToken");
//     if (token) {

//         showSidebar();
//     } else {

//         Login.classList.add("active");
//     }
// }

// 显示侧边栏选择界面的函数
function showSidebar() {
    // 实现显示侧边栏选择界面的逻辑
    console.log("Showing sidebar");
}

// 点击登录图标时检查token
// document.querySelector('#loginIcon').onclick = function () {
//     checkAuthToken();
// };

// 获取 #loginIcon 和 #userMenu 元素
let loginIcon = document.querySelector('#loginIcon');
let userMenu = document.querySelector('#userMenu');
let header = document.querySelector('.header');
// 当 #loginIcon 被点击时，显示或隐藏菜单
loginIcon.onclick = function (event) {
    event.preventDefault(); // 防止页面跳转
    if (localStorage.getItem("authToken")) {
        // 获取登录图标的位置和尺寸
        const iconRect = loginIcon.getBoundingClientRect();
        // 获取导航栏的高度
        const headerHeight = header.offsetHeight;
        // 设置菜单的位置
        userMenu.style.top = `${iconRect.bottom+headerHeight / 6}px`;
        userMenu.style.left = `${iconRect.left+headerHeight / 4}px`;
        // 切换菜单的显示状态
        userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block'; // 切换菜单的显示状态
    } else {
        Login.classList.add('active');
    }
};

// 当点击页面其他地方时，隐藏菜单
document.addEventListener('click', function (event) {
    if (!loginIcon.contains(event.target) && !userMenu.contains(event.target)) { // 如果点击的不是 #loginIcon 和 #userMenu 元素
        userMenu.style.display = 'none';
    }
});

// 当点击退出登录时，清除 token 并隐藏菜单
document.querySelector('#logout').onclick = function (event) {
    event.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user'sname")
    // localStorage.removeItem("profileImage")
    userMenu.style.display = 'none';
    // Login.classList.add('active');
};

let count = 0
// 初始化一个计数器
const btn = document.querySelectorAll('.slides input')
// 获取input
const stopTimer = document.querySelectorAll('.imgnavigation .bar')
// 获取bar
const title = document.querySelector('.home-maker .coffee-house')
// 获取coffee_house
const font = document.querySelector('.home-maker .font')
// 获取coffeehouse下面那段字
const linkBtn = document.querySelector('.home-maker .link-btn')
// 获取get—start按钮

let timer = setInterval(function () {
    // 这个是定时器，每4s +1
    count = count + 1
    if (count > 4) {
        count = 0
    }

    btn[count].checked = true
    // 让input的对应按钮改成已选

    if (count === 0) {
        stopTimer[stopTimer.length - 1].classList.remove('changeColor')
        stopTimer[count].classList.add('changeColor')
    }
    //添加changecolor类，判断它从最后一张图片回来的时候把最后
    // 那个按钮给改成未选状态 

    if (count !== 0) {
        stopTimer[count].classList.add('changeColor')
        stopTimer[count - 1].classList.remove('changeColor')
    }
    // 如果就是从第一张切到第二张这些普通案例的话，就是这个来
    // 判断




}
    , 4000)

stopTimer.forEach(function (items) {
    // 这个是获取全部bar，然后分别对它们创函数

    items.addEventListener('mouseenter', function () {
        clearInterval(timer)
    })
    // 这个是鼠标停留在下面那个bar的时候控制图片不会动的

    items.addEventListener('mouseleave', function () {

        timer = setInterval(function () {
            count = count + 1
            if (count > 4) {
                count = 0
            }

            btn[count].checked = true

            if (count === 0) {
                stopTimer[stopTimer.length - 1].classList.remove('changeColor')
                stopTimer[count].classList.add('changeColor')
            }
            if (count !== 0) {
                stopTimer[count].classList.add('changeColor')
                stopTimer[count - 1].classList.remove('changeColor')
            }

        }
            , 4000)
    })
    // 这一整个就是重新搞回计数器，鼠标离开的时候重启计数器
    items.addEventListener('click', function () {
        const index = Array.from(stopTimer).indexOf(this)
        stopTimer[index].classList.add('changeColor')
        stopTimer[count].classList.remove('changeColor')
        count = index
    })
    // 这个呢就是假如我点击其中一个bar，我的选定状态就变成那个对应
    // bar的下标，变成白色
})

document.addEventListener('DOMContentLoaded', function () {
    title.style.opacity = 1
    // title.style.transform = 'translate(-150px,-100px)'
    font.style.opacity = 1
    // font.style.transform = 'translate(-150px,-100px)'
    linkBtn.style.opacity = 1
    // linkBtn.style.transform = 'translate(-150px,-100px)'
})
// 这个就是刚开始加载画面的时候，会把那些文字移动

//activities
let next = document.getElementById("next");
let prev = document.getElementById("prev");
let carousel = document.querySelector(".carousel");
let items = document.querySelectorAll(".carousel .item");

let countItem = items.length;
let active = 1;
let other_1 = null;
let other_2 = null;

next.onclick = () => {
  carousel.classList.remove("prev");
  carousel.classList.add("next");

  active = active + 1 >= countItem ? 0 : active + 1;
  other_1 = active - 1 < 0 ? countItem - 1 : active - 1;
  other_2 = active + 1 >= countItem ? 0 : active + 1;
  changeSlider();
};

prev.onclick = () => {
  carousel.classList.remove("next");
  carousel.classList.add("prev");
  active = active - 1 < 0 ? countItem - 1 : active - 1;
  other_1 = active + 1 >= countItem ? 0 : active + 1;
  other_2 = other_1 + 1 >= countItem ? 0 : other_1 + 1;
  changeSlider();
};

const changeSlider = () => {
  let itemOldActive = document.querySelector(".carousel .item.active");
  if (itemOldActive) itemOldActive.classList.remove("active");

  let itemOldOther_1 = document.querySelector(".carousel .item.other_1");
  if (itemOldOther_1) itemOldOther_1.classList.remove("other_1");

  let itemOldOther_2 = document.querySelector(".carousel .item.other_2");
  if (itemOldOther_2) itemOldOther_2.classList.remove("other_2");

  items.forEach((e) => {
    // 清除动画效果
    e.querySelector(".image img").style.animation = "none";
    e.querySelector(".image figcaption").style.animation = "none";
    // 强制重新布局 (reflow)
    void e.offsetWidth;
    // 恢复动画效果
    e.querySelector(".image img").style.animation = "";
    e.querySelector(".image figcaption").style.animation = "";
  });

  items[active].classList.add("active");
  items[other_1].classList.add("other_1");
  items[other_2].classList.add("other_2");

  clearInterval(autoPlay);
  autoPlay = setInterval(() => {
    next.click();
  }, 5000);
};

let autoPlay = setInterval(() => {
  next.click();
}, 5000);


const imgSlider = document.querySelector(".img-slider");
const imgSliderItems = document.querySelectorAll(".img-slider .item");
const imgItems = document.querySelectorAll(".img-item");
const infoItems = document.querySelectorAll(".info-item");

const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

let colors = ["#3674be", "#d26181", "#ceb13d", "#c6414c", "#171f2b", "#50aa61"];

console.log(imgSlider);
console.log(nextBtn);
console.log(prevBtn);

let indexSlider = 0;
let index = 0;
let autoPlayInterval = null;

const slider = () => {
  if (imgSlider) {
    imgSlider.style.transform = `rotate(${indexSlider * 60}deg)`;
  }

  imgSliderItems.forEach((item) => {
    item.style.transform = `rotate(${indexSlider * -60}deg)`;
  });

  const activeImgItem = document.querySelector(".img-item.active");
  if (activeImgItem) {
    activeImgItem.classList.remove("active");
  }
  if (imgItems[index]) {
    imgItems[index].classList.add("active");
  }

  const activeInfoItem = document.querySelector(".info-item.active");
  if (activeInfoItem) {
    activeInfoItem.classList.remove("active");
  }
  if (infoItems[index]) {
    infoItems[index].classList.add("active");
  }

//   document.body.style.background = colors[index];
};

// 自动播放函数
const startAutoPlay = () => {
  // 清除之前的自动播放
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
  
  // 设置新的自动播放，每4秒切换一次
  autoPlayInterval = setInterval(() => {
    if (nextBtn) {
      indexSlider++;
      index++;

      if (index > imgItems.length - 1) {
        index = 0;
      }

      slider();
    }
  }, 4000);
};

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    indexSlider++;
    index++;

    if (index > imgItems.length - 1) {
      index = 0;
    }

    slider();
    // 点击后重新开始自动播放
    startAutoPlay();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    indexSlider--;
    index--;

    if (index < 0) {
      index = imgItems.length - 1;
    }
    slider();
    // 点击后重新开始自动播放
    startAutoPlay();
  });
}

// 如果轮播图存在，启动自动播放
if (imgSlider && imgItems.length > 0) {
  startAutoPlay();
  
  // 鼠标悬停在轮播图上时暂停自动播放
  const carouselAbout = document.querySelector(".carousel_about");
  if (carouselAbout) {
    carouselAbout.addEventListener("mouseenter", stopAutoPlay);
    carouselAbout.addEventListener("mouseleave", startAutoPlay);
  }
}

// ========== Shop Page Functionality ==========
// 等待DOM和数据库加载完成
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initShopPage, 100);
});

function initShopPage() {
  // 获取元素
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const originFilter = document.getElementById('origin-filter');
  const sortSelect = document.getElementById('sort-select');
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!productsGrid) return; // 如果不在商店页面，直接返回

  let filteredProducts = [];
  let currentCart = [];

  // 加载购物车
  function loadCart() {
    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { cart: [] };
    currentCart = storedDatabase.cart || [];
    updateCartUI();
  }

  // 更新购物车UI
  function updateCartUI() {
    if (cartCount) {
      const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      // 购物车图标始终显示，但数量为0时隐藏数字
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    // 确保购物车图标始终可见
    if (cartIcon) {
      cartIcon.style.display = 'flex';
    }
  }

  // 渲染产品
  function renderProducts(products) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
      productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 2rem; padding: 4rem;">No products found</p>';
      return;
    }

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      
      const isInCart = currentCart.find(item => item.id === product.id);
      const isInWishlist = checkWishlist(product.id);
      
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.src='../photo/bean1.png'">
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-rating">
            ${generateStars(product.rating)} ${product.rating} (${product.reviews} reviews)
          </div>
          <div class="product-stock ${product.stock < 10 ? 'low-stock' : ''}">
            Stock: ${product.stock}
          </div>
          <div class="product-actions">
            <button class="product-btn add-to-cart-btn" data-id="${product.id}">
              ${isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <button class="product-btn wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      `;
      
      productsGrid.appendChild(productCard);
    });

    // 添加事件监听器
    productsGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        addToCart(productId);
      });
    });

    productsGrid.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        toggleWishlist(productId);
      });
    });
  }

  // 生成星星评分
  function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    return stars;
  }

  // 添加到购物车
  function addToCart(productId) {
    const product = mockDatabase.products.find(p => p.id === productId);
    if (!product) return;

    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { cart: [] };
    let cart = storedDatabase.cart || [];
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    storedDatabase.cart = cart;
    localStorage.setItem('mockDatabase', JSON.stringify(storedDatabase));
    currentCart = cart;
    updateCartUI();
    renderProducts(filteredProducts);
  }

  // 检查是否在愿望清单
  function checkWishlist(productId) {
    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { wishlist: [] };
    return storedDatabase.wishlist.some(item => item.id === productId);
  }

  // 切换愿望清单
  function toggleWishlist(productId) {
    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { wishlist: [] };
    let wishlist = storedDatabase.wishlist || [];
    
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      const product = mockDatabase.products.find(p => p.id === productId);
      if (product) {
        wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image });
      }
    }

    storedDatabase.wishlist = wishlist;
    localStorage.setItem('mockDatabase', JSON.stringify(storedDatabase));
    renderProducts(filteredProducts);
  }

  // 过滤和排序产品
  function filterAndSortProducts() {
    let products = [...mockDatabase.products];

    // 搜索过滤
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // 分类过滤
    const category = categoryFilter ? categoryFilter.value : 'all';
    if (category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // 产地过滤
    const origin = originFilter ? originFilter.value : 'all';
    if (origin !== 'all') {
      products = products.filter(p => p.origin === origin);
    }

    // 排序
    const sortBy = sortSelect ? sortSelect.value : 'default';
    switch(sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    filteredProducts = products;
    renderProducts(products);
  }

  // 初始化
  loadCart();
  filterAndSortProducts();

  // 事件监听器
  if (searchInput) {
    searchInput.addEventListener('input', filterAndSortProducts);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterAndSortProducts);
  }
  if (originFilter) {
    originFilter.addEventListener('change', filterAndSortProducts);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', filterAndSortProducts);
  }

  // 购物车图标点击
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      if (cartModal) {
        renderCartModal();
        cartModal.classList.add('active');
      }
    });
  }

  // 关闭购物车
  if (closeCart) {
    closeCart.addEventListener('click', () => {
      if (cartModal) {
        cartModal.classList.remove('active');
      }
    });
  }

  // 渲染购物车模态框
  function renderCartModal() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (currentCart.length === 0) {
      cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; font-size: 1.6rem;">Your cart is empty</p>';
      if (cartTotal) cartTotal.textContent = '0.00';
      return;
    }

    let total = 0;
    currentCart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src='../photo/bean1.png'">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
      total += item.price * item.quantity;
    });

    if (cartTotal) cartTotal.textContent = total.toFixed(2);
  }

  // 全局函数供HTML调用
  window.updateCartQuantity = function(productId, change) {
    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { cart: [] };
    let cart = storedDatabase.cart || [];
    const item = cart.find(i => i.id === productId);
    
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
      }
    }

    storedDatabase.cart = cart;
    localStorage.setItem('mockDatabase', JSON.stringify(storedDatabase));
    currentCart = cart;
    updateCartUI();
    renderCartModal();
    renderProducts(filteredProducts);
  };

  window.removeFromCart = function(productId) {
    const storedDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || { cart: [] };
    let cart = storedDatabase.cart.filter(i => i.id !== productId);
    
    storedDatabase.cart = cart;
    localStorage.setItem('mockDatabase', JSON.stringify(storedDatabase));
    currentCart = cart;
    updateCartUI();
    renderCartModal();
    renderProducts(filteredProducts);
  };
}
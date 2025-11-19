console.log("Aroch Green y Asociados");

AOS.init();

// You can also pass an optional settings object
// below listed default settings
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 100, // values from 0 to 3000, with step 50ms
  duration: 1000, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: true, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});

const mobileMenu = document.querySelector('.mobile-menu');

const openMobileMenu = () => {
  if (mobileMenu) {
    mobileMenu.style.opacity = 1;
    mobileMenu.style.visibility = 'visible';
  }
}

const closeMobileMenu = () => {
  if (mobileMenu) {
    mobileMenu.style.opacity = 0;
    mobileMenu.style.visibility = 'hidden';
  }
}

const mobileMenuBurger = document.querySelector('.navbar-main-mobile-burger');
mobileMenuBurger && mobileMenuBurger.addEventListener('click', () => {
  openMobileMenu();
})

const mobileMenuClose = document.querySelector('.mobile-menu-close');
mobileMenuClose && mobileMenuClose.addEventListener('click', () => {
  closeMobileMenu();
})

const loadSubmenuItems = async () => {
  try {
    const submenu = document.querySelector('#navbar-main-submenu-lawyers');
    const lawyers = await fetchLawyers();
    lawyers && lawyers.forEach(element => {
      const submenuItem = document.createElement('li');
      submenuItem.classList.add('navbar-main-submenu-item');
      const submenuAnchor = document.createElement('a');
      submenuAnchor.textContent = element.shortname;
      submenuAnchor.setAttribute('href', `./abogados.html?username=${element.username}`);
      submenuAnchor.setAttribute('title', element.shortname);
      submenuItem.appendChild(submenuAnchor);
      submenu.appendChild(submenuItem);
    })
  } catch (error) {
    console.error('Failed to get lawyers info:', error);
  }
}

const loadMobileMenuItems = async () => {
  try {
    const mobileMenuItems = document.querySelector('#mobile-menu-items');
    
    // Add [Panel de abogados] element
    const lawyersItem = document.createElement('li');
    lawyersItem.textContent = 'Panel de abogados';
    lawyersItem.classList.add('mobile-menu-item');
    mobileMenuItems.appendChild(lawyersItem);
    
    // Add layers elements
    const lawyers = await fetchLawyers();
    lawyers && lawyers.forEach(element => {
      const lawyerItem = document.createElement('li');
      lawyerItem.classList.add('mobile-menu-subitem');
      const lawyerAnchor = document.createElement('a');
      lawyerAnchor.textContent = element.shortname;
      lawyerAnchor.setAttribute('href', `./abogados.html?username=${element.username}`);
      lawyerAnchor.setAttribute('title', element.shortname);
      lawyerItem.appendChild(lawyerAnchor);
      mobileMenuItems.appendChild(lawyerItem);
    })

    // Add divider
    const divider = document.createElement('div');
    divider.classList.add('mobile-menu-divider');
    mobileMenuItems.appendChild(divider);

    // Add [Panel administrativo] element
    const adminItem = document.createElement('li');
    adminItem.classList.add('mobile-menu-item');
    const adminAnchor = document.createElement('a');
    adminAnchor.textContent = 'Panel administrativo';
    adminAnchor.setAttribute('href', './administrativo.html');
    adminAnchor.setAttribute('title', 'Panel administrativo');
    adminItem.appendChild(adminAnchor);
    mobileMenuItems.appendChild(adminItem);
  } catch (error) {
    console.error('Failed to get lawyers info:', error);
  }
}

const isLawyersPage = () => {
  const { location: { pathname = null } } = window;
  return pathname.includes('/abogados.html');
}

const getQueryParams = () => {
  const { location: { search = null } } = window;
  const queryParams = new URLSearchParams(search);
  return queryParams;
}

const getQueryParam = (param) => {
  const queryParams = getQueryParams();
  const queryParamValue = queryParams.get(param);
  return queryParamValue;
}

const loadLawyersInfo = async () => {
  try {
    const imagesPath = './assets/lawyers/';
    const lawyers = await fetchLawyers();
    const username = getQueryParam('username');
    const lawyer = lawyers.filter(lawyer => lawyer.username === username);
    if (lawyer) {
      const image = document.querySelector('#lawyer-image');
      const name = document.querySelector('#lawyer-name');
      const email = document.querySelector('#lawyer-email');
      const academic = document.querySelector('#lawyer-academic-list');
      const experience = document.querySelector('#lawyer-experience-list');
      const languages = document.querySelector('#lawyer-languages-list');
      const additional = document.querySelector('#laywer-additional-list');
      image.setAttribute('src', `${imagesPath}${lawyer[0].image}`);
      image.setAttribute('alt', lawyer[0].name);
      name.textContent = lawyer[0].name;
      email.textContent = lawyer[0].email;
      academic.innerHTML = lawyer[0].academic
      experience.innerHTML = lawyer[0].experience
      languages.innerHTML = lawyer[0].languages
      additional.innerHTML = lawyer[0].additional
    }
  } catch (error) {
    console.error('Failed to get lawyers info:', error);
    throw error;
  }
}

const fetchLawyers = async () => {
  try {
    const response = await fetch('lawyers.json');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
    const data = await response.json();
    return data.lawyers || null;
  } catch (error) {
    console.error('Error trying to get lawyers.json:', error);
    throw error;
  }
}

const fetchMenu = async () => {
  try {
    const response = await fetch('menu.json');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
    const data = await response.json();
    return data.menu || null;
  } catch (error) {
    console.error('Error trying to get lawyers.json:', error);
    throw error;
  }
}

const createMenu = async () => {
  try {
    const data = await fetchMenu()
    const menu = document.querySelector(".navbar-main-menu")
    // Add home anchor
    const logoItem = document.createElement('li')
    logoItem.classList.add('navbar-main-menu-item')
    const logoAnchor = document.createElement('a')
    logoAnchor.setAttribute('href', './')
    logoAnchor.classList.add('navbar-logo')
    logoItem.appendChild(logoAnchor)
    const logo = document.createElement('img')
    logo.setAttribute('src', './assets/logo-white.png')
    logo.setAttribute('title', 'Inicio')
    logoAnchor.appendChild(logo)
    menu.appendChild(logoItem)
    
    menu && data && data.forEach(item => {
      // Add menu item
      const menuItem = document.createElement("li")
      menuItem.classList.add("navbar-main-menu-item")
      const menuItemAnchor = document.createElement("a")
      menuItemAnchor.setAttribute("href", "#")
      menuItemAnchor.setAttribute("title", item.title)
      menuItemAnchor.innerText = item.title
      menuItem.appendChild(menuItemAnchor)
      menu.appendChild(menuItem)

      // Add submenu items
      const subitems = item.items
      if (subitems && subitems.length > 0) {
        const submenuList = document.createElement("ul")
        submenuList.classList.add("navbar-main-submenu")
        subitems.forEach(subitem => {
          const submenuItem = document.createElement("li")
          submenuItem.classList.add("navbar-main-submenu-item")
          const submenuItemAnchor = document.createElement("a")
          submenuItemAnchor.setAttribute("href", subitem.path)
          submenuItemAnchor.setAttribute("title", subitem.title)
          submenuItemAnchor.innerText = subitem.title
          submenuItem.appendChild(submenuItemAnchor)
          submenuList.appendChild(submenuItem)
        });
        menuItem.appendChild(submenuList)
      }
    })
  } catch (error) {
    console.error('Failed to get menu info:', error);
  }
}

const createMobileMenu = async () => {
  try {
    const data = await fetchMenu()
    const mobileMenu = document.querySelector("#mobile-menu-items")
    mobileMenu && data && data.forEach(item => {
      const mobileMenuItem = document.createElement("li")
      mobileMenuItem.classList.add("mobile-menu-item")
      const mobileMenuItemAnchor = document.createElement("a")
      mobileMenuItemAnchor.setAttribute("href", "#")
      mobileMenuItemAnchor.setAttribute("title", item.title)
      mobileMenuItemAnchor.innerText = item.title
      mobileMenuItem.appendChild(mobileMenuItemAnchor)
      mobileMenu.appendChild(mobileMenuItem)
      const subitems = item.items
      if (subitems && subitems.length > 0) {
        subitems.forEach(subitem => {
          const mobileSubmenuItem = document.createElement("li")
          mobileSubmenuItem.classList.add("mobile-menu-subitem")
          const mobileSubmenuItemAnchor = document.createElement("a")
          mobileSubmenuItemAnchor.setAttribute("href", subitem.path)
          mobileSubmenuItemAnchor.setAttribute("title", subitem.title)
          mobileSubmenuItemAnchor.innerText = subitem.title
          mobileSubmenuItem.appendChild(mobileSubmenuItemAnchor)
          mobileMenu.appendChild(mobileSubmenuItem)
        })
      }
    })
  } catch (error) {
    console.error('Failed to get menu info:', error);
  }
}

window.addEventListener('load', () => {
  createMenu();
  createMobileMenu();
})
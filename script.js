// Loading Animation
document.addEventListener("DOMContentLoaded", () => {
  // Hide loader after page is fully loaded
  setTimeout(() => {
    const loader = document.querySelector(".loader-wrapper");
    loader.classList.add("fade-out");

    setTimeout(() => {
      loader.style.display = "none";
      document.body.classList.add("loaded");
    }, 500);
  }, 1500);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Scroll animation for sections
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.1 }
);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
  section.classList.add("hidden");
});

// Add scroll styles to header
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Project Modal and Slideshow
const projectCards = document.querySelectorAll(".project-card");
const modal = document.querySelector(".project-modal");
const modalClose = document.querySelector(".modal-close");
const modalContent = document.querySelector(".modal-content");
const slideshow = document.querySelector(".slideshow");
const slideshowImages = document.querySelector(".slideshow-images");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const slideDots = document.querySelector(".slide-dots");

let currentSlide = 0;
let slides = [];

// Project data (would normally come from a database)
const projectData = {
  "recipe-tracker": {
    title: "Recipe Tracker",
    description:
      "A full-stack recipe management app that lets users create, schedule and organise recipes with an integrated calendar, shopping list and a meal planner. After getting into cooking last year, I found it hard to keep track of all the recipes that I liked. I was using a google spreadsheet that had 20 tabs at the bottom 💀.",

    slides: [
      // {
      //   image: "assets/Slide1.png",
      //   caption: "Dashboard view showing weekly meal plan and favorite recipes",
      // },
      // {
      //   image: "assets/Slide2.png",
      //   caption: "Recipe creation interface with ingredient management",
      // },
      {
        image: "assets/Slide3.png",
        caption:
          "Dashboard view displaying all recipes. Users can choose to add recipes on this page. Clicking on a recipe will ...",
      },
      {
        image: "assets/Slide4.png",
        caption:
          "... take you to this page, which shows the added recipe's method ingredients and any youtube video that was embedded. Users can change the servings to easily adjust the quantity of ingredients for the people you are serving. There is also the option to edit or delete the recipe as well.",
      },
      {
        image: "assets/Slide5.png",
        caption:
          "Calendar view: Schedule what meals you plan to cook on what days which will be handy for... ",
      },
      {
        image: "assets/Slide6.png",
        caption:
          "... the shopping list! Choose to generate a shopping list of all the ingredients for the recipes scheduled from a start to finish date.",
      },
      {
        image: "assets/Slide7.png",
        caption:
          "Shopping list view: Displays the shopping list in a to-do list format. Users can choose to add / edit / delete any ingredients and cross off any ingredients already bought.",
      },
      {
        image: "assets/Slide2.png",
        caption: "Multi-user support!",
      },
    ],
    technologies: ["React", "Express", "Node.js", "PostgreSQL"],
    links: {
      github: "https://github.com",
      demo: "https://example.com",
    },
  },
  flockr: {
    title: "Flockr (Church Management Software)",
    description: `
    Flockr is a full-stack church management system designed to help churches organise their people, streamline operations, and enable effective communication.
    This project supports managing groups, events, attendance, and communications through a single platform. It was deployed using Docker and AWS services.
  `,
    slides: [],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Docker",
      "AWS EC2",
      "AWS RDS",
    ],
    links: {
      demo: "",
    },
  },
};

// Open modal when clicking on a project card
projectCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    // Don't open modal if clicking on links
    if (e.target.closest(".project-links")) return;

    const projectId = card.getAttribute("data-project");
    const project = projectData[projectId];

    if (project) {
      // Set modal content
      document.querySelector(".modal-title").textContent = project.title;
      const descriptionEl = document.querySelector(".modal-description");
      const newDescription = document.querySelector(
        `.project-template[data-project-id="${projectId}"]`
      );

      if (newDescription) {
        descriptionEl.innerHTML = newDescription.innerHTML;
      }

      // Clear previous slides
      slideshowImages.innerHTML = "";
      slideDots.innerHTML = "";
      slides = project.slides;
      currentSlide = 0;

      if (project.slides.length === 0) {
        slideshow.style.display = "none";
      } else {
        slideshow.style.display = "block";
      }

      // Create slides
      project.slides.forEach((slide, index) => {
        // Create image slide
        const slideDiv = document.createElement("div");
        slideDiv.className = "slide";
        if (index === 0) slideDiv.classList.add("active");

        const img = document.createElement("img");
        img.src = slide.image;
        img.alt = `${project.title} - Slide ${index + 1}`;

        const caption = document.createElement("p");
        caption.className = "slide-caption";
        caption.textContent = slide.caption;

        slideDiv.appendChild(img);
        slideDiv.appendChild(caption);
        slideshowImages.appendChild(slideDiv);

        // Create dot indicator
        const dot = document.createElement("span");
        dot.className = "dot";
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        slideDots.appendChild(dot);
      });

      // Show modal
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }
  });
});

// Close modal
modalClose.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Re-enable scrolling
});

// Close modal when clicking outside content
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Next slide
nextBtn.addEventListener("click", () => {
  if (slides.length > 0) {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlideshow();
  }
});

// Previous slide
prevBtn.addEventListener("click", () => {
  if (slides.length > 0) {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlideshow();
  }
});

// Go to specific slide
function goToSlide(index) {
  currentSlide = index;
  updateSlideshow();
}

// Update slideshow display
function updateSlideshow() {
  // Update slides
  const slideElements = slideshowImages.querySelectorAll(".slide");
  slideElements.forEach((slide, index) => {
    if (index === currentSlide) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });

  // Update dots
  const dotElements = slideDots.querySelectorAll(".dot");
  dotElements.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;
  const heroSection = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image img");

  if (scrollPosition <= heroSection.offsetHeight) {
    heroImage.style.transform = `translateY(${scrollPosition * 0.2}px) rotate(${
      scrollPosition * 0.02
    }deg)`;
    heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
  }
});

// Typing animation for hero title
const heroTitle = document.querySelector(".hero-content h1 span");
const originalText = heroTitle.textContent;
heroTitle.textContent = "";

// Typing animation for name
const heroTyping = document.getElementById("hero-typing");
const fullText = "Hi, I'm Raymond";
let index = 0;

function typeWriterFull() {
  if (index < fullText.length) {
    heroTyping.innerHTML =
      fullText.substring(0, index + 1) + '<span class="cursor">|</span>';
    index++;
    setTimeout(typeWriterFull, 100);
  } else {
    heroTyping.innerHTML = fullText; // remove cursor at end
  }
}

// Start animation after page load
setTimeout(typeWriterFull, 2000);

// Add animation classes
document.head.insertAdjacentHTML(
  "beforeend",
  `
<style>
    .hidden {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .show {
        opacity: 1;
        transform: translateY(0);
    }
    
    header.scrolled {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        padding: 10px 0;
        background-color: rgba(15, 23, 42, 0.95);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    /* Loading animation */
    .loader-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--background-color);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }
    
    .loader-wrapper.fade-out {
        opacity: 0;
    }
    
    .loader {
        width: 60px;
        height: 60px;
        border: 5px solid rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    /* Cursor animation */
    .cursor {
        animation: blink 1s step-end infinite;
    }
    
    @keyframes blink {
        from, to { opacity: 1; }
        50% { opacity: 0; }
    }
    
    /* Slideshow styles */
    .slide {
        display: none;
        text-align: center;
    }
    
    .slide.active {
        display: block;
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .dot {
        cursor: pointer;
        height: 12px;
        width: 12px;
        margin: 0 5px;
        background-color: var(--border-color);
        border-radius: 50%;
        display: inline-block;
        transition: background-color 0.3s ease;
    }
    
    .dot.active, .dot:hover {
        background-color: var(--primary-color);
    }
</style>
`
);

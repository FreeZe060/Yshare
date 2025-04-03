document.addEventListener("scroll", function() {
    var sections = document.querySelectorAll("section");
    var navLinks = document.querySelectorAll(".nav-link");

    sections.forEach(function(section) {
        var sectionTop = section.offsetTop - 100;
        var sectionHeight = section.offsetHeight;
        var scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            var currentId = section.getAttribute("id");
            navLinks.forEach(function(link) {
                link.classList.remove("active");
                if (link.getAttribute("href").includes(currentId)) {
                    link.classList.add("active");
                }
            });
        }
    });
});

AOS.init({
    duration: 500,
    easing: 'ease-out',
    once: true 
});

function openProjectPopup(event) {
    const popup = document.getElementById("projectPopup");
    const popupBackground = document.getElementById("popup-background");
    const popupContent = document.getElementById("popup-content");

    const eventTitle = event.title;
    const eventText = event.desc;
    const eventDate = event.date;
    const eventImage = event.img;
    console.log(event);

    // popupBackground.style.backgroundImage = `url(${eventImage})`;

    popupContent.querySelector('.popup-title').textContent = eventTitle;
    popupContent.querySelector('.popup-date').textContent = eventDate;
    popupContent.querySelector('.popup-description p').textContent = eventText;

    popup.style.display = "flex";
    AOS.refresh();
}

function closeProjectPopup(event) {
    const popup = document.getElementById("projectPopup");
    
    if (event.target === popup) {
        popup.style.display = "none";
    }
}
// ------------------------
// PROMO SECTION
// ------------------------
async function loadPromo() {
  try {
    const res = await fetch('https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbwxSVq_9jMG-QeeFoAy6kxtU7R8ArsIvN6-wn4Kp3dLEeBiMBbn9btbeLNX2gQfqjWHwA/exec?type=promo');
    const data = await res.json();
    if (data.posterUrl) {
      document.getElementById('promo-image').src = data.posterUrl;
      document.getElementById('promo-image').style.display = 'block';
    }
  } catch (err) {
    console.error('Error loading promo:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadPromo);

// ------------------------
// CLASSES SECTION: Get class info
// ------------------------
// Fetch classes from Apps Script web app
async function loadClassesDebug() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxN7WvHNqEx9qmCpDUW4g3hFvC9LrPvnKzD2F9FUDRSojwUfvQkly28YvssMNAVqD2e/exec?type=classes');
    const data = await response.json();

    const container = document.getElementById('classes-debug');
    container.innerHTML = ''; // clear previous content

    data.forEach(cls => {
      // Create card wrapper
      const card = document.createElement('div');
      card.className = 'card hover-card';
      card.style.width = '220px'; // optional: fixed width

      // Card content
      const content = document.createElement('div');
      content.className = 'card-content';

      // Title
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.textContent = cls['Class Name'] || 'No Name';

      // Description
      const desc = document.createElement('p');
      desc.className = 'card-description';
      desc.textContent = cls.Description || 'No description';

      // Price & Duration
      const price = document.createElement('p');
      price.textContent = 'Price: ' + (cls.Price || 'N/A');

      const duration = document.createElement('p');
      duration.textContent = 'Duration: ' + (cls.Duration || 'N/A');

      // Append elements
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(price);
      content.appendChild(duration);

      card.appendChild(content);
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('classes-debug').textContent = 'Error fetching data: ' + err;
  }
}

window.addEventListener('DOMContentLoaded', loadClassesDebug);

// ------------------------
// SCHEDULE SECTION: Classes Calendar
// ------------------------
document.addEventListener('DOMContentLoaded', function() {

  // --- CONFIG: replace these with your values ---
  const GOOGLE_API_KEY = 'AIzaSyBW1eCat6SicXhpcnbW2uv9jIiGinrltBA';
  const GOOGLE_CALENDAR_ID = '49238ffdbb6c83d48350881da0f598e0278f4e3637b70b2ba3ef55ea8cde68bf@group.calendar.google.com'; // e.g. yourname@gmail.com or xxxxx@group.calendar.google.com

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxN7WvHNqEx9qmCpDUW4g3hFvC9LrPvnKzD2F9FUDRSojwUfvQkly28YvssMNAVqD2e/exec';

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
	initialView: 'timeGridWeek',
	headerToolbar: {
		left: 'prev,next today',
		center: 'title',
		right: 'dayGridMonth,timeGridWeek' // Month and Week views
	},
	googleCalendarApiKey: GOOGLE_API_KEY,
	events: { googleCalendarId: GOOGLE_CALENDAR_ID },

	eventClick: function(info) {
		info.jsEvent.preventDefault();
		document.getElementById('eventTitle').value = info.event.title || '';
		document.getElementById('eventDateTime').value =
		info.event.start ? info.event.start.toLocaleString() : '';
		document.getElementById('formModal').classList.add('is-active');
	}
  });

  calendar.render();

  // Handle submit
  document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.status === 'success') {
        document.getElementById('formStatus').innerText = '✅ Registered successfully!';
        form.reset();
      } else {
        document.getElementById('formStatus').innerText = '❌ Error: ' + data.message;
      }
    } catch (err) {
      document.getElementById('formStatus').innerText = '❌ Network error: ' + err;
    }
  });

  // Modal close
  function closeModal() {
    document.getElementById('formModal').classList.remove('is-active');
  }
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('modalBg').addEventListener('click', closeModal);
});

// ------------------------
// REVIEWS SECTION
// ------------------------
async function loadReviews() {
  const slider = document.getElementById('testimonial-slider');
  slider.innerHTML = 'Loading reviews...';

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwMyu8FkaYSo1te7BNCKSG4NEbEbyabIninBLqgn0hmv6SzIhS2UV7LdbIFqwhzxEA-_A/exec?type=reviews'); 
    const reviews = await response.json();

    if (!reviews.length) {
      slider.innerHTML = 'No reviews found.';
      return;
    }

    slider.innerHTML = ''; // clear loading

    reviews.forEach(r => {
      const div = document.createElement('div');
      div.classList.add('testimonial-content', 'has-text-centered');
      
      // Convert rating number to stars
      let stars = '⭐'.repeat(Math.round(r.Rating || 0));

      div.innerHTML = `
        <i class="ti-quote-right has-text-white icon mb-20 is-inline-block"></i>
        <p class="has-text-white mb-20">${r.Review}</p>
        <img class="image is-rounded is-inline-block mb-20" src="${r.Image || 'images/testimonial/client-1.png'}" alt="client-image">
        <h4 class="has-text-white">${r.Name}</h4>
        <h6 class="has-text-light mb-20">${stars}</h6>
      `;
      slider.appendChild(div);
    });

    // Reinitialize Slick Slider after adding slides
    if ($(slider).hasClass('slick-initialized')) {
      $(slider).slick('unslick'); // remove previous instance
    }

    $('.testimonial-slider').slick({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      arrows: false,
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 5000, // auto swipe every 5 seconds
      fade: true
    });

  } catch (err) {
    console.error(err);
    slider.innerHTML = 'Error loading reviews';
  }
}

window.addEventListener('DOMContentLoaded', loadReviews);

// ------------------------
// OTHER FUNCTIONS
// ------------------------
(function ($) {
	'use strict';

	// Check for click events on the navbar burger icon
	$(".navbar-burger").click(function () {
		$(".navbar-burger").toggleClass("is-active");
		$(".navbar-menu").toggleClass("is-active");
	});

	// Sticky Menu
	$(window).scroll(function () {
		if ($('.navbar').offset().top > 100) {
			$('.navbar').addClass('nav-bg');
		} else {
			$('.navbar').removeClass('nav-bg');
		}
	});

	// Background-images
	$('[data-background]').each(function () {
		$(this).css({
			'background-image': 'url(' + $(this).data('background') + ')'
		});
	});

	// background color
	$('[data-color]').each(function () {
		$(this).css({
			'background-color': $(this).data('color')
		});
	});

	// progress bar
	$('[data-progress]').each(function () {
		$(this).css({
			'bottom': $(this).data('progress')
		});
	});


	/* ########################################### hero parallax ############################################## */
	window.onload = function () {

		var parallaxBox = document.getElementById('parallax');
		var
			/* c1left = document.getElementById('l1').offsetLeft,
			           c1top = document.getElementById('l1').offsetTop, */
			c2left = document.getElementById('l2').offsetLeft,
			c2top = document.getElementById('l2').offsetTop,
			c3left = document.getElementById('l3').offsetLeft,
			c3top = document.getElementById('l3').offsetTop,
			c4left = document.getElementById('l4').offsetLeft,
			c4top = document.getElementById('l4').offsetTop,
			c5left = document.getElementById('l5').offsetLeft,
			c5top = document.getElementById('l5').offsetTop,
			c6left = document.getElementById('l6').offsetLeft,
			c6top = document.getElementById('l6').offsetTop,
			c7left = document.getElementById('l7').offsetLeft,
			c7top = document.getElementById('l7').offsetTop,
			c8left = document.getElementById('l8').offsetLeft,
			c8top = document.getElementById('l8').offsetTop,
			c9left = document.getElementById('l9').offsetLeft,
			c9top = document.getElementById('l9').offsetTop;

		parallaxBox.onmousemove = function (event) {
			event = event || window.event;
			var x = event.clientX - parallaxBox.offsetLeft,
				y = event.clientY - parallaxBox.offsetTop;

			/*  mouseParallax('l1', c1left, c1top, x, y, 5); */
			mouseParallax('l2', c2left, c2top, x, y, 25);
			mouseParallax('l3', c3left, c3top, x, y, 20);
			mouseParallax('l4', c4left, c4top, x, y, 35);
			mouseParallax('l5', c5left, c5top, x, y, 30);
			mouseParallax('l6', c6left, c6top, x, y, 45);
			mouseParallax('l7', c7left, c7top, x, y, 30);
			mouseParallax('l8', c8left, c8top, x, y, 25);
			mouseParallax('l9', c9left, c9top, x, y, 40);
		};

	};

	function mouseParallax(id, left, top, mouseX, mouseY, speed) {
		var obj = document.getElementById(id);
		var parentObj = obj.parentNode,
			containerWidth = parseInt(parentObj.offsetWidth),
			containerHeight = parseInt(parentObj.offsetHeight);
		obj.style.left = left - (((mouseX - (parseInt(obj.offsetWidth) / 2 + left)) / containerWidth) * speed) + 'px';
		obj.style.top = top - (((mouseY - (parseInt(obj.offsetHeight) / 2 + top)) / containerHeight) * speed) + 'px';
	}
	/* ########################################### /hero parallax ############################################## */

	// testimonial-slider
	$('.testimonial-slider').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		arrows: false,
		adaptiveHeight: true
	});


	// clients logo slider
	$('.client-logo-slider').slick({
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		autoplay: true,
		dots: false,
		arrows: false,
		responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

	// Shuffle js filter and masonry
	var Shuffle = window.Shuffle;
	var jQuery = window.jQuery;

	var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
		itemSelector: '.shuffle-item',
		buffer: 1
	});

	jQuery('input[name="shuffle-filter"]').on('change', function (evt) {
		var input = evt.currentTarget;
		if (input.checked) {
			myShuffle.filter(input.value);
		}
	});


	// Check for click events on the navbar burger icon
	$(".filter-menu .button").click(function () {
		$(this).addClass("is-active").siblings().removeClass('is-active');
	});



})(jQuery);

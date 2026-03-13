document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on refresh
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 800); // Minimum showing time
        }
    });

    // WhatsApp Location Feature
    const whatsappBtn = document.getElementById('whatsapp-location-btn');
    const phoneNumber = "905516840985"; // Değiştirmeyi unutmayın

    if(whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = whatsappBtn.innerHTML;
            
            // Kullanıcıya yükleniyor hissi ver
            whatsappBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Konum Alınıyor...";
            whatsappBtn.style.pointerEvents = "none";
            
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Başarılı konum alımı
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        // Google Maps linki oluştur
                        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
                        
                        // WhatsApp mesajını hazırla
                        const message = encodeURIComponent(`Merhaba, acil yardıma ihtiyacım var. Şu anki konumum: ${mapsLink}`);
                        
                        // WhatsApp'a yönlendir
                        window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
                        
                        // Butonu eski haline getir
                        whatsappBtn.innerHTML = originalText;
                        whatsappBtn.style.pointerEvents = "auto";
                    },
                    (error) => {
                        // Hata durumu (kullanıcı izin vermedi, veya teknik arıza)
                        console.error("Konum hatası:", error);
                        whatsappBtn.innerHTML = "<i class='bx bx-error'></i> Konum Alınamadı";
                        
                        setTimeout(() => {
                            // Sadece WhatsApp'a normal şekilde yönlendir
                            window.location.href = `https://wa.me/${phoneNumber}`;
                            whatsappBtn.innerHTML = originalText;
                            whatsappBtn.style.pointerEvents = "auto";
                        }, 2000);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } else {
                // Tarayıcı desteklemiyorsa normal WhatsApp linkine git
                window.open(`https://wa.me/${phoneNumber}`, '_blank');
                whatsappBtn.innerHTML = originalText;
                whatsappBtn.style.pointerEvents = "auto";
            }
        });
    }

    // Parallax Effect for Hero Background
    const heroBg = document.querySelector('.hero-bg');
    const floatingWa = document.querySelector('.floating-wa');
    const scrollBar = document.getElementById('scroll-bar');
    
    window.addEventListener('scroll', () => {
        // Scroll Progress Bar logic
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) {
            scrollBar.style.width = scrolled + "%";
        }

        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Floating WhatsApp button visibility
        if (floatingWa) {
            if (window.scrollY > 300) {
                floatingWa.classList.add('show-float');
            } else {
                floatingWa.classList.remove('show-float');
            }
        }

        // Parallax calculation
        if (heroBg && window.scrollY < window.innerHeight) {
            const scrollPos = window.scrollY;
            heroBg.style.transform = `translateY(${scrollPos * 0.4}px)`;
        }
    });
    setTimeout(() => {
        const animateUpElements = document.querySelectorAll('.animate-up');
        animateUpElements.forEach(el => {
            el.classList.add('show');
        });
        
        const animateFade = document.querySelectorAll('.animate-fade');
        animateFade.forEach(el => {
            el.classList.add('show-fade');
        });
        
        // Trigger counters
        startCounters();
    }, 100);

    // Number Counter Animation
    let counted = false;
    function startCounters() {
        if (counted) return;
        
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // lower is slower

        counters.forEach(counter => {
            const upDate = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(upDate, 10);
                } else {
                    counter.innerText = target;
                }
            };
            upDate();
        });
        counted = true;
    }

    // Scroll Reveal Animation with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: animate only once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Testimonial Slider Logic
    const slider = document.getElementById('testimonial-slider');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-card');
        const numSlides = slides.length;
        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateDots() {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }

        function goToSlide(index) {
            currentSlide = index;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % numSlides;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + numSlides) % numSlides;
            goToSlide(currentSlide);
        }

        if(nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000); // Slide every 5 seconds
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Pause auto-slide on hover
        slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        slider.parentElement.addEventListener('mouseleave', startAutoSlide);

        startAutoSlide();
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Toggle current one
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.service-card, .gallery-item, .zone-card, .testimonial-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Mobile check - skip tilt for touch devices
            if (window.innerWidth <= 1024) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.transition = "transform 0.1s ease";
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            card.style.transition = "transform 0.5s ease";
        });
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lbPrev = document.querySelector('.lb-prev');
    const lbNext = document.querySelector('.lb-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentIndex = 0;

    const showImage = (index) => {
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        currentIndex = index;

        const item = galleryItems[currentIndex];
        // Get background image URL from computed style
        const bgImg = window.getComputedStyle(item).backgroundImage;
        const url = bgImg.replace('url("', '').replace('")', '');
        
        lightboxImg.src = url;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 10);
            showImage(index);
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });

    // Call Feedback & Desktop Emergency Modal Logic
    const telLinks = document.querySelectorAll('a[href^="tel:"]');
    const emergencyModal = document.getElementById('emergency-modal');
    const modalClose = document.querySelector('.modal-close');
    const toast = document.getElementById('toast-notification');
    const copyBtn = document.getElementById('copy-phone');
    const phoneNumText = document.getElementById('target-phone').innerText;

    const showToast = (message) => {
        const toastMsg = document.getElementById('toast-message');
        toastMsg.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    telLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 1024;
            
            if (!isMobile) {
                // On Desktop: Open Modal instead of doing nothing
                e.preventDefault();
                emergencyModal.style.display = 'flex';
                setTimeout(() => emergencyModal.classList.add('active'), 10);
            } else {
                // On Mobile: Show feedback then allow call
                showToast("Aranıyor...");
                // Link will proceed naturally to trigger the dialer
            }
        });
    });

    const closeEmergencyModal = () => {
        emergencyModal.classList.remove('active');
        setTimeout(() => emergencyModal.style.display = 'none', 400);
    };

    if (modalClose) {
        modalClose.addEventListener('click', closeEmergencyModal);
    }
    
    if (emergencyModal) {
        emergencyModal.addEventListener('click', (e) => {
            if (e.target === emergencyModal) closeEmergencyModal();
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText("05516840985").then(() => {
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = "<i class='bx bx-check'></i>";
                setTimeout(() => copyBtn.innerHTML = originalIcon, 2000);
                showToast("Numara kopyalandı!");
            });
        });
    }

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            
            // Toggle icon
            if (navLinks.classList.contains('mobile-active')) {
                menuIcon.classList.replace('bx-menu', 'bx-x');
            } else {
                menuIcon.classList.replace('bx-x', 'bx-menu');
            }
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                if(menuIcon) menuIcon.classList.replace('bx-x', 'bx-menu');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('mobile-active')) {
                navLinks.classList.remove('mobile-active');
                if(menuIcon) menuIcon.classList.replace('bx-x', 'bx-menu');
            }
        });
    }

});

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Lucide иконок
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Проверяем, есть ли якорь в URL для прокрутки к форме
    if (window.location.hash === '#signupForm') {
        setTimeout(() => {
            scrollToForm();
        }, 500); // Небольшая задержка для полной загрузки страницы
    }
    
    // Адаптация модального окна при изменении размера экрана
    window.addEventListener('resize', adaptModalToScreen);
    window.addEventListener('orientationchange', function() {
        setTimeout(adaptModalToScreen, 100);
    });
    
    // Начальная адаптация
    adaptModalToScreen();
    
    // Обработчик клика вне модального окна для закрытия
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }

    // Initialize all interactive components
    initFAQ();
    initSmoothScrolling();
    initFormSubmission();
    initMobileMenu();
});

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Функция для плавной прокрутки к форме или перенаправления на главную страницу
function scrollToForm() {
    // Проверяем, есть ли форма на текущей странице
    const form = document.querySelector('#signupForm, .signup-form, form[name="signupForm"]');
    
    if (form) {
        // Если форма найдена на текущей странице, прокручиваем к ней
        form.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Устанавливаем фокус на первое поле формы после прокрутки
        setTimeout(() => {
            focusFirstFormField(form);
        }, 800); // Задержка для завершения анимации прокрутки
        
    } else {
        // Если формы нет, перенаправляем на главную страницу с якорем к форме
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            window.location.href = 'index.html#signupForm';
        } else {
            // Если мы уже на главной странице, но форма не найдена, попробуем найти её по другим селекторам
            const fallbackForm = document.querySelector('form, .form-container, #contact-form');
            if (fallbackForm) {
                fallbackForm.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Устанавливаем фокус на первое поле fallback формы
                setTimeout(() => {
                    focusFirstFormField(fallbackForm);
                }, 800);
            }
        }
    }
}

// Функция для установки фокуса на первое поле формы
function focusFirstFormField(form) {
    if (!form) return;
    
    // Ищем первое поле ввода в форме по приоритету
    const firstField = form.querySelector('#name') || 
                      form.querySelector('input[name="name"]') ||
                      form.querySelector('input[type="text"]:first-of-type') ||
                      form.querySelector('input[type="email"]:first-of-type') ||
                      form.querySelector('input:not([type="hidden"]):not([type="submit"]):not([type="button"])') ||
                      form.querySelector('textarea') ||
                      form.querySelector('select');
    
    if (firstField) {
        // Устанавливаем фокус на поле
        firstField.focus();
        
        // Добавляем визуальный эффект для привлечения внимания
        firstField.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
        firstField.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
        firstField.style.borderColor = '#3b82f6';
        
        // Убираем эффект через некоторое время
        setTimeout(() => {
            firstField.style.boxShadow = '';
            firstField.style.borderColor = '';
        }, 2000);
    } else {
        console.log('Первое поле формы не найдено');
    }
}

// Form submission with Google Sheets integration
function initFormSubmission() {
    const form = document.getElementById('signupForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i data-lucide="loader-2"></i> Отправляем...';
        submitButton.disabled = true;
        lucide.createIcons();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company') || '',
            usecase: formData.get('usecase') || '',
            message: formData.get('message') || '',
            timestamp: new Date().toISOString(),
            source: 'ApiSafe Landing Page'
        };
        
        try {
            // Send to Google Sheets
            await sendToGoogleSheets(data);
            
            // Show success message
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Произошла ошибка. Попробуйте еще раз или напишите нам на email.', 'error');
        } finally {
            // Restore button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            lucide.createIcons();
        }
    });
}

// Send data to Google Sheets
async function sendToGoogleSheets(data) {
    // This will be replaced with actual Google Sheets API integration
    // For now, we'll use a placeholder URL
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    
    const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    // Since we're using no-cors mode, we can't check the response
    // We'll assume success if no error is thrown
    return true;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 0.25rem;
                margin-left: auto;
            }
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Update icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }
}

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#FFFFFF';
        header.style.backdropFilter = 'none';
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .problem-card, .step, .pricing-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add mobile menu styles
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-link {
            padding: 0.75rem 0;
            border-bottom: 1px solid #E2E8F0;
        }
        
        .nav-link:last-child {
            border-bottom: none;
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

// Функция для открытия видео модального окна - адаптивная версия
function openVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('demoVideo');
    
    if (modal && video) {
        // Показываем модальное окно с flex для правильного центрирования
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        // Сбрасываем видео и запускаем воспроизведение
        video.currentTime = 0;
        video.play().catch(error => {
            console.log('Автовоспроизведение заблокировано:', error);
        });
        
        // Блокируем прокрутку страницы
        document.body.style.overflow = 'hidden';
        
        // Добавляем обработчик для закрытия по Escape
        document.addEventListener('keydown', handleEscapeKey);
        
        // Фокус на модальном окне для доступности
        modal.focus();
    }
}

// Функция для закрытия видео модального окна
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('demoVideo');
    
    if (modal && video) {
        // Скрываем модальное окно
        modal.style.display = 'none';
        modal.classList.remove('show');
        
        // Останавливаем видео
        video.pause();
        video.currentTime = 0;
        
        // Восстанавливаем прокрутку страницы
        document.body.style.overflow = '';
        
        // Удаляем обработчик Escape
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

// Обработчик нажатия Escape для закрытия модального окна
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeVideoModal();
    }
}

// Функция для определения типа устройства
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 480) return 'mobile-small';
    if (width <= 767) return 'mobile';
    if (width <= 1199) return 'tablet';
    if (width <= 1919) return 'desktop';
    if (width <= 2559) return 'desktop-large';
    return 'desktop-4k';
}

// Функция для адаптации модального окна под размер экрана
function adaptModalToScreen() {
    const modal = document.getElementById('videoModal');
    const modalContent = modal?.querySelector('.video-modal-content');
    
    if (modal && modalContent) {
        const deviceType = getDeviceType();
        
        // Добавляем класс устройства для дополнительной стилизации
        modal.className = modal.className.replace(/device-\w+/g, '');
        modal.classList.add(`device-${deviceType}`);
        
        // Логирование для отладки
        console.log(`Устройство: ${deviceType}, Размер экрана: ${window.innerWidth}x${window.innerHeight}`);
    }
}

// Экспорт функций для глобального использования
window.scrollToForm = scrollToForm;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.getDeviceType = getDeviceType;
window.adaptModalToScreen = adaptModalToScreen;

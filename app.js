// Portfolio Application JavaScript
class CyberPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.startLoadingSequence();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('nav-toggle')?.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Hero section buttons
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Project filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', this.handleProjectFilter.bind(this));
        });

        // Blog search
        document.getElementById('blog-search')?.addEventListener('input', this.handleBlogSearch.bind(this));

        // Contact form
        document.getElementById('contact-form')?.addEventListener('submit', this.handleContactForm.bind(this));

        // Resume download
        document.getElementById('download-resume')?.addEventListener('click', this.handleResumeDownload.bind(this));

        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    initializeComponents() {
        this.setupIntersectionObserver();
        this.initializeSkillBars();
    }

    // Loading Screen
    startLoadingSequence() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.startTypewriterEffect();
                    this.startCodeAnimation();
                }, 500);
            }
        }, 4500); // Wait for boot sequence to complete
    }

    // Typewriter Effect
    startTypewriterEffect() {
        const text = "Passionate about securing systems and solving cybersecurity challenges";
        const typewriterElement = document.getElementById('typewriter');
        
        if (!typewriterElement) return;

        let i = 0;
        const typeSpeed = 50;

        function typeWriter() {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        }

        typeWriter();
    }

    // Code Animation
    startCodeAnimation() {
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
            }, index * 300 + 1000);
        });
    }

    // Navigation
    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    }

    handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Only handle internal anchor links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const navToggle = document.getElementById('nav-toggle');
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle?.classList.remove('active');
                }

                // Update active nav link
                setTimeout(() => {
                    this.updateActiveNavLink();
                }, 100);
            }
        }
    }

    // Project Filtering
    handleProjectFilter(e) {
        const filterValue = e.currentTarget.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.project-card');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Filter projects
        projectCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.transition = 'all 0.3s ease';
                }, index * 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Blog Search
    handleBlogSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const blogPosts = document.querySelectorAll('.blog-post');

        blogPosts.forEach(post => {
            const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
            const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
            const tags = post.getAttribute('data-tags')?.toLowerCase() || '';

            const isMatch = title.includes(searchTerm) || 
                          excerpt.includes(searchTerm) || 
                          tags.includes(searchTerm);

            if (isMatch || searchTerm === '') {
                post.style.display = 'block';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
                post.style.transition = 'all 0.3s ease';
            } else {
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                post.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    if (post.style.opacity === '0') {
                        post.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    // Contact Form
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Create mailto link
        const mailtoLink = `mailto:pittalabhasker2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        this.showNotification('Message prepared! Your email client should open shortly.', 'success');
        
        // Reset form
        e.target.reset();
    }

    // Resume Download
    handleResumeDownload(e) {
        e.preventDefault();
        
        // Create a simple text resume content
        const resumeContent = `
BHASKAR P PITTALA
Cybersecurity Specialist | @BHASHER2229
Email: pittalabhasker2@gmail.com
Phone: +91 8499948773
Location: Bangalore, India

PROFESSIONAL SUMMARY
Cybersecurity professional with expertise in penetration testing, vulnerability assessment, and SIEM technologies. Currently working as a Cybersecurity Intern at PNH Consulting Pvt. Ltd.

EDUCATION
B.Tech - Computer Science and Engineering (Cybersecurity)
Parul University, Vadodara (2020-2024)
CGPA: 7.43

TECHNICAL SKILLS
Platforms: Linux (Ubuntu, Kali), Windows, Android
Security Tools: Burp Suite, Metasploit, Nmap, Wireshark, Wazuh, Splunk
Programming: Python, Bash, Java

PROJECTS
1. NotePass - Secure Password Manager (Aug 2023 - Mar 2024)
   - Android app with AES-256 encryption
   - Technologies: Android Studio, Java, Firebase

2. Bug Hunting - OpenBugBounty Platform (Ongoing)
   - Discovered XSS vulnerabilities in live applications
   - Tools: Burp Suite, Google Dorks

3. Cybersecurity Home Lab (2024 - Present)
   - Built virtualized environment for penetration testing
   - Platforms: VirtualBox, Kali Linux, Ubuntu, Windows 10

CERTIFICATIONS
- Cybersecurity Essentials - Cisco
- CEH (Certified Ethical Hacker) - In Progress
- Google IT Support - Cybersecurity Internship

EXPERIENCE
Cybersecurity Intern - PNH Consulting Pvt. Ltd. (May 2024 - Dec 2024)
- Supported security QA processes
- Focused on threat detection and issue resolution
        `;

        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Bhaskar_P_Pittala_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showNotification('Resume downloaded successfully!', 'success');
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#00FFD1' : '#FF6B6B',
            color: '#000000',
            padding: '1rem 1.5rem',
            borderRadius: '4px',
            fontFamily: 'Fira Code, monospace',
            fontSize: '0.9rem',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger skill bar animations
                    if (entry.target.classList.contains('skills')) {
                        setTimeout(() => {
                            this.animateSkillBars();
                        }, 300);
                    }
                }
            });
        }, observerOptions);

        // Observe sections for fade-in animations
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });

        // Observe individual elements
        document.querySelectorAll('.project-card, .blog-post, .skill-category').forEach(element => {
            element.classList.add('fade-in');
            observer.observe(element);
        });
    }

    // Skills Animation
    initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1.5s ease-in-out';
        });
    }

    animateSkillBars() {
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        
        skillProgressBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 200);
        });
    }

    // Scroll handling
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove navbar shadow on scroll
        if (scrollTop > 100) {
            navbar?.classList.add('scrolled');
            if (navbar) {
                navbar.style.background = 'rgba(0, 0, 0, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 209, 0.1)';
            }
        } else {
            navbar?.classList.remove('scrolled');
            if (navbar) {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }

        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPosition = window.scrollY + 150;

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Window resize handling
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu?.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle?.classList.remove('active');
            }
        }
    }
}

// Terminal Easter Egg
class TerminalEasterEgg {
    constructor() {
        this.commands = {
            'help': 'Available commands: whoami, skills, projects, contact, clear, hack',
            'whoami': 'BHASKAR P PITTALA (@BHASHER2229) - Cybersecurity Specialist',
            'skills': 'Python, Bash, Burp Suite, Metasploit, Nmap, Kali Linux, Penetration Testing',
            'projects': 'NotePass, Bug Hunting, Cybersecurity Home Lab',
            'contact': 'Email: pittalabhasker2@gmail.com | Phone: +91 8499948773',
            'hack': 'Access Denied. Nice try! 😉',
            'clear': 'CLEAR_COMMAND'
        };
        
        this.init();
    }

    init() {
        // Listen for ctrl+shift+t
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.openTerminal();
            }
        });
    }

    openTerminal() {
        const terminal = document.createElement('div');
        terminal.innerHTML = `
            <div class="easter-egg-terminal">
                <div class="terminal-header">
                    <span class="terminal-dot red"></span>
                    <span class="terminal-dot yellow"></span>
                    <span class="terminal-dot green"></span>
                    <span class="terminal-title">BHASHER2229@portfolio:~</span>
                    <button class="close-terminal">×</button>
                </div>
                <div class="terminal-content">
                    <div class="terminal-output">
                        <div>Welcome to BHASHER2229's Terminal</div>
                        <div>Type 'help' for available commands</div>
                    </div>
                    <div class="terminal-input-line">
                        <span class="terminal-prompt">guest@portfolio:~$ </span>
                        <input type="text" class="terminal-input" autofocus>
                    </div>
                </div>
            </div>
        `;

        // Styles
        const styles = `
            .easter-egg-terminal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                max-width: 90vw;
                height: 400px;
                background: #000;
                border: 1px solid #00FFD1;
                border-radius: 8px;
                z-index: 10001;
                font-family: 'Fira Code', monospace;
                overflow: hidden;
                box-shadow: 0 0 30px rgba(0, 255, 209, 0.3);
            }
            .terminal-content {
                padding: 1rem;
                height: calc(100% - 40px);
                overflow-y: auto;
                color: #00FFD1;
            }
            .terminal-input {
                background: transparent;
                border: none;
                color: #00FFD1;
                font-family: 'Fira Code', monospace;
                outline: none;
                flex: 1;
                font-size: 14px;
            }
            .terminal-input-line {
                display: flex;
                align-items: center;
                margin-top: 1rem;
            }
            .terminal-prompt {
                color: #00FFD1;
                margin-right: 0.5rem;
            }
            .close-terminal {
                background: #FF6B6B;
                border: none;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                cursor: pointer;
                margin-left: auto;
                font-size: 14px;
            }
            .close-terminal:hover {
                background: #ff5555;
            }
        `;

        // Add styles
        if (!document.getElementById('terminal-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'terminal-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        document.body.appendChild(terminal);

        // Handle terminal input
        const input = terminal.querySelector('.terminal-input');
        const output = terminal.querySelector('.terminal-output');
        const closeBtn = terminal.querySelector('.close-terminal');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim().toLowerCase();
                this.executeCommand(command, output);
                input.value = '';
            }
        });

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(terminal);
        });

        // Close on escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                if (terminal.parentNode) {
                    document.body.removeChild(terminal);
                }
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    executeCommand(command, output) {
        const commandDiv = document.createElement('div');
        commandDiv.innerHTML = `<span style="color: #00FFD1;">guest@portfolio:~$ </span>${command}`;
        output.appendChild(commandDiv);

        const responseDiv = document.createElement('div');
        responseDiv.style.marginBottom = '1rem';

        if (command === 'clear') {
            output.innerHTML = `
                <div>Welcome to BHASHER2229's Terminal</div>
                <div>Type 'help' for available commands</div>
            `;
            return;
        }

        const response = this.commands[command] || `Command not found: ${command}. Type 'help' for available commands.`;
        responseDiv.textContent = response;
        output.appendChild(responseDiv);

        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
    }
}

// Matrix Rain Effect (Optional)
class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]";
        this.drops = [];
        this.animationId = null;
        this.init();
    }

    init() {
        // Add matrix rain to hero background occasionally
        if (Math.random() > 0.8) { // 20% chance to show matrix effect
            this.createCanvas();
            this.animate();
        }
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.05';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
        
        // Initialize drops
        const columns = Math.floor(this.canvas.width / 20);
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.floor(Math.random() * this.canvas.height / 20);
        }
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    animate() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00FFD1';
        this.ctx.font = '15px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillText(text, i * 20, this.drops[i] * 20);
            
            if (this.drops[i] * 20 > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        this.animationId = setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this));
        }, 100);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberPortfolio();
    new TerminalEasterEgg();
    
    // Optional matrix effect after loading
    setTimeout(() => {
        new MatrixRain();
    }, 8000);
});

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    console.log('🔐 BHASHER2229 Portfolio loaded successfully!');
    console.log('💡 Tip: Press Ctrl+Shift+T to open the terminal easter egg!');
});
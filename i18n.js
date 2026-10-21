(function () {
    "use strict";

    const messages = {
        en: {
            "meta.title": "ABDELKAIOUM | Web Developer",
            "meta.description": "Websites built to grow your business: landing pages and online stores with WordPress, WooCommerce, and Shopify.",
            "nav.label": "Main navigation",
            "nav.home": "Home",
            "nav.services": "Services",
            "nav.work": "Work",
            "nav.approach": "Approach",
            "nav.process": "How I Work",
            "nav.skills": "Skills",
            "nav.contact": "Contact",
            "hero.eyebrow": "Websites built to grow your business",
            "hero.title": "I'm Abdelkaioum",
            "hero.role": "WordPress & Shopify Developer",
            "hero.line1": "I build landing pages and online stores",
            "hero.line2": "with WordPress, WooCommerce, and Shopify.",
            "hero.line3": "Fast, responsive, and easy to manage after launch.",
            "hero.cta": "Start a Project",
            "hero.portraitAlt": "Portrait of ABDELKAIOUM, web developer",
            "services.eyebrow": "Services",
            "services.title": "Services",
            "services.intro": "Landing pages and online stores designed around your goals—easy to use, simple to manage, and built for a smooth customer journey.",
            "service.landing.title": "Landing Pages",
            "service.landing.copy": "Focused pages that explain your offer clearly, guide visitors toward action, and work smoothly on mobile.",
            "service.wordpress.title": "WordPress Stores",
            "service.wordpress.copy": "Easy-to-manage WooCommerce stores with clear product browsing and a smoother path from product page to checkout.",
            "service.shopify.title": "Shopify Stores",
            "service.shopify.copy": "Custom Shopify storefronts with clear product pages and a straightforward buying flow, ready for you to manage.",
            "service.performance.title": "Performance & SEO",
            "service.performance.copy": "Improve load times, Core Web Vitals, and on-page SEO foundations for a smoother experience and clearer search signals.",
            "service.portfolio.title": "Portfolio Websites",
            "service.portfolio.copy": "Showcase your work and expertise in a polished, easy-to-update website that helps potential clients understand your value.",
            "work.eyebrow": "Portfolio",
            "work.title": "Selected Work",
            "work.intro": "A selection of sites and products I designed and built—from first pixel to launch.",
            "project.vercel.alt": "Screenshot of the Vercel website",
            "project.vercel.copy": "Marketing site and dashboard UI—dark theme, motion system, and a component library built for speed.",
            "project.stripe.alt": "Screenshot of the Stripe website",
            "project.stripe.copy": "Product pages with interactive demos, animated gradients, and documentation that stays readable at scale.",
            "project.linear.alt": "Screenshot of the Linear website",
            "project.linear.copy": "App interface work—keyboard-first flows, crisp typography, and state handling that never feels heavy.",
            "project.figma.alt": "Screenshot of the Figma website",
            "project.figma.copy": "Landing pages and feature launches—pixel-accurate builds handed off straight from design files.",
            "project.tailwind.alt": "Screenshot of the Tailwind CSS website",
            "project.tailwind.copy": "Docs and marketing build—responsive layouts, dark mode, and a search experience that stays fast.",
            "project.raycast.alt": "Screenshot of the Raycast website",
            "project.raycast.copy": "Product site with rich visuals and micro-interactions—tuned for Core Web Vitals on every device.",
            "project.visit": "Visit site",
            "project.goTo": "Go to project {number}",
            "tag.designSystem": "Design System",
            "tag.performance": "Performance",
            "tag.animation": "Animation",
            "tag.accessibility": "Accessibility",
            "tag.webApp": "Web App",
            "tag.ui": "UI",
            "tag.seo": "SEO",
            "tag.docs": "Documentation",
            "tag.responsive": "Responsive",
            "tag.motion": "Motion",
            "tag.coreWebVitals": "Core Web Vitals",
            "work.pagination": "Project navigation",
            "process.approach": "My approach: how I work",
            "process.journey": "The five stages of my process",
            "process.eyebrow": "How I work",
            "process.title": "HOW I WORK",
            "process.intro": "Clear communication, quick iterations, and quality you can measure.",
            "process.jumpToStep": "Jump to a process step",
            "process.navigateSteps": "Navigate process steps",
            "process.previousStep": "Previous step",
            "process.nextStep": "Next step",
            "process.scrollContinue": "Scroll down to continue",
            "process.progress": "Process progress",
            "process.sceneCaption": "OPEN WORKFLOW / 3D FIELD",
            "process.sceneAlt": "An open 3D landscape showing the work process",
            "scene.discover": "DISCOVER",
            "scene.plan": "SITE MAP / PLAN",
            "scene.home": "HOME",
            "scene.work": "WORK",
            "scene.about": "ABOUT",
            "scene.contact": "CONTACT",
            "scene.projects": "PROJECTS",
            "scene.story": "STORY",
            "scene.reachOut": "REACH OUT",
            "scene.build": "CODE / ASSEMBLE",
            "scene.headerNav": "HEADER / NAV",
            "scene.heroValue": "HERO / VALUE",
            "scene.optimize": "TEST / IMPROVE",
            "scene.illustrativeScore": "ILLUSTRATIVE SCORE",
            "scene.launch": "DEPLOY / LAUNCH",
            "scene.goal": "GOAL",
            "scene.audience": "AUDIENCE",
            "scene.scope": "SCOPE",
            "scene.userNeed": "USER NEED",
            "scene.userFlow": "USER FLOW / INFORMATION ARCHITECTURE",
            "scene.componentsCode": "COMPONENTS / CODE",
            "scene.codeQuality": "CLEAN · SEMANTIC · REVIEWABLE",
            "scene.fasterLoad": "FASTER LOAD",
            "scene.accessible": "ACCESSIBLE",
            "scene.seoReady": "SEO READY",
            "scene.measured": "MEASURED / REFINED",
            "scene.live": "LIVE",
            "scene.test": "TEST",
            "scene.deploy": "DEPLOY",
            "story.eyebrow": "HOW I BUILD / THE PROCESS",
            "story.title": "How I Build Websites",
            "story.intro": "A clear, collaborative process—from the first conversation through launch and handoff.",
            "story.stages": "5 CORE STAGES",
            "story.scroll": "SCROLL THROUGH THE PROCESS",
            "story.region": "Website development process",
            "skills.title": "My Skills & Tech Stack",
            "skills.intro": "The technologies I use to design, build, and ship fast, accessible web experiences.",
            "skills.list": "Skills and technologies",
            "skills.accessibility": "Accessibility",
            "contact.eyebrow": "Contact",
            "contact.title": "Have a project in mind?",
            "contact.copy": "Tell me what you’re building. I’m available to discuss landing pages and WordPress or Shopify stores.",
            "contact.options": "Contact options",
            "contact.whatsapp": "Message me on WhatsApp",
            "contact.email": "Email me",
            "contact.whatsappShort": "WhatsApp",
            "contact.emailShort": "Email",
            "footer.rights": "© 2026 ABDELKAIOUM. All rights reserved.",
            "footer.contactLinks": "Contact links",
            "step.discovery.title": "Discovery & Analysis",
            "step.discovery.description": "We clarify your goals, audience, content, and technical needs before work begins.",
            "step.discovery.phase": "DEFINE THE WHY",
            "step.plan.title": "Plan & Design",
            "step.plan.description": "We map the site structure and user flow, then shape a responsive visual direction.",
            "step.plan.phase": "MAP THE WAY",
            "step.build.title": "Build",
            "step.build.description": "We turn the approved plan into responsive pages with clean, accessible code.",
            "step.build.phase": "MAKE IT REAL",
            "step.optimize.title": "Test & Optimize",
            "step.optimize.description": "We test across devices, fix issues, and refine speed, accessibility, and SEO.",
            "step.optimize.phase": "REFINE THE DETAILS",
            "step.launch.title": "Launch",
            "step.launch.description": "Deploy, monitor, and hand over documentation you can actually use.",
            "step.launch.phase": "READY FOR THE WORLD",
            "process.station": "STATION {current} / {total}",
            "process.goToStep": "Go to step {number}: {title}"
        },
        ar: {
            "meta.title": "عبدالقيوم | مطور مواقع",
            "meta.description": "مواقع تساعد أعمالك على النمو: صفحات هبوط ومتاجر إلكترونية باستخدام WordPress وWooCommerce وShopify.",
            "nav.label": "التنقل الرئيسي",
            "nav.home": "الرئيسية",
            "nav.services": "الخدمات",
            "nav.work": "الأعمال",
            "nav.approach": "نهجي",
            "nav.process": "طريقة العمل",
            "nav.skills": "المهارات",
            "nav.contact": "تواصل",
            "hero.eyebrow": "مواقع تساعد أعمالك على النمو",
            "hero.title": "أنا عبدالقيوم",
            "hero.role": "مطور مواقع WordPress وShopify",
            "hero.line1": "أنشئ صفحات هبوط ومتاجر إلكترونية",
            "hero.line2": "باستخدام WordPress وWooCommerce وShopify.",
            "hero.line3": "سريعة ومتجاوبة وسهلة الإدارة بعد الإطلاق.",
            "hero.cta": "ابدأ مشروعك",
            "hero.portraitAlt": "صورة عبدالقيوم، مطور مواقع",
            "services.eyebrow": "الخدمات",
            "services.title": "الخدمات",
            "services.intro": "صفحات هبوط ومتاجر إلكترونية تُصمَّم وفق أهدافك؛ سهلة الاستخدام والإدارة، وتوفر رحلة سلسة لعملائك.",
            "service.landing.title": "صفحات الهبوط",
            "service.landing.copy": "صفحات مركّزة تشرح عرضك بوضوح، وتوجّه الزائر إلى الإجراء المطلوب، وتعمل بسلاسة على الهاتف.",
            "service.wordpress.title": "متاجر WordPress",
            "service.wordpress.copy": "متاجر WooCommerce سهلة الإدارة، مع تصفح واضح للمنتجات ومسار أسهل من صفحة المنتج إلى إتمام الشراء.",
            "service.shopify.title": "متاجر Shopify",
            "service.shopify.copy": "متاجر Shopify مصممة حسب احتياجك، بصفحات منتجات واضحة وخطوات شراء مباشرة، وجاهزة لإدارتك.",
            "service.performance.title": "الأداء وتهيئة محركات البحث",
            "service.performance.copy": "تحسين سرعة التحميل ومؤشرات Core Web Vitals وأساسيات SEO داخل الصفحة لتجربة أفضل وظهور أوضح في البحث.",
            "service.portfolio.title": "مواقع البورتفوليو",
            "service.portfolio.copy": "اعرض أعمالك وخبراتك في موقع أنيق وسهل التحديث يساعد العملاء المحتملين على فهم قيمتك.",
            "work.eyebrow": "معرض الأعمال",
            "work.title": "أعمال مختارة",
            "work.intro": "مجموعة من المواقع والمنتجات التي صممتها وطورتها، من الفكرة الأولى حتى الإطلاق.",
            "project.vercel.alt": "لقطة شاشة لموقع Vercel",
            "project.vercel.copy": "موقع تسويقي ولوحة تحكم بواجهة داكنة وحركة مدروسة ومكتبة مكونات مصممة للسرعة.",
            "project.stripe.alt": "لقطة شاشة لموقع Stripe",
            "project.stripe.copy": "صفحات منتجات بعروض تفاعلية وتدرجات متحركة ووثائق واضحة وسهلة القراءة مع التوسع.",
            "project.linear.alt": "لقطة شاشة لموقع Linear",
            "project.linear.copy": "واجهات تطبيقات بتدفقات تعتمد على لوحة المفاتيح، وخطوط واضحة، وإدارة حالات لا تثقل التجربة.",
            "project.figma.alt": "لقطة شاشة لموقع Figma",
            "project.figma.copy": "صفحات هبوط وإطلاق مزايا، بتنفيذ دقيق يطابق ملفات التصميم.",
            "project.tailwind.alt": "لقطة شاشة لموقع Tailwind CSS",
            "project.tailwind.copy": "موقع توثيق وتسويق بتصميم متجاوب ووضع داكن وتجربة بحث سريعة.",
            "project.raycast.alt": "لقطة شاشة لموقع Raycast",
            "project.raycast.copy": "موقع منتج بصري غني وتفاعلات دقيقة، مع عناية بمؤشرات Core Web Vitals على مختلف الأجهزة.",
            "project.visit": "زيارة الموقع",
            "project.goTo": "الانتقال إلى المشروع {number}",
            "tag.designSystem": "نظام التصميم",
            "tag.performance": "الأداء",
            "tag.animation": "الرسوم المتحركة",
            "tag.accessibility": "إمكانية الوصول",
            "tag.webApp": "تطبيق ويب",
            "tag.ui": "واجهة المستخدم",
            "tag.seo": "تهيئة محركات البحث",
            "tag.docs": "التوثيق",
            "tag.responsive": "متجاوب",
            "tag.motion": "الحركة",
            "tag.coreWebVitals": "مؤشرات Core Web Vitals",
            "work.pagination": "التنقل بين المشاريع",
            "process.approach": "نهجي في العمل",
            "process.journey": "مراحل العمل الخمس",
            "process.eyebrow": "طريقة عملي",
            "process.title": "كيف أعمل",
            "process.intro": "تواصل واضح، وتطوير سريع، وجودة يمكن قياسها.",
            "process.jumpToStep": "الانتقال إلى مرحلة من مراحل العمل",
            "process.navigateSteps": "التنقل بين مراحل العمل",
            "process.previousStep": "المرحلة السابقة",
            "process.nextStep": "المرحلة التالية",
            "process.scrollContinue": "مرّر للأسفل للمتابعة",
            "process.progress": "التقدم في مراحل العمل",
            "process.sceneCaption": "مسار العمل / مشهد ثلاثي الأبعاد",
            "process.sceneAlt": "مشهد ثلاثي الأبعاد يوضح مراحل العمل",
            "scene.discover": "اكتشاف",
            "scene.plan": "خريطة الموقع / التخطيط",
            "scene.home": "الرئيسية",
            "scene.work": "الأعمال",
            "scene.about": "نبذة",
            "scene.contact": "تواصل",
            "scene.projects": "المشاريع",
            "scene.story": "القصة",
            "scene.reachOut": "تواصل معنا",
            "scene.build": "كتابة الكود / البناء",
            "scene.headerNav": "الترويسة / التنقل",
            "scene.heroValue": "الواجهة الرئيسية / القيمة",
            "scene.optimize": "اختبار / تحسين",
            "scene.illustrativeScore": "نتيجة توضيحية",
            "scene.launch": "النشر / الإطلاق",
            "scene.goal": "الهدف",
            "scene.audience": "الجمهور",
            "scene.scope": "النطاق",
            "scene.userNeed": "احتياج المستخدم",
            "scene.userFlow": "تدفق المستخدم / بنية المعلومات",
            "scene.componentsCode": "المكونات / البرمجة",
            "scene.codeQuality": "نظيف · دلالي · قابل للمراجعة",
            "scene.fasterLoad": "تحميل أسرع",
            "scene.accessible": "متاح للجميع",
            "scene.seoReady": "جاهز لمحركات البحث",
            "scene.measured": "قياس / تحسين",
            "scene.live": "مباشر",
            "scene.test": "اختبار",
            "scene.deploy": "نشر",
            "story.eyebrow": "كيف أبني المواقع / مراحل التنفيذ",
            "story.title": "كيف أبني المواقع",
            "story.intro": "من أول نقاش إلى الإطلاق والتسليم، أتبع خطوات واضحة وتعاونية.",
            "story.stages": "٥ مراحل أساسية",
            "story.scroll": "مرّر للتعرّف على المراحل",
            "story.region": "مراحل بناء الموقع",
            "skills.title": "مهاراتي والتقنيات",
            "skills.intro": "التقنيات التي أستخدمها لتصميم وبناء وإطلاق مواقع سريعة ومتاحة للجميع.",
            "skills.list": "المهارات والتقنيات",
            "skills.accessibility": "إمكانية الوصول",
            "contact.eyebrow": "تواصل",
            "contact.title": "هل لديك مشروع تريد تنفيذه؟",
            "contact.copy": "أخبرني عن فكرتك. يسعدني مناقشة صفحات الهبوط ومتاجر WordPress أو Shopify.",
            "contact.options": "خيارات التواصل",
            "contact.whatsapp": "راسلني عبر WhatsApp",
            "contact.email": "راسلني بالبريد الإلكتروني",
            "contact.whatsappShort": "WhatsApp",
            "contact.emailShort": "البريد الإلكتروني",
            "footer.rights": "© 2026 ABDELKAIOUM. جميع الحقوق محفوظة.",
            "footer.contactLinks": "روابط التواصل",
            "step.discovery.title": "التحليل والاكتشاف",
            "step.discovery.description": "نحدد أهدافك وجمهورك ومحتوى الموقع ومتطلباته التقنية قبل البدء.",
            "step.discovery.phase": "تحديد الهدف",
            "step.plan.title": "التخطيط والتصميم",
            "step.plan.description": "نرسم بنية الموقع ومسارات المستخدم، ثم نحدد توجهًا بصريًا متجاوبًا.",
            "step.plan.phase": "رسم المسار",
            "step.build.title": "التطوير",
            "step.build.description": "نحوّل الخطة المعتمدة إلى صفحات متجاوبة بكود واضح ومتاح للجميع.",
            "step.build.phase": "تحويل الفكرة إلى واقع",
            "step.optimize.title": "الاختبار والتحسين",
            "step.optimize.description": "نختبر الموقع على الأجهزة المختلفة، ونعالج المشاكل، ونحسّن السرعة وإمكانية الوصول وSEO.",
            "step.optimize.phase": "صقل التفاصيل",
            "step.launch.title": "الإطلاق",
            "step.launch.description": "ننشر الموقع ونتابع عمله، ثم نسلّمك توثيقًا عمليًا يمكنك استخدامه.",
            "step.launch.phase": "جاهز للانطلاق",
            "process.station": "المرحلة {current} / {total}",
            "process.goToStep": "الانتقال إلى المرحلة {number}: {title}"
        }
    };

    const storageKey = "portfolio-language";
    const html = document.documentElement;
    const switchButton = document.getElementById("languageSwitch");
    let language = "en";

    try {
        const savedLanguage = window.localStorage.getItem(storageKey);
        if (savedLanguage === "en" || savedLanguage === "ar") language = savedLanguage;
    } catch (error) {
        // The page remains usable when storage is unavailable.
    }

    function t(key, values) {
        let message = (messages[language] && messages[language][key]) || messages.en[key] || key;
        if (values) {
            Object.keys(values).forEach(function (name) {
                message = message.replace("{" + name + "}", values[name]);
            });
        }
        return message;
    }

    function localize() {
        html.lang = language;
        html.dir = language === "ar" ? "rtl" : "ltr";
        document.body.dataset.language = language;

        document.querySelectorAll("[data-i18n]").forEach(function (element) {
            element.textContent = t(element.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
            element.setAttribute("aria-label", t(element.dataset.i18nAria));
        });
        document.querySelectorAll("[data-i18n-alt]").forEach(function (element) {
            element.setAttribute("alt", t(element.dataset.i18nAlt));
        });
        document.querySelectorAll("[data-i18n-content]").forEach(function (element) {
            element.setAttribute("content", t(element.dataset.i18nContent));
        });

        if (switchButton) {
            const targetLanguage = language === "en" ? "ar" : "en";
            switchButton.lang = targetLanguage;
            switchButton.setAttribute("aria-label", targetLanguage === "ar" ? "Switch to Arabic" : "التبديل إلى الإنجليزية");
            switchButton.setAttribute("aria-pressed", String(language === "ar"));
        }

        document.dispatchEvent(new CustomEvent("site-language-change", { detail: { language: language } }));
    }

    function setLanguage(nextLanguage) {
        if (nextLanguage !== "en" && nextLanguage !== "ar") return;
        if (language === nextLanguage) return;
        language = nextLanguage;
        try {
            window.localStorage.setItem(storageKey, language);
        } catch (error) {
            // Continue without persistence if storage is unavailable.
        }
        localize();
    }

    if (switchButton) {
        switchButton.addEventListener("click", function () {
            setLanguage(language === "en" ? "ar" : "en");
        });
    }

    window.siteI18n = {
        t: t,
        getLanguage: function () { return language; },
        setLanguage: setLanguage,
        localizeDigits: function (value) {
            const text = String(value);
            return language === "ar" ? text.replace(/[0-9]/g, function (digit) { return "٠١٢٣٤٥٦٧٨٩"[Number(digit)]; }) : text;
        }
    };

    localize();
})();

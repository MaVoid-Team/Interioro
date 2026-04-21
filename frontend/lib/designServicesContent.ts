import type { PortfolioProject } from "@/hooks/usePortfolio"

export type SupportedLocale = "en" | "ar"

const content = {
    en: {
        navLabel: "Design Services",
        hub: {
            eyebrow: "Interioro Studio",
            title: "Design services for spaces that need more than an off-the-shelf piece.",
            description:
                "Browse our portfolio, request a custom piece, or start a consultation with the Interioro team.",
            cards: [
                {
                    href: "/design-services/portfolio",
                    title: "Portfolio",
                    description: "See finished projects and submit a special-piece request from the gallery.",
                },
                {
                    href: "/design-services/custom-requests",
                    title: "Custom Requests",
                    description: "Tell us about the object, surface, or atmosphere you want us to create.",
                },
                {
                    href: "/design-services/consultation",
                    title: "Schedule Consultation",
                    description: "Share your questions and preferred contact window for a design conversation.",
                },
            ],
            sectionTitle: "A studio workflow built around conversation, references, and careful execution.",
            sectionText:
                "Every request enters a dedicated internal queue so our team can review, contact, and follow through without losing the context of your brief.",
        },
        shared: {
            fullName: "Full name",
            email: "Email address",
            phone: "Phone number",
            dimensions: "Dimensions",
            budget: "Budget range",
            timeline: "Timeline",
            upload: "Inspiration images",
            uploadHint: "Upload up to 5 inspiration images.",
            submit: "Send request",
            submitting: "Sending...",
            success: "Your request has been received. The team will follow up soon.",
            error: "Something went wrong while sending your request.",
        },
        portfolio: {
            title: "Portfolio",
            description: "A selection of bespoke surfaces, framed compositions, and spatial interventions.",
            specialTitle: "Request a special piece",
            specialDescription:
                "Seen something close to your vision? Describe the piece you want and our studio team will follow up.",
            specialFields: {
                desiredPieceType: "Desired piece type",
                visionDescription: "Your vision",
            },
            empty: "Portfolio projects will appear here once they are added by the studio team.",
            viewProject: "View project",
            backToPortfolio: "Back to portfolio",
        },
        custom: {
            title: "Custom Requests",
            description:
                "Share the object, wall treatment, or room direction you want us to design for you.",
            fields: {
                projectTypeOrSpace: "Item or space type",
                visionDescription: "Describe your vision",
                stylePreferences: "Style preferences",
            },
        },
        consultation: {
            title: "Schedule Consultation",
            description:
                "Send your questions and preferred contact details so our team can arrange the right consultation.",
            fields: {
                preferredContactMethod: "Preferred contact method",
                questionSummary: "Question summary",
                preferredDays: "Preferred days",
                preferredTimeWindow: "Preferred time window",
            },
            methods: {
                phone: "Phone call",
                whatsapp: "WhatsApp",
                email: "Email",
            },
        },
        detail: {
            gallery: "Project gallery",
        },
        admin: {
            portfolio: {
                title: "Portfolio Management",
                description: "Create and curate portfolio projects with bilingual content and gallery images.",
                searchPlaceholder: "Search portfolio projects",
                create: "Create project",
                edit: "Edit project",
                delete: "Delete project",
                saveSuccess: "Project saved successfully.",
                saveError: "Failed to save project.",
                deleteSuccess: "Project deleted successfully.",
                deleteError: "Failed to delete project.",
                fields: {
                    slug: "Slug",
                    titleEn: "English title",
                    titleAr: "Arabic title",
                    summaryEn: "English summary",
                    summaryAr: "Arabic summary",
                    descriptionEn: "English description",
                    descriptionAr: "Arabic description",
                    sortOrder: "Sort order",
                    active: "Visible on site",
                    coverImage: "Cover image",
                    galleryImages: "Gallery images",
                    gallery: "Existing gallery",
                },
            },
            queue: {
                createdAt: "Created",
                previous: "Previous",
                next: "Next",
                detailTitle: "Open request",
                detailDescription: "Review the brief, uploaded references, and internal notes.",
                status: "Status",
                notes: "Internal notes",
                loading: "Loading requests...",
                save: "Save changes",
                saving: "Saving...",
                allStatuses: "All statuses",
                new: "New",
                contacted: "Contacted",
                closed: "Closed",
                images: "Reference images",
                noImages: "No images were uploaded with this request.",
                saveSuccess: "Request updated successfully.",
                saveError: "Failed to update the request.",
            },
            custom: {
                title: "Custom Requests",
                description: "Review design briefs submitted from the custom requests page.",
                summary: "Brief",
                searchPlaceholder: "Search by client, email, or phone",
                emptyTitle: "No custom requests yet",
                emptyDescription: "New briefs will appear here after clients submit them.",
            },
            special: {
                title: "Special Pieces",
                description: "Manage special-piece requests submitted from the portfolio gallery.",
                summary: "Piece type",
                searchPlaceholder: "Search special piece requests",
                emptyTitle: "No special-piece requests yet",
                emptyDescription: "Requests submitted from the portfolio page will appear here.",
            },
            consultation: {
                title: "Consultations",
                description: "Track incoming consultation requests and internal follow-up notes.",
                summary: "Question summary",
                searchPlaceholder: "Search consultation requests",
                emptyTitle: "No consultation requests yet",
                emptyDescription: "Consultation requests will appear here after submission.",
            },
        },
    },
    ar: {
        navLabel: "خدمات التصميم",
        hub: {
            eyebrow: "استوديو إنتريورو",
            title: "خدمات تصميم للمساحات التي تحتاج أكثر من قطعة جاهزة.",
            description:
                "تصفح أعمالنا السابقة، اطلب قطعة مخصصة، أو ابدأ استشارة مع فريق إنتريورو.",
            cards: [
                {
                    href: "/design-services/portfolio",
                    title: "معرض الأعمال",
                    description: "اطلع على المشاريع المنفذة وقدّم طلب قطعة خاصة من داخل المعرض.",
                },
                {
                    href: "/design-services/custom-requests",
                    title: "الطلبات المخصصة",
                    description: "شاركنا القطعة أو السطح أو الأجواء التي تريد أن نصممها لك.",
                },
                {
                    href: "/design-services/consultation",
                    title: "حجز استشارة",
                    description: "أرسل أسئلتك وموعد التواصل المناسب لبدء نقاش تصميمي.",
                },
            ],
            sectionTitle: "آلية عمل استوديو مبنية على الحوار والمراجع والتنفيذ المتقن.",
            sectionText:
                "كل طلب يدخل إلى قائمة متابعة داخلية مخصصة حتى يتمكن الفريق من المراجعة والتواصل والمتابعة بدون فقدان تفاصيل الطلب.",
        },
        shared: {
            fullName: "الاسم الكامل",
            email: "البريد الإلكتروني",
            phone: "رقم الهاتف",
            dimensions: "الأبعاد",
            budget: "الميزانية التقريبية",
            timeline: "المدة المتوقعة",
            upload: "صور مرجعية",
            uploadHint: "يمكنك رفع حتى 5 صور مرجعية.",
            submit: "إرسال الطلب",
            submitting: "جارٍ الإرسال...",
            success: "تم استلام طلبك، وسيتواصل الفريق معك قريبًا.",
            error: "حدث خطأ أثناء إرسال الطلب.",
        },
        portfolio: {
            title: "معرض الأعمال",
            description: "مجموعة من الأعمال المخصصة، والتكوينات المؤطرة، والتدخلات البصرية في المساحات.",
            specialTitle: "اطلب قطعة خاصة",
            specialDescription:
                "إذا رأيت مشروعًا قريبًا من رؤيتك، صف القطعة التي تريدها وسيتواصل معك فريق الاستوديو.",
            specialFields: {
                desiredPieceType: "نوع القطعة المطلوبة",
                visionDescription: "صف رؤيتك",
            },
            empty: "ستظهر مشاريع المعرض هنا بعد إضافتها من قبل فريق الاستوديو.",
            viewProject: "عرض المشروع",
            backToPortfolio: "العودة إلى المعرض",
        },
        custom: {
            title: "الطلبات المخصصة",
            description:
                "شاركنا تفاصيل القطعة أو معالجة الجدار أو اتجاه الغرفة الذي ترغب أن نصممه لك.",
            fields: {
                projectTypeOrSpace: "نوع القطعة أو المساحة",
                visionDescription: "صف رؤيتك",
                stylePreferences: "التفضيلات الأسلوبية",
            },
        },
        consultation: {
            title: "حجز استشارة",
            description:
                "أرسل أسئلتك وتفاصيل التواصل المناسبة ليتمكن فريقنا من ترتيب الاستشارة المناسبة.",
            fields: {
                preferredContactMethod: "طريقة التواصل المفضلة",
                questionSummary: "ملخص الأسئلة",
                preferredDays: "الأيام المفضلة",
                preferredTimeWindow: "الفترة الزمنية المناسبة",
            },
            methods: {
                phone: "مكالمة هاتفية",
                whatsapp: "واتساب",
                email: "بريد إلكتروني",
            },
        },
        detail: {
            gallery: "معرض المشروع",
        },
        admin: {
            portfolio: {
                title: "إدارة معرض الأعمال",
                description: "أنشئ مشاريع المعرض ونسق محتواها ثنائي اللغة وصور المعرض.",
                searchPlaceholder: "ابحث في مشاريع المعرض",
                create: "إضافة مشروع",
                edit: "تعديل المشروع",
                delete: "حذف المشروع",
                saveSuccess: "تم حفظ المشروع بنجاح.",
                saveError: "تعذر حفظ المشروع.",
                deleteSuccess: "تم حذف المشروع بنجاح.",
                deleteError: "تعذر حذف المشروع.",
                fields: {
                    slug: "الرابط المختصر",
                    titleEn: "العنوان بالإنجليزية",
                    titleAr: "العنوان بالعربية",
                    summaryEn: "الملخص بالإنجليزية",
                    summaryAr: "الملخص بالعربية",
                    descriptionEn: "الوصف بالإنجليزية",
                    descriptionAr: "الوصف بالعربية",
                    sortOrder: "ترتيب العرض",
                    active: "ظاهر في الموقع",
                    coverImage: "صورة الغلاف",
                    galleryImages: "صور المعرض",
                    gallery: "الصور الحالية",
                },
            },
            queue: {
                createdAt: "تاريخ الإنشاء",
                previous: "السابق",
                next: "التالي",
                detailTitle: "فتح الطلب",
                detailDescription: "راجع تفاصيل الطلب والصور المرجعية والملاحظات الداخلية.",
                status: "الحالة",
                notes: "ملاحظات داخلية",
                loading: "جارٍ تحميل الطلبات...",
                save: "حفظ التغييرات",
                saving: "جارٍ الحفظ...",
                allStatuses: "كل الحالات",
                new: "جديد",
                contacted: "تم التواصل",
                closed: "مغلق",
                images: "الصور المرجعية",
                noImages: "لم يتم رفع صور مع هذا الطلب.",
                saveSuccess: "تم تحديث الطلب بنجاح.",
                saveError: "تعذر تحديث الطلب.",
            },
            custom: {
                title: "الطلبات المخصصة",
                description: "راجع الطلبات المرسلة من صفحة الطلبات المخصصة.",
                summary: "الملخص",
                searchPlaceholder: "ابحث بالعميل أو البريد أو الهاتف",
                emptyTitle: "لا توجد طلبات مخصصة بعد",
                emptyDescription: "ستظهر الطلبات الجديدة هنا بعد إرسالها من العملاء.",
            },
            special: {
                title: "القطع الخاصة",
                description: "إدارة طلبات القطع الخاصة الواردة من صفحة معرض الأعمال.",
                summary: "نوع القطعة",
                searchPlaceholder: "ابحث في طلبات القطع الخاصة",
                emptyTitle: "لا توجد طلبات قطع خاصة بعد",
                emptyDescription: "ستظهر الطلبات المرسلة من المعرض هنا.",
            },
            consultation: {
                title: "طلبات الاستشارة",
                description: "تابع طلبات الاستشارة والملاحظات الداخلية الخاصة بها.",
                summary: "ملخص السؤال",
                searchPlaceholder: "ابحث في طلبات الاستشارة",
                emptyTitle: "لا توجد طلبات استشارة بعد",
                emptyDescription: "ستظهر طلبات الاستشارة هنا بعد إرسالها.",
            },
        },
    },
} as const

export function getDesignServicesContent(locale: string) {
    return content[(locale === "ar" ? "ar" : "en") as SupportedLocale]
}

export function getLocalizedPortfolioField(
    project: PortfolioProject,
    locale: string,
    field: "title" | "summary" | "description"
) {
    const isArabic = locale === "ar"

    if (field === "title") {
        return isArabic ? project.titleAr : project.titleEn
    }

    if (field === "summary") {
        return isArabic ? project.summaryAr : project.summaryEn
    }

    return isArabic ? project.descriptionAr : project.descriptionEn
}

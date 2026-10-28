import {
  ResumeDocumentSchema,
  type ResumeDocumentType,
} from "@/schemas/resume.schema";

/**
 * Generates the pre-filled reference resume ("Habil Baihaki Ramadhan")
 * matching Schema.md, Design.md, and PRD.md specifications.
 */
export function createSampleResume(): ResumeDocumentType {
  return ResumeDocumentSchema.parse({
    id: "sample-ats-resume-001",
    title: "AI & Software Engineer Resume",
    slug: "habil-baihaki-ramadhan",
    isPublic: false,
    headerData: {
      fullName: "HABIL BAIHAKI RAMADHAN",
      location: "Bekasi, West Java, Indonesia",
      phone: "+6283899254467",
      email: "habilramadhan1005@gmail.com",
      links: [
        {
          id: "link-linkedin",
          label: "linkedin.com/in/habilbaihakiramadhan",
          url: "https://linkedin.com/in/habilbaihakiramadhan",
          isVisible: true,
        },
        {
          id: "link-github",
          label: "github.com/HabilBoyyyyyy",
          url: "https://github.com/HabilBoyyyyyy",
          isVisible: true,
        },
        {
          id: "link-portfolio",
          label: "habilboy.vercel.app",
          url: "https://habilboy.vercel.app",
          isVisible: true,
        },
      ],
    },
    styleConfig: {
      paperSize: "A4",
      fontFamily: "Times New Roman",
      baseFontSizePt: 10,
      nameFontSizePt: 18,
      sectionFontSizePt: 11,
      lineHeight: 1.2,
      marginXIn: 0.5,
      marginYIn: 0.45,
      sectionGapPt: 8,
      itemGapPt: 5,
      justifyText: false,
    },
    sections: [
      {
        id: "sec-summary",
        sectionType: "SUMMARY",
        title: "SUMMARY",
        sortOrder: 0,
        isVisible: true,
        layoutVariant: "PARAGRAPH",
        content: [
          {
            id: "sum-1",
            htmlText:
              "Information Technology undergraduate specializing in <b>Artificial Intelligence</b>, <b>Computer Vision</b>, and <b>Full-Stack Web Engineering</b>. Proven track record in building deep learning pipelines, NLP summarization models, and scalable web applications.",
            isVisible: true,
          },
        ],
      },
      {
        id: "sec-education",
        sectionType: "EDUCATION",
        title: "EDUCATION",
        sortOrder: 1,
        isVisible: true,
        layoutVariant: "STANDARD",
        content: [
          {
            id: "edu-1",
            institution: "President University",
            location: "Bekasi, West Java",
            degree: "Bachelor's Student in Information Technology",
            dateRange: "Aug. 2024 – Present",
            gpa: "3.80/4.00",
            relevantCoursework:
              "Artificial Intelligence, Machine Learning, Web Development, Data Structures & Algorithms",
            bullets: [
              {
                id: "edu-b1",
                htmlText:
                  "Recipient of Merit Academic Scholarship for consistent high academic standing.",
                isVisible: true,
              },
            ],
            isVisible: true,
          },
        ],
      },
      {
        id: "sec-projects",
        sectionType: "PROJECT_EXPERIENCE",
        title: "PROJECT EXPERIENCES",
        sortOrder: 2,
        isVisible: true,
        layoutVariant: "STANDARD",
        content: [
          {
            id: "proj-1",
            title: "VeriVision",
            subtitleOrRole: "Lead AI Developer",
            organizationOrLocation: "",
            techStack: ["Python", "YOLOv8", "PyTorch", "MobileSAM"],
            url: "https://github.com/HabilBoyyyyyy",
            dateRange: "July 2026",
            bullets: [
              {
                id: "proj-1-b1",
                htmlText:
                  "Engineered a real-time object detection and segmentation pipeline achieving <b>97.7% accuracy</b> on validation benchmarks.",
                isVisible: true,
              },
              {
                id: "proj-1-b2",
                htmlText:
                  "Integrated <b>YOLOv8</b> with <b>MobileSAM</b> to reduce inference latency by 35% on edge devices.",
                isVisible: true,
              },
            ],
            isVisible: true,
          },
          {
            id: "proj-2",
            title: "Neural Text Summarizer Benchmarking",
            subtitleOrRole: "NLP Researcher",
            organizationOrLocation: "",
            techStack: ["Python", "HuggingFace", "DistilBART", "PyTorch"],
            url: "",
            dateRange: "March 2026",
            bullets: [
              {
                id: "proj-2-b1",
                htmlText:
                  "Identified <b>DistilBART</b> as the optimal transformer architecture, achieving a <b>ROUGE-1 F1 of 0.3742</b> across multi-document datasets.",
                isVisible: true,
              },
            ],
            isVisible: true,
          },
        ],
      },
      {
        id: "sec-leadership",
        sectionType: "LEADERSHIP_ACTIVITY",
        title: "LEADERSHIP ACTIVITIES",
        sortOrder: 3,
        isVisible: true,
        layoutVariant: "STANDARD",
        content: [
          {
            id: "lead-1",
            title: "Mahasiswa Penggerak - Education Department",
            subtitleOrRole: "Vice Project Manager (VPM)",
            organizationOrLocation: "President University",
            techStack: [],
            url: "",
            dateRange: "October 2024 – July 2025",
            bullets: [
              {
                id: "lead-1-b1",
                htmlText:
                  "Coordinated cross-functional student teams to deliver technical workshops and academic mentorship programs for 200+ students.",
                isVisible: true,
              },
            ],
            isVisible: true,
          },
        ],
      },
      {
        id: "sec-certifications",
        sectionType: "CERTIFICATIONS",
        title: "CERTIFICATIONS",
        sortOrder: 4,
        isVisible: true,
        layoutVariant: "COMPACT_ROW",
        content: [
          {
            id: "cert-1",
            title: "Data Analysis Camp Batch 1",
            issuer: "Ousean Indonesia & Data Analyst Camp",
            metricOrScore: "Score: 90/100",
            credentialUrl: "",
            date: "Feb 2025",
            isVisible: true,
          },
        ],
      },
      {
        id: "sec-skills",
        sectionType: "SKILLS_LANGUAGES",
        title: "SKILLS & LANGUAGES",
        sortOrder: 5,
        isVisible: true,
        layoutVariant: "STANDARD",
        content: [],
      },
    ],
    skillCategories: [
      {
        id: "cat-prog",
        name: "Programming Languages",
        displayMode: "INLINE_COMMA",
        showProficiency: false,
        sortOrder: 0,
        isVisible: true,
        items: [
          {
            id: "sk-1",
            categoryId: "cat-prog",
            name: "Python",
            proficiency: "",
            isHighlighted: true,
            isVisible: true,
            sortOrder: 0,
          },
          {
            id: "sk-2",
            categoryId: "cat-prog",
            name: "C++",
            proficiency: "",
            isHighlighted: false,
            isVisible: true,
            sortOrder: 1,
          },
          {
            id: "sk-3",
            categoryId: "cat-prog",
            name: "JavaScript",
            proficiency: "",
            isHighlighted: false,
            isVisible: true,
            sortOrder: 2,
          },
          {
            id: "sk-4",
            categoryId: "cat-prog",
            name: "TypeScript",
            proficiency: "",
            isHighlighted: true,
            isVisible: true,
            sortOrder: 3,
          },
          {
            id: "sk-5",
            categoryId: "cat-prog",
            name: "SQL",
            proficiency: "",
            isHighlighted: false,
            isVisible: true,
            sortOrder: 4,
          },
        ],
      },
      {
        id: "cat-ai",
        name: "AI & Data Science",
        displayMode: "INLINE_COMMA",
        showProficiency: false,
        sortOrder: 1,
        isVisible: true,
        items: [
          {
            id: "sk-6",
            categoryId: "cat-ai",
            name: "PyTorch",
            proficiency: "",
            isHighlighted: true,
            isVisible: true,
            sortOrder: 0,
          },
          {
            id: "sk-7",
            categoryId: "cat-ai",
            name: "YOLOv8",
            proficiency: "",
            isHighlighted: true,
            isVisible: true,
            sortOrder: 1,
          },
          {
            id: "sk-8",
            categoryId: "cat-ai",
            name: "OpenCV",
            proficiency: "",
            isHighlighted: false,
            isVisible: true,
            sortOrder: 2,
          },
          {
            id: "sk-9",
            categoryId: "cat-ai",
            name: "MobileSAM",
            proficiency: "",
            isHighlighted: false,
            isVisible: true,
            sortOrder: 3,
          },
        ],
      },
      {
        id: "cat-lang",
        name: "Spoken Languages",
        displayMode: "PROFICIENCY_GROUPED",
        showProficiency: true,
        sortOrder: 2,
        isVisible: true,
        items: [
          {
            id: "sk-10",
            categoryId: "cat-lang",
            name: "Indonesian",
            proficiency: "Native",
            isHighlighted: false,
            isVisible: true,
            sortOrder: 0,
          },
          {
            id: "sk-11",
            categoryId: "cat-lang",
            name: "English",
            proficiency: "Professional Working Proficiency",
            isHighlighted: false,
            isVisible: true,
            sortOrder: 1,
          },
        ],
      },
    ],
  });
}

/**
 * Generates a clean blank resume with default empty sections.
 */
export function createBlankResume(): ResumeDocumentType {
  return ResumeDocumentSchema.parse({
    title: "Untitled Resume",
    sections: [
      {
        id: crypto.randomUUID(),
        sectionType: "SUMMARY",
        title: "SUMMARY",
        sortOrder: 0,
        isVisible: true,
        layoutVariant: "PARAGRAPH",
        content: [],
      },
      {
        id: crypto.randomUUID(),
        sectionType: "EDUCATION",
        title: "EDUCATION",
        sortOrder: 1,
        isVisible: true,
        layoutVariant: "STANDARD",
        content: [],
      },
      {
        id: crypto.randomUUID(),
        sectionType: "PROJECT_EXPERIENCE",
        title: "PROJECT EXPERIENCES",
        sortOrder: 2,
        isVisible: true,
        layoutVariant: "STANDARD",
        content: [],
      },
      {
        id: crypto.randomUUID(),
        sectionType: "SKILLS_LANGUAGES",
        title: "SKILLS & LANGUAGES",
        sortOrder: 3,
        isVisible: true,
        layoutVariant: "STANDARD",
        content: [],
      },
    ],
    skillCategories: [],
  });
}

import {
  Campaign,
  Department,
  Doctor,
  LibraryItem,
  MedicalService,
  NewsItem,
  Product,
  ProductCategory,
  SuccessStory,
} from '../types/clinic';

export const enSiteText = {
  shortAbout:
    'A specialized medical ecosystem uniting neurosurgical assessment, interventional pain management, physiotherapy and rehabilitation, and clinical pharmacy under one roof.',
  vision:
    'Delivering trusted, specialized care for spine, neurological, and chronic pain conditions through an integrated pathway from precision diagnosis to full rehabilitation.',
  mission:
    'Coordinating neurosurgery, pain management, physical therapy, and pharmacy teams to provide clear, safe, and patient-centered care.',
  city: 'Sana’a (Replaceable Demo Location)',
  address: 'South 60th Street — Specialized Medical Center Building (Prototype Placeholder)',
  landmark: 'Near main intersection — Dedicated patient parking available',
  workingDays: 'Saturday to Thursday',
  workingPeriods: [
    { label: 'Morning Shift', time: '09:00 AM – 01:30 PM' },
    { label: 'Evening Shift', time: '04:00 PM – 08:30 PM' },
  ],
  phoneLabels: ['Reception & Appointments', 'Pharmacy & Store Orders'],
  whatsappDisplay: '+967 770 000 000 (Demo Number)',
  directionsNote: 'Official Google Maps link will be connected once final clinic coordinates are provided.',
  visitTypes: ['Initial Consultation', 'Follow-up Visit', 'MRI / Imaging Review', 'Therapy / Assessment Session'],
  periods: ['Morning Shift (09:00 AM – 01:30 PM)', 'Evening Shift (04:00 PM – 08:30 PM)'],
  capacityPolicyNote:
    'Remaining campaign capacity is automatically calculated from approved slots per campaign day and can be adjusted in clinic settings.',
  prescriptionHelperText: 'Accepted formats: Clear prescription photo (JPG, PNG, WEBP) or PDF up to 10 MB.',
  moderationNotice:
    'All comments and ratings are reviewed by our editorial team prior to publication to protect patient privacy and clinical accuracy.',
  ePaymentNetworks: [
    { id: 'kuraimi', name: 'Electronic Transfer / Wallet (Configurable Network)', accountHint: 'Demo Account: 1000-2000-30' },
    { id: 'jawali', name: 'Local Mobile Wallet (Configurable Network)', accountHint: 'Demo Merchant Code: NODISC-01' },
    { id: 'card', name: 'Demo Bank Card Gateway', accountHint: 'Payment gateway integration placeholder' },
  ],
  collectionNote: 'Payment network names, fees, and collection accounts can be configured with official clinic details.',
  galleryCaptions: [
    'Main Reception & Patient Waiting Lounge (Prototype Visual)',
    'Neurosurgery & Spine Consultation Suite',
    'Physical Rehabilitation & Movement Unit',
    'Clinical Pharmacy & Prescription Counter',
  ],
};

export const enDepartments: Record<string, Partial<Department>> = {
  neurosurgery: {
    nameAr: 'NODISC Neurosurgery',
    nameEn: 'نوديسك لجراحة المخ والأعصاب',
    shortDesc: 'Precision diagnosis and microscopic surgical care for spine disorders, disc herniation, and nerve conditions.',
    fullOverview:
      'The Neurosurgery Department at NODISC Clinic evaluates spine conditions, cervical and lumbar disc herniations, spinal canal stenosis, and peripheral nerve disorders through thorough clinical examination and detailed MRI review.',
    scopeItems: [
      'Consultations for cervical and lumbar disc herniation',
      'Microscopic and minimally invasive spine interventions',
      'Evaluation of spinal stenosis and vertebral instability',
      'Post-operative follow-up coordinated with rehabilitation specialists',
    ],
    contactNote: 'Demo Ext: 101 — Available for pre-booked specialist consultations',
    workingHoursNote: 'Sat – Thu | Morning & Evening Shifts',
    ctaLabel: 'Book in Neurosurgery Department',
  },
  pain: {
    nameAr: 'NODISC Pain',
    nameEn: 'نوديسك لعلاج الألم',
    shortDesc: 'Modern non-surgical protocols and targeted interventions to relieve back, neck, joint, and nerve pain.',
    fullOverview:
      'NODISC Pain focuses on evaluating acute and chronic spine, joint, and neuropathic pain using conservative and image-guided non-surgical protocols designed to reduce pain and restore daily mobility.',
    scopeItems: [
      'Specialist assessment for chronic back, neck, and sciatic pain',
      'Targeted local injections and nerve root inflammation relief',
      'Management programs for myofascial and joint pain',
      'Integrated medication and rehab planning across clinic departments',
    ],
    contactNote: 'Demo Ext: 102 — Acute & chronic pain evaluation',
    workingHoursNote: 'Sat – Thu | Morning & Evening Shifts',
    ctaLabel: 'Book in Pain Management Department',
  },
  rehabilitation: {
    nameAr: 'NODISC Rehabilitation',
    nameEn: 'نوديسك للتأهيل والعلاج الطبيعي',
    shortDesc: 'Dedicated physiotherapy and movement rehabilitation programs for spine health and post-surgical recovery.',
    fullOverview:
      'The Rehabilitation & Physiotherapy Department provides individualized therapy sessions designed to improve spinal flexibility, strengthen core stabilizers, and guide recovery after surgery or musculoskeletal injury in a calm, well-equipped space.',
    scopeItems: [
      'Physiotherapy programs for disc herniation, neck, and lower back pain',
      'Post-surgical spine and joint rehabilitation',
      'Manual therapy, posture correction, and core stability training',
      'Electrotherapy, therapeutic ultrasound, and controlled traction',
    ],
    gallery: [
      {
        url: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
        caption: 'Spinal rehabilitation & physiotherapy studio with treatment tables and gait parallel bars',
      },
      {
        url: '/src/assets/images/dept_pain_clinic_1795286628900.jpg',
        caption: 'Private assessment and ultrasound-guided musculoskeletal suite',
      },
    ],
    equipmentList: [
      {
        name: 'Multi-Position Electric Physiotherapy Tables',
        purpose: 'Allows therapists to position spinal angles safely and comfortably during manual therapy.',
      },
      {
        name: 'Electrotherapy & Pain Modulation Units (TENS / IFC)',
        purpose: 'Reduces muscle spasm and supports localized neuromuscular recovery.',
      },
      {
        name: 'Therapeutic Ultrasound Units',
        purpose: 'Supports deep soft-tissue healing and reduces localized inflammation around tendons and joints.',
      },
      {
        name: 'Gait Parallel Bars & Balance Training Tools',
        purpose: 'Restores safe walking mechanics and balance following surgery or injury.',
      },
    ],
    contactNote: 'Demo Ext: 103 — Scheduled therapy session coordination',
    workingHoursNote: 'Sat – Thu | Morning & Evening Sessions by Appointment',
    ctaLabel: 'Request Rehabilitation & Physiotherapy Assessment',
  },
  pharmacy: {
    nameAr: 'NODISC Pharmacy',
    nameEn: 'نوديسك للصيدلية',
    shortDesc: 'Specialized medical dispensary for prescriptions, spine braces, nerve supplements, and rehab essentials.',
    fullOverview:
      'NODISC Pharmacy provides accurate prescription dispensing under licensed pharmacist supervision, alongside curated spine supports, ergonomic pillows, home pain-relief devices, and nerve & joint supplements.',
    scopeItems: [
      'Prescription dispensing for neurosurgery and pain management patients',
      'Certified lumbar and cervical braces and home recovery aids',
      'Online prescription photo intake for pharmacist verification',
      'Online pharmacy store with clinic pickup or local delivery options',
    ],
    contactNote: 'Demo Ext: 104 — Prescription & store order support',
    workingHoursNote: 'Sat – Thu | 09:00 AM – 09:00 PM',
    ctaLabel: 'Browse Pharmacy Store',
  },
};

export const enDoctors: Record<string, Partial<Doctor>> = {
  'dr-mohammed-aljurbani': {
    nameAr: 'Dr. Mohammed Al-Jurbani',
    nameEn: 'د. محمد الجرباني',
    roleTitle: 'Consultant Neurosurgeon & Spine Specialist (Replaceable Demo Title)',
    imagePlaceholderNote: 'Dedicated frame for Dr. Mohammed Al-Jurbani’s approved portrait',
    bio: 'Dr. Mohammed Al-Jurbani leads neurosurgical and diagnostic spine evaluation at NODISC Clinic, emphasizing clear differentiation between cases best served by conservative rehabilitation and cases requiring microscopic surgical intervention.',
    qualifications: [
      'Specialist Academic Degree in Neurosurgery (Replaceable with approved credentials)',
      'Advanced Fellowship / Training in Microscopic Spine Surgery (Replaceable field)',
      'Professional Medical Association Memberships (To be completed by clinic)',
    ],
    experiences: [
      'Clinical and surgical experience in cervical and lumbar disc herniation (To be updated with approved figures)',
      'Coordinated multidisciplinary care planning with Pain and Rehabilitation teams',
      'Detailed evaluation of MRI and CT spinal imaging studies',
    ],
    focusAreas: [
      'Lumbar & Cervical Disc Herniation',
      'Spinal Canal Stenosis & Nerve Root Compression',
      'Minimally Invasive Spine Surgery',
      'Peripheral Nerve Disorders',
    ],
    isProfileEditableNote:
      'All credentials, experience figures, and portrait fields in this profile are structured placeholders ready for official clinic approval.',
  },
  'team-pain-unit': {
    nameAr: 'Interventional Pain Care Team',
    nameEn: 'فريق عيادة علاج الألم التداخلي',
    roleTitle: 'Specialists in Acute & Chronic Pain Assessment (Extensible Team Slot)',
    imagePlaceholderNote: 'Slot for Pain Management physicians upon final onboarding',
    bio: 'A dedicated medical team focused on diagnosing neuropathic and musculoskeletal pain sources and delivering targeted non-surgical interventions to restore comfort and daily function.',
    qualifications: [
      'Specialization in Pain Medicine & Guided Interventions (Replaceable with physician names)',
      'Certified medication safety & targeted local injection protocols',
    ],
    experiences: [
      'Managing chronic pain cases unresponsive to conventional oral analgesics',
      'Direct coordination with Neurosurgery to avoid surgery whenever safely possible',
    ],
    focusAreas: [
      'Targeted Nerve Root Blocks',
      'Facet Joint Pain Management',
      'Chronic Neuropathic Pain Protocols',
    ],
    isProfileEditableNote: 'Extensible team module ready for individual physician profiles.',
  },
  'team-rehab-unit': {
    nameAr: 'Rehabilitation & Physiotherapy Team',
    nameEn: 'فريق التأهيل والعلاج الطبيعي',
    roleTitle: 'Licensed Physiotherapists & Movement Specialists (Extensible Team Slot)',
    imagePlaceholderNote: 'Slot for Rehabilitation specialists’ portraits and names',
    bio: 'Licensed physiotherapists dedicated to therapeutic exercise programming, post-operative spine rehabilitation, and ergonomic posture restoration using modern clinical modalities.',
    qualifications: [
      'B.Sc. / Postgraduate Qualifications in Physiotherapy (Replaceable field)',
      'Specialized training in spinal and neurological rehabilitation',
    ],
    experiences: [
      'Designing individualized session plans matched to patient tolerance',
      'Ongoing functional mobility and recovery milestone tracking',
    ],
    focusAreas: [
      'Post-Discectomy Rehabilitation',
      'Manual Therapy & Posture Correction',
      'Core & Paraspinal Strengthening',
    ],
    isProfileEditableNote: 'Flexible team component ready to split into individual specialist cards.',
  },
};

export const enServices: Record<string, Partial<MedicalService>> = {
  'srv-neuro-consult': {
    title: 'Neurosurgery & Spine Consultation',
    shortDesc: 'Comprehensive neurological exam and MRI review to establish a clear care plan.',
    details: [
      'Detailed assessment of motor, sensory, and reflex neurological signs.',
      'Side-by-side review of MRI/CT imaging with transparent explanation of options.',
      'Clear guidance between conservative therapy, pain intervention, or surgery.',
    ],
    durationNote: 'Estimated duration: 25 – 35 minutes',
  },
  'srv-microdiscectomy': {
    title: 'Microscopic Disc Herniation Surgical Evaluation',
    shortDesc: 'Pre-operative consultation for minimally invasive nerve root decompression.',
    details: [
      'Assessment of clinical indications for microscopic decompression.',
      'Step-by-step explanation of the procedure, recovery timeline, and post-op rehab.',
      'Coordination of pre-procedure clearances and imaging.',
    ],
    durationNote: 'Scheduled specialist evaluation',
  },
  'srv-spine-mri-review': {
    title: 'Spine Imaging & Second Opinion Review',
    shortDesc: 'Detailed reading of cervical or lumbar MRI/CT scans with structured recommendations.',
    details: [
      'Comparison of prior and current spinal imaging studies.',
      'Multidisciplinary routing across surgery, pain relief, or physiotherapy.',
    ],
    durationNote: '20 – 30 minutes',
  },
  'srv-pain-eval': {
    title: 'Chronic Pain Assessment & Interventional Planning',
    teamLabel: 'NODISC Pain Team',
    shortDesc: 'Pinpointing neuropathic or musculoskeletal pain generators with non-surgical plans.',
    details: [
      'Classification of nerve, facet joint, or muscular pain origins.',
      'Stepwise protocol aimed at reducing reliance on long-term oral painkillers.',
    ],
    durationNote: '30 minutes',
  },
  'srv-nerve-block': {
    title: 'Targeted Nerve Root Pain Interventions',
    teamLabel: 'NODISC Pain Team',
    shortDesc: 'Guided outpatient procedures to calm inflamed nerve roots without open surgery.',
    details: [
      'Precision-guided local anti-inflammatory therapy around affected nerve roots.',
      'Day-case procedure followed by clinical observation and physiotherapy integration.',
    ],
    durationNote: 'Outpatient clinical procedure',
  },
  'srv-rehab-spine': {
    title: 'Spinal Physiotherapy Program (Back & Neck)',
    teamLabel: 'Rehabilitation Team',
    shortDesc: 'Manual therapy, targeted exercises, and modalities to relieve spinal load.',
    details: [
      'Baseline flexibility, posture, and muscle tension evaluation.',
      'Combined manual mobilization, graded core exercises, and electrotherapy.',
    ],
    durationNote: '45 – 60 minutes per session',
  },
  'srv-rehab-postop': {
    title: 'Post-Spine Surgery Rehabilitation',
    teamLabel: 'Rehabilitation Team',
    shortDesc: 'Coordinated progressive recovery program to restore movement safely.',
    details: [
      'Gentle early mobility and breathing guidance aligned with surgical precautions.',
      'Ergonomic training for safe sitting, sleeping, and lifting mechanics.',
    ],
    durationNote: '6 to 12 sessions based on assessment',
  },
  'srv-pharmacy-consult': {
    title: 'Clinical Prescription Dispensing & Medical Aids',
    teamLabel: 'Clinical Pharmacy Team',
    shortDesc: 'Pharmacist review of prescriptions, drug interactions, and certified braces.',
    details: [
      'Dosage verification and clear usage counseling for patients.',
      'Supplying orthopedic braces, home TENS units, and supportive supplements.',
    ],
    durationNote: 'Available daily during pharmacy hours',
  },
};

export const enLibrary: Record<string, Partial<LibraryItem>> = {
  'lib-cond-lumbar-disc': {
    typeLabel: 'Condition',
    title: 'Lumbar Disc Herniation & Sciatica Explained',
    authorName: 'Dr. Mohammed Al-Jurbani (Demo Educational Copy)',
    readTime: '4 min read',
    summary: 'Understand how lumbar disc herniation occurs, key nerve symptoms, and when conservative care versus microscopic surgery is considered.',
    sections: [
      {
        heading: 'What Is Lumbar Disc Herniation?',
        body: 'Disc herniation happens when part of the inner disc cushions bulges backward between lower spine vertebrae, potentially irritating or compressing nearby nerve roots.',
      },
      {
        heading: 'Common Symptoms Requiring Evaluation',
        body: 'Lower back pain radiating down the buttock or leg (sciatica), tingling or numbness, or foot weakness in advanced cases. Diagnosis pairs clinical exams with MRI findings.',
      },
      {
        heading: 'NODISC Stepped Care Pathway',
        body: 'Many cases improve with guided physiotherapy and targeted pain relief. Persistent nerve compression or progressive weakness is evaluated for minimally invasive microscopic surgery.',
      },
    ],
  },
  'lib-art-pain-management': {
    typeLabel: 'Medical Article',
    title: 'How Targeted Pain Interventions Reduce Oral Painkiller Dependency',
    authorName: 'NODISC Pain Team',
    readTime: '3 min read',
    summary: 'Comparing long-term oral analgesics with precision local interventions that calm inflamed nerves and joints.',
    sections: [
      {
        heading: 'Limits of Long-Term Oral Painkillers',
        body: 'Repeated oral painkillers mask pain signals temporarily without addressing localized inflammation around the nerve root, and prolonged use may burden the stomach or kidneys.',
      },
      {
        heading: 'Precision Guided Relief',
        body: 'Using imaging guidance, clinicians deliver calming therapy directly at the pain source, enabling patients to participate comfortably in physiotherapy.',
      },
    ],
  },
  'lib-proc-microdiscectomy': {
    typeLabel: 'Procedure',
    title: 'Microscopic Nerve Decompression & Discectomy Overview',
    authorName: 'Dr. Mohammed Al-Jurbani',
    readTime: '4 min read',
    summary: 'An accessible overview of microscopic disc removal to relieve nerve compression and the subsequent recovery pathway.',
    sections: [
      {
        heading: 'Purpose of the Procedure',
        body: 'Removing only the herniated disc fragment pressing on the nerve root through a small incision under surgical magnification while preserving spinal stability.',
      },
      {
        heading: 'Recovery & Post-Op Rehabilitation',
        body: 'Patients follow an early walking and posture program supervised jointly by surgery and rehabilitation teams. Specific timelines are tailored during consultation.',
      },
    ],
  },
  'lib-vid-neck-posture': {
    typeLabel: 'Educational Video',
    title: 'Ergonomic Sitting Posture & Gentle Stretches for Neck and Lower Back',
    authorName: 'Rehabilitation & Physiotherapy Unit',
    videoPreviewNote: 'Interactive demo video player — ready to link the clinic’s official hosted video file.',
    summary: 'Brief visual guide demonstrating monitor height, chair alignment, and three safe desk stretches.',
  },
  'lib-cond-cervical-radiculopathy': {
    typeLabel: 'Condition',
    title: 'Neck Pain Radiating to the Arm & Finger Tingling',
    authorName: 'Rehabilitation & Neurosurgery Teams',
    readTime: '3 min read',
    summary: 'Distinguishing muscular neck strain from cervical nerve root compression.',
    sections: [
      {
        heading: 'Initial Symptom Differences',
        body: 'Muscular strain typically stays localized in the neck and upper shoulders, whereas cervical nerve irritation may send radiating pain or tingling down the arm and fingers.',
      },
    ],
  },
  'lib-faq-booking-process': {
    typeLabel: 'FAQ',
    title: 'How is my appointment request confirmed after submitting online?',
    summary: 'Step-by-step overview of booking review and final slot confirmation.',
    faqAnswer:
      'Once you submit the "Book Appointment" form, you receive a demo reference number marked "Pending Review". Our coordination desk verifies specialist availability and contacts you to confirm your exact appointment time.',
  },
  'lib-faq-mri-requirements': {
    typeLabel: 'FAQ',
    title: 'Do I need to bring MRI scans to my first consultation?',
    summary: 'Guidance on preparing prior imaging and medical reports.',
    faqAnswer:
      'If you already have MRI, CT, or X-ray scans and a current medication list, please bring them to assist evaluation. If not, the physician will perform a clinical exam and advise if new imaging is needed.',
  },
  'lib-faq-pain-vs-rehab': {
    typeLabel: 'FAQ',
    title: 'How do Pain Management and Physiotherapy work together?',
    summary: 'Explaining the coordination between pain relief and movement rehabilitation.',
    faqAnswer:
      'Both teams coordinate closely: Pain Management helps calm severe acute inflammation so patients can safely complete muscle-strengthening and mobility sessions in Physiotherapy.',
  },
  'lib-faq-pharmacy-prescription': {
    typeLabel: 'FAQ',
    title: 'How can I order a prescription or orthopedic brace from NODISC Pharmacy?',
    summary: 'Ordering directly from the store or uploading a prescription photo.',
    faqAnswer:
      'You can add braces, devices, and supplements directly in the Pharmacy Store, or use the "Order by Prescription Photo" page for pharmacist review and follow-up.',
  },
};

export const enNews: Record<string, Partial<NewsItem>> = {
  'news-rehab-unit-expansion': {
    title: 'Rehabilitation Unit Equipment Upgrade Supporting Post-Surgical Recovery',
    categoryLabel: 'Service Expansion',
    summary: 'NODISC Clinic added modern gait training bars and electrotherapy units to strengthen post-surgical and conservative spine care.',
    body: [
      'As part of continuous service development at NODISC Clinic, the Rehabilitation & Physiotherapy Unit has been upgraded with dedicated spine recovery equipment.',
      'These tools enable progressive mobility plans both after microscopic spine procedures and during non-surgical care.',
      'Note: This news item is prototype demo content replaceable with official clinic announcements.',
    ],
  },
  'news-free-spine-campaign': {
    title: 'Announcing the Free Back Pain & Disc Screening Campaign Day',
    categoryLabel: 'Community Initiative',
    summary: 'Demo registration is now open for limited-capacity free spine evaluations and MRI reviews at the clinic.',
    body: [
      'The Neurosurgery Department announced an open screening day providing complimentary initial evaluations for pre-registered patients.',
      'Full eligibility scope, timings, and registration are available on the Campaigns page.',
    ],
  },
  'news-pharmacy-prescription-service': {
    title: 'Digital Prescription Photo Intake Launched at NODISC Pharmacy',
    categoryLabel: 'Pharmacy Services',
    summary: 'Patients can now upload prescription photos for pharmacist review prior to delivery or clinic pickup.',
    body: [
      'To simplify access to prescribed medications and orthopedic supports, NODISC Pharmacy introduced an online prescription intake workflow.',
      'In this prototype, submissions operate as a complete interactive local simulation.',
    ],
  },
};

export const enStories: Record<string, Partial<SuccessStory>> = {
  'story-lumbar-recovery': {
    title: 'Gradual Recovery from Sciatica & Return to Daily Mobility',
    patientLabel: 'Patient — General Demo Case (Initials: A. M.)',
    summary: 'A coordinated pathway starting with surgical evaluation and progressing through conservative pain relief and physiotherapy.',
    beforeState: 'Months of lower back pain radiating to the leg, limiting standing and short walks.',
    carePath: 'MRI review in Neurosurgery followed by a combined plan of nerve-root inflammation relief and 8 guided physiotherapy sessions.',
    outcome: 'Steady return to comfortable walking and daily work alongside home posture maintenance (replaceable demo copy).',
    comments: [
      {
        id: 'cmt-1',
        author: 'Khalid S. (Approved Demo Comment)',
        rating: 5,
        text: 'Well-organized coordination and very clear explanation of all treatment options.',
        date: '2026-11-11',
        status: 'approved',
      },
      {
        id: 'cmt-2',
        author: 'Um Abdullah (Approved Demo Comment)',
        rating: 5,
        text: 'Having the clinic and physiotherapy unit communicate directly made follow-ups effortless.',
        date: '2026-11-14',
        status: 'approved',
      },
    ],
  },
  'story-neck-rehab': {
    title: 'Relieving Chronic Neck Stiffness Through Physiotherapy & Pain Care',
    patientLabel: 'Patient — General Demo Case (Initials: S. A.)',
    summary: 'Combining muscle-release sessions and ergonomic workstation coaching to ease chronic cervical tension.',
    beforeState: 'Recurring neck stiffness and tension headaches from long hours of desk work.',
    carePath: 'Pain clinic assessment followed by manual therapy, deep neck flexor exercises, and an orthopedic cervical pillow.',
    outcome: 'Restored neck range of motion and fewer tension episodes (general replaceable prototype example).',
    comments: [
      {
        id: 'cmt-3',
        author: 'Majid H. (Approved Demo Comment)',
        rating: 4,
        text: 'The guided posture coaching and follow-up exercises were genuinely helpful.',
        date: '2026-11-09',
        status: 'approved',
      },
    ],
  },
  'story-pain-joint-relief': {
    title: 'Restoring Active Movement After Targeted Pain Relief',
    patientLabel: 'Patient — General Demo Case (Initials: M. Y.)',
    summary: 'Reducing daily painkiller reliance and transitioning safely into guided exercise.',
    beforeState: 'Chronic lower back facet joint pain affecting morning mobility and sleep.',
    carePath: 'Comprehensive pain evaluation, targeted outpatient procedure, and seamless handoff to Rehabilitation.',
    outcome: 'Improved morning flexibility and greater comfort during daily routines (demo example).',
    comments: [],
  },
};

export const enCampaigns: Record<string, Partial<Campaign>> = {
  'camp-spine-screening-nov': {
    title: 'Free Medical Day for Back Pain & Disc Herniation Evaluation',
    serviceSummary: 'Initial clinical exam and MRI report review for lower back and neck pain cases',
    dayLabel: 'Thursday — November 26, 2026 (Demo Date)',
    periodLabel: 'Morning Shift: 09:00 AM – 01:00 PM',
    locationLabel: 'NODISC Clinic — 1st Floor, Neurosurgery Clinics',
    registrationWindow: 'Open until capacity is reached or 24 hours before event',
    freeScopeExplanation:
      'Free coverage includes the initial screening consultation fee during campaign hours only; external lab tests, imaging, or medications are excluded if required.',
    notes: [
      'Please bring prior X-ray or MRI films if available.',
      'Priority is given to pre-registered patients within available capacity.',
      'Exact arrival time is confirmed via phone/demo SMS.',
    ],
  },
  'camp-rehab-posture-check': {
    title: 'Free Posture Screening & Desk Neck Pain Rehabilitation Campaign',
    serviceSummary: 'Complimentary movement assessment and preventive exercise plan for neck & back strain',
    dayLabel: 'Saturday — November 21, 2026 (Demo Date)',
    periodLabel: 'Evening Shift: 04:00 PM – 07:30 PM',
    locationLabel: 'Rehabilitation & Physiotherapy Department — Ground Floor',
    registrationWindow: 'Registration closed — Capacity full',
    freeScopeExplanation:
      'Covers the initial posture screening and written home-exercise guidance; extended therapy sessions are not included.',
    notes: [
      'All allocated seats for this campaign are filled in the demo data.',
      'You may check upcoming campaigns or book a regular assessment.',
    ],
  },
  'camp-pain-awareness-dec': {
    title: 'Chronic Non-Surgical Pain Management Awareness Day',
    serviceSummary: 'Informational consultation on interventional non-surgical options for chronic pain',
    dayLabel: 'Thursday — December 10, 2026 (Scheduled Campaign)',
    periodLabel: 'Morning Shift: 09:30 AM – 01:00 PM',
    locationLabel: 'Pain Management Unit — NODISC Clinic',
    registrationWindow: 'Opens 5 days prior to campaign date',
    freeScopeExplanation: 'Covers educational consultation and history review; excludes interventional injections.',
    notes: ['This campaign is in "Scheduled" status to preview upcoming registration states.'],
  },
  'camp-pharmacy-elderly-oct': {
    title: 'Complimentary Pharmacist Medication Review Initiative',
    serviceSummary: 'Drug interaction review and safe usage guidance for nerve and joint medications',
    dayLabel: 'Thursday — October 29, 2026 (Ended)',
    periodLabel: '09:00 AM – 02:00 PM',
    locationLabel: 'NODISC Pharmacy',
    registrationWindow: 'Campaign window ended',
    freeScopeExplanation: 'Free pharmacist consultation reviewing current medication regimens.',
    notes: ['Archived campaign demonstrating the "Ended" state.'],
  },
};

export const enStoreMainSections: Record<string, { nameAr: string; description: string }> = {
  'sec-medical-supplies': {
    nameAr: 'Medical Supplies',
    description: 'Spine braces, neurological vitamins & supplements, and topical post-op care supplies.',
  },
  'sec-rehab-equipment': {
    nameAr: 'Physiotherapy & Rehabilitation Equipment',
    description: 'Electrotherapy pain relief devices, thermal wraps, and home rehabilitation tools.',
  },
};

export const enCategories: Record<string, Partial<ProductCategory>> = {
  'cat-supports': {
    nameAr: 'Spine Braces & Supports',
    description: 'Lumbar belts, cervical collars, and orthopedic pillows for spinal alignment.',
  },
  'cat-devices': {
    nameAr: 'Physiotherapy & Pain Relief Devices',
    description: 'Home TENS electrotherapy units, hot/cold packs, and rehab tools.',
  },
  'cat-supplements': {
    nameAr: 'Nerve & Bone Supplements',
    description: 'Targeted vitamins and minerals supporting nerve and joint health.',
  },
  'cat-topical': {
    nameAr: 'Topical Care & Post-Op Supplies',
    description: 'Soothing analgesic gels and sterile post-surgical care packs.',
  },
};

export const enProducts: Record<string, Partial<Product>> = {
  'prd-lumbar-brace': {
    name: 'Dual-Strap Ergonomic Lumbar Support Brace',
    unit: 'Piece',
    options: ['Size M', 'Size L', 'Size XL'],
    shortDesc: 'Breathable mesh lower-back brace with dual tension straps for lumbar stability.',
    fullDesc: 'Designed to provide gentle lower-back stabilization and reduce muscular strain during standing or walking during recovery (demo product).',
  },
  'prd-cervical-pillow': {
    name: 'Contoured Memory Foam Orthopedic Cervical Pillow',
    unit: 'Piece',
    options: ['Standard Loft', 'Low Loft'],
    shortDesc: 'Ergonomically contoured pillow maintaining natural cervical curve during sleep.',
    fullDesc: 'High-density medical memory foam with washable organic cotton cover to help ease neck and shoulder tension (demo product).',
  },
  'prd-tens-unit': {
    name: 'Digital Home TENS Pain Relief Electrotherapy Device',
    unit: 'Unit + 4 Pads',
    options: ['Dual Channel', 'Dual Channel + Extra Pads'],
    shortDesc: 'Gentle nerve stimulation unit with multi-mode programs for muscle and nerve comfort.',
    fullDesc: 'Helps calm localized muscle spasms and pain signals in the back, neck, and joints under physiotherapist guidance (demo data).',
  },
  'prd-bcomplex-neuro': {
    name: 'Neuro B-Complex Nerve Support Supplement',
    unit: 'Bottle (60 Capsules)',
    options: ['60 Capsules'],
    shortDesc: 'Balanced B1 / B6 / B12 formula supporting peripheral nerve nourishment.',
    fullDesc: 'Dietary supplement supporting peripheral nerve function, used as advised by your physician or pharmacist (demo product).',
  },
  'prd-coccyx-cushion': {
    name: 'Ergonomic Cut-Out Coccyx & Spine Seat Cushion',
    unit: 'Piece',
    options: ['Charcoal Black', 'Clinical Grey'],
    shortDesc: 'Office and car seat cushion relieving direct tailbone and lower-spine pressure.',
    fullDesc: 'Ideal for prolonged sitting or recovery from lower back and coccyx discomfort (demo product).',
  },
  'prd-cervical-collar': {
    name: 'Semi-Rigid Medical Cervical Collar',
    unit: 'Piece',
    options: ['Size S/M', 'Size L/XL'],
    shortDesc: 'Lightweight neck support limiting sudden motion during acute neck strain.',
    fullDesc: 'Intended for short, physician-guided intervals to reduce cervical load (demo product).',
  },
  'prd-electrode-pads': {
    name: 'Replacement Hydrogel TENS Electrode Pads',
    unit: 'Pack of 8 Pads',
    options: ['Standard 5x5 cm'],
    shortDesc: 'Skin-friendly reusable conductive pads compatible with home TENS devices.',
    fullDesc: 'High-conductivity self-adhesive pads gentle on sensitive skin (demo data).',
  },
  'prd-thermal-wrap': {
    name: 'Reusable Hot/Cold Flexible Spine Gel Wrap',
    unit: 'Wrap with Belt',
    options: ['Wide Back Size'],
    shortDesc: 'Dual hot/cold gel compress with securing strap for back or neck comfort.',
    fullDesc: 'Use cold to soothe acute swelling or warm to relax tight muscles prior to stretching (demo product).',
  },
  'prd-magnesium-glycinate': {
    name: 'Magnesium Glycinate Muscle & Nerve Support',
    unit: 'Bottle (90 Tablets)',
    options: ['90 Tablets'],
    shortDesc: 'High-absorption gentle magnesium supporting muscle relaxation and nerve balance.',
    fullDesc: 'Supports relief from nighttime muscle tightness as part of balanced care (demo product).',
  },
  'prd-vitd-calcium': {
    name: 'Vitamin D3 + Calcium Bone & Spine Formula',
    unit: 'Bottle (60 Tablets)',
    options: ['60 Tablets'],
    shortDesc: 'Balanced mineral and vitamin support for bone and vertebral density.',
    fullDesc: 'Supports bone and joint strength alongside physical rehabilitation; consult your pharmacist for dosing (demo product).',
  },
  'prd-soothing-gel': {
    name: 'Topical Muscle & Joint Soothing Gel',
    unit: '100g Tube',
    options: ['100g'],
    shortDesc: 'Fast-absorbing, non-greasy topical gel for soothing localized muscle fatigue.',
    fullDesc: 'Convenient topical comfort gel before or after light rehabilitation exercises (demo product).',
  },
  'prd-postop-kit': {
    name: 'Sterile Post-Op Spine Wound Care Dressing Kit',
    unit: 'Pack of 10 Dressings',
    options: ['Standard Sterile'],
    shortDesc: 'Water-resistant gentle sterile dressings (Demo out-of-stock test item).',
    fullDesc: 'Configured as out-of-stock in prototype data so reviewers can verify out-of-stock states across catalog and product views.',
    requiresNote: 'Out-of-stock prototype preview item',
  },
};

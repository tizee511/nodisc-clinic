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
    'NODISC Clinic — A specialized medical center uniting Neurosurgery & Spine Surgery, Mayo Clinic-standard Pain Management, computerized spinal decompression & physiotherapy, and Clinical Pharmacy under Dr. Mohammed Abdullah Al-Jurbani at Ibn Sina Medical Diagnostic Center in Sana’a.',
  vision:
    '“Specialized care that starts by listening to your case, evaluating your imaging, and discussing the most suitable treatment options” — combining surgical precision with a commitment to conservative non-surgical recovery whenever possible.',
  mission:
    'Coordinating Neurosurgery, Interventional Pain Management, Digital Rehabilitation & Physiotherapy, and Clinical Pharmacy to deliver safe, evidence-based care for spine and neurological patients.',
  city: 'Sana’a — Republic of Yemen',
  address: 'Sana’a – Taiz St. – 45 Roundabout – Above Al-Faisal Pharmacy',
  landmark: 'Ibn Sina Medical Diagnostic Center (Main Consultant Clinic)',
  workingDays: 'Saturday to Thursday (Visits confirmed by phone in advance)',
  workingPeriods: [
    { label: 'Morning Shift', time: '09:00 AM – 02:00 PM' },
    { label: 'Evening Shift', time: '04:00 PM – 09:00 PM' },
  ],
  phoneLabels: ['Direct Clinic & Appointments Phone', 'NODISC WhatsApp, Store & Rehabilitation'],
  whatsappDisplay: '+967 772070207',
  directionsNote: 'Ibn Sina Medical Diagnostic Center — Sana’a, Taiz St., 45 Roundabout, Above Al-Faisal Pharmacy.',
  visitTypes: ['Initial Consultation', 'Follow-up Visit', 'MRI / Imaging Review', 'Physiotherapy / Rehabilitation Session'],
  periods: ['Morning Shift (09:00 AM – 02:00 PM)', 'Evening Shift (04:00 PM – 09:00 PM)'],
  capacityPolicyNote:
    'Remaining campaign capacity is automatically calculated from approved slots per campaign day and can be adjusted in clinic settings.',
  prescriptionHelperText: 'Accepted formats: Clear prescription photo (JPG, PNG, WEBP) or PDF up to 10 MB.',
  moderationNotice:
    'All comments and ratings are reviewed by our editorial team prior to publication to protect patient privacy and clinical accuracy.',
  ePaymentNetworks: [
    {
      id: 'kuraimi',
      name: 'Al-Kuraimi Hasib — Al-Kuraimi Islamic Bank',
      accountHint: 'Account No: 784545908 (Dr. Mohammed Abdullah Al-Jurbani / NODISC)',
    },
    {
      id: 'jawali',
      name: 'Jawali Wallet (CAC Bank)',
      accountHint: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
    },
    {
      id: 'jeeb',
      name: 'Jeeb Wallet (Tadhamon Bank)',
      accountHint: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
    },
    {
      id: 'onecash',
      name: 'OneCash Wallet',
      accountHint: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
    },
    {
      id: 'flousak',
      name: 'Flousak Wallet (YKB Bank)',
      accountHint: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
    },
  ],
  collectionNote: 'Store orders and wallet payments run in interactive local simulation mode during preview.',
  galleryCaptions: [
    'Main Reception at NODISC Clinic — Ibn Sina Medical Diagnostic Center',
    'Neurosurgery & Spine Consultation Suite — Dr. Mohammed Abdullah Al-Jurbani',
    'NODISC Rehabilitation & Digital Spinal Traction Unit',
    'NODISC Medical Pharmacy & Prescription Counter',
  ],
};

export const enDepartments: Record<string, Partial<Department>> = {
  neurosurgery: {
    nameAr: 'NODISC Neurosurgery',
    nameEn: 'نوديسك لجراحة المخ والأعصاب',
    shortDesc: 'Precision diagnosis and microscopic surgery for spine, disc herniation, brain, and peripheral nerves led by Dr. Mohammed Abdullah Al-Jurbani.',
    fullOverview:
      'The Neurosurgery & Spine Surgery Department at NODISC Clinic evaluates lumbar and cervical disc herniation, spinal canal stenosis, peripheral nerve compression, and brain conditions using thorough clinical exams and MRI review, prioritizing conservative care before microscopic surgery.',
    scopeItems: [
      'Consultations for cervical and lumbar disc herniation without unnecessary surgery',
      'Microscopic & minimally invasive spine interventions across 13 sub-specialties',
      'Evaluation of spinal canal stenosis, spondylolisthesis, and peripheral nerves',
      'Direct post-operative follow-up coordinated with Pain & Rehabilitation teams',
    ],
    contactNote: 'Direct Booking: +967 784545908 — Ibn Sina Medical Diagnostic Center, Sana’a',
    workingHoursNote: 'Sat – Thu | 09:00 AM – 02:00 PM & 04:00 PM – 09:00 PM',
    ctaLabel: 'Book in Neurosurgery Department',
  },
  pain: {
    nameAr: 'NODISC Pain',
    nameEn: 'نوديسك لعلاج الألم',
    shortDesc: 'Evidence-based interventional pain protocols aligned with Mayo Clinic Pain Rehabilitation standards without open surgery.',
    fullOverview:
      'NODISC Pain provides specialized assessment and targeted outpatient interventions for chronic spine, joint, sciatic, and neuropathic pain following Mayo Clinic Pain Rehabilitation standards, aiming to relieve inflammation and restore daily function.',
    scopeItems: [
      'Comprehensive evaluation of acute and chronic spine, neck, and nerve pain',
      'Targeted guided nerve root and facet joint interventions',
      'Non-surgical pain programs helping reduce reliance on oral painkillers',
      'Integrated treatment plans connecting Neurosurgery and Physiotherapy',
    ],
    contactNote: 'Appointments & Pain Unit: +967 784545908 | WhatsApp: +967 772070207',
    workingHoursNote: 'Sat – Thu | Morning & Evening Shifts (Confirmed by phone)',
    ctaLabel: 'Book in Pain Management Department',
  },
  rehabilitation: {
    nameAr: 'NODISC Rehabilitation',
    nameEn: 'نوديسك للتأهيل والعلاج الطبيعي',
    shortDesc: 'Computerized digital spinal decompression (traction) and physiotherapy achieving over 85% non-surgical improvement.',
    fullOverview:
      'NODISC Rehabilitation delivers structured physical therapy and computerized spinal decompression traction programs designed to relieve disc pressure, strengthen core stabilizers, and support recovery after spine surgery or injury.',
    scopeItems: [
      'Computerized digital spinal traction & decompression for cervical and lumbar discs',
      'Post-operative spine and joint rehabilitation protocols',
      'Manual therapy, posture correction, and deep core stabilization',
      'Electrotherapy (TENS/IFC), therapeutic ultrasound, and gait balance training',
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
        name: 'Computerized Digital Spinal Decompression & Traction Unit',
        purpose: 'Gently relieves intradiscal pressure on compressed cervical and lumbar nerve roots without surgery.',
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
    contactNote: 'Rehab Scheduling: +967 784545908 | WhatsApp: +967 772070207',
    workingHoursNote: 'Sat – Thu | Morning & Evening Sessions by Appointment',
    ctaLabel: 'Request Rehabilitation & Physiotherapy Assessment',
  },
  pharmacy: {
    nameAr: 'NODISC Pharmacy',
    nameEn: 'نوديسك للصيدلية',
    shortDesc: 'Specialized clinical dispensary for neurology/spine prescriptions, orthopedic braces, home devices, and supplements.',
    fullOverview:
      'NODISC Pharmacy provides accurate prescription dispensing supervised by licensed pharmacists alongside certified lumbar and cervical braces, orthopedic pillows, TENS therapy units, and nerve & joint supplements.',
    scopeItems: [
      'Clinical prescription dispensing for neurosurgery and pain patients',
      'Certified orthopedic braces, cervical collars, and home TENS devices',
      'Online prescription photo intake for pharmacist verification',
      'Local wallets (Al-Kuraimi, Jawali, Jeeb, OneCash, Flousak) and COD support',
    ],
    contactNote: 'Store & WhatsApp: +967 772070207 | Sana’a — Taiz St. – 45 Roundabout',
    workingHoursNote: 'Sat – Thu | 09:00 AM – 09:00 PM',
    ctaLabel: 'Browse Pharmacy Store',
  },
};

export const enDoctors: Record<string, Partial<Doctor>> = {
  'dr-mohammed-aljurbani': {
    nameAr: 'Dr. Mohammed Abdullah Al-Jurbani',
    nameEn: 'د. محمد عبدالله الجرباني',
    roleTitle: 'Consultant Neurosurgeon & Spine Surgeon — Founder of NODISC Clinic',
    imagePlaceholderNote: 'Official clinical portrait of Dr. Mohammed Abdullah Al-Jurbani',
    bio: 'Dr. Mohammed Abdullah Al-Jurbani is a Consultant Neurosurgeon and Spine Surgeon with over 15 years of specialized surgical practice and more than 4,500 operations and clinical cases across 13 neurosurgical sub-specialties. At NODISC Clinic (Ibn Sina Medical Diagnostic Center, Sana’a), his clinical philosophy starts with careful listening and MRI evaluation—prioritizing conservative treatment (>85% non-surgical improvement) and reserving microscopic surgery only when truly indicated.',
    qualifications: [
      'Consultant Neurosurgeon & Spine Surgeon — Over 15 years of specialized clinical and surgical practice',
      'Over 4,500 successful surgical operations and evaluated spine & neuro cases with a 98% safety & satisfaction rate',
      'Comprehensive diagnostic coverage spanning 13 neurosurgical and spine sub-specialties',
    ],
    experiences: [
      'Lead Consultant at NODISC Clinic — Ibn Sina Medical Diagnostic Center, Sana’a (Taiz St., 45 Roundabout)',
      'Microscopic & minimally invasive decompression for cervical and lumbar disc herniation and spinal stenosis',
      'Multidisciplinary non-surgical spine pathway integrating NODISC Rehabilitation (>85% improvement rate)',
    ],
    focusAreas: [
      'Lumbar & Cervical Disc Herniation (Conservative & Microscopic)',
      'Spinal Canal Stenosis & Vertebral Instability',
      'Microscopic Brain, Spine & Peripheral Nerve Surgery',
      'Integrated Pain & Digital Rehabilitation Routing',
    ],
    isProfileEditableNote:
      'Profile aligned with the official NODISC Clinic Sana’a practice of Dr. Mohammed Abdullah Al-Jurbani.',
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
  'sec-beauty-care': {
    nameAr: 'Beauty & Personal Care',
    description: 'Pharmacist-curated hair care, dermatological skincare, and oral hygiene essentials.',
  },
  'sec-vitamins-supplements': {
    nameAr: 'Vitamins & Supplements',
    description: 'Targeted nutritional formulas for nerve health, seniors, children, and women.',
  },
  'sec-mother-baby': {
    nameAr: 'Mother & Baby Care',
    description: 'Gentle infant nutrition, follow-on formulas, and daily mother & baby skin care.',
  },
  'sec-medical-supplies': {
    nameAr: 'Spine & Medical Supplies',
    description: 'Spine braces, ergonomic orthopedic pillows, and topical post-op care supplies.',
  },
  'sec-rehab-equipment': {
    nameAr: 'Physiotherapy & Rehabilitation Equipment',
    description: 'Electrotherapy pain relief devices, thermal wraps, and home rehabilitation tools.',
  },
};

export const enCategories: Record<string, Partial<ProductCategory>> = {
  'cat-hair-care': {
    nameAr: 'Hair Care',
    description: 'Sulfate-free medical shampoos and follicle-strengthening anti-hair-loss serums.',
  },
  'cat-skin-care': {
    nameAr: 'Skin Care',
    description: 'Gentle facial cleansers, high-SPF sunscreens, and barrier-repair moisturizers.',
  },
  'cat-oral-care': {
    nameAr: 'Oral & Dental Care',
    description: 'Sensitive enamel toothpastes, alcohol-free mouthwashes, and gum care essentials.',
  },
  'cat-supplements': {
    nameAr: 'Nerve & Joint Supplements',
    description: 'Targeted vitamins and minerals supporting nerve, spine, and joint health.',
  },
  'cat-seniors-vitamins': {
    nameAr: 'Seniors Vitamins (+50)',
    description: 'Balanced daily formulas supporting bone density, memory, and vitality for seniors.',
  },
  'cat-kids-vitamins': {
    nameAr: 'Children Vitamins',
    description: 'Kid-friendly immunity and growth syrups enriched with Vitamin D3, C, and Zinc.',
  },
  'cat-women-vitamins': {
    nameAr: "Women's Health Vitamins",
    description: 'Gentle iron, folate, biotin, and calcium complexes tailored for women.',
  },
  'cat-baby-nutrition': {
    nameAr: 'Baby Nutrition & Formula',
    description: 'Prebiotic-enriched infant formulas and wholesome iron-fortified baby cereals.',
  },
  'cat-baby-care': {
    nameAr: 'Mother & Baby Essentials',
    description: 'Fragrance-free baby lotions, tear-free shampoos, and gentle protective creams.',
  },
  'cat-supports': {
    nameAr: 'Spine Braces & Supports',
    description: 'Lumbar belts, cervical collars, and orthopedic pillows for spinal alignment.',
  },
  'cat-devices': {
    nameAr: 'Physiotherapy & Pain Relief Devices',
    description: 'Home TENS electrotherapy units, hot/cold packs, and rehab tools.',
  },
  'cat-topical': {
    nameAr: 'Topical Care & Post-Op Supplies',
    description: 'Soothing analgesic gels and sterile post-surgical care packs.',
  },
};

export const enProducts: Record<string, Partial<Product>> = {
  'prd-hair-serum': {
    name: 'Biotin & Peptide Follicle-Strengthening Hair Serum',
    unit: '60 ml Bottle',
    options: ['60 ml', 'Twin Pack 120 ml'],
    shortDesc: 'Lightweight non-greasy serum nourishing the scalp and supporting fuller hair density.',
    fullDesc: 'Pharmacy-grade formula with biotin, caffeine, and panthenol to revitalize roots and reduce daily shedding.',
    offerLabelAr: 'Hair Care Offer -20%',
  },
  'prd-hair-shampoo': {
    name: 'Sulfate-Free Medical Daily Scalp Shampoo',
    unit: '250 ml Bottle',
    options: ['250 ml'],
    shortDesc: 'Gently cleanses sensitive scalps while preserving natural moisture balance.',
    fullDesc: 'pH-balanced medical shampoo suitable for frequent washing and dry or treated hair.',
  },
  'prd-skin-sunscreen': {
    name: 'Hydra-Defense SPF50+ Sensitive Skin Sunscreen',
    unit: '50 ml Tube',
    options: ['Invisible Fluid', 'Light Tint'],
    shortDesc: 'Broad-spectrum UVA/UVB protection with zero white cast or pore congestion.',
    fullDesc: 'Enriched with hyaluronic acid and niacinamide to hydrate while protecting skin against pigmentation.',
    offerLabelAr: 'Sun Care -20%',
  },
  'prd-skin-cleanser': {
    name: 'Ceramide & Hyaluronic Hydrating Facial Cleanser',
    unit: '200 ml Bottle',
    options: ['200 ml'],
    shortDesc: 'Deeply cleanses without stripping while reinforcing the skin moisture barrier.',
    fullDesc: 'Soap-free, fragrance-free formula ideal for dry and sensitive skin.',
  },
  'prd-oral-kit': {
    name: 'Sensitive Enamel & Gum Oral Care Kit',
    unit: '2-Piece Set',
    options: ['Mild Mint'],
    shortDesc: 'Dual enamel protection toothpaste with alcohol-free soothing mouthwash.',
    fullDesc: 'Combines enamel repair and gentle antiseptic mouthwash for everyday oral wellness.',
    offerLabelAr: 'Oral Care Bundle',
  },
  'prd-bcomplex-neuro': {
    name: 'Neuro B-Complex Nerve Support Supplement',
    unit: 'Bottle (60 Capsules)',
    options: ['60 Capsules'],
    shortDesc: 'Balanced B1 / B6 / B12 formula supporting peripheral nerve nourishment.',
    fullDesc: 'Dietary supplement supporting peripheral nerve function, used as advised by your physician or pharmacist (demo product).',
  },
  'prd-seniors-multi': {
    name: 'Seniors 50+ Complete Vitality Multivitamin',
    unit: 'Bottle (60 Tablets)',
    options: ['60 Tablets', '90 Tablets'],
    shortDesc: 'Balanced Calcium, Vitamin D3, B12, Zinc, and Lutein for active aging.',
    fullDesc: 'Specially calibrated for adults over 50 to support bone density, cognitive clarity, and daily energy.',
    offerLabelAr: 'Seniors Offer -20%',
  },
  'prd-kids-syrup': {
    name: 'Kids Immunity & Growth Multivitamin Syrup',
    unit: '150 ml Bottle',
    options: ['Natural Orange', 'Strawberry'],
    shortDesc: 'Supports children immunity, healthy bones, and appetite with kid-friendly taste.',
    fullDesc: 'Dye-free liquid multivitamin formulated with Zinc, Vitamin C, and Vitamin D3.',
  },
  'prd-women-complete': {
    name: "Women's Health Iron, Folate & Biotin Complex",
    unit: 'Bottle (60 Capsules)',
    options: ['60 Capsules'],
    shortDesc: 'Supports iron levels, daily energy, hair strength, and bone health for women.',
    fullDesc: 'Gentle-on-stomach formula combining chelated iron, folic acid, calcium, and biotin.',
    offerLabelAr: "Women's Wellness Deal",
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
  'prd-baby-formula': {
    name: 'Prebiotic Follow-On Infant Milk Formula (Stage 2)',
    unit: '400g Tin',
    options: ['Stage 1 (0-6m)', 'Stage 2 (6-12m)', 'Stage 3 (1-3y)'],
    shortDesc: 'Easy-to-digest formula fortified with iron, DHA, and prebiotics.',
    fullDesc: 'Balanced follow-on infant nutrition supporting immune and cognitive development.',
  },
  'prd-baby-cereal': {
    name: 'Organic Oat & Iron-Fortified Baby Cereal (6m+)',
    unit: '250g Pack',
    options: ['Oat & Milk', 'Wheat & Apple'],
    shortDesc: 'No-added-sugar wholesome complementary cereal gentle on baby digestion.',
    fullDesc: 'Provides essential iron, Vitamin B1, and Vitamin C for the weaning stage.',
    offerLabelAr: 'Save 19%',
  },
  'prd-baby-lotion-kit': {
    name: 'Mother & Baby Gentle 3-Piece Skin Care Set',
    unit: '3-Piece Set',
    options: ['Chamomile Sensitive Set'],
    shortDesc: 'Paraben-free soothing lotion, tear-free wash, and protective barrier cream.',
    fullDesc: 'Dermatologist-tested gentle kit designed for delicate infant skin and everyday maternal care.',
    offerLabelAr: '20% Off Set',
  },
  'prd-lumbar-brace': {
    name: 'Dual-Strap Ergonomic Lumbar Support Brace',
    unit: 'Piece',
    options: ['Size M', 'Size L', 'Size XL'],
    shortDesc: 'Breathable mesh lower-back brace with dual tension straps for lumbar stability.',
    fullDesc: 'Designed to provide gentle lower-back stabilization and reduce muscular strain during standing or walking during recovery (demo product).',
    offerLabelAr: 'Rehab Offer',
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
    offerLabelAr: 'Save 5,500 YER',
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

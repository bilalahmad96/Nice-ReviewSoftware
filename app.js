// NICE Computer Education - School of Coding, Yavatmal
// Short & Executive Google Review Assistant (3-5 Lines + Direct 5-Star + Voice Over)

const DEFAULT_GOOGLE_REVIEW_URL = 'https://g.page/r/CTKrEmKbJP-dEBM/review';
const DEFAULT_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/3Vf5Vw4qnXcjUoPy5';

const COURSE_CATALOG = {
  coding: {
    'Programming & App Development': [
      'C Programming',
      'C++ Programming',
      'Core Java Programming',
      'Advanced Java Programming',
      'Python Programming',
      'Android App Development'
    ],
    'Web & .NET Technologies': [
      'Basic Web Designing',
      'Advanced Web Designing',
      'JavaScript',
      'PHP Programming',
      'VB.NET',
      'C#.NET',
      'ASP.NET'
    ],
    'Diploma Programs': [
      'Diploma in Information Technology'
    ]
  },
  professional: {
    'Office & Hardware Skills': [
      'Hardware & Trouble Shooting',
      'MS Office & Internet'
    ]
  }
};

// Application State
const state = {
  rating: 5,
  mode: 'ai', // 'ai' (default) or 'direct'
  stream: 'coding',
  course: 'C Programming',
  experience: 'Excellent', // 'Excellent' | 'Good' | 'Highly Impressed'
  highlights: ['practical_labs', 'expert_faculty'],
  language: 'en', // 'en' | 'mr' | 'hi'
  photoDataUrl: null,
  photoFileName: '',
  generatedReview: '',
  reviewIndex: 0
};

// Calibrated 3-5 Line Review Templates (No Special Thanks line)
const reviews3to5Lines = {
  en: {
    coding: [
      "{expLead} learning {course} at NICE Computer Education, Yavatmal. {labSentence} {facultySentence} Definitely recommend this institute to students looking for practical coding training.",
      "I recently completed {course} at NICE Computer Education – School of Coding, Yavatmal. {facultySentence} {labSentence} Truly satisfied with the quality of teaching and supportive environment.",
      "{expLead} training in {course} at NICE Computer Education, Yavatmal. The instructors break down logic into simple steps and focus on real coding practice rather than just theory. Great place to build strong programming skills!"
    ],
    professional: [
      "{expLead} learning {course} at NICE Computer Education, Yavatmal. {labSentence} {facultySentence} The practical job-oriented approach gave me great confidence for office work.",
      "Completed my {course} course at NICE Computer Education in Wadgaon, Yavatmal. {facultySentence} {labSentence} Very satisfied with the disciplined training and helpful classroom environment.",
      "{expLead} experience completing {course} at NICE Computer Education, Yavatmal. Every module is taught with real-world practical examples and plenty of computer practice. Highly recommend it to students and job seekers!"
    ]
  },
  mr: {
    coding: [
      "नाईस कॉम्प्युटर एज्युकेशन (स्कूल ऑफ कोडिंग), यवतमाळ येथे {course} शिकण्याचा अनुभव {expMr} राहिला. {labMr} {facultyMr} यवतमाळमधील विद्यार्थ्यांसाठी ही सर्वोत्तम संस्था आहे.",
      "मी नाईस कॉम्प्युटर एज्युकेशन, यवतमाळ येथून {course} चे प्रशिक्षण पूर्ण केले. {facultyMr} {labMr} प्रॅक्टिकलवर भर दिल्यामुळे कोडिंगमधील आत्मविश्वास खूप वाढला.",
      "यवतमाळमध्ये {course} शिकण्यासाठी नाईस कॉम्प्युटर एज्युकेशन ही अतिशय उत्तम संस्था आहे. प्रत्येक संकल्पना सोप्या भाषेत समजावून सांगून लॅबमध्ये भरपूर सराव करून घेतला जातो. नक्की प्रवेश घ्या!"
    ],
    professional: [
      "नाईस कॉम्प्युटर एज्युकेशन, यवतमाळ येथून {course} पूर्ण करण्याचा अनुभव {expMr} ठरला. {labMr} {facultyMr} ऑफिस कामासाठी हे प्रशिक्षण खूप उपयुक्त आहे.",
      "मी नाईस कॉम्प्युटर एज्युकेशनमध्ये {course} चे प्रात्यक्षिक प्रशिक्षण घेतले. {facultyMr} {labMr} दर्जेदार शिक्षणामुळे कामाचा आत्मविश्वास वाढला. सर्वांना शिफारस करतो.",
      "व्यावसायिक कॉम्प्युटर कोर्सेससाठी यवतमाळमधील सर्वोत्तम संस्था! {course} दरम्यान प्रत्यक्ष कामाचे उदाहरण आणि भरपूर लॅब प्रॅक्टिस मिळाली. खूप समाधानकारक अनुभव!"
    ]
  },
  hi: {
    coding: [
      "नाइस कंप्यूटर एजुकेशन – स्कूल ऑफ कोडिंग (यवतमाल) में {course} सीखने का मेरा अनुभव {expHi} रहा। {labHi} {facultyHi} यवतमाल के सभी छात्रों को 100% रेकमेंडेड!",
      "मैंने नाइस कंप्यूटर एजुकेशन, यवतमाल से {course} का कोर्स पूरा किया है। {facultyHi} {labHi} प्रैक्टिकल ट्रेनिंग की वजह से कोडिंग की समझ बहुत मजबूत हुई।",
      "यवतमाल में {course} सीखने के लिए नाइस कंप्यूटर एजुकेशन सबसे बेहतरीन संस्थान है। यहाँ हर टॉपिक को बेसिक से प्रैक्टिकल के साथ आसान तरीके से सिखाया जाता है। बहुत बढ़िया अनुभव!"
    ],
    professional: [
      "नाइस कंप्यूटर एजुकेशन, यवतमाल से {course} पूरा करने का मेरा अनुभव {expHi} रहा। {labHi} {facultyHi} जॉब की तैयारी करने वालों के लिए यह एक उत्तम संस्थान है।",
      "मैंने यहाँ {course} की प्रैक्टिकल ट्रेनिंग ली और बहुत उपयोगी स्किल्स सीखीं। {facultyHi} {labHi} यहाँ की ट्रेनिंग क्वालिटी और माहौल बहुत ही शानदार है।",
      "यवतमाल में प्रोफेशनल कंप्यूटर कोर्सेज के लिए बेस्ट इंस्टिट्यूट! {course} के दौरान रियल-लाइफ एग्जांपल्स और भरपूर कंप्यूटर लैब प्रैक्टिस मिली। हाईली रेकमेंडेड!"
    ]
  }
};

// DOM References
const starContainer = document.getElementById('starContainer');
const ratingLabel = document.getElementById('ratingLabel');
const ratingHelp = document.getElementById('ratingHelp');
const reviewModeSelector = document.getElementById('reviewModeSelector');
const modeAiBtn = document.getElementById('modeAiBtn');
const modeDirectBtn = document.getElementById('modeDirectBtn');

const grievanceContainer = document.getElementById('grievanceContainer');
const positiveFlowContainer = document.getElementById('positiveFlowContainer');
const directReviewContainer = document.getElementById('directReviewContainer');
const aiBuilderContainer = document.getElementById('aiBuilderContainer');
const grievanceText = document.getElementById('grievanceText');
const submitGrievanceBtn = document.getElementById('submitGrievanceBtn');

const allCoursesSelect = document.getElementById('allCoursesSelect');
const directOpenGoogleBtn = document.getElementById('directOpenGoogleBtn');

const cameraInput = document.getElementById('cameraInput');
const galleryInput = document.getElementById('galleryInput');
const photoPreviewBox = document.getElementById('photoPreviewBox');
const uploadedPhotoPreview = document.getElementById('uploadedPhotoPreview');
const removePhotoBtn = document.getElementById('removePhotoBtn');

const highlightsList = document.getElementById('highlightsList');

const reviewText = document.getElementById('reviewText');
const regenerateBtn = document.getElementById('regenerateBtn');
const refreshReviewActionBtn = document.getElementById('refreshReviewActionBtn');
const copyAndOpenBtn = document.getElementById('copyAndOpenBtn');

// Voice Over DOM References
const voiceReviewBtn = document.getElementById('voiceReviewBtn');
const voiceBtnLabel = document.getElementById('voiceBtnLabel');
const voiceStatusBar = document.getElementById('voiceStatusBar');
const voiceStatusText = document.getElementById('voiceStatusText');
const stopVoiceBtn = document.getElementById('stopVoiceBtn');
const voiceActionModal = document.getElementById('voiceActionModal');
const voiceLangSelector = document.getElementById('voiceLangSelector');
const voiceReplaceBtn = document.getElementById('voiceReplaceBtn');
const voiceAppendBtn = document.getElementById('voiceAppendBtn');
const voiceCancelBtn = document.getElementById('voiceCancelBtn');

const successModal = document.getElementById('successModal');
const modalOpenGoogleBtn = document.getElementById('modalOpenGoogleBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

// Toast helper
let toastTimer = null;
function showToast(msg) {
  toastMessage.textContent = msg;
  toastNotification.classList.remove('opacity-0', 'pointer-events-none');
  toastNotification.classList.add('opacity-100');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotification.classList.remove('opacity-100');
    toastNotification.classList.add('opacity-0', 'pointer-events-none');
  }, 2800);
}

// Switch Mode: 'ai' (default) vs 'direct'
function setMode(mode) {
  state.mode = mode;
  if (mode === 'ai') {
    modeAiBtn.classList.add('active');
    modeDirectBtn.classList.remove('active');
    aiBuilderContainer.classList.remove('hidden');
    directReviewContainer.classList.add('hidden');
  } else {
    modeDirectBtn.classList.add('active');
    modeAiBtn.classList.remove('active');
    directReviewContainer.classList.remove('hidden');
    aiBuilderContainer.classList.add('hidden');
    if (isRecording) stopVoiceRecognition();
  }
}

// Set Star Rating
function setRating(val) {
  state.rating = val;
  const stars = starContainer.querySelectorAll('.star-btn');
  stars.forEach((btn) => {
    const starVal = parseInt(btn.dataset.value, 10);
    btn.classList.toggle('active', starVal <= val);
  });

  const ratingCaptions = {
    5: '5 Star Rating Selected ⭐',
    4: '4 Star Rating Selected ⭐',
    3: '3 Star Rating Selected',
    2: '2 Star Rating Selected',
    1: '1 Star Rating Selected'
  };
  ratingLabel.textContent = ratingCaptions[val];

  if (val >= 4) {
    ratingHelp.textContent = 'Choose how you would like to share your review on Google:';
    reviewModeSelector.classList.remove('hidden');
    grievanceContainer.classList.add('hidden');
    positiveFlowContainer.classList.remove('hidden');
    setMode(state.mode);
    generateCalibratedReview();
  } else {
    ratingHelp.textContent = 'We value your honest feedback. Please let our Director know directly.';
    reviewModeSelector.classList.add('hidden');
    grievanceContainer.classList.remove('hidden');
    positiveFlowContainer.classList.add('hidden');
    if (isRecording) stopVoiceRecognition();
  }
}

// Populate Direct Course Dropdown
function populateAllCoursesSelect() {
  if (!allCoursesSelect) return;
  let html = '<option value="" disabled>-- Select Your Course --</option>';
  for (const stream in COURSE_CATALOG) {
    const streamName = stream === 'coding' ? '💻 Coding & Programming' : '📊 Professional & IT Skills';
    html += `<optgroup label="${streamName}">`;
    for (const track in COURSE_CATALOG[stream]) {
      COURSE_CATALOG[stream][track].forEach((courseName) => {
        html += `<option value="${courseName}">${courseName}</option>`;
      });
    }
    html += '</optgroup>';
  }
  allCoursesSelect.innerHTML = html;
  allCoursesSelect.value = state.course;
}

function findStreamForCourse(courseName) {
  for (const stream in COURSE_CATALOG) {
    for (const track in COURSE_CATALOG[stream]) {
      if (COURSE_CATALOG[stream][track].includes(courseName)) {
        return stream;
      }
    }
  }
  return 'coding';
}

// Build 3-5 Line Review Text Reflecting Course, Experience & Highlights
function generateCalibratedReview() {
  const lang = state.language;
  const stream = state.stream;
  const pool = reviews3to5Lines[lang][stream] || reviews3to5Lines.en.coding;
  let template = pool[state.reviewIndex % pool.length];

  const hasLabs = state.highlights.includes('practical_labs');
  const hasFaculty = state.highlights.includes('expert_faculty');

  const expMapEn = {
    'Excellent': 'Had an excellent experience',
    'Good': 'Had a good and helpful experience',
    'Highly Impressed': 'Highly impressed with my experience'
  };
  const expMapMr = {
    'Excellent': 'अतिशय उत्कृष्ट',
    'Good': 'खूप चांगला आणि उपयुक्त',
    'Highly Impressed': 'अत्यंत प्रभावी आणि समाधानकारक'
  };
  const expMapHi = {
    'Excellent': 'बेहद शानदार',
    'Good': 'बहुत अच्छा और मददगार',
    'Highly Impressed': 'बहुत ही प्रभावशाली'
  };

  const labSentenceEn = hasLabs
    ? 'Hands-on computer lab practicals made every topic easy to grasp.'
    : 'The daily classroom training is very structured and practical.';
  const facultySentenceEn = hasFaculty
    ? 'The supportive and expert faculty clear every doubt patiently.'
    : 'The learning atmosphere is friendly and focused on real skills.';

  const labMr = hasLabs
    ? 'कॉम्प्युटर लॅबमधील भरपूर प्रॅक्टिकल सरावामुळे प्रत्येक विषय सोपा झाला.'
    : 'दररोजच्या क्लासमध्ये व्यावहारिक ज्ञानावर विशेष भर दिला जातो.';
  const facultyMr = hasFaculty
    ? 'अनुभवी व सहकार्यशील शिक्षक प्रत्येक शंका शांतपणे समजावून सांगतात.'
    : 'येथील अभ्यासपूर्ण वातावरणामुळे शिकणे खूप सोपे होते.';

  const labHi = hasLabs
    ? 'कंप्यूटर लैब में हैंड्स-ऑन प्रैक्टिकल की वजह से हर टॉपिक आसानी से समझ आया।'
    : 'क्लासरूम ट्रेनिंग पूरी तरह प्रैक्टिकल और आसान तरीके से कराई जाती है।';
  const facultyHi = hasFaculty
    ? 'सहयोगी और अनुभवी शिक्षक हर डाउट को बड़े धैर्य से क्लियर करते हैं।'
    : 'यहाँ का सकारात्मक माहौल सीखने के लिए बहुत बढ़िया है।';

  let review = template
    .replace(/\{course\}/g, state.course)
    .replace(/\{expLead\}/g, expMapEn[state.experience] || expMapEn.Excellent)
    .replace(/\{expMr\}/g, expMapMr[state.experience] || expMapMr.Excellent)
    .replace(/\{expHi\}/g, expMapHi[state.experience] || expMapHi.Excellent)
    .replace(/\{labSentence\}/g, labSentenceEn)
    .replace(/\{facultySentence\}/g, facultySentenceEn)
    .replace(/\{labMr\}/g, labMr)
    .replace(/\{facultyMr\}/g, facultyMr)
    .replace(/\{labHi\}/g, labHi)
    .replace(/\{facultyHi\}/g, facultyHi);

  review = review.replace(/\s+/g, ' ').trim();
  state.generatedReview = review;
  reviewText.value = review;
}

// Record Review to LocalStorage for Admin Dashboard
function recordReviewSubmission(status) {
  const reviews = JSON.parse(localStorage.getItem('nice_reviews_db') || '[]');
  let text = '';
  if (status === 'direct_google') {
    text = `Direct ${state.rating}-Star Google Rating (No written text)`;
  } else if (state.rating >= 4) {
    text = reviewText.value.trim() || state.generatedReview;
  } else {
    text = grievanceText.value.trim() || 'Private Feedback';
  }

  const newEntry = {
    id: 'REV-' + Date.now().toString(36).toUpperCase(),
    timestamp: new Date().toISOString(),
    name: 'Student Reviewer',
    stream: status === 'direct_google' ? 'direct-5★' : state.stream,
    course: status === 'direct_google' ? 'Quick 5-Star Rating' : state.course,
    rating: state.rating,
    status: status,
    reviewText: text,
    hasPhoto: status === 'direct_google' ? false : !!state.photoDataUrl
  };
  reviews.unshift(newEntry);
  localStorage.setItem('nice_reviews_db', JSON.stringify(reviews));
}

// Photo Upload Handler (Camera & Gallery)
function setupPhotoUpload() {
  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      state.photoDataUrl = e.target.result;
      state.photoFileName = file.name;
      uploadedPhotoPreview.src = state.photoDataUrl;
      photoPreviewBox.classList.remove('hidden');
      showToast('Photo attached! 📸 Ready for Google.');
    };
    reader.readAsDataURL(file);
  }

  cameraInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  galleryInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

  removePhotoBtn.addEventListener('click', () => {
    state.photoDataUrl = null;
    state.photoFileName = '';
    cameraInput.value = '';
    galleryInput.value = '';
    uploadedPhotoPreview.src = '';
    photoPreviewBox.classList.add('hidden');
    showToast('Photo removed.');
  });
}

// ==========================================
// VOICE OVER (SPEECH-TO-TEXT) ENGINE
// ==========================================
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const VOICE_LOCALES = {
  en: { code: 'en-IN', label: 'English' },
  mr: { code: 'mr-IN', label: 'मराठी (Marathi)' },
  hi: { code: 'hi-IN', label: 'हिंदी (Hindi)' }
};

let recognition = null;
let isRecording = false;
let voiceBaseText = '';
let committedTranscript = '';
let selectedVoiceLang = 'en';

function syncLanguageUI(langCode, regenerateIfEmpty = false) {
  state.language = langCode;
  selectedVoiceLang = langCode;
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === langCode);
  });
  document.querySelectorAll('.voice-lang-chip').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === langCode);
  });
  if (regenerateIfEmpty) {
    generateCalibratedReview();
  }
}

function startVoiceRecognition(actionMode) {
  if (!SpeechRecognitionAPI) {
    showToast('Voice typing requires Chrome or Edge browser.');
    return;
  }

  if (isRecording && recognition) {
    recognition.stop();
  }

  if (actionMode === 'replace') {
    reviewText.value = '';
    voiceBaseText = '';
  } else {
    voiceBaseText = reviewText.value.trim();
  }
  committedTranscript = '';

  const langMeta = VOICE_LOCALES[selectedVoiceLang] || VOICE_LOCALES.en;
  recognition = new SpeechRecognitionAPI();
  recognition.lang = langMeta.code;
  recognition.continuous = true;
  recognition.interimResults = true;

  isRecording = true;
  voiceReviewBtn.classList.add('voice-btn-recording');
  voiceBtnLabel.textContent = 'Listening...';
  voiceStatusBar.classList.remove('hidden');
  voiceStatusText.textContent = `Listening in ${langMeta.label}... Speak your review clearly`;

  recognition.onresult = (event) => {
    let interim = '';
    let newFinals = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        newFinals += piece + ' ';
      } else {
        interim += piece;
      }
    }
    if (newFinals) {
      committedTranscript = (committedTranscript + ' ' + newFinals).replace(/\s+/g, ' ').trim();
    }
    const spokenSoFar = [committedTranscript, interim.trim()].filter(Boolean).join(' ');
    const combined = [voiceBaseText, spokenSoFar].filter(Boolean).join(' ');
    reviewText.value = combined;
  };

  recognition.onerror = (event) => {
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      showToast('Microphone permission denied. Please allow mic access.');
    } else if (event.error === 'no-speech') {
      showToast('No speech detected. Try speaking closer to the mic.');
    } else if (event.error !== 'aborted') {
      showToast('Voice recognition stopped (' + event.error + ').');
    }
    stopVoiceRecognition();
  };

  recognition.onend = () => {
    stopVoiceRecognition(true);
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn('SpeechRecognition start failed:', err);
    stopVoiceRecognition();
  }
}

function stopVoiceRecognition(fromEndEvent = false) {
  isRecording = false;
  voiceReviewBtn.classList.remove('voice-btn-recording');
  voiceBtnLabel.textContent = 'Voice Over';
  voiceStatusBar.classList.add('hidden');
  if (recognition && !fromEndEvent) {
    try {
      recognition.stop();
    } catch (e) {
      // ignore if already stopped
    }
  }
  recognition = null;
}

function setupVoiceOver() {
  voiceReviewBtn.addEventListener('click', () => {
    if (isRecording) {
      stopVoiceRecognition();
      showToast('Voice recording stopped.');
      return;
    }

    if (!SpeechRecognitionAPI) {
      showToast('Voice Over is supported in Chrome / Edge / Android browsers.');
      return;
    }

    selectedVoiceLang = state.language;
    document.querySelectorAll('.voice-lang-chip').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === selectedVoiceLang);
    });

    if (reviewText.value.trim().length > 0) {
      voiceActionModal.classList.remove('hidden');
    } else {
      startVoiceRecognition('replace');
    }
  });

  voiceLangSelector.addEventListener('click', (e) => {
    const chip = e.target.closest('.voice-lang-chip');
    if (!chip) return;
    const langCode = chip.dataset.lang;
    syncLanguageUI(langCode, false);
  });

  voiceReplaceBtn.addEventListener('click', () => {
    voiceActionModal.classList.add('hidden');
    startVoiceRecognition('replace');
  });

  voiceAppendBtn.addEventListener('click', () => {
    voiceActionModal.classList.add('hidden');
    startVoiceRecognition('append');
  });

  voiceCancelBtn.addEventListener('click', () => {
    voiceActionModal.classList.add('hidden');
  });

  voiceActionModal.addEventListener('click', (e) => {
    if (e.target === voiceActionModal) voiceActionModal.classList.add('hidden');
  });

  stopVoiceBtn.addEventListener('click', () => {
    stopVoiceRecognition();
    showToast('Voice review captured! 🎤');
  });
}

// ==========================================
// INITIALIZE APP
// ==========================================
function initializeApp() {
  // Star Clicks
  starContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.star-btn');
    if (btn) {
      setRating(parseInt(btn.dataset.value, 10));
    }
  });

  // 2 Mode Switcher (AI Generator vs Direct 5-Star)
  modeAiBtn.addEventListener('click', () => setMode('ai'));
  modeDirectBtn.addEventListener('click', () => setMode('direct'));

  // Direct 5-Star Google Action
  directOpenGoogleBtn.addEventListener('click', () => {
    recordReviewSubmission('direct_google');
    showToast('Opening Google Reviews for 5★ rating! ⭐');
    window.open(DEFAULT_GOOGLE_REVIEW_URL, '_blank');
  });

  // Grievance Submit Action
  if (submitGrievanceBtn) {
    submitGrievanceBtn.addEventListener('click', () => {
      const text = grievanceText.value.trim();
      if (!text) {
        showToast('Please write your feedback before submitting.');
        grievanceText.focus();
        return;
      }
      recordReviewSubmission('grievance_caught');
      grievanceText.value = '';
      showToast('Feedback sent privately to Director! Thank you.');
    });
  }

  // Direct Course Select Dropdown
  allCoursesSelect.addEventListener('change', (e) => {
    const selectedCourse = e.target.value;
    if (!selectedCourse) return;
    state.course = selectedCourse;
    state.stream = findStreamForCourse(selectedCourse);
    generateCalibratedReview();
  });

  // Experience Chips
  document.querySelectorAll('.exp-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.exp-chip').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.experience = btn.dataset.exp;
      generateCalibratedReview();
    });
  });

  // Highlight Chips (2 compact toggles)
  highlightsList.addEventListener('click', (e) => {
    const chip = e.target.closest('.highlight-chip');
    if (!chip) return;
    chip.classList.toggle('active');
    state.highlights = Array.from(highlightsList.querySelectorAll('.highlight-chip.active')).map(
      (c) => c.dataset.highlight
    );
    generateCalibratedReview();
  });

  // Language Chips (English / Marathi / Hindi)
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      syncLanguageUI(btn.dataset.lang, true);
      showToast(`Language switched to ${btn.dataset.lang.toUpperCase()}!`);
    });
  });

  // Regenerate / Refresh Button
  function triggerRefresh() {
    if (isRecording) stopVoiceRecognition();
    state.reviewIndex++;
    generateCalibratedReview();
    showToast('Generated new review variation! 🔄');
  }
  regenerateBtn.addEventListener('click', triggerRefresh);
  refreshReviewActionBtn.addEventListener('click', triggerRefresh);

  // 2-in-1 Action Button: Copy Review & Open Google
  copyAndOpenBtn.addEventListener('click', async () => {
    if (isRecording) stopVoiceRecognition();
    const textToCopy = reviewText.value.trim();
    if (!textToCopy) {
      showToast('Please generate or speak a review first.');
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        reviewText.select();
        document.execCommand('copy');
      }
      showToast('Review copied to clipboard! 📋');
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }

    recordReviewSubmission('copied_google');
    successModal.classList.remove('hidden');
  });

  // Modal Actions
  modalOpenGoogleBtn.addEventListener('click', () => {
    window.open(DEFAULT_GOOGLE_REVIEW_URL, '_blank');
  });
  modalCloseBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
  });
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) successModal.classList.add('hidden');
  });

  // Secret 5-Tap on Brand Logo for Admin Portal
  let logoTaps = 0;
  let logoTapTimer = null;
  const brandLogo = document.getElementById('brandLogoClickable');
  if (brandLogo) {
    brandLogo.addEventListener('click', () => {
      logoTaps++;
      clearTimeout(logoTapTimer);
      if (logoTaps >= 5) {
        logoTaps = 0;
        showToast('🔓 Opening Admin Portal...');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 600);
      }
      logoTapTimer = setTimeout(() => {
        logoTaps = 0;
      }, 2000);
    });
  }

  setupPhotoUpload();
  setupVoiceOver();
  populateAllCoursesSelect();
  setMode('ai'); // Default to AI Generator on page open
  setRating(5);  // Default 5 Stars
}

document.addEventListener('DOMContentLoaded', initializeApp);

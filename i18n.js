/**
 * MosqAware — i18n Multi-Language Support
 * Supported Languages: English (en), Hindi (hi), Odia (or)
 */

const TRANSLATIONS = {
  en: {
    appName: 'MosqAware',
    appSubtitle: 'Odisha Dengue Prediction & Early Warning System',
    nav: {
      dashboard: 'Dashboard',
      prediction: 'AI Prediction',
      analytics: 'Analytics',
      breeding: 'Breeding Index',
      awareness: 'Public Awareness',
      reports: 'Reports',
    },
    dashboard: {
      title: 'Dengue Surveillance Dashboard',
      totalCases: 'Total Cases (2025)',
      activeCases: 'Active Outbreaks',
      tpr: 'Test Positivity Rate',
      riskLevel: 'State Risk Level',
      weeklyTrend: 'Weekly Case Trend',
      weatherCorr: 'Weather Correlation',
      districtRank: 'District Risk Ranking',
      lastUpdated: 'Last Updated',
      viewDetails: 'View Details',
      allDistricts: 'All Districts',
    },
    prediction: {
      title: 'AI Prediction Engine',
      subtitle: '2-5 Month Dengue Outbreak Forecasting',
      modelAccuracy: 'Model Accuracy',
      leadTime: 'Prediction Lead Time',
      confidence: 'Confidence Interval',
      shapTitle: 'SHAP Feature Importance',
      forecastTitle: 'Monthly Case Forecast',
      alertLevel: 'Current Alert Level',
    },
    riskLevels: {
      LOW: 'LOW RISK',
      MODERATE: 'MODERATE RISK',
      HIGH: 'HIGH RISK',
      CRITICAL: 'CRITICAL RISK',
    },
    alerts: {
      GREEN: '🟢 Normal — Routine Surveillance',
      YELLOW: '🟡 Watch — Increase Surveillance',
      ORANGE: '🟠 Alert — Activate Response',
      RED: '🔴 Emergency — Full Outbreak Response',
    },
    awareness: {
      title: 'Public Awareness Portal',
      symptoms: 'Know the Symptoms',
      prevention: 'Prevention Tips',
      testing: 'Testing Centers',
      emergency: 'Emergency Contacts',
    },
    symptoms: [
      'High fever (102–104°F) lasting 2–7 days',
      'Severe headache and pain behind eyes',
      'Joint and muscle pain (Breakbone fever)',
      'Skin rash appearing 2–5 days after fever',
      'Mild bleeding — nose, gums',
      'Nausea, vomiting, loss of appetite',
    ],
    prevention: [
      'Empty and clean water containers weekly',
      'Use mosquito repellent (DEET-based)',
      'Sleep under mosquito nets',
      'Wear full-sleeved clothing',
      'Cover overhead tanks and water drums',
      'Participate in dry-day drives',
    ],
    emergencyContacts: {
      stateHelpline: '104',
      bmc: '0674-2392516',
      nhm: '1800-345-6977',
      ambulance: '108',
    },
  },

  hi: {
    appName: 'MosqAware',
    appSubtitle: 'ओडिशा डेंगू पूर्वानुमान एवं प्रारंभिक चेतावनी प्रणाली',
    nav: {
      dashboard: 'डैशबोर्ड',
      prediction: 'AI पूर्वानुमान',
      analytics: 'विश्लेषण',
      breeding: 'प्रजनन सूचकांक',
      awareness: 'जन जागरूकता',
      reports: 'रिपोर्ट',
    },
    dashboard: {
      title: 'डेंगू निगरानी डैशबोर्ड',
      totalCases: 'कुल मामले (2025)',
      activeCases: 'सक्रिय प्रकोप',
      tpr: 'परीक्षण सकारात्मकता दर',
      riskLevel: 'राज्य जोखिम स्तर',
      weeklyTrend: 'साप्ताहिक मामले का रुझान',
      weatherCorr: 'मौसम सहसंबंध',
      districtRank: 'जिला जोखिम रैंकिंग',
      lastUpdated: 'अंतिम अपडेट',
      viewDetails: 'विवरण देखें',
      allDistricts: 'सभी जिले',
    },
    prediction: {
      title: 'AI पूर्वानुमान इंजन',
      subtitle: '2-5 माह डेंगू प्रकोप पूर्वानुमान',
      modelAccuracy: 'मॉडल सटीकता',
      leadTime: 'पूर्वानुमान अग्रता समय',
      confidence: 'विश्वास अंतराल',
      shapTitle: 'SHAP विशेषता महत्व',
      forecastTitle: 'मासिक मामले का पूर्वानुमान',
      alertLevel: 'वर्तमान अलर्ट स्तर',
    },
    riskLevels: {
      LOW: 'कम जोखिम',
      MODERATE: 'मध्यम जोखिम',
      HIGH: 'उच्च जोखिम',
      CRITICAL: 'अत्यधिक जोखिम',
    },
    alerts: {
      GREEN: '🟢 सामान्य — नियमित निगरानी',
      YELLOW: '🟡 सतर्क — निगरानी बढ़ाएं',
      ORANGE: '🟠 चेतावनी — प्रतिक्रिया प्रोटोकॉल सक्रिय करें',
      RED: '🔴 आपातकाल — पूर्ण प्रकोप प्रतिक्रिया',
    },
    awareness: {
      title: 'जन जागरूकता पोर्टल',
      symptoms: 'लक्षण जानें',
      prevention: 'बचाव उपाय',
      testing: 'परीक्षण केंद्र',
      emergency: 'आपातकालीन संपर्क',
    },
    symptoms: [
      'तेज बुखार (102-104°F) 2-7 दिन तक',
      'तेज सिरदर्द और आंखों के पीछे दर्द',
      'जोड़ों और मांसपेशियों में दर्द',
      'बुखार के 2-5 दिन बाद त्वचा पर दाने',
      'हल्का रक्तस्राव — नाक, मसूड़े',
      'मतली, उल्टी, भूख न लगना',
    ],
    prevention: [
      'हर सप्ताह पानी के बर्तन साफ करें',
      'मच्छर भगाने वाली क्रीम का उपयोग करें',
      'मच्छरदानी के नीचे सोएं',
      'पूरी आस्तीन के कपड़े पहनें',
      'टंकियां और पानी के ड्रम ढककर रखें',
      'ड्राई-डे अभियान में भाग लें',
    ],
    emergencyContacts: {
      stateHelpline: '104',
      bmc: '0674-2392516',
      nhm: '1800-345-6977',
      ambulance: '108',
    },
  },

  or: {
    appName: 'MosqAware',
    appSubtitle: 'ଓଡ଼ିଶା ଡେଙ୍ଗୁ ପୂର୍ବାନୁମାନ ଓ ଆଗୁଆ ସତର୍କ ବ୍ୟବସ୍ଥା',
    nav: {
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
      prediction: 'AI ପୂର୍ବାନୁମାନ',
      analytics: 'ବିଶ୍ଳେଷଣ',
      breeding: 'ପ୍ରଜନନ ସୂଚକ',
      awareness: 'ସାର୍ବଜନୀନ ସଚେତନତା',
      reports: 'ରିପୋର୍ଟ',
    },
    dashboard: {
      title: 'ଡେଙ୍ଗୁ ନଜରଦାରି ଡ୍ୟାସବୋର୍ଡ',
      totalCases: 'ମୋଟ ମାମଲା (2025)',
      activeCases: 'ସକ୍ରିୟ ପ୍ରାଦୁର୍ଭାବ',
      tpr: 'ପରୀକ୍ଷା ସକାରାତ୍ମକ ହାର',
      riskLevel: 'ରାଜ୍ୟ ଆଶଙ୍କା ସ୍ତର',
      weeklyTrend: 'ସାପ୍ତାହିକ ଧାରା',
      weatherCorr: 'ପାଣିପାଗ ସଂଯୋଗ',
      districtRank: 'ଜିଲ୍ଲା ଆଶଙ୍କା ଶ୍ରେଣୀ',
      lastUpdated: 'ଶେଷ ଅପଡ଼େଟ',
      viewDetails: 'ବିବରଣୀ ଦେଖନ୍ତୁ',
      allDistricts: 'ସମସ୍ତ ଜିଲ୍ଲା',
    },
    prediction: {
      title: 'AI ପୂର୍ବାନୁମାନ ଇଞ୍ଜିନ',
      subtitle: '2-5 ମାସ ଡେଙ୍ଗୁ ପ୍ରାଦୁର୍ଭାବ ପୂର୍ବାନୁମାନ',
      modelAccuracy: 'ମଡେଲ ଠିକ୍‍ତ୍ଵ',
      leadTime: 'ଆଗୁଆ ଚେତାବନୀ ସମୟ',
      confidence: 'ଆତ୍ମବିଶ୍ଵାସ ବ୍ୟବଧାନ',
      shapTitle: 'SHAP ଗୁଣ ମହତ୍ତ୍ଵ',
      forecastTitle: 'ମାସିକ ମାମଲା ପୂର୍ବାନୁମାନ',
      alertLevel: 'ବର୍ତ୍ତମାନ ସତର୍କ ସ୍ତର',
    },
    riskLevels: {
      LOW: 'ନିମ୍ନ ଆଶଙ୍କା',
      MODERATE: 'ମଧ୍ୟମ ଆଶଙ୍କା',
      HIGH: 'ଉଚ୍ଚ ଆଶଙ୍କା',
      CRITICAL: 'ଅତ୍ୟନ୍ତ ଉଚ୍ଚ ଆଶଙ୍କା',
    },
    alerts: {
      GREEN: '🟢 ସ୍ୱାଭାବିକ — ନିୟମିତ ନଜରଦାରି',
      YELLOW: '🟡 ସତର୍କ — ନଜରଦାରି ବଢ଼ାନ୍ତୁ',
      ORANGE: '🟠 ଚେତାବନୀ — ପ୍ରତ୍ୟୁତ୍ତର ସକ୍ରିୟ କରନ୍ତୁ',
      RED: '🔴 ଜରୁରୀ — ସମ୍ପୂର୍ଣ ପ୍ରାଦୁର୍ଭାବ ପ୍ରତ୍ୟୁତ୍ତର',
    },
    awareness: {
      title: 'ସାର୍ବଜନୀନ ସଚେତନତା ପୋର୍ଟାଲ',
      symptoms: 'ଲକ୍ଷଣ ଜାଣନ୍ତୁ',
      prevention: 'ପ୍ରତିରୋଧ ଟିପ୍ସ',
      testing: 'ପରୀକ୍ଷା କେନ୍ଦ୍ର',
      emergency: 'ଜରୁରୀ ଯୋଗାଯୋଗ',
    },
    symptoms: [
      'ତୀବ୍ର ଜ୍ୱର (102-104°F) 2-7 ଦିନ',
      'ତୀବ୍ର ମୁଣ୍ଡ ବ୍ୟଥା ଓ ଆଖି ପଛରେ ଯନ୍ତ୍ରଣା',
      'ଗଣ୍ଠି ଓ ମାଂସପେଶୀ ଯନ୍ତ୍ରଣା',
      'ଜ୍ୱର ପରେ 2-5 ଦିନ ମଧ୍ୟରେ ଚର୍ମ ଫୁସ୍କୁଡ଼ି',
      'ହାଲୁକା ରକ୍ତସ୍ରାବ — ନାକ, ଦାନ୍ତ',
      'ବାନ୍ତି, ଅରୁଚି',
    ],
    prevention: [
      'ପ୍ରତି ସପ୍ତାହ ପାଣି ପାତ୍ର ଖାଲି ଓ ସଫା କରନ୍ତୁ',
      'ମଶା ବିରୋଧୀ କ୍ରିମ ବ୍ୟବହାର କରନ୍ତୁ',
      'ମଶାରି ଭିତରେ ଶୁଅନ୍ତୁ',
      'ପୂର୍ଣ ହାତ ପୋଷାକ ପିନ୍ଧନ୍ତୁ',
      'ଟ୍ୟାଙ୍କ ଓ ବ୍ୟାରେଲ ଢାଙ୍କି ରଖନ୍ତୁ',
      'ଡ୍ରାଇ-ଡେ ଅଭିଯାନରେ ଭାଗ ନିଅନ୍ତୁ',
    ],
    emergencyContacts: {
      stateHelpline: '104',
      bmc: '0674-2392516',
      nhm: '1800-345-6977',
      ambulance: '108',
    },
  },
};

// ─── I18N MANAGER ─────────────────────────────────────────────────────────
const i18n = {
  currentLang: 'en',

  t(key) {
    const keys = key.split('.');
    let result = TRANSLATIONS[this.currentLang];
    for (const k of keys) {
      result = result?.[k];
    }
    return result ?? key;
  },

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      this.applyTranslations();
      localStorage.setItem('denguel_lang', lang);
    }
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      el.placeholder = this.t(key);
    });
    document.title = `${this.t('appName')} — ${this.t('appSubtitle')}`;
  },

  init() {
    const saved = localStorage.getItem('denguel_lang') || 'en';
    this.currentLang = saved;
    this.applyTranslations();
  },
};

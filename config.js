const SAAS_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) 
    ? import.meta.env.VITE_SUPABASE_URL 
    : "https://fpvtcgafpgdvuwtwxunm.supabase.co", // Fallback for local testing
  
  SUPABASE_ANON_KEY: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) 
    ? import.meta.env.VITE_SUPABASE_ANON_KEY 
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdnRjZ2FmcGdkdnV3dHd4dW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0NjgsImV4cCI6MjA5MTM1MTQ2OH0.kJl1KcHmfEGByHQqojYJzAbhmTuo90qnxtDpeKIRNU0",

  // Google Form for Student Entry (Legacy support or fallback)
  STUDENT_ENTRY_FORM_URL: "https://docs.google.com/forms/u/0/d/e/YOUR_STUDENT_FORM_ID/formResponse",
  // ... rest of config
  STUDENT_FORM_FIELDS: {
    NAME: "entry.123456789",
    PHONE: "entry.987654321",
    TEACHER_ID: "entry.111222333"
  },
  TEACHER_UPDATE_FORM_URL: "https://docs.google.com/forms/u/0/d/e/YOUR_TEACHER_FORM_ID/formResponse",
  TEACHER_FORM_FIELDS: {
    TEACHER_ID: "entry.444555666",
    LESSON: "entry.777888999",
    EXAM: "entry.000111222",
    WHATSAPP: "entry.333444555"
  },
  SHEETDB_URL: "https://sheetdb.io/api/v1/fr1qssb8b1qhg", 
  DEFAULT_TEACHERS: {
    "ahmed_math": {
      id: "ahmed_math",
      name: "أ. أحمد محمد",
      subject: "رياضيات - ثانوي",
      lessonLink: "https://zoom.us/j/123456",
      examLink: "https://docs.google.com/forms/d/e/exam1/viewform",
      whatsapp: "201012345678",
      stats: { totalStudents: 156, examTakers: 92 }
    },
    "mohamed_physics": {
      id: "mohamed_physics",
      name: "د. محمد مصطفى",
      subject: "فيزياء - لغات",
      lessonLink: "https://meet.google.com/abc-defg-hij",
      examLink: "https://docs.google.com/forms/d/e/exam2/viewform",
      whatsapp: "201098765432",
      stats: { totalStudents: 84, examTakers: 45 }
    }
  }
};
export default SAAS_CONFIG;

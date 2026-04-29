import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            //For Login
            "welcome": "Welcome back",
            "subtitle": "Enter your credentials to access your account",
            "email": "Email",
            "password": "Password",
            "signing_in": "Signing in...",
            "sign_in": "Sign In",
            "no_account": "Don't have an account?",
            "signup_patient": "Sign up as Patient",
            "signup_doctor": "Sign up as Doctor",
            // For registraion
            "doc_reg_title": "Doctor Registration",
            "doc_reg_subtitle": "Join our platform to start receiving patients",
            "full_name": "Full Name",
            "specialization": "Specialization",
            "fee": "Fee ($)",
            "phone_number": "Phone Number",
            "creating_account": "Creating account...",
            "register_doc_btn": "Register as Doctor",
            "already_registered": "Already registered?",
            "log_in_link": "Log in",
            "doc_name_placeholder": "Dr. Ruwan De Silva",
            "doc_specialty_placeholder": "Cardiology",
            // For patient reg
            "pat_reg_title": "Patient Registration",
            "pat_reg_subtitle": "Create an account to easily book appointments",
            "phone": "Phone",
            "age": "Age",
            "register_pat_btn": "Register as Patient",
            "pat_name_placeholder": "Eg: Danushka Fernando"
        }
    },
    si: {
        translation: {
            "welcome": "නැවත සාදරයෙන් පිළිගනිමු",
            "subtitle": "ඔබේ ගිණුමට පිවිසීමට තොරතුරු ඇතුළත් කරන්න",
            "email": "විද්‍යුත් තැපෑල",
            "password": "මුරපදය",
            "signing_in": "ඇතුල් වෙමින්...",
            "sign_in": "ඇතුල් වන්න",
            "no_account": "ගිණුමක් නැද්ද?",
            "signup_patient": "රෝගියෙකු ලෙස ලියාපදිංචි වන්න",
            "signup_doctor": "වෛද්‍යවරයෙකු ලෙස ලියාපදිංචි වන්න",

            // Registration Keys
            "doc_reg_title": "වෛද්‍ය ලියාපදිංචිය",
            "doc_reg_subtitle": "රෝගීන් ලබා ගැනීම ආරම්භ කිරීමට අපගේ වේදිකාවට සම්බන්ධ වන්න",
            "full_name": "සම්පූර්ණ නම",
            "specialization": "විශේෂත්වය",
            "fee": "ගාස්තුව ($)",
            "phone_number": "දුරකථන අංකය",
            "creating_account": "ගිණුම සාදමින්...",
            "register_doc_btn": "වෛද්‍යවරයෙකු ලෙස ලියාපදිංචි වන්න",
            "already_registered": "දැනටමත් ලියාපදිංචි වී තිබේද?",
            "log_in_link": "ඇතුල් වන්න",
            "doc_name_placeholder": "වෛද්‍ය ජෝන් ඩෝ",
            "doc_specialty_placeholder": "හෘද රෝග",

            "pat_reg_title": "රෝගී ලියාපදිංචිය",
            "pat_reg_subtitle": "පහසුවෙන් වේලාවන් වෙන්කර ගැනීමට ගිණුමක් සාදන්න",
            "phone": "දුරකථන",
            "age": "වයස",
            "register_pat_btn": "රෝගියෙකු ලෙස ලියාපදිංචි වන්න",
            "pat_name_placeholder": "ජේන් ඩෝ"
        }
    },
    ta: {
        translation: {
            "welcome": "மீண்டும் வருக",
            "subtitle": "உங்கள் கணக்கை அணுக உள்நுழையவும்",
            "email": "மின்னஞ்சல்",
            "password": "கடவுச்சொல்",
            "signing_in": "உள்நுழைகிறது...",
            "sign_in": "உள்நுழைய",
            "no_account": "கணக்கு இல்லையா?",
            "signup_patient": "நோயாளியாக பதிவு செய்க",
            "signup_doctor": "மருத்துவராக பதிவு செய்க",

            "doc_reg_title": "மருத்துவர் பதிவு",
            "doc_reg_subtitle": "நோயாளிகளைப் பெற எங்கள் தளத்தில் இணையுங்கள்",
            "full_name": "முழு பெயர்",
            "specialization": "நிபுணத்துவம்",
            "fee": "கட்டணம் ($)",
            "phone_number": "தொலைபேசி எண்",
            "creating_account": "கணக்கு உருவாக்கப்படுகிறது...",
            "register_doc_btn": "மருத்துவராக பதிவு செய்க",
            "already_registered": "ஏற்கனவே பதிவு செய்துள்ளீர்களா?",
            "log_in_link": "உள்நுழைய",
            "doc_name_placeholder": "டாக்டர் ஜான் டோ",
            "doc_specialty_placeholder": "இதயவியல்",

            "pat_reg_title": "நோயாளி பதிவு",
            "pat_reg_subtitle": "நியமனங்களை எளிதாக பதிவு செய்ய கணக்கை உருவாக்கவும்",
            "phone": "தொலைபேசி",
            "age": "வயது",
            "register_pat_btn": "நோயாளியாக பதிவு செய்க",
            "pat_name_placeholder": "ஜேன் டோ"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false }
    });

export default i18n;
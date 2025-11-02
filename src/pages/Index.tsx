/**
 * TAAWIDATY - Moroccan Medication Reimbursement Calculator
 * 
 * @author BENTALBA ZAKARIA
 * @copyright 2025 BENTALBA ZAKARIA
 * @description Main landing page with medication search and reimbursement calculator
 * 
 * NOTE: The name "TAAWIDATY" (تعويضاتي) is proprietary and protected.
 * The code is open source (MIT License), but the brand name cannot be used
 * in derivative works without explicit permission.
 */

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import LanguageToggle from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import SearchInput from '@/components/SearchInput';
import ResultCard from '@/components/ResultCard';
import { PlaceholderAd } from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

type InsuranceType = 'cnops' | 'cnss' | null;

interface Medication {
  id: number;
  name: string;
  dci?: string;
  ppv: number;
  base_remb: number;
  taux_remb: number;
}

interface CalculationResult {
  originalPrice: number;
  reimbursementAmount: number;
  patientPays: number;
  percentageCovered: number;
  insuranceType: 'cnops' | 'cnss';
  medicationName: string;
}

export default function Index() {
  const { language, toggleLanguage, isRTL } = useLanguage();
  const t = translations[language];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [insurance, setInsurance] = useState<InsuranceType>(null);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateReimbursement = () => {
    if (!medication || !insurance) return;

    const reimbursement = (medication.base_remb * medication.taux_remb) / 100;
    const patientPays = Math.max(0, medication.ppv - reimbursement);

    setResult({
      originalPrice: medication.ppv,
      reimbursementAmount: reimbursement,
      patientPays,
      percentageCovered: medication.taux_remb,
      insuranceType: insurance,
      medicationName: medication.name
    });

    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setInsurance(null);
    setMedication(null);
    setResult(null);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-card transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-card/80 backdrop-blur-sm sticky top-0 z-40 shadow-soft dark:border-border transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logos/TAAWIDATY.png"
              alt="Taawidaty logo"
              className="h-12 w-auto"
            />
            <h1 className={`text-2xl font-black text-primary-800 ${isRTL ? 'font-arabic' : ''}`}>
              {t.app.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {step === 1 && (
        <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-primary-700" />
              <span className={`text-sm font-semibold text-primary-700 ${isRTL ? 'font-arabic' : ''}`}>
                {t.app.subtitle}
              </span>
            </div>
          </div>

          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight ${isRTL ? 'font-arabic' : ''}`}>
            {t.hero.title}
          </h2>
          <p className={`text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t.hero.subtitle}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-slate-600">
            {[
              { icon: CheckCircle2, text: t.hero.trustOfficial },
              { icon: CheckCircle2, text: t.hero.trustInstant },
              { icon: CheckCircle2, text: t.hero.trustFree }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-success-600" />
                <span className={isRTL ? 'font-arabic' : ''}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* FAQ Quick Access Banner */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-center gap-3 mb-3">
                <HelpCircle className="w-6 h-6 text-primary-700" />
                <h3 className={`text-xl font-bold text-slate-900 ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'هل لديك أسئلة؟' : 'Vous avez des questions ?'}
                </h3>
              </div>
              <p className={`text-slate-600 mb-4 text-center ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' 
                  ? 'تصفح أسئلتنا الشائعة حول استرجاع مصاريف الأدوية'
                  : 'Consultez notre FAQ sur le remboursement des médicaments'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="default" size="sm">
                  <Link to="/faq-cnops" className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'أسئلة CNOPS' : 'FAQ CNOPS'}
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/faq-cnss" className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'أسئلة CNSS' : 'FAQ CNSS'}
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Insurance Selection */}
          <div className="max-w-4xl mx-auto">
            <h3 className={`text-2xl font-bold text-slate-900 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
              {t.calculator.selectInsurance}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setInsurance('cnops');
                  setStep(2);
                }}
                className="group p-8 rounded-2xl border-2 border-slate-300 hover:border-primary-700 hover:bg-primary-50 transition-all shadow-soft hover:shadow-lg"
              >
                <div className="flex justify-center mb-6">
                  <img 
                    src="/logos/cnops-logo.png" 
                    alt="CNOPS Logo" 
                    className="h-24 w-auto object-contain"
                    onError={(e) => {
                      // Fallback to emoji if image not found
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-6xl';
                      fallback.textContent = '🏥';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">
                  {t.calculator.cnops}
                </h3>
                <p className={`text-slate-600 ${isRTL ? 'font-arabic' : ''}`}>
                  {t.calculator.cnopsDesc}
                </p>
                <div className={`mt-4 flex items-center justify-center gap-2 text-primary-700 font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                  {t.hero.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => {
                  setInsurance('cnss');
                  setStep(2);
                }}
                className="group p-8 rounded-2xl border-2 border-slate-300 hover:border-primary-700 hover:bg-primary-50 transition-all shadow-soft hover:shadow-lg"
              >
                <div className="flex justify-center mb-6">
                  <img 
                    src="/logos/cnss-logo.png" 
                    alt="CNSS Logo" 
                    className="h-24 w-auto object-contain"
                    onError={(e) => {
                      // Fallback to emoji if image not found
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-6xl';
                      fallback.textContent = '👷';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">
                  {t.calculator.cnss}
                </h3>
                <p className={`text-slate-600 ${isRTL ? 'font-arabic' : ''}`}>
                  {t.calculator.cnssDesc}
                </p>
                <div className={`mt-4 flex items-center justify-center gap-2 text-primary-700 font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                  {t.hero.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* FAQ Help Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <Link 
                to="/faq-cnops"
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <h4 className={`font-bold text-slate-900 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'أسئلة شائعة - CNOPS' : 'Questions fréquentes - CNOPS'}
                    </h4>
                    <p className={`text-sm text-slate-600 ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' 
                        ? '15 سؤالاً حول استرجاع مصاريف الأدوية'
                        : '15 questions sur le remboursement'}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </Link>

              <Link 
                to="/faq-cnss"
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <h4 className={`font-bold text-slate-900 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'أسئلة شائعة - CNSS' : 'Questions fréquentes - CNSS'}
                    </h4>
                    <p className={`text-sm text-slate-600 ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' 
                        ? '15 سؤالاً حول استرجاع مصاريف الأدوية'
                        : '15 questions sur le remboursement'}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </Link>
            </div>
          </div>

          {/* Ad Banner - Below Insurance Selection */}
          <div className="mt-12 max-w-3xl mx-auto">
            <PlaceholderAd 
              height="120px" 
              className="mb-4"
              label={language === 'ar' ? 'إعلان' : 'Publicité'}
            />
          </div>
        </section>
      )}

      {/* Step 2: Medication Search */}
      {step === 2 && (
        <section className="px-4 py-16 max-w-4xl mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-strong p-6 md:p-10">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className={`mb-4 ${isRTL ? 'font-arabic' : ''}`}
              >
                ← {t.calculator.back}
              </Button>
              <h2 className={`text-3xl font-black text-slate-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {t.calculator.searchMed}
              </h2>
              <p className={`text-slate-600 ${isRTL ? 'font-arabic' : ''}`}>
                {insurance === 'cnops' ? t.calculator.cnops : t.calculator.cnss}
              </p>
            </div>

            <SearchInput
              placeholder={t.calculator.searchPlaceholder}
              onSelect={(selected) => setMedication(selected as Medication)}
              language={language}
              insuranceType={insurance!}
            />

            {/* Ad Banner - Below Search Input */}
            <div className="mt-8">
              <PlaceholderAd 
                height="100px"
                label={language === 'ar' ? 'إعلان' : 'Publicité'}
              />
            </div>

            {medication && (
              <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-700 rounded-xl animate-scale-in">
                <p className={`text-sm text-primary-700 mb-2 font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                  {t.calculator.selected}
                </p>
                <p className={`text-xl font-black text-slate-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                  {medication.name}
                </p>
                <Button
                  onClick={calculateReimbursement}
                  size="lg"
                  className={`w-full text-lg ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t.calculator.calculate}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 3: Results */}
      {step === 3 && result && (
        <section className="px-4 py-16 max-w-5xl mx-auto">
          {/* Ad Banner - Top of Results */}
          <div className="mb-8">
            <PlaceholderAd 
              height="120px"
              label={language === 'ar' ? 'إعلان' : 'Publicité'}
            />
          </div>

          <ResultCard {...result} language={language} />

          {/* Ad Banner - Below Results */}
          <div className="mt-8">
            <PlaceholderAd 
              height="250px"
              label={language === 'ar' ? 'إعلان' : 'Publicité'}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={reset}
              size="lg"
              className={`text-lg ${isRTL ? 'font-arabic' : ''}`}
            >
              {t.calculator.newCalc}
            </Button>
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              size="lg"
              className={`text-lg ${isRTL ? 'font-arabic' : ''}`}
            >
              {t.calculator.changeMed}
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        {/* Ad Banner - Before Footer */}
        <div className="container mx-auto px-4 pt-8">
          <PlaceholderAd 
            height="120px"
            label={language === 'ar' ? 'إعلان' : 'Publicité'}
          />
        </div>
        
        {/* FAQ Links */}
        <div className="container mx-auto px-4 py-6 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button asChild variant="outline" className={isRTL ? 'font-arabic' : ''}>
              <Link to="/faq-cnops" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'أسئلة متكررة CNOPS' : 'FAQ CNOPS'}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className={isRTL ? 'font-arabic' : ''}>
              <Link to="/faq-cnss" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'أسئلة متكررة CNSS' : 'FAQ CNSS'}</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p className={`text-sm ${isRTL ? 'font-arabic' : ''}`}>
            © 2025 TAAWIDATY • {language === 'ar' ? 'صمم وطور بواسطة' : 'Designed & Developed by'} <strong>BENTALBA ZAKARIA</strong>
          </p>
          <p className={`text-xs mt-2 ${isRTL ? 'font-arabic' : ''}`}>
            {t.disclaimer.text}
          </p>
        </div>
      </footer>
    </div>
  );
}

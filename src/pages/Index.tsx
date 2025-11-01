import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/lib/translations';
import LanguageToggle from '@/components/LanguageToggle';
import SearchInput from '@/components/SearchInput';
import ResultCard from '@/components/ResultCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles, Pill } from 'lucide-react';

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
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-2xl font-black text-primary-800 ${isRTL ? 'font-arabic' : ''}`}>
              {t.app.title}
            </h1>
          </div>
          <LanguageToggle />
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
            />

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
          <ResultCard {...result} language={language} />

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
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p className={`text-sm ${isRTL ? 'font-arabic' : ''}`}>
            © 2024 DawaCalc • {t.disclaimer.text}
          </p>
        </div>
      </footer>
    </div>
  );
}

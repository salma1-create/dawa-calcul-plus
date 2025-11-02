import { translations } from '@/lib/translations';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface ResultCardProps {
  originalPrice: number;
  reimbursementAmount: number;
  patientPays: number;
  percentageCovered: number;
  insuranceType: 'cnops' | 'cnss';
  medicationName: string;
  language: 'ar' | 'fr';
}

export default function ResultCard({
  originalPrice,
  reimbursementAmount,
  patientPays,
  percentageCovered,
  insuranceType,
  medicationName,
  language
}: ResultCardProps) {
  const t = translations[language].results;
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div dir={dir} className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Main Result Card */}
      <div className="bg-white dark:bg-card rounded-2xl shadow-strong border-2 border-primary-700 dark:border-primary p-6">
        <h2 className={`text-2xl font-black text-slate-900 dark:text-card-foreground mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t.title}
        </h2>

        {/* Medication Info */}
        <div className="bg-slate-50 dark:bg-muted rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className={`text-sm text-slate-600 dark:text-muted-foreground mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t.medication}
              </p>
              <p className={`text-lg font-bold text-slate-900 dark:text-card-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                {medicationName}
              </p>
            </div>
            <img 
              src={`/logos/${insuranceType}-logo.png`}
              alt={`${insuranceType.toUpperCase()} Logo`}
              className="h-12 w-auto object-contain ml-4"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>
          <p className="text-sm text-primary-700 mt-1 font-semibold">
            {insuranceType.toUpperCase()}
          </p>
        </div>

        {/* Main Amount - What Patient Pays */}
        <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white rounded-2xl p-8 mb-6 text-center shadow-lg">
          <p className={`text-sm opacity-90 mb-3 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.youPay}
          </p>
          <p className="text-5xl md:text-6xl font-black tracking-tight">
            {formatCurrency(patientPays)}
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b-2 border-slate-200">
            <span className={`text-slate-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.originalPrice}
            </span>
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(originalPrice)}
            </span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b-2 border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
              <div>
                <span className={`text-slate-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.reimbursement}
                </span>
                <span className={`text-sm text-success-600 font-semibold ${language === 'ar' ? 'mr-2 font-arabic' : 'ml-2'}`}>
                  ({percentageCovered}% {t.covered})
                </span>
              </div>
            </div>
            <span className="text-xl font-bold text-success-600">
              -{formatCurrency(reimbursementAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className={`text-lg font-black text-slate-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.youPay}
            </span>
            <span className="text-3xl font-black text-primary-700">
              {formatCurrency(patientPays)}
            </span>
          </div>
        </div>
      </div>

      {/* Savings Indicator */}
      {reimbursementAmount > 0 && (
        <div className="bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-600 rounded-xl p-5 text-center shadow-soft animate-scale-in">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-success-700" />
            <p className={`text-success-700 font-bold text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.savings.replace('{amount}', formatCurrency(reimbursementAmount))}
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-warning-50 border-l-4 border-warning-500 rounded-lg p-4">
        <p className={`text-sm font-semibold text-warning-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          ⚠️ {translations[language].disclaimer.title}
        </p>
        <p className={`text-sm text-warning-800 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {translations[language].disclaimer.text}
        </p>
      </div>
    </div>
  );
}

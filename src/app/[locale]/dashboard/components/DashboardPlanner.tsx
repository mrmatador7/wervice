'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiPlus, FiCheck, FiCalendar } from 'react-icons/fi';
import { useUser } from '@/contexts/UserContext';

interface DashboardPlannerProps {
  profile: {
    wedding_date?: string | null;
  } | null;
  locale?: string;
}

type PlannerLocale = 'en' | 'fr' | 'ar';

type PlannerCategoryKey =
  | 'venue'
  | 'catering'
  | 'photography'
  | 'music'
  | 'beauty'
  | 'dresses'
  | 'decor'
  | 'invitations';

const defaultCategories: Array<{ id: PlannerCategoryKey; icon: string; completed: boolean }> = [
  { id: 'venue', icon: '🏛️', completed: false },
  { id: 'catering', icon: '🍽️', completed: false },
  { id: 'photography', icon: '📸', completed: false },
  { id: 'music', icon: '🎵', completed: false },
  { id: 'beauty', icon: '💄', completed: false },
  { id: 'dresses', icon: '👗', completed: false },
  { id: 'decor', icon: '🎨', completed: false },
  { id: 'invitations', icon: '💌', completed: false },
];

const plannerCopy = {
  en: {
    title: 'Wedding Planner',
    subtitle: 'Track your wedding planning progress',
    weddingDateTitle: 'Your Wedding Date',
    weddingDateHint: 'Set your big day to help vendors know your timeline',
    saving: 'Saving...',
    saveWeddingDate: 'Save Wedding Date',
    weddingDateSaved: 'Wedding date saved.',
    saveDateError: 'Failed to save wedding date',
    progressTitle: 'Planning Progress',
    categoriesCompleted: '{done} of {total} categories completed',
    complete: 'Complete',
    checklistTitle: 'Vendor Checklist',
    addCustom: 'Add Custom',
    booked: 'Booked ✓',
    notYetBooked: 'Not yet booked',
    categories: {
      venue: 'Venue',
      catering: 'Catering',
      photography: 'Photography',
      music: 'Music & DJ',
      beauty: 'Beauty & Makeup',
      dresses: 'Wedding Dress',
      decor: 'Decoration',
      invitations: 'Invitations',
    },
  },
  fr: {
    title: 'Planificateur de mariage',
    subtitle: 'Suivez la progression de votre préparation',
    weddingDateTitle: 'Votre date de mariage',
    weddingDateHint: 'Définissez votre grand jour pour aider les prestataires à planifier',
    saving: 'Enregistrement...',
    saveWeddingDate: 'Enregistrer la date du mariage',
    weddingDateSaved: 'Date du mariage enregistrée.',
    saveDateError: 'Échec de l’enregistrement de la date du mariage',
    progressTitle: 'Progression de la planification',
    categoriesCompleted: '{done} sur {total} catégories terminées',
    complete: 'Terminé',
    checklistTitle: 'Checklist des prestataires',
    addCustom: 'Ajouter personnalisé',
    booked: 'Réservé ✓',
    notYetBooked: 'Pas encore réservé',
    categories: {
      venue: 'Lieu',
      catering: 'Traiteur',
      photography: 'Photographie',
      music: 'Musique & DJ',
      beauty: 'Beauté & maquillage',
      dresses: 'Robe de mariée',
      decor: 'Décoration',
      invitations: 'Invitations',
    },
  },
  ar: {
    title: 'مخطط الزفاف',
    subtitle: 'تابعي تقدم التخطيط لحفل زفافك',
    weddingDateTitle: 'تاريخ زفافك',
    weddingDateHint: 'حددي يومك الكبير لمساعدة المزوّدين على معرفة الجدول الزمني',
    saving: 'جارٍ الحفظ...',
    saveWeddingDate: 'حفظ تاريخ الزفاف',
    weddingDateSaved: 'تم حفظ تاريخ الزفاف.',
    saveDateError: 'فشل حفظ تاريخ الزفاف',
    progressTitle: 'تقدم التخطيط',
    categoriesCompleted: '{done} من {total} فئات مكتملة',
    complete: 'مكتمل',
    checklistTitle: 'قائمة مزوّدي الخدمات',
    addCustom: 'إضافة مخصص',
    booked: 'تم الحجز ✓',
    notYetBooked: 'لم يتم الحجز بعد',
    categories: {
      venue: 'المكان',
      catering: 'التموين',
      photography: 'التصوير',
      music: 'الموسيقى ودي جي',
      beauty: 'الجمال والمكياج',
      dresses: 'فستان الزفاف',
      decor: 'الديكور',
      invitations: 'الدعوات',
    },
  },
} as const;

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}

export default function DashboardPlanner({ profile, locale = 'en' }: DashboardPlannerProps) {
  const safeLocale: PlannerLocale = locale === 'fr' || locale === 'ar' ? locale : 'en';
  const t = plannerCopy[safeLocale];
  const { refreshUserData } = useUser();
  const [plannedVendors, setPlannedVendors] = useState(defaultCategories);
  const [weddingDate, setWeddingDate] = useState(profile?.wedding_date || '');
  const [isSavingDate, setIsSavingDate] = useState(false);
  const [saveDateMessage, setSaveDateMessage] = useState('');
  const [saveDateError, setSaveDateError] = useState('');

  useEffect(() => {
    setWeddingDate(profile?.wedding_date || '');
  }, [profile?.wedding_date]);

  const toggleVendor = (id: string) => {
    setPlannedVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, completed: !v.completed } : v))
    );
  };

  const completedCount = plannedVendors.filter((v) => v.completed).length;
  const progressPercentage = (completedCount / plannedVendors.length) * 100;

  const categoriesCompletedLabel = useMemo(
    () => interpolate(t.categoriesCompleted, { done: completedCount, total: plannedVendors.length }),
    [completedCount, plannedVendors.length, t.categoriesCompleted]
  );

  const saveWeddingDate = async () => {
    setSaveDateError('');
    setSaveDateMessage('');
    setIsSavingDate(true);

    try {
      const response = await fetch('/api/profiles/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          wedding_date: weddingDate || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || t.saveDateError);
      }

      setSaveDateMessage(t.weddingDateSaved);
      await refreshUserData();
    } catch (error) {
      setSaveDateError(error instanceof Error ? error.message : t.saveDateError);
    } finally {
      setIsSavingDate(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#11190C]">{t.title}</h1>
        <p className="text-gray-600 mt-1">{t.subtitle}</p>
      </div>

      <div className="bg-gradient-to-br from-[#D9FF0A] to-[#BEE600] rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <FiCalendar className="w-7 h-7 text-[#11190C]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#11190C]">{t.weddingDateTitle}</h2>
            <p className="text-[#11190C]/70 text-sm">{t.weddingDateHint}</p>
          </div>
        </div>
        <input
          type="date"
          value={weddingDate}
          onChange={(e) => setWeddingDate(e.target.value)}
          className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-white/60 rounded-2xl focus:outline-none focus:border-white text-lg font-semibold text-[#11190C]"
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={saveWeddingDate}
            disabled={isSavingDate}
            className="rounded-xl bg-[#11190C] px-5 py-2.5 text-sm font-bold text-[#D9FF0A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingDate ? t.saving : t.saveWeddingDate}
          </button>
          {saveDateError && <span className="text-sm font-semibold text-red-700">{saveDateError}</span>}
          {saveDateMessage && <span className="text-sm font-semibold text-[#2f6f49]">{saveDateMessage}</span>}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#11190C]">{t.progressTitle}</h2>
            <p className="text-gray-600">{categoriesCompletedLabel}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[#11190C]">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-500">{t.complete}</div>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#D9FF0A] to-[#BEE600] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#11190C]">{t.checklistTitle}</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#11190C] text-white rounded-xl font-medium hover:bg-[#2A2F25] transition-all">
            <FiPlus className="w-5 h-5" />
            {t.addCustom}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedVendors.map((vendor) => (
            <button
              key={vendor.id}
              onClick={() => toggleVendor(vendor.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                vendor.completed
                  ? 'border-[#D9FF0A] bg-[#D9FF0A]/10'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  vendor.completed ? 'bg-[#D9FF0A]' : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {vendor.completed && <FiCheck className="w-4 h-4 text-[#11190C] font-bold" />}
              </div>

              <div className="text-3xl">{vendor.icon}</div>

              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    vendor.completed ? 'text-[#11190C] line-through' : 'text-[#11190C]'
                  }`}
                >
                  {t.categories[vendor.id]}
                </h3>
                <p className="text-sm text-gray-500">
                  {vendor.completed ? t.booked : t.notYetBooked}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

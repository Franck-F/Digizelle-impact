"use client";
import { useState } from "react";
import { Container } from '@/components/ui/Container';
import { CelebrationAnimation } from '@/components/animations/CelebrationAnimation';

const questions = [
  {
    type: "qcm",
    question: "Comment avez-vous vécu l'événement ?",
    options: ["Excellent", "Bien", "Moyen", "Décevant"],
  },
  {
    type: "qcm",
    question: "Comment jugez-vous l'organisation ?",
    options: ["Parfaite", "Bonne", "À améliorer", "Insuffisante"],
  },
  {
    type: "qcm",
    question: "Comment avez-vous trouvé l'ambiance ?",
    options: ["Très conviviale", "Sympa", "Neutre", "Tendue"],
  },
  {
    type: "qcm",
    question: "Les intervenants étaient-ils inspirants ?",
    options: ["Oui, beaucoup", "Oui, un peu", "Non vraiment", "Je n'ai pas d'avis"],
  },
  {
    type: "qcm",
    question: "Recommanderiez-vous Digizelle à un ami ?",
    options: ["Oui", "Non", "Peut-être"],
  },
  {
    type: "qro",
    question: "Qu'avez-vous préféré ?",
  },
  {
    type: "qro",
    question: "Une suggestion pour améliorer l'événement ?",
  },
];

export default function SurveyPage() {
        {/* Mascotte bas droite */}
        <div className="fixed bottom-24 right-24 z-10 pointer-events-none select-none">
          <img src="/images/mascotte/mascotte4.png" alt="Mascotte Digizelle" width={120} height={120} className="opacity-80 hover:opacity-100 transition" />
        </div>
        {/* Mascotte haut gauche */}
        <div className="fixed top-24 left-24 z-10 pointer-events-none select-none">
          <img src="/images/mascotte/mascotte2.png" alt="Mascotte Digizelle" width={90} height={90} className="opacity-70 hover:opacity-100 transition" />
        </div>
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const current = questions[step];

  async function handleQCM(option: string) {
    setAnswers((prev) => ({ ...prev, [step]: option }));
  }

  async function handleQRO(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const qroInput = target.elements.namedItem("qro") as HTMLTextAreaElement | null;
    const answer = qroInput?.value || "";
    setAnswers((prev) => ({ ...prev, [step]: answer }));
    if (step + 1 === questions.length) {
      await submitSurvey({ ...answers, [step]: answer });
    }
    setStep(step + 1);
  }

  async function handleNext() {
    if (step + 1 === questions.length) {
      await submitSurvey(answers);
    }
    setStep(step + 1);
  }

  function handlePrev() {
    setStep(Math.max(0, step - 1));
  }

  async function submitSurvey(data: Record<string, any>) {
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: data }),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
  }

  return (
    <Container className="py-4 sm:py-8 md:py-12">
      <div className="min-h-[90vh] flex flex-col justify-center items-center relative overflow-hidden">
        {/* Animation mascottes lors de la soumission */}
        {submitted ? (
          <CelebrationAnimation show={true} message="Merci d’avoir pris le temps de répondre au sondage. L’équipe Digizelle vous remercie chaleureusement 🎉 Votre avis compte pour nous et aidera à améliorer les prochains événements." />
        ) : (
          <>
            {/* Animation d'envoi pendant la soumission */}
            <CelebrationAnimation show={step === questions.length} message="Envoi du sondage..." />
            {/* Fixed header removed; question moved below */}
            <div className="relative w-full flex flex-col items-center">
              {/* Mascotte bas droite */}
              <div className="fixed bottom-[2vw] right-[2vw] sm:bottom-[4vw] sm:right-[4vw] md:bottom-[3vw] md:right-[3vw] z-10 select-none pointer-events-none">
                <img src="/images/mascotte/mascotte4.png" alt="Mascotte Digizelle" width={36} height={36} className="opacity-80 hover:opacity-100 transition sm:w-[60px] sm:h-[60px] md:w-[90px] md:h-[90px] object-contain mascotte-max" />
              </div>
              {/* Mascotte haut gauche */}
              <div className="fixed top-[2vw] left-[2vw] sm:top-[4vw] sm:left-[4vw] md:top-[3vw] md:left-[3vw] z-10 select-none pointer-events-none">
                <img src="/images/mascotte/mascotte2.png" alt="Mascotte Digizelle" width={28} height={28} className="opacity-70 hover:opacity-100 transition sm:w-[48px] sm:h-[48px] md:w-[70px] md:h-[70px] object-contain mascotte-max" />
              </div>
              {step < questions.length && (
                <div className="w-full max-w-2xl mx-auto mt-40 backdrop-blur-lg bg-white/80 dark:bg-navy/80 border border-purple/20 dark:border-navy/40 rounded-3xl shadow-2xl p-14 flex flex-col items-center transition-all duration-300 animate-fade-in">
                              {/* Question visible dans le bloc sondage */}
                              <div className="w-full mb-2 sm:mb-4 mt-2 md:mt-8 lg:mt-12">
                                <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-extrabold text-heading dark:text-white text-center font-sans tracking-tight bg-transparent break-words max-w-[95vw]">
                                  {step < questions.length ? current.question : 'Merci pour votre participation !'}
                                </h1>
                              </div>
                  {/* Timeline stylée */}
                  <div className="flex flex-col items-center mb-2 sm:mb-4 w-full">
                    <div className="relative w-full max-w-[220px] sm:max-w-md h-6 sm:h-8 flex items-center">
                      {/* Barre de progression */}
                      <div className="absolute left-0 top-1/2 w-full h-2 bg-purple/10 rounded-full timeline-bar-bg" />
                      {(() => {
                        let progress = questions.length > 1 ? step/(questions.length-1) : 0;
                        let widthClass = "w-0";
                        if (progress >= 0.99) widthClass = "w-full";
                        else if (progress >= 0.75) widthClass = "w-3/4";
                        else if (progress >= 0.5) widthClass = "w-1/2";
                        else if (progress >= 0.25) widthClass = "w-1/4";
                        // else w-0
                        return (
                          <div
                            className={`absolute left-0 top-1/2 h-2 bg-purple rounded-full transition-all duration-500 timeline-bar-fill ${widthClass}`}
                          />
                        );
                      })()}
                      {/* Cercles numérotés */}
                      <div className="flex justify-between w-full z-10">
                        {questions.map((q, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full font-bold text-xs sm:text-base border-2 transition-all duration-300 ${idx < step ? 'bg-purple text-white border-purple' : idx === step ? 'bg-white dark:bg-navy/80 text-purple border-purple' : 'bg-white dark:bg-navy/80 text-purple/40 border-purple/30'}`}
                            >{idx+1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Removed duplicate question display */}
                  {current.type === "qcm" ? (
                    <div className="flex flex-col gap-8 w-full">
                      {(current.options ?? []).map((opt) => (
                        <button
                          key={opt}
                          className={`group flex items-center justify-center gap-2 rounded-xl border-2 border-purple/60 bg-transparent font-semibold py-1 px-2 sm:py-3 sm:px-6 text-xs sm:text-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-purple/30 ${answers[step] === opt ? 'bg-purple/10 border-purple text-purple dark:text-white' : 'text-heading dark:text-white hover:bg-purple/10 hover:border-purple hover:text-purple dark:hover:text-white'}`}
                          onClick={() => handleQCM(opt)}
                        >
                          <span className="group-hover:text-purple text-xs sm:text-lg">{opt}</span>
                          {answers[step] === opt && (
                            <span className="transition-opacity text-purple dark:text-white">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                          )}
                        </button>
                      ))}
                      <div className="flex justify-between mt-2 sm:mt-6 w-full">
                        <button type="button" onClick={handlePrev} disabled={step === 0} className="rounded-xl border-2 border-purple bg-transparent text-purple font-semibold py-1 px-2 sm:py-2 sm:px-6 text-xs sm:text-lg shadow-md hover:bg-purple/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          Précédent
                        </button>
                        <button type="button" onClick={handleNext} disabled={answers[step] == null} className="rounded-xl border-2 border-purple bg-purple text-white font-semibold py-1 px-2 sm:py-2 sm:px-6 text-xs sm:text-lg shadow-md hover:bg-purple/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          {step + 1 === questions.length ? 'Valider' : 'Suivant'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleQRO} className="flex flex-col gap-8 w-full">
                        <textarea
                          name="qro"
                          rows={2}
                          className="rounded-xl border-2 border-purple/30 bg-white dark:bg-navy/80 text-heading dark:text-white placeholder:text-body/60 dark:placeholder:text-white focus:border-purple focus:ring-2 focus:ring-purple/30 outline-none transition text-xs sm:text-base shadow-md py-1 px-2 sm:py-2 sm:px-4 resize-none"
                          placeholder="Votre réponse..."
                          value={answers[step] || ""}
                          onChange={e => setAnswers(prev => ({ ...prev, [step]: e.target.value }))}
                        />
                        <div className="flex justify-between mt-10 w-full">
                          <button type="button" onClick={handlePrev} disabled={step === 0} className="rounded-xl border-2 border-purple bg-transparent text-purple font-semibold py-1 px-2 sm:py-2 sm:px-6 text-xs sm:text-lg shadow-md hover:bg-purple/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            Précédent
                          </button>
                          <button type="submit" className="rounded-xl border-2 border-purple bg-purple text-white font-semibold py-1 px-2 sm:py-2 sm:px-6 text-xs sm:text-lg shadow-md hover:bg-purple/80 transition-all">
                            {step + 1 === questions.length ? 'Valider' : 'Suivant'}
                          </button>
                        </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

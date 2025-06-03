import React, { useState, useEffect } from 'react';
import DirectionSection from './components/DirectionSection/DirectionSection';
import SpecialistSection from './components/SpecialistSelection/SpecialistSelection';
import CompanySizeSection from './components/CompanySizeSection/CompanySizeSection';
import ProjectTypeSection from './components/ProjectTypeSection/ProjectTypeSection';
import DeveloperDurationSection from './components/DeveloperDurationSection/DeveloperDurationSection';
import InvolvementLevelSection from './components/InvolvementLevelSection/InvolvementLevelSection';
import StartDateSection from './components/StartDateSection/StartDateSection';
import ContactInfoSection from './components/ContactInfoSection/ContactInfoSection';
import styles from './CreateAccountClient.module.scss';

const CreateAccountClient = () => {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    direction: '',
    specialists: [] as string[],
    companySize: '',
    projectType: '',
    duration: '',
    involvement: '',
    startDate: '',
    contact: {
      email: '',
      username: '',
      company: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (step === 8) {
      // Финальная отправка на сервер
      fetch('/api/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => console.log('Успешно отправлено:', data))
        .catch((err) => console.error('Ошибка при отправке:', err));
    }
  }, [step]);

  const steps = [
    {
      title: 'Какое направление вас интересует?',
      content: (
        <DirectionSection
          onNext={() => setStep(1)}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, direction: value }))
          }
        />
      ),
    },
    {
      title: 'Каких специалистов вы ищете?',
      content: (
        <SpecialistSection
          onNext={() => setStep(2)}
          onSelect={(list) =>
            setFormData((prev) => ({ ...prev, specialists: list }))
          }
        />
      ),
    },
    {
      title: 'Сколько людей работает в вашей компании?',
      content: (
        <CompanySizeSection
          onNext={() => setStep(3)}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, companySize: value }))
          }
        />
      ),
    },
    {
      title: 'Для какого типа проекта ищете специалиста?',
      content: (
        <ProjectTypeSection
          onNext={() => setStep(4)}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, projectType: value }))
          }
        />
      ),
    },
    {
      title: 'Насколько долго вам нужен разработчик?',
      content: (
        <DeveloperDurationSection
          onNext={() => setStep(5)}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, duration: value }))
          }
        />
      ),
    },
    {
      title:
        'Какой уровень вовлеченности во время работы требуется от специалиста?',
      content: (
        <InvolvementLevelSection
          onNext={() => setStep(6)}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, involvement: value }))
          }
        />
      ),
    },
    {
      title: 'Когда вам нужно, чтобы специалист начал?',
      content: (
        <StartDateSection
          onNext={() => setStep(7)}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, startDate: value }))
          }
        />
      ),
    },
    {
      title: 'Почти готово! Давайте свяжем вас со специалистами.',
      content: (
        <ContactInfoSection
          onSubmit={(contactData) => {
          setFormData((prev) => ({
  ...prev,
  contact: {
    ...prev.contact, 
    ...contactData, 
  },
}));

            setStep(8);
          }}
        />
      ),
    },
  ];

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.nav}>
        {step > 0 && (
          <button className={styles.back} onClick={goBack}>
            ←
          </button>
        )}
        <p className={styles.step}>ШАГ {step + 1}</p>
      </div>

      <h2 className={styles.title}>{steps[step]?.title}</h2>
      {steps[step]?.content}
    </div>
  );
};

export default CreateAccountClient;

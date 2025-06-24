import styles from "./SpecialistCardProfile.module.scss";
import {deleteFileById, uploadSpecialistFile} from "shared/api/files";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "shared/hooks/useAppDispatch";
import {useAppSelector} from "shared/hooks/useAppSelector";
import TagSection from "./TagSection";
import ProjectFiles from "shared/UI/ProjectFiles/ProjectFiles";
import RateItem from "shared/UI/RateItem/RateItem";
import CustomDivTable from "shared/UI/CutomDivTable/CustomDivTable";
import {TrackerNotes} from "widgets/sub_pages/ClientProfile/components/TrackerNotes/TrackerNotes";
import {updateMe} from "shared/store/slices/meSlice";
import Spinner from "shared/UI/Spinner/Spinner";
import {useChatService} from "shared/hooks/useWebsocket";
import IconButton from "shared/UI/IconButton/IconButton";
import Plus from "shared/assets/icons/plus.svg";
import type {FileItem} from "shared/UI/ProjectFiles/ProjectFiles";
import {
    updateProfessionalProfile,
    updateSpecialist,
} from "shared/store/slices/specialistSlice";
import EducationForm from "./EducationForm";
import {selectMe} from "shared/store/slices/meSlice";
import {getProfessionalAreas} from "shared/store/slices/specialistSlice";
import {Service} from "shared/types/professionalArea";
import {
    SpecialistFormData,
    WorkExperienceFormData,
    SpecialistCardProps,
} from "shared/types/specialist";
import Header from "./Header/Header";
import About from "./About/About";
import WorkExperience from "./WorkExperience/WorkExperience";

const SpecialistCard: React.FC<SpecialistCardProps> = ({
                                                           specialist,
                                                           isSelf = false,
                                                       }) => {
    const dispatch = useAppDispatch();

    //services
    const allServices = useAppSelector(
        (state) => state.specialist.professionalAreas
    ).flatMap((area) => area.services || []);

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const {professionalAreas} = useAppSelector((state) => state.specialist);

    useEffect(() => {
        if (!professionalAreas || professionalAreas.length === 0) {
            dispatch(getProfessionalAreas());
        }
    }, [dispatch, professionalAreas]);
    // console.log("professionalAreas:", professionalAreas);


    const navigate = useNavigate();
    const {chats, setActiveChat} = useChatService();
    const {data: me} = useAppSelector(selectMe);
    const meId = me?.id;
    const isAdmin = me?.role?.toLowerCase() === "admin";
    const isSelfViewing = meId && specialist?.id === meId;


    const [isEditMode, setIsEditMode] = useState(false);
    const [showEduForm, setShowEduForm] = useState(false);
    const [formData, setFormData] = useState<SpecialistFormData | null>(null);

    // console.log("ID из useParams:", id);
    // console.log("Список специалистов:", specialistsList);
    // console.log("Найденный специалист:", specialist);

    useEffect(() => {
        if (specialist?.custom_user) {
            setFormData({
                firstName: specialist.custom_user.first_name || "",
                lastName: specialist.custom_user.last_name || "",
                phone: specialist.custom_user.phone_number || "",
                email: specialist.custom_user.email || "",
                website: specialist.custom_user.tg_nickname || "",
                description: specialist.self_description || "",
                is_busy: specialist.is_busy || "Not available",
                hourlyRate:
                    String(specialist.appr_hourly_rate) !== "Not defined"
                        ? String(specialist.appr_hourly_rate)
                        : "",
                hoursPerWeek:
                    String(specialist.hours_per_week) !== "Not defined"
                        ? String(specialist.hours_per_week)
                        : "",
            });
        }
    }, [specialist]);

    const [workExperiences, setWorkExperiences] = useState<
        WorkExperienceFormData[]
    >(
        Array.isArray(specialist.work_experiences)
            ? specialist.work_experiences.map((item, index) => ({
                id: item.id ? String(item.id) : `exp-${index}-${Date.now()}`,
                company_name: item.place_of_work?.company_name || "",
                position: item.position || "",
                started_at: item.started_at || "",
                left_at: item.left_at || "",
                duties: item.duties || "",
            }))
            : []
    );
    const [education, setEducation] = useState({
        university: specialist.university || "",
        faculty: specialist.faculty || "",
    });

    const handleExperienceChange = (
        index: number,
        field: keyof WorkExperienceFormData,
        value: string
    ) => {
        setWorkExperiences((prev) =>
            prev.map((exp, i) => (i === index ? {...exp, [field]: value} : exp))
        );
    };

    const addExperience = () => {
        const uniqueId = `new-${Date.now()}`;
        setWorkExperiences([
            ...workExperiences,
            {
                id: uniqueId,
                company_name: "",
                position: "",
                started_at: "",
                left_at: "",
                duties: "",
            },
        ]);
    };

    const hourlyRateOptions = [
        "Not defined",
        "From 200 rub",
        "200-300 rub",
        "300-500 rub",
        "500-700 rub",
        "700-1000 rub",
        "1000-1500 rub",
        "1500-3000 rub",
        "More than 3000 rub",
    ];
    const hoursPerWeekOptions = [
        "Not defined",
        "Up to 5 hours",
        "5-10 hours",
        "10-20 hours",
        "20-30 hours",
        "30-40 hours",
        "More than 40 hours",
    ];

    if (!specialist?.custom_user) return <Spinner/>;

    const {custom_user} = specialist;
    const specialistProjects = specialist.projects || [];
    const activeProjects = specialistProjects.filter(
        (project) => project.status === "in_progress"
    );
    const finishedProjects = specialistProjects.filter(
        (project) => project.status === "completed"
    );

    const handleChatClick = () => {
        const specialistUserId = String(custom_user.id);
        const chat = chats.find((chat) =>
            chat.participants?.some((p: any) => String(p.id) === specialistUserId)
        );
        if (chat) {
            setActiveChat(chat.id);
            navigate("/manager/chats");
        } else {
            alert("Чат с этим специалистом не найден.");
        }
    };
    const handleInputChange = (
        field: keyof SpecialistFormData,
        value: string
    ) => {
        setFormData((prev) => (prev ? {...prev, [field]: value} : null));
    };

    const handleSave = async () => {
        try {
            const invalidExperiences = workExperiences.filter(
                (exp) => !exp.company_name || exp.company_name.trim() === ""
            );
            if (invalidExperiences.length > 0) {
                alert(
                    "Пожалуйста, заполните название компании для всех записей опыта работы."
                );
                return;
            }

            // Сборка опыта работы
            const filteredExperiences = workExperiences.map((item) => {
                const experience = {
                    place_of_work: {
                        company_name: item.company_name,
                        ...(item.id &&
                        specialist.work_experiences?.find(
                            (exp: any) => String(exp.id) === item.id
                        )
                            ? {
                                id: specialist.work_experiences.find(
                                    (exp: any) => String(exp.id) === item.id
                                ).place_of_work.id,
                            }
                            : {}),
                    },
                    position: item.position || null,
                    started_at: item.started_at || null,
                    left_at: item.left_at || null,
                    duties: item.duties || null,
                };
                return item.id ? {...experience, id: parseInt(item.id)} : experience;
            });

            const meFields = {
                phone_number: formData.phone,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                tg_nickname: formData.website,
            };
            if (
                formData.website &&
                formData.website.trim() !== "" &&
                formData.website.trim() !== (specialist.custom_user.tg_nickname || "")
            ) {
                meFields.tg_nickname = formData.website.trim();
            }
            const cleanedMeData: any = {};

            if (
                formData.phone &&
                formData.phone.trim() !== "" &&
                formData.phone.trim() !== (specialist.custom_user.phone_number || "")
            ) {
                cleanedMeData.phone_number = formData.phone.trim();
            }

            if (
                formData.firstName &&
                formData.firstName.trim() !== "" &&
                formData.firstName.trim() !== (specialist.custom_user.first_name || "")
            ) {
                cleanedMeData.first_name = formData.firstName.trim();
            }

            if (
                formData.lastName &&
                formData.lastName.trim() !== "" &&
                formData.lastName.trim() !== (specialist.custom_user.last_name || "")
            ) {
                cleanedMeData.last_name = formData.lastName.trim();
            }

            if (
                formData.email &&
                formData.email.trim() !== "" &&
                formData.email.trim() !== (specialist.custom_user.email || "")
            ) {
                cleanedMeData.email = formData.email.trim();
            }

            if (
                formData.website &&
                formData.website.trim() !== "" &&
                formData.website.trim() !== (specialist.custom_user.tg_nickname || "")
            ) {
                cleanedMeData.tg_nickname = formData.website.trim();
            }

            const cleanedSpecialistData: any = {};
            const specialistFields = {
                self_description: formData.description,
                appr_hourly_rate: formData.hourlyRate,
                hours_per_week: formData.hoursPerWeek,
                university: education.university,
                faculty: education.faculty,
                is_busy: formData.is_busy,
                work_experiences: filteredExperiences,
            };
            Object.entries(specialistFields).forEach(([key, value]) => {
                if (value !== "" && !(Array.isArray(value) && value.length === 0)) {
                    cleanedSpecialistData[key] = value;
                }
            });

            const findProfessionAndAreaByService = (selectedServiceId: number) => {
                for (const area of professionalAreas) {
                    for (const profession of area.professions) {
                        const service = profession.services.find(
                            (s) => s.id === selectedServiceId
                        );
                        if (service) {
                            return {
                                areaId: area.id,
                                professionId: profession.id,
                                serviceId: selectedServiceId,
                            };
                        }
                    }
                }
                return null;
            };

            if (selectedService) {
                const selected = findProfessionAndAreaByService(selectedService.id);

                if (selected) {
                    await dispatch(
                        updateProfessionalProfile({
                            specialist: specialist.id,
                            professional_area: selected.areaId,
                            profession: selected.professionId,
                            services: [selected.serviceId],
                        })
                    );
                } else {
                    console.error("❌ Не удалось найти услугу в professionalAreas");
                }
            }


            if (isAdmin && !isSelfViewing) {
                await dispatch(
                    updateSpecialist({
                        ...cleanedSpecialistData,
                        id: specialist.id,
                        custom_user: cleanedMeData,
                    })
                ).unwrap();
            } else {
                if (Object.keys(cleanedMeData).length > 0) {
                    await dispatch(updateMe(cleanedMeData)).unwrap();
                }
                if (Object.keys(cleanedSpecialistData).length > 0) {
                    await dispatch(updateSpecialist(cleanedSpecialistData)).unwrap();
                }
            }

            setIsEditMode(false);
            navigate(0);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        }
    };
    const handleAvatarUpload = (file: File) => {
        const formData = new FormData();
        formData.append("custom_user.avatar", file);
        formData.append("id", specialist.id.toString()); // обязательно, если бэк ожидает id

        dispatch(updateSpecialist(formData));
    };

    const handleAddService = async (newService: string) => {
        if (!newService.trim()) return;
        const updatedServices = [...(specialist.services || []), newService];
        try {
            await dispatch(updateSpecialist({services: updatedServices})).unwrap();
        } catch (error) {
            console.error("Ошибка при добавлении услуги:", error);
        }
    };

    const handleAddScope = async (newScope: string) => {
        const updated = [...(specialist.business_scopes || []), newScope];
        try {
            await dispatch(updateSpecialist({business_scopes: updated})).unwrap();
        } catch (error) {
            console.error("Ошибка при обновлении ниш:", error);
        }
    };

    const handleFileSelect = async (file: File) => {
        try {
            await uploadSpecialistFile(file, file.name, specialist.id, "Описание");
        } catch (error) {
            console.error("Ошибка загрузки файла:", error);
        }
    };

    const handleDeleteFile = async (file: FileItem) => {
        try {
            await deleteFileById("specialist", file.id);
        } catch (e) {
            console.error("Ошибка при удалении файла", e);
        }
    };

    // console.log("me:", me);
    if (!specialist?.custom_user || !formData) return <Spinner/>;

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <Header
                    customUser={custom_user}
                    isBusy={formData.is_busy !== "Available"}
                    overallRating={Number(specialist.overall_rating) || 0}
                    isEditMode={isEditMode}
                    formData={formData}
                    onFieldChange={handleInputChange}
                    onAvatarUpload={handleAvatarUpload}
                    onToggleEdit={() => setIsEditMode((prev) => !prev)}
                    onSave={handleSave}
                    onChatClick={handleChatClick}
                    isAdmin={isAdmin}
                    isSelfViewing={isSelfViewing}
                    specialist={specialist}
                />
                <About
                    isEditMode={isEditMode}
                    formData={formData}
                    onFieldChange={handleInputChange}
                    specialist={specialist}
                    onEnterEdit={() => setIsEditMode(true)}
                />
                <div className={styles.experience}>
                    <ProjectFiles
                        files={specialist.file?.map((f) => ({
                            id: f.id,
                            name: f.name,
                            fileUrl: f.file,
                        }))}
                        onFileSelect={handleFileSelect}
                        onFileDelete={handleDeleteFile}
                    />

                    <TagSection
                        title="Опыт в нишах"
                        tags={
                            specialist.professional_profiles
                                ?.map((p) => p.profession?.name)
                                .filter(Boolean) || []
                        }
                        align="center"
                        className={styles.column}
                    />
                </div>
                <div className={styles.rateBlock}>
                    <RateItem
                        title="Примерная ставка в час"
                        value={
                            isEditMode ? (
                                <select
                                    className={styles.inputField}
                                    value={formData.hourlyRate}
                                    onChange={(e) =>
                                        handleInputChange("hourlyRate", e.target.value)
                                    }
                                >
                                    {hourlyRateOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : formData.hourlyRate &&
                            formData.hourlyRate !== "Not defined" ? (
                                formData.hourlyRate
                            ) : (
                                "Не указано"
                            )
                        }
                    />
                    <RateItem
                        title="Занятость в неделю"
                        value={
                            isEditMode ? (
                                <select
                                    className={styles.inputField}
                                    value={formData.hoursPerWeek}
                                    onChange={(e) =>
                                        handleInputChange("hoursPerWeek", e.target.value)
                                    }
                                >
                                    {hoursPerWeekOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : formData.hoursPerWeek &&
                            formData.hoursPerWeek !== "Not defined" ? (
                                formData.hoursPerWeek
                            ) : (
                                "Не указано"
                            )
                        }
                    />
                    <RateItem
                        title="Часовой пояс"
                        value={custom_user.time_zone || "Не указано"}
                    />
                </div>
                <div className={styles.projects}>
                    {specialistProjects.length === 0 ? (
                        <p>Нет активных проектов</p>
                    ) : (
                        <CustomDivTable
                            activeProjects={activeProjects}
                            headers={[
                                "Название",
                                "Клиент",
                                "Трекер",
                                "Таймлайн",
                                "Сумма",
                                "Осталось",
                            ]}
                            rows={activeProjects.map((project) => [
                                project.name || "Нет названия",
                                project.client || "—",
                                project.tracker || "—",
                                project.timeline || "Нет дат",
                                project.task_total_sum?.toString() ?? "Нет суммы",
                                project.tasks_left?.toString() ?? "Нет данных",
                            ])}
                        />
                    )}
                </div>
                {finishedProjects.length > 0 && (
                    <div className={styles.finishedProjects}>
                        <div className={styles.header}>
                            <h3 className={styles.title}>Выполненные проекты</h3>
                            <span className={styles.count}>{finishedProjects.length}</span>
                        </div>
                        <div className={styles.table}>
                            <div className={`${styles.row} ${styles.head}`}>
                                <div>Название</div>
                                <div>Клиент</div>
                                <div>Трекер</div>
                                <div>Таймлайн</div>
                                <div>Оценка трекеров</div>
                                <div>Оценка заказчика</div>
                            </div>
                            {finishedProjects.map((project, index) => (
                                <div className={styles.row} key={index}>
                                    <div>{project.name || "Нет названия"}</div>
                                    <div>{project.client || "—"}</div>
                                    <div>{project.tracker || "—"}</div>
                                    <div>{project.timeline || "Нет дат"}</div>
                                    <div>{project.tracker_rating || "0"}</div>
                                    <div>{project.client_rating || "0"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className={styles.trackerNotes}>
                    <TrackerNotes/>
                </div>
                <div className={styles.education}>
                    <h3 className={styles.title}>Образование</h3>
                    {isEditMode ? (
                        <EducationForm value={education} onChange={setEducation}/>
                    ) : specialist.university || specialist.faculty ? (
                        <div className={styles.item}>
                            <p className={styles.label}>
                                {specialist.university || "Учебное заведение не указано"}
                            </p>
                            <p className={styles.text}>
                                {specialist.faculty || "Факультет / специальность не указаны"}
                            </p>
                        </div>
                    ) : (
                        <IconButton
                            alt="Добавить"
                            border="none"
                            icon={Plus}
                            onClick={() => setIsEditMode(true)}
                        />
                    )}
                </div>
                <WorkExperience
                    isEditMode={isEditMode}
                    workExperiences={workExperiences}
                    onChange={handleExperienceChange}
                    onAdd={addExperience}
                    />
            </div>
        </div>
    );
};

export default SpecialistCard;

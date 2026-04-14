import asyncio
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.sachet import Sachet
from app.core.database import SessionLocal, engine
from sqlalchemy import select

async def populate():
    sachets_data = [
        {
            "name": "Женский Набор — 5 капсул",
            "slug": "women-set-5",
            "description_short": "Комплекс для женского здоровья, энергии и гормонального баланса.",
            "description_long": "Специально разработанный комплекс из 5 капсул для поддержки женского организма. Сочетает в себе Магний для спокойствия, D3+K2 для костей и иммунитета, Инозитол для гормонального здоровья, 5-HTP для настроения и Коэнзим Q10 для молодости клеток.",
            "benefits": [
                "Гормональный баланс и поддержка цикла",
                "Улучшение настроения и качества сна",
                "Поддержка молодости кожи и энергии",
                "Укрепление костной ткани и иммунитета"
            ],
            "dosage": "5 капсул",
            "usage": "Принимать по 1 саше в день во время завтрака или обеда.",
            "sale_price": 385000.0,
            "composition": {
                "ingredients": [
                    {"name": "Магний бисглицинат + В6", "dosage": "Mg 125 мг | B6 2 мг", "daily_value": "100%"},
                    {"name": "Витамин D3 + K2", "dosage": "D3 50 мкг (2000 МЕ) | K2 30 мкг", "daily_value": "100%"},
                    {"name": "Инозитол", "dosage": "Инозитол 683 мг | B9 100 мкг | D3 2.5 мкг", "daily_value": "45%"},
                    {"name": "5-HTP", "dosage": "50 мг | Mg 120 мг", "daily_value": "100%"},
                    {"name": "Коэнзим Q10", "dosage": "30 мг", "daily_value": "100%"}
                ]
            }
        },
        {
            "name": "Мужской Набор — 4 капсулы",
            "slug": "men-set-4",
            "description_short": "Набор для мужской силы, выносливости и эмоционального спокойствия.",
            "description_long": "Оптимальный набор для современного мужчины. Включает 5-HTP для контроля стресса, Магний для восстановления, полноценный В-комплекс для работы нервной системы и Глицин для ментальной концентрации.",
            "benefits": [
                "Повышение стрессоустойчивости",
                "Восстановление после физических нагрузок",
                "Улучшение работы нервной системы",
                "Поддержка ментальной концентрации"
            ],
            "dosage": "4 капсулы",
            "usage": "Принимать по 1 саше в первой половине дня после еды.",
            "sale_price": 345000.0,
            "composition": {
                "ingredients": [
                    {"name": "5-HTP", "dosage": "50 мг | Mg 120 мг", "daily_value": "100%"},
                    {"name": "Магний бисглицинат + В6", "dosage": "Mg 125 мг | B6 2 мг", "daily_value": "100%"},
                    {"name": "В-комплекс", "dosage": "8 витаминов группы B (высокие дозировки)", "daily_value": "300%"},
                    {"name": "Глицин", "dosage": "1000 мг/сут", "daily_value": "30%"}
                ]
            }
        },
        {
            "name": "Набор для похудения — 5 капсул",
            "slug": "weight-loss-set-5",
            "description_short": "Ускорение метаболизма и контроль аппетита для вашей идеальной формы.",
            "description_long": "Мощный жиросжигающий и метаболический комплекс. Сочетает L-карнитин для транспорта энергии, Альфа-липоевую кислоту (АЛК) для обмена веществ, Хром для подавления тяги к сладкому, а также Магний и В-комплекс для поддержки организма в период дефицита калорий.",
            "benefits": [
                "Ускорение жирового обмена",
                "Снижение тяги к сладкому и аппетита",
                "Поддержка энергии при тренировках",
                "Детокс-эффект и защита печени"
            ],
            "dosage": "5 капсул",
            "usage": "Принимать 1 саше за 30 минут до тренировки или в первой половине дня.",
            "sale_price": 425000.0,
            "composition": {
                "ingredients": [
                    {"name": "Магний бисглицинат + В6", "dosage": "Mg 125 мг | B6 2 мг", "daily_value": "100%"},
                    {"name": "В-комплекс", "dosage": "8 витаминов группы B", "daily_value": "100%"},
                    {"name": "L-карнитин", "dosage": "306 мг (чистый L-карнитин)", "daily_value": "100%"},
                    {"name": "Альфа-липоевая кислота", "dosage": "100 мг", "daily_value": "300%"},
                    {"name": "Пиколинат хрома", "dosage": "250 мкг", "daily_value": "500%"}
                ]
            }
        },
        {
            "name": "Набор для нервной системы — 5 капсул",
            "slug": "nervous-system-set-5",
            "description_short": "Защита от стресса и поддержка когнитивных функций в условиях нагрузки.",
            "description_long": "Максимальный антистресс-комплекс. Магний, 5-HTP и Глицин работают на быстрое расслабление и нормализацию сна, а L-Тирозин с Йодом и В-комплекс поддерживают высокую работоспособность мозга и щитовидную железу.",
            "benefits": [
                "Мгновенное снижение уровня стресса",
                "Нормализация фаз сна",
                "Поддержка щитовидной железы",
                "Защита от эмоционального выгорания"
            ],
            "dosage": "5 капсул",
            "usage": "Принимать 1 саше за 2-3 часа до сна или в период пиковых стрессовых нагрузок.",
            "sale_price": 395000.0,
            "composition": {
                "ingredients": [
                    {"name": "Магний бисглицинат + В6", "dosage": "Mg 125 мг | B6 2 мг", "daily_value": "100%"},
                    {"name": "5-HTP", "dosage": "50 мг | Mg 120 мг", "daily_value": "100%"},
                    {"name": "Глицин", "dosage": "1000 мг", "daily_value": "30%"},
                    {"name": "L-Тирозин + Йод", "dosage": "Тирозин 500 мг | Йод 75 мкг", "daily_value": "50%"},
                    {"name": "В-комплекс", "dosage": "Полный спектр витаминов B", "daily_value": "150%"}
                ]
            }
        }
    ]

    async with SessionLocal() as session:
        for s_data in sachets_data:
            # Check if exists
            stmt = select(Sachet).where(Sachet.slug == s_data["slug"])
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if existing:
                print(f"Sachet {s_data['name']} already exists, updating...")
                for key, value in s_data.items():
                    setattr(existing, key, value)
            else:
                print(f"Creating sachet: {s_data['name']}")
                new_sachet = Sachet(**s_data)
                session.add(new_sachet)
        
        await session.commit()
    print("Done populating sachets!")

if __name__ == "__main__":
    asyncio.run(populate())

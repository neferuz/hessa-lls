import asyncio
import json
from app.core.database import SessionLocal, engine
from app.models.sachet import Sachet
from sqlalchemy import select

async def seed_sachet():
    # List of sachets to seed
    sachets_to_seed = [
        {
            "name": "ЖЕНСКИЙ НАБОР",
            "slug": "female-complex-set",
            "dosage": "5 капсул в саше",
            "benefits": ["Beauty", "Skin", "Energy", "Hormones"],
            "description_short": "Персональный комплекс для женского здоровья и энергии.",
            "description_long": "Сбалансированная комбинация нутриентов, направленная на поддержку гормонального фона, нервной системы и красоты кожи, волос и ногтей.",
            "cost_price": 12.5,
            "sale_price": 450000.0,
            "is_active": True,
            "composition": {
                "capsules": [
                    {
                        "name": "Магний бисглицинат + В6",
                        "ingredients": [
                            {"name": "Магний бисглицинат", "dosage": "125 мг (Mg)", "daily_value": ""},
                            {"name": "Витамин В6", "dosage": "2 мг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Витамин D3 + K2",
                        "ingredients": [
                            {"name": "Витамин D3", "dosage": "50 мкг (2000 МЕ)", "daily_value": ""},
                            {"name": "Витамин K2", "dosage": "30 мкг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Инозитол",
                        "ingredients": [
                            {"name": "Инозитол", "dosage": "683 мг", "daily_value": ""},
                            {"name": "Витамин B9", "dosage": "100 мкг", "daily_value": ""},
                            {"name": "Витамин D3", "dosage": "2.5 мкг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "5-HTP",
                        "ingredients": [
                            {"name": "5-HTP", "dosage": "50 мг", "daily_value": ""},
                            {"name": "Магний", "dosage": "120 мг (Mg)", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Коэнзим Q10",
                        "ingredients": [
                            {"name": "Коэнзим Q10", "dosage": "30 мг", "daily_value": ""}
                        ]
                    }
                ]
            }
        },
        {
            "name": "МУЖСКОЙ НАБОР",
            "slug": "male-complex-set",
            "dosage": "4 капсулы в саше",
            "benefits": ["Focus", "Strength", "Recovery", "Energy"],
            "description_short": "Комплексная поддержка мужского организма и ментальной концентрации.",
            "description_long": "Оптимальный набор нутриентов для поддержания высокого уровня энергии, стрессоустойчивости и физической активности.",
            "cost_price": 10.5,
            "sale_price": 380000.0,
            "is_active": True,
            "composition": {
                "capsules": [
                    {
                        "name": "5-HTP",
                        "ingredients": [
                            {"name": "5-HTP", "dosage": "50 мг", "daily_value": ""},
                            {"name": "Магний", "dosage": "120 мг (Mg)", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Магний бисглицинат + В6",
                        "ingredients": [
                            {"name": "Магний бисглицинат", "dosage": "125 мг (Mg)", "daily_value": ""},
                            {"name": "Витамин В6", "dosage": "2 мг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "В-комплекс",
                        "ingredients": [
                            {"name": "Витамины группы B (8 видов)", "dosage": "комплекс", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Глицин",
                        "ingredients": [
                            {"name": "Глицин", "dosage": "400 мг", "daily_value": ""}
                        ]
                    }
                ]
            }
        },
        {
            "name": "НАБОР ДЛЯ ПОХУДЕНИЯ",
            "slug": "slimming-complex-set",
            "dosage": "5 капсул в саше",
            "benefits": ["Metabolism", "Weight Loss", "Energy", "Sugar Control"],
            "description_short": "Сбалансированный комплекс для поддержки обмена веществ и контроля веса.",
            "description_long": "Комбинация активных компонентов, способствующих эффективному жиросжиганию, снижению аппетита и поддержанию высокого уровня энергии во время диеты.",
            "cost_price": 11.0,
            "sale_price": 420000.0,
            "is_active": True,
            "composition": {
                "capsules": [
                    {
                        "name": "Магний бисглицинат + В6",
                        "ingredients": [
                            {"name": "Магний бисглицинат", "dosage": "125 мг (Mg)", "daily_value": ""},
                            {"name": "Витамин В6", "dosage": "2 мг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "В-комплекс",
                        "ingredients": [
                            {"name": "Витамины группы B (8 видов)", "dosage": "комплекс", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "L-карнитин",
                        "ingredients": [
                            {"name": "L-карнитин тартрат", "dosage": "500 мг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Альфа-липоевая кислота",
                        "ingredients": [
                            {"name": "Альфа-липоевая кислота (АЛК)", "dosage": "100 мг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Пиколинат хрома",
                        "ingredients": [
                            {"name": "Хром (Пиколинат)", "dosage": "500 мкг", "daily_value": ""}
                        ]
                    }
                ]
            }
        },
        {
            "name": "НАБОР ДЛЯ НЕРВНОЙ СИСТЕМЫ",
            "slug": "nervous-system-set",
            "dosage": "5 капсул в саше",
            "benefits": ["Stress Relief", "Sleep Quality", "Mental Health", "Cognitive Support"],
            "description_short": "Комплекс для укрепления нервной системы и снижения уровня стресса.",
            "description_long": "Гармоничное сочетание аминокислот и минералов, направленное на улучшение качества сна, эмоциональную стабильность и защиту организма от перенапряжения.",
            "cost_price": 13.0,
            "sale_price": 480000.0,
            "is_active": True,
            "composition": {
                "capsules": [
                    {
                        "name": "Магний бисглицинат + В6",
                        "ingredients": [
                            {"name": "Магний бисглицинат", "dosage": "125 мг (Mg)", "daily_value": ""},
                            {"name": "Витамин В6", "dosage": "2 мг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "5-HTP",
                        "ingredients": [
                            {"name": "5-HTP", "dosage": "50 мг", "daily_value": ""},
                            {"name": "Магний", "dosage": "120 мг (Mg)", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "Глицин",
                        "ingredients": [
                            {"name": "Глицин", "dosage": "400 мг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "L-Тирозин + Йод",
                        "ingredients": [
                            {"name": "L-Тирозин", "dosage": "330 мг", "daily_value": ""},
                            {"name": "Йод", "dosage": "75 мкг", "daily_value": ""}
                        ]
                    },
                    {
                        "name": "В-комплекс",
                        "ingredients": [
                            {"name": "Витамины группы B (8 видов)", "dosage": "комплекс", "daily_value": ""}
                        ]
                    }
                ]
            }
        }
    ]

    async with SessionLocal() as session:
        for sachet_data in sachets_to_seed:
            # Check if already exists
            result = await session.execute(select(Sachet).where(Sachet.slug == sachet_data["slug"]))
            existing = result.scalar_one_or_none()
            
            if existing:
                print(f"Sachet with slug '{sachet_data['slug']}' already exists. Updating...")
                for key, value in sachet_data.items():
                    setattr(existing, key, value)
            else:
                print(f"Creating new sachet: {sachet_data['name']}")
                new_sachet = Sachet(**sachet_data)
                session.add(new_sachet)
                
        await session.commit()
        print("Success!")

if __name__ == "__main__":
    asyncio.run(seed_sachet())

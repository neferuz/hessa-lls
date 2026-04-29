import httpx
import json
from typing import Dict, Any, List

class AIService:
    def __init__(self):
        self.api_key = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjFrYnhacFJNQGJSI0tSbE1xS1lqIn0.eyJ1c2VyIjoiYmo1MzAyNiIsInR5cGUiOiJhcGlfa2V5IiwiYXBpX2tleV9pZCI6IjdiZmQwMmQ4LTIzNzMtNDQ4NS1iYWI1LTBhYmM2MDExNTZjOSIsImlhdCI6MTc2OTg5MDg5M30.V55-H_xiCd34g91EqxRU_4P1MP07J32NczS-EkA-47FQj-7bW22uBMweI_BIMQVZlFA8AFjuDRpiBx7jbeMNuOTrwH0KQOhYOWAwDwiDb4iaYO-b8iZL57-7RFeSr8EWxHRE0QgdZ-dLnwusUAJrEu9jTDnyE9NOoq4By0uh2v3qpPuy1FcW438pIyMJEnB_heQf55OcbSzNx1-sR6tlH2PezaD7zL35GDwW4K-4SA1RHHox5YJDcG8M6sYtME9HGXj9CEfVbSf9zeTDZIlioqgHzFzyZ0dDAuqM-mEFmqXEvDdal7U4fCWthaB1pxPGWK-eja-IyP92CAmz8HJpFTLHwAaRd2XrlOabk3zbbcRDOJ0NNFxcG7sChWDefjgZrpmKW3BxM_PcVrQZ79EoX4xXQ1ZOZmkMJTfHOwwmJS_rF7KwR04YYbpTnM7A8F4MPYlFZOKJ_PvKOCUzOv3IzUDzElZKcONNexbsnVfiVqUe8vvVZB31FG-Y8NQtnjhD"
        self.endpoint = "https://agent.timeweb.cloud/api/v1/cloud-ai/agents/2bd3b129-4582-4b32-a836-299dd177165b/v1/chat/completions"
        self.system_prompt = """
Вы — экспертный ассистент-нутрициолог HESSA. Ваша задача — собрать персональный набор витаминов (состав) из нашего каталога саше.

ИНСТРУКЦИИ:
1. Тщательно изучите ответы пользователя: его цели, уровень стресса, качество сна, иммунитет и физическую активность.
2. Подберите ОДНО САМОЕ ПОДХОДЯЩЕЕ саше (набор), которое максимально полно решает запросы пользователя.
3. Обоснуйте выбор: объясните роль этого конкретного набора для пользователя.
4. Пишите СТРОГО 1-2 предложения общего вывода.
5. Максимум 20 слов для общего обоснования. Тон: премиальный, научный, лаконичный.
6. В reasoning объясните, почему именно этот набор является идеальным решением.
7. НЕ перечисляйте исходные данные в ответе.

СПИСОК САШЕ (КОМПОНЕНТОВ):
{sachets_context}

ФОРМАТ ОТВЕТА (JSON):
{{
  "box_name": "Название (только для контекста, будет замещено именем из БД)",
  "sachet_ids": [ID_выбранного_саше], 
  "reasoning": "Краткое профессиональное обоснование одним предложением почему это лучшее решение",
  "sachet_reasons": {{
      "ID_саше": "Почему это саше нужно именно этому пользователю"
  }},
  "stats": {{
      "rating": 4.8, 
      "reviews_count": 1050, 
      "effectiveness": 90,
      "stat1_label": "Стресс",
      "stat1_value": 96,
      "stat2_label": "Восстановление",
      "stat2_value": 92,
      "stat3_label": "Концентрация",
      "stat3_value": 95,
      "trust_blocks": [
          {{ "title": "Клинически оптимизированный состав", "description": "Комбинация нутриентов подобрана для синергичного действия на стресс и восстановление." }},
          {{ "title": "Премиальное качество сырья", "description": "Строгий контроль качества и стандартизация дозировок для стабильного эффекта." }}
      ]
  }}
}}
"""

    chat_system_prompt = """
Вы — дружелюбный и компетентный AI-консультант бренда HESSA.
Ваша цель — помогать пользователям с вопросами о здоровье, нутрициологии и наших продуктах (саше).

КОНТЕКСТ КОМПОНЕНТОВ (САШЕ) HESSA:
{sachets_context}

ИНСТРУКЦИИ:
1. Отвечайте кратко, полезно и с заботой (tone of voice: warm, professional, premium).
2. Если пользователь спрашивает о проблеме (сон, стресс, вес), предлагайте подходящие саше из списка выше.
3. Если вопрос не связан с продуктами HESSA или здоровьем, вежливо верните тему к здоровью.
4. Не выдумывайте продукты, которых нет в списке.
"""

    async def get_recommendation(self, quiz_answers: Dict[str, Any], sachets: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Form sachets context for AI
        ctx = ""
        for s in sachets:
            desc = s.get("description_short") or s.get("description_long") or ""
            benefits = ", ".join(s.get("benefits") or [])
            ctx += f"ID: {s['id']}, Название: {s['name']}, Дозировка: {s.get('dosage')}, Преимущества: {benefits}, Описание: {desc}\n"
        
        user_message = f"Ответы пользователя: {json.dumps(quiz_answers, ensure_ascii=False)}"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messages": [
                {"role": "system", "content": self.system_prompt.format(sachets_context=ctx)},
                {"role": "user", "content": user_message}
            ]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.endpoint, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                content = data['choices'][0]['message']['content']
                
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                return json.loads(content)
            except Exception as e:
                print(f"AI Service Error: {e}")
                
                # Smart fallback based on answers
                gender = quiz_answers.get("Ваш пол:", "").lower()
                goals = quiz_answers.get("🎯 ШАГ 1: ОПРЕДЕЛИТЕ ВАШИ ПРИОРИТЕТЫ", "").lower()
                
                # Default to Female set
                sachet_id = 2 
                box_name = "ЖЕНСКИЙ НАБОР"
                reasoning = "Сбалансированный комплекс нутриентов для поддержания женского здоровья и энергии."
                
                if "мужчина" in gender:
                    sachet_id = 3
                    box_name = "МУЖСКОЙ НАБОР"
                    reasoning = "Комплекс для активного образа жизни, поддержки мужского здоровья и бодрости."
                elif "вес" in goals:
                    sachet_id = 4
                    box_name = "НАБОР ДЛЯ ПОХУДЕНИЯ"
                    reasoning = "Специально подобранные компоненты для ускорения обмена веществ и контроля аппетита."
                elif "стресс" in goals or "спокойствие" in goals:
                    sachet_id = 5
                    box_name = "НАБОР ДЛЯ НЕРВНОЙ СИСТЕМЫ"
                    reasoning = "Гармоничное сочетание магния и витаминов для устойчивости к стрессу и глубокого сна."

                return {
                    "box_name": box_name,
                    "sachet_ids": [sachet_id],
                    "reasoning": reasoning,
                    "sachet_reasons": {
                        str(sachet_id): reasoning
                    },
                    "stats": {
                        "rating": 4.9,
                        "reviews_count": 1083,
                        "effectiveness": 95,
                        "stat1_label": "Грамотный подбор",
                        "stat1_value": 96,
                        "stat2_label": "Удобно принимать",
                        "stat2_value": 93,
                        "stat3_label": "Самочувствие",
                        "stat3_value": 95,
                        "trust_blocks": [
                            { "title": "Собственное производство", "description": "Контроль качества на каждом этапе" },
                            { "title": "Сертифицировано", "description": "Продукты сертифицированы по стандартам" },
                            { "title": "Формулы врачей", "description": "Составы постоянно совершенствуются экспертами" },
                            { "title": "Умный подбор", "description": "Опрос учитывает сочетаемость компонентов" }
                        ]
                    }
                }

    async def chat(self, messages: List[Dict[str, str]], products: List[Dict[str, Any]]) -> str:
        ctx = ""
        for p in products:
            desc = p.get("description") or ""
            comp_str = ""
            if p.get("composition"):
                comp_str = f" Состав: {json.dumps(p['composition'], ensure_ascii=False)}"
            ctx += f"ID: {p['id']}, Название: {p['name']},{comp_str} Описание: {desc}\n"
            
        system_message = {"role": "system", "content": self.chat_system_prompt.format(sachets_context=ctx)}
        
        # Prepend system message
        full_messages = [system_message] + messages
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messages": full_messages
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.endpoint, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                return data['choices'][0]['message']['content']
            except Exception as e:
                print(f"AI Chat Error: {e}")
                return "Извините, сейчас я не могу ответить. Пожалуйста, попробуйте позже."

ai_service = AIService()

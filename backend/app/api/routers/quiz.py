from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ...core.database import get_db
from ...models.plan import Plan
from app.schemas.quiz import QuizData
from app.repositories.quiz import quiz_repo
from app.schemas.recommendation import RecommendationResult, RecommendationProduct
from app.services.ai_service import ai_service
from ...models.product import Product
from ...models.sachet import Sachet
from typing import Dict, List
import json

router = APIRouter()

@router.get("/quiz", response_model=QuizData)
async def get_quiz():
    """Fetch quiz questions"""
    return quiz_repo.get_quiz()

@router.post("/quiz", response_model=QuizData)
async def update_quiz(data: QuizData):
    """Update quiz questions"""
    return quiz_repo.update_quiz(data)

@router.post("/quiz/recommend", response_model=RecommendationResult)
async def get_recommendations(answers: Dict[str, str] = Body(...), db: AsyncSession = Depends(get_db)):
    # 1. Fetch all sachets for AI context
    stmt = select(Sachet).where(Sachet.is_active == True)
    result = await db.execute(stmt)
    db_sachets = result.scalars().all()
    
    # Format for AI service
    sachets_list = []
    for s in db_sachets:
        s_dict = {
            "id": s.id,
            "name": s.name,
            "benefits": s.benefits,
            "dosage": s.dosage,
            "description_short": s.description_short,
            "description_long": s.description_long
        }
        sachets_list.append(s_dict)
        
    # 2. Enrich answers with question text and option text for AI
    quiz_data = quiz_repo.get_quiz()
    enriched_answers = {}
    
    for q in quiz_data.questions:
        user_val = answers.get(q.id)
        if user_val:
            if q.type == "options":
                if q.multiple:
                    selected_ids = user_val.split(',')
                    option_texts = [next((opt.text for opt in q.options if opt.id == sid), sid) for sid in selected_ids]
                    enriched_answers[q.label] = ", ".join(option_texts)
                else:
                    option_text = next((opt.text for opt in q.options if opt.id == user_val), user_val)
                    enriched_answers[q.label] = option_text
            else:
                enriched_answers[q.label] = user_val
                
    # 3. Get recommendation from AI
    ai_resp = await ai_service.get_recommendation(enriched_answers, sachets_list)
    sachet_ids = ai_resp.get("sachet_ids", [])
    box_name = ai_resp.get("box_name", "HESSA Personal Box")
    ai_reasoning = ai_resp.get("reasoning", "Персональный баланс микронутриентов для вашего организма.")
    sachet_reasons = ai_resp.get("sachet_reasons", {})
    
    # 4. Prepare Recommended Sachets
    recommended_sachets = []
    if sachet_ids and isinstance(sachet_ids, list):
        for s_id in sachet_ids:
            try:
                target_id = int(s_id)
            except:
                continue
            # Find sachet in DB
            s_obj = next((s for s in db_sachets if s.id == target_id), None)
            if s_obj:
                s_dict = {
                    "id": s_obj.id,
                    "name": s_obj.name,
                    "dosage": s_obj.dosage,
                    "image": s_obj.image_url or "/static/vitamins-1.png",
                    "reason": sachet_reasons.get(str(s_id)) or s_obj.description_short,
                    "description": s_obj.description_long or s_obj.description_short,
                    "benefits": s_obj.benefits,
                    "composition": s_obj.composition
                }
                recommended_sachets.append(s_dict)

    # Fallback to main product for legacy compatibility if needed
    main_image = "/static/sets/female_set.png" # Default
    if recommended_sachets:
        main_image = recommended_sachets[0]["image"]

    # 5. Fetch subscription plans
    plans_result = await db.execute(select(Plan))
    all_plans = plans_result.scalars().all()
    
    subscription_plans = []
    for plan in all_plans:
        try:
            # Extract only digits from the title (e.g. "1 месяц" -> 1)
            digits = ''.join(filter(str.isdigit, plan.title))
            months = int(digits) if digits else 1
        except Exception:
            months = 1
            
        discount = 0
        if plan.old_price and plan.old_price > plan.price:
            discount = int(round((plan.old_price - plan.price) / plan.old_price * 100))

        subscription_plans.append({
            "months": months,
            "price": plan.price,
            "discount": discount,
            "title": plan.title,
            "items": plan.items or f"Курс на {months} {'месяц' if months == 1 else 'месяца'}"
        })
    
    # Extract stats from AI response
    stats_data = ai_resp.get("stats")
    recommendation_stats = None
    if stats_data and isinstance(stats_data, dict):
        try:
            from app.schemas.recommendation import RecommendationStats
            recommendation_stats = RecommendationStats(**stats_data)
        except Exception as e:
            print(f"Stats validation error: {e}")
            pass

    # Use the specific sachet name as the main title for clarity
    final_title = box_name
    if recommended_sachets:
        primary_sachet = recommended_sachets[0]
        final_title = primary_sachet['name']
        if ":" in box_name:
             context = box_name.split(':')[-1].strip()
             final_title = f"{primary_sachet['name']}: {context}"

    return RecommendationResult(
        title=final_title,
        description=ai_reasoning,
        image=main_image, 
        products=[], 
        sachets=recommended_sachets,
        subscription_plans=subscription_plans,
        stats=recommendation_stats
    )

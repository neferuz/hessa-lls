import asyncio
import logging
import os
import sqlite3
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "http://localhost:3002") # Use localhost for dev
DB_PATH = "hessa.lls"

if not TOKEN:
    TOKEN = "8045133629:AAGMUrr51SLiyJ37b74g71AqLVAV9HNBDd4"

logging.basicConfig(level=logging.INFO)

bot = Bot(token=TOKEN)
dp = Dispatcher()

def normalize_phone(phone: str) -> str:
    # Remove any non-digits
    clean = "".join(filter(str.isdigit, phone))
    # If it's a 9-digit local number, prepend Uzbekistan country code 998
    if len(clean) == 9:
        clean = "998" + clean
    # If it starts with +998, remove the + (handled by isdigit filter already)
    return clean

def save_user(telegram_id, phone, full_name):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        normalized_phone = normalize_phone(phone)
        
        # 1. Check if user exists by telegram_id
        cursor.execute("SELECT id FROM users WHERE telegram_id = ?", (str(telegram_id),))
        user_by_tg = cursor.fetchone()
        
        if user_by_tg:
            # Update info for existing telegram user
            cursor.execute("UPDATE users SET phone = ?, full_name = ? WHERE telegram_id = ?", (normalized_phone, full_name, str(telegram_id)))
            conn.commit()
            logging.info(f"User {telegram_id} info updated")
        else:
            # 2. Check if user exists by phone (registered via website)
            cursor.execute("SELECT id FROM users WHERE phone = ?", (normalized_phone,))
            user_by_phone = cursor.fetchone()
            
            if user_by_phone:
                # Link telegram_id to existing website user
                cursor.execute("UPDATE users SET telegram_id = ?, full_name = ? WHERE phone = ?", (str(telegram_id), full_name, normalized_phone))
                conn.commit()
                logging.info(f"Linked Telegram ID {telegram_id} to existing phone account {normalized_phone}")
            else:
                # 3. Create new user
                username = f"user_{telegram_id}"
                email = f"{telegram_id}@telegram.com"
                hashed_password = "telegram_user" # Placeholder
                import uuid
                referral_code = uuid.uuid4().hex[:8].upper()
                
                cursor.execute(
                    "INSERT INTO users (username, email, telegram_id, hashed_password, phone, full_name, is_active, created_at, referral_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (username, email, str(telegram_id), hashed_password, normalized_phone, full_name, 1, "2024-04-24 10:00:00", referral_code)
                )
                conn.commit()
                logging.info(f"User {telegram_id} registered as a new user with phone {normalized_phone}")
            
        conn.close()
    except Exception as e:
        logging.error(f"Error saving user: {e}")

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    """
    Handle /start command.
    """
    kb = [
        [
            KeyboardButton(text="📱 Отправить номер телефона", request_contact=True)
        ]
    ]
    keyboard = ReplyKeyboardMarkup(keyboard=kb, resize_keyboard=True, one_time_keyboard=True)
    
    await message.answer(
        "👋 Рады видеть вас в HESSA!\n\n"
        "Мы создаем персональные наборы витаминов, основанные на ваших биоритмах и образе жизни.\n\n"
        "Чтобы начать, пожалуйста, **поделитесь вашим номером телефона**, нажав на кнопку ниже. "
        "Это поможет нам сохранить ваш профиль и результаты тестов.",
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.message(F.contact)
async def handle_contact(message: types.Message):
    """
    Handle shared contact and show WebApp button.
    """
    contact = message.contact
    telegram_id = message.from_user.id
    phone = contact.phone_number
    full_name = f"{contact.first_name} {contact.last_name or ''}".strip()
    
    # Save to DB
    save_user(telegram_id, phone, full_name)
    
    # Append user info to WebApp URL
    webapp_url_with_params = f"{WEBAPP_URL}?tg_id={telegram_id}&phone={phone}&name={full_name}"
    
    inline_kb = [
        [
            InlineKeyboardButton(
                text="💊 Открыть Hessa Mini App", 
                web_app=WebAppInfo(url=webapp_url_with_params)
            )
        ]
    ]
    keyboard = InlineKeyboardMarkup(inline_keyboard=inline_kb)
    
    await message.answer(
        f"✅ Приятно познакомиться, {contact.first_name}!\n\n"
        "Теперь вы готовы к прохождению теста и заказу витаминов. "
        "Нажмите на кнопку ниже, чтобы войти в наше приложение.",
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped")

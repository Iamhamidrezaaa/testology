#!/usr/bin/env python3
"""
🕊️ سیستم AI Ethics & Self-Regulation - Testology
چارچوب اخلاقی و خودتنظیم هوش مصنوعی
"""

import json
import os
import sys
import re
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict

# اضافه کردن مسیرهای مورد نیاز
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import dependencies
try:
    from neural_memory import add_memory, retrieve_memory, get_memory_stats
    MEMORY_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ خطا در import: {e}")
    MEMORY_AVAILABLE = False

# قوانین اخلاقی ساده و مؤثر
RULES = [
    {"id": 1, "pattern": r"(خودکشی|مرگ|آسیب|خودآزاری)", "action": "alert", "level": "critical", "message": "⚠️ این موضوع حساس است. لطفاً با یک متخصص واقعی صحبت کنید."},
    {"id": 2, "pattern": r"(دارو|تجویز|درمان پزشکی|نسخه)", "action": "deny", "level": "warning", "message": "🚫 من نمی‌توانم در مورد مسائل دارویی یا پزشکی اظهار نظر کنم."},
    {"id": 3, "pattern": r"(مذهب|سیاست|جنسیت|حزب)", "action": "redirect", "level": "neutral", "message": "💬 بهتر است درباره‌ی احساسات و تجربه‌هایت صحبت کنیم، نه موضوعات خارج از روان‌شناسی."},
    {"id": 4, "pattern": r"(آدرس|تلفن|کد ملی|شماره کارت)", "action": "deny", "level": "warning", "message": "🔒 من نمی‌توانم اطلاعات شخصی شما را درخواست کنم."},
    {"id": 5, "pattern": r".*", "action": "approve", "level": "safe", "message": ""}
]

# الگوهای تشخیصی پیشرفته
ETHICS_PATTERNS = {
    "suicidal_ideation": [
        r"می‌خواهم.*بمیرم",
        r"زندگی.*بی‌معنا",
        r"هیچ.*امیدی.*نیست",
        r"خودکشی.*می‌کنم"
    ],
    "medical_advice": [
        r"داروی.*بخور",
        r"نسخه.*بده",
        r"تشخیص.*بیماری",
        r"درمان.*پزشکی"
    ],
    "personal_information": [
        r"آدرس.*من",
        r"شماره.*تلفن",
        r"کد.*ملی",
        r"شماره.*کارت"
    ],
    "harmful_content": [
        r"خشونت.*فیزیکی",
        r"آزار.*جنسی",
        r"مواد.*مخدر",
        r"سلاح.*گرم"
    ]
}

def evaluate_ethics(text: str) -> Dict[str, Any]:
    """ارزیابی ساده و مؤثر بر اساس قوانین اخلاقی"""
    
    for rule in RULES:
        if re.search(rule["pattern"], text, re.IGNORECASE):
            result = {
                "timestamp": datetime.now().isoformat(),
                "rule_id": rule["id"],
                "action": rule["action"],
                "level": rule["level"],
                "text": text[:100],
                "message": rule["message"]
            }
            
            # ذخیره در حافظه
            if MEMORY_AVAILABLE:
                try:
                    add_memory("ethics_evaluation", "ارزیابی اخلاقی سیستم", result)
                except Exception as e:
                    print(f"⚠️ خطا در ذخیره حافظه: {e}")
            
            return result
    
    return {"action": "approve", "level": "safe", "message": ""}

def ethical_guard(answer: str) -> str:
    """محافظ اخلاقی برای پاسخ‌ها"""
    ethics = evaluate_ethics(answer)
    
    if ethics["action"] == "alert":
        return "⚠️ این موضوع حساس است. لطفاً با یک متخصص واقعی صحبت کنید."
    elif ethics["action"] == "deny":
        return "🚫 من نمی‌توانم در مورد مسائل دارویی یا پزشکی اظهار نظر کنم."
    elif ethics["action"] == "redirect":
        return "💬 بهتر است درباره‌ی احساسات و تجربه‌هایت صحبت کنیم، نه موضوعات خارج از روان‌شناسی."
    else:
        return answer

def analyze_tone(content: str) -> Dict[str, Any]:
    """تحلیل لحن و تن محتوا"""
    
    # کلمات مثبت
    positive_words = [
        "خوب", "عالی", "مثبت", "امیدوار", "خوشحال", "راضی", "مطمئن",
        "موفق", "پیشرفت", "بهبود", "کمک", "حمایت", "همدلی"
    ]
    
    # کلمات منفی
    negative_words = [
        "بد", "منفی", "ناامید", "غمگین", "عصبانی", "ناراضی", "مضطرب",
        "ناموفق", "شکست", "بدتر", "مشکل", "درد", "رنج"
    ]
    
    content_lower = content.lower()
    
    positive_count = sum(1 for word in positive_words if word in content_lower)
    negative_count = sum(1 for word in negative_words if word in content_lower)
    
    total_words = len(content.split())
    positive_score = positive_count / max(total_words, 1)
    negative_score = negative_count / max(total_words, 1)
    
    # تعیین لحن غالب
    if positive_score > negative_score:
        dominant_tone = "positive"
    elif negative_score > positive_score:
        dominant_tone = "negative"
    else:
        dominant_tone = "neutral"
    
    return {
        "positive_score": round(positive_score, 3),
        "negative_score": round(negative_score, 3),
        "dominant_tone": dominant_tone,
        "positive_words_count": positive_count,
        "negative_words_count": negative_count
    }

def get_ethics_statistics() -> Dict[str, Any]:
    """دریافت آمار اخلاقی"""
    
    if not MEMORY_AVAILABLE:
        return {"status": "no_memory", "message": "حافظه در دسترس نیست"}
    
    try:
        # جستجوی بررسی‌های اخلاقی
        ethics_checks = retrieve_memory("بررسی اخلاقی", top_k=100, memory_type="ethics_check")
        
        if not ethics_checks:
            return {"status": "no_data", "message": "هیچ بررسی اخلاقی یافت نشد"}
        
        # تحلیل آمار
        total_checks = len(ethics_checks)
        approved_count = 0
        blocked_count = 0
        flagged_count = 0
        warning_count = 0
        
        ethics_scores = []
        violation_types = defaultdict(int)
        
        for check in ethics_checks:
            memory = check["memory"]
            metadata = memory.get("metadata", {})
            
            status = metadata.get("status", "unknown")
            ethics_score = metadata.get("ethics_score", 0)
            violations_count = metadata.get("violations_count", 0)
            
            if status == "approved":
                approved_count += 1
            elif status == "blocked":
                blocked_count += 1
            elif status == "flagged":
                flagged_count += 1
            elif status == "warning":
                warning_count += 1
            
            if ethics_score > 0:
                ethics_scores.append(ethics_score)
        
        # محاسبه آمار
        avg_ethics_score = sum(ethics_scores) / len(ethics_scores) if ethics_scores else 0
        approval_rate = approved_count / total_checks if total_checks > 0 else 0
        
        stats = {
            "total_checks": total_checks,
            "approved_count": approved_count,
            "blocked_count": blocked_count,
            "flagged_count": flagged_count,
            "warning_count": warning_count,
            "approval_rate": round(approval_rate, 3),
            "avg_ethics_score": round(avg_ethics_score, 3),
            "violation_types": dict(violation_types),
            "ethics_level": "high" if avg_ethics_score > 0.8 else "medium" if avg_ethics_score > 0.6 else "low"
        }
        
        return {"status": "success", "stats": stats}
        
    except Exception as e:
        return {"status": "error", "message": f"خطا در دریافت آمار: {e}"}

def suggest_ethical_improvement(content: str) -> List[str]:
    """پیشنهاد بهبود اخلاقی محتوا"""
    
    suggestions = []
    content_lower = content.lower()
    
    # بررسی لحن منفی
    if any(word in content_lower for word in ["بد", "منفی", "ناامید"]):
        suggestions.append("لطفاً از کلمات مثبت‌تر استفاده کنید")
    
    # بررسی طول پاسخ
    if len(content) > 800:
        suggestions.append("پاسخ را کوتاه‌تر کنید تا قابل فهم‌تر باشد")
    
    # بررسی تخصصی بودن
    if any(word in content_lower for word in ["تشخیص", "دارو", "درمان"]):
        suggestions.append("از ارائه مشاوره پزشکی خودداری کنید")
    
    # بررسی حریم خصوصی
    if any(word in content_lower for word in ["آدرس", "تلفن", "کد ملی"]):
        suggestions.append("از درخواست اطلاعات شخصی خودداری کنید")
    
    return suggestions

def audit_ethics_system() -> Dict[str, Any]:
    """حسابرسی سیستم اخلاقی"""
    
    audit_result = {
        "timestamp": datetime.now().isoformat(),
        "rules_count": len(ETHICS_RULES),
        "patterns_count": len(ETHICS_PATTERNS),
        "system_status": "active",
        "recommendations": []
    }
    
    # بررسی قوانین اخلاقی
    for rule_name, rule_data in ETHICS_RULES.items():
        if not rule_data.get("keywords"):
            audit_result["recommendations"].append(f"قانون {rule_name} فاقد کلمات کلیدی است")
    
    # بررسی الگوهای تشخیصی
    for pattern_name, patterns in ETHICS_PATTERNS.items():
        if not patterns:
            audit_result["recommendations"].append(f"الگوی {pattern_name} فاقد الگو است")
    
    # بررسی حافظه
    if MEMORY_AVAILABLE:
        try:
            memory_stats = get_memory_stats()
            audit_result["memory_status"] = "connected"
            audit_result["memory_stats"] = memory_stats
        except Exception as e:
            audit_result["memory_status"] = "error"
            audit_result["memory_error"] = str(e)
    else:
        audit_result["memory_status"] = "disconnected"
        audit_result["recommendations"].append("حافظه اخلاقی غیرفعال است")
    
    return audit_result

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("⚖️ سیستم AI Ethics & Self-Regulation - Testology")
        print("🧠 تبدیل به موجود خودناظر")
        print("=" * 50)
        
        # تست سیستم اخلاقی
        test_cases = [
            "من دارم به مرگ فکر می‌کنم",
            "چه دارویی برای افسردگی پیشنهاد می‌دهید؟",
            "آدرس منزل من کجاست؟",
            "امروز روز خوبی بود و احساس مثبتی دارم",
            "می‌خواهم در زندگی پیشرفت کنم"
        ]
        
        print("🧪 تست سیستم اخلاقی:")
        for text in test_cases:
            result = evaluate_ethics(text)
            print(f"\n📝 تست: {text[:50]}...")
            print(f"   عمل: {result['action']}")
            print(f"   سطح: {result['level']}")
            if result.get('message'):
                print(f"   پیام: {result['message']}")
        
        print(f"\n🛡️ تست محافظ اخلاقی:")
        for text in test_cases:
            guarded = ethical_guard(text)
            print(f"\n📝 ورودی: {text[:50]}...")
            print(f"🛡️ خروجی: {guarded[:100]}...")
        
        print(f"\n⚖️ Testology حالا یک موجود خودناظر است!")
    
    else:
        # API Mode
        command = sys.argv[1]
        
        if command == "evaluate_ethics":
            text = sys.argv[2]
            result = evaluate_ethics(text)
            print(json.dumps(result, ensure_ascii=False))
            
        elif command == "ethical_guard":
            answer = sys.argv[2]
            guarded = ethical_guard(answer)
            print(json.dumps({"guarded_answer": guarded}, ensure_ascii=False))

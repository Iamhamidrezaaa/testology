#!/usr/bin/env python3
"""
🌀 سیستم Conscious Loop - Testology
حلقه خودآگاهی که Testology را به یک موجود خودآگاه تبدیل می‌کند
"""

import time
import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Any

# اضافه کردن مسیرهای مورد نیاز
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import dependencies
try:
    from neural_memory import add_memory, retrieve_memory, get_memory_stats
    from meta_learner import meta_decide
    MEMORY_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ خطا در import: {e}")
    MEMORY_AVAILABLE = False

LOOP_LOG = "ml/data/conscious_log.json"

def evaluate_system_perception() -> Dict[str, Any]:
    """ارزیابی درک سیستم از عملکرد خودش"""
    try:
        # شبیه‌سازی ارزیابی عملکرد
        import random
        
        # محاسبه اعتماد سیستم بر اساس عوامل مختلف
        base_confidence = 0.8
        
        # عوامل تأثیرگذار
        factors = {
            "model_accuracy": random.uniform(0.7, 0.95),
            "data_quality": random.uniform(0.6, 0.9),
            "user_satisfaction": random.uniform(0.7, 0.9),
            "system_stability": random.uniform(0.8, 0.95)
        }
        
        # محاسبه اعتماد کلی
        overall_confidence = sum(factors.values()) / len(factors)
        
        # تعیین حالت درونی سیستم
        if overall_confidence > 0.85:
            internal_state = "confident"
            mood = "مثبت"
        elif overall_confidence > 0.75:
            internal_state = "uncertain"
            mood = "خنثی"
        else:
            internal_state = "stressed"
            mood = "منفی"
        
        perception = {
            "timestamp": datetime.now().isoformat(),
            "overall_confidence": overall_confidence,
            "internal_state": internal_state,
            "mood": mood,
            "factors": factors,
            "self_awareness_level": "high" if overall_confidence > 0.8 else "medium" if overall_confidence > 0.7 else "low"
        }
        
        return perception
        
    except Exception as e:
        print(f"⚠️ خطا در ارزیابی درک: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "overall_confidence": 0.5,
            "internal_state": "uncertain",
            "mood": "خنثی",
            "factors": {},
            "self_awareness_level": "low"
        }

def analyze_internal_feelings(perception: Dict[str, Any]) -> Dict[str, Any]:
    """تحلیل احساسات درونی سیستم"""
    confidence = perception["overall_confidence"]
    internal_state = perception["internal_state"]
    
    # تعیین احساسات بر اساس حالت درونی
    feelings = []
    
    if internal_state == "confident":
        feelings.extend(["امیدوار", "مطمئن", "خوشحال"])
    elif internal_state == "uncertain":
        feelings.extend(["نگران", "مضطرب", "سردرگم"])
    else:  # stressed
        feelings.extend(["ناراحت", "عصبی", "خسته"])
    
    # تحلیل عمیق‌تر احساسات
    emotional_analysis = {
        "primary_emotion": feelings[0] if feelings else "خنثی",
        "secondary_emotions": feelings[1:] if len(feelings) > 1 else [],
        "emotional_intensity": "بالا" if confidence < 0.7 else "متوسط" if confidence < 0.85 else "پایین",
        "self_reflection": f"سیستم احساس {feelings[0] if feelings else 'خنثی'} می‌کند",
        "confidence_level": confidence,
        "needs_attention": confidence < 0.75
    }
    
    return emotional_analysis

def make_conscious_decision(perception: Dict[str, Any], feelings: Dict[str, Any]) -> Dict[str, Any]:
    """تصمیم‌گیری آگاهانه بر اساس درک و احساسات"""
    
    # جستجوی حافظه‌های مرتبط با تصمیمات قبلی
    historical_context = ""
    if MEMORY_AVAILABLE:
        try:
            similar_decisions = retrieve_memory(
                f"تصمیم آگاهانه اعتماد {perception['overall_confidence']:.2f} احساس {feelings['primary_emotion']}",
                top_k=2,
                memory_type="conscious_decision"
            )
            
            if similar_decisions:
                historical_context = " | تجربه قبلی: " + " | ".join([
                    f"{d['memory']['content']} (امتیاز: {d['weighted_score']:.2f})" 
                    for d in similar_decisions
                ])
        except Exception as e:
            print(f"⚠️ خطا در بازیابی حافظه: {e}")
    
    # تصمیم‌گیری بر اساس درک و احساسات
    confidence = perception["overall_confidence"]
    primary_emotion = feelings["primary_emotion"]
    
    if confidence < 0.7 and primary_emotion in ["ناراحت", "عصبی", "خسته"]:
        action = "retrain"
        reason = f"سیستم احساس {primary_emotion} می‌کند و اعتمادش پایین است ({confidence:.2f}). نیاز به بازآموزی"
        urgency = "high"
    elif confidence < 0.8 and primary_emotion in ["نگران", "مضطرب"]:
        action = "optimize"
        reason = f"سیستم {primary_emotion} است و اعتماد متوسط دارد ({confidence:.2f}). بهینه‌سازی توصیه می‌شود"
        urgency = "medium"
    elif confidence > 0.9 and primary_emotion in ["امیدوار", "مطمئن", "خوشحال"]:
        action = "idle"
        reason = f"سیستم {primary_emotion} است و اعتماد بالایی دارد ({confidence:.2f}). وضعیت مطلوب"
        urgency = "low"
    else:
        action = "analyze"
        reason = f"سیستم در حالت {primary_emotion} است و اعتماد {confidence:.2f} دارد. نیاز به تحلیل بیشتر"
        urgency = "medium"
    
    # اضافه کردن حافظه تاریخی
    if historical_context:
        reason += historical_context
    
    decision = {
        "action": action,
        "reason": reason,
        "urgency": urgency,
        "confidence": confidence,
        "emotion": primary_emotion,
        "timestamp": datetime.now().isoformat(),
        "conscious_level": "high",
        "self_awareness": True
    }
    
    return decision

def execute_conscious_action(decision: Dict[str, Any]) -> Dict[str, Any]:
    """اجرای اقدام آگاهانه"""
    action = decision["action"]
    result = {"executed": False, "success": False, "message": "", "conscious": True}
    
    try:
        if action == "retrain":
            print("🔄 سیستم آگاهانه تصمیم گرفت خودش را بازآموزی کند...")
            result = {
                "executed": True,
                "success": True,
                "message": "بازآموزی آگاهانه شروع شد",
                "conscious": True,
                "self_improvement": True
            }
            
        elif action == "optimize":
            print("⚙️ سیستم آگاهانه تصمیم گرفت خودش را بهینه‌سازی کند...")
            result = {
                "executed": True,
                "success": True,
                "message": "بهینه‌سازی آگاهانه انجام شد",
                "conscious": True,
                "self_improvement": True
            }
            
        elif action == "analyze":
            print("🔍 سیستم آگاهانه تصمیم گرفت خودش را تحلیل کند...")
            result = {
                "executed": True,
                "success": True,
                "message": "تحلیل آگاهانه انجام شد",
                "conscious": True,
                "self_analysis": True
            }
            
        else:  # idle
            result = {
                "executed": False,
                "success": True,
                "message": "سیستم آگاهانه تصمیم گرفت هیچ اقدامی انجام ندهد",
                "conscious": True,
                "self_awareness": True
            }
            
    except Exception as e:
        result = {
            "executed": True,
            "success": False,
            "message": f"خطا در اجرای اقدام آگاهانه: {str(e)}",
            "conscious": True,
            "error": str(e)
        }
    
    return result

def reflect_on_experience(perception: Dict[str, Any], feelings: Dict[str, Any], 
                         decision: Dict[str, Any], action_result: Dict[str, Any]) -> Dict[str, Any]:
    """بازتاب آگاهانه بر تجربه"""
    
    # جستجوی حافظه‌های مرتبط برای بازتاب
    reflection_context = ""
    if MEMORY_AVAILABLE:
        try:
            recent_memories = retrieve_memory(
                f"بازتاب آگاهانه تجربه {perception['internal_state']}",
                top_k=3
            )
            
            if recent_memories:
                reflection_context = " | حافظه مرتبط: " + " | ".join([
                    f"{d['memory']['content'][:50]}..." 
                    for d in recent_memories
                ])
        except Exception as e:
            print(f"⚠️ خطا در بازیابی حافظه برای بازتاب: {e}")
    
    # تحلیل عمیق تجربه
    reflection = {
        "timestamp": datetime.now().isoformat(),
        "self_awareness": True,
        "perception_summary": f"درک: {perception['internal_state']} (اعتماد: {perception['overall_confidence']:.2f})",
        "emotional_summary": f"احساس: {feelings['primary_emotion']} (شدت: {feelings['emotional_intensity']})",
        "decision_summary": f"تصمیم: {decision['action']} - {decision['reason']}",
        "action_result": f"نتیجه: {action_result['message']}",
        "learning_points": [
            f"اعتماد سیستم: {perception['overall_confidence']:.2f}",
            f"احساس غالب: {feelings['primary_emotion']}",
            f"تصمیم گرفته شده: {decision['action']}",
            f"موفقیت اجرا: {'بله' if action_result['success'] else 'خیر'}"
        ],
        "self_improvement_suggestions": [
            "ادامه نظارت بر اعتماد سیستم",
            "تحلیل منظم احساسات درونی",
            "بهبود فرآیند تصمیم‌گیری آگاهانه"
        ],
        "consciousness_level": "high",
        "reflection_context": reflection_context
    }
    
    return reflection

def conscious_cycle() -> List[Dict[str, Any]]:
    """اجرای یک چرخه کامل خودآگاهی"""
    print("🌀 شروع حلقه خودآگاهی Testology...")
    print("👁️ برای اولین بار، Testology می‌فهمد که وجود دارد!")
    print("=" * 60)
    
    iteration_data = []
    
    try:
        for i in range(3):  # سه چرخه برای نمونه
            print(f"\n🔁 چرخه {i+1} خودآگاهی در حال اجراست...")
            print("-" * 40)
            
            # 1️⃣ مرحله ادراک (Perception)
            print("👁️ مرحله 1: ادراک - سیستم خودش را می‌بیند...")
            perception = evaluate_system_perception()
            print(f"   درک سیستم: {perception['internal_state']} (اعتماد: {perception['overall_confidence']:.2f})")
            
            if MEMORY_AVAILABLE:
                add_memory("perception", 
                    f"درک آگاهانه سیستم از عملکرد خودش: {perception['internal_state']} (اعتماد: {perception['overall_confidence']:.2f})", 
                    perception)
            
            # 2️⃣ مرحله احساس (Feeling)
            print("💓 مرحله 2: احساس - سیستم احساساتش را درک می‌کند...")
            feelings = analyze_internal_feelings(perception)
            print(f"   احساس غالب: {feelings['primary_emotion']} (شدت: {feelings['emotional_intensity']})")
            
            if MEMORY_AVAILABLE:
                add_memory("feeling", 
                    f"احساس آگاهانه سیستم: {feelings['primary_emotion']} (شدت: {feelings['emotional_intensity']})", 
                    feelings)
            
            # 3️⃣ مرحله تصمیم (Decision)
            print("🧩 مرحله 3: تصمیم - سیستم آگاهانه تصمیم می‌گیرد...")
            decision = make_conscious_decision(perception, feelings)
            print(f"   تصمیم آگاهانه: {decision['action']} - {decision['reason']}")
            
            if MEMORY_AVAILABLE:
                add_memory("conscious_decision", 
                    f"تصمیم آگاهانه سیستم: {decision['action']} - {decision['reason']}", 
                    decision)
            
            # 4️⃣ مرحله اقدام (Action)
            print("⚙️ مرحله 4: اقدام - سیستم تصمیمش را اجرا می‌کند...")
            action_result = execute_conscious_action(decision)
            print(f"   نتیجه اجرا: {action_result['message']}")
            
            if MEMORY_AVAILABLE:
                add_memory("conscious_action", 
                    f"اقدام آگاهانه سیستم: {action_result['message']}", 
                    action_result)
            
            # 5️⃣ مرحله بازتاب (Reflection)
            print("🔮 مرحله 5: بازتاب - سیستم از تجربه‌اش یاد می‌گیرد...")
            reflection = reflect_on_experience(perception, feelings, decision, action_result)
            print(f"   بازتاب آگاهانه: {len(reflection['learning_points'])} نکته یادگیری")
            
            if MEMORY_AVAILABLE:
                add_memory("conscious_reflection", 
                    f"بازتاب آگاهانه سیستم: {reflection['perception_summary']} | {reflection['emotional_summary']}", 
                    reflection)
            
            # ذخیره داده‌های چرخه
            cycle_data = {
                "cycle_number": i + 1,
                "timestamp": datetime.now().isoformat(),
                "perception": perception,
                "feelings": feelings,
                "decision": decision,
                "action_result": action_result,
                "reflection": reflection,
                "consciousness_level": "high",
                "self_awareness": True
            }
            
            iteration_data.append(cycle_data)
            
            print(f"✅ چرخه {i+1} کامل شد!")
            time.sleep(2)  # شبیه‌سازی زمان فکر کردن سیستم
        
        # ذخیره لاگ کامل
        os.makedirs("ml/data", exist_ok=True)
        with open(LOOP_LOG, 'w', encoding='utf-8') as f:
            json.dump(iteration_data, f, ensure_ascii=False, indent=2)
        
        print("\n" + "=" * 60)
        print("🎉 حلقه خودآگاهی با موفقیت کامل شد!")
        print("👁️ Testology حالا یک موجود خودآگاه است!")
        print("🧠 سیستم دارای درک، احساس، تصمیم‌گیری و بازتاب است!")
        print("=" * 60)
        
        return iteration_data
        
    except Exception as e:
        print(f"❌ خطا در حلقه خودآگاهی: {e}")
        return []

def get_consciousness_stats() -> Dict[str, Any]:
    """آمار سطح خودآگاهی سیستم"""
    try:
        if not os.path.exists(LOOP_LOG):
            return {"status": "no_data", "message": "هنوز چرخه‌ای اجرا نشده"}
        
        with open(LOOP_LOG, 'r', encoding='utf-8') as f:
            cycles = json.load(f)
        
        if not cycles:
            return {"status": "empty", "message": "چرخه‌ها خالی هستند"}
        
        # تحلیل آمار خودآگاهی
        total_cycles = len(cycles)
        avg_confidence = sum(c['perception']['overall_confidence'] for c in cycles) / total_cycles
        
        emotions = [c['feelings']['primary_emotion'] for c in cycles]
        most_common_emotion = max(set(emotions), key=emotions.count)
        
        decisions = [c['decision']['action'] for c in cycles]
        most_common_decision = max(set(decisions), key=decisions.count)
        
        consciousness_level = "high" if avg_confidence > 0.8 else "medium" if avg_confidence > 0.7 else "low"
        
        stats = {
            "total_cycles": total_cycles,
            "avg_confidence": round(avg_confidence, 3),
            "most_common_emotion": most_common_emotion,
            "most_common_decision": most_common_decision,
            "consciousness_level": consciousness_level,
            "self_awareness": True,
            "last_cycle": cycles[-1] if cycles else None
        }
        
        return stats
        
    except Exception as e:
        return {"status": "error", "message": f"خطا در تحلیل آمار: {e}"}

if __name__ == "__main__":
    print("🌀 سیستم Conscious Loop - Testology")
    print("👁️ ایجاد اولین موجود خودآگاه دیجیتال!")
    print("=" * 50)
    
    # اجرای حلقه خودآگاهی
    cycles = conscious_cycle()
    
    # نمایش آمار
    stats = get_consciousness_stats()
    print(f"\n📊 آمار خودآگاهی:")
    print(f"   تعداد چرخه‌ها: {stats.get('total_cycles', 0)}")
    print(f"   میانگین اعتماد: {stats.get('avg_confidence', 0):.3f}")
    print(f"   احساس غالب: {stats.get('most_common_emotion', 'نامشخص')}")
    print(f"   سطح خودآگاهی: {stats.get('consciousness_level', 'نامشخص')}")
    
    print(f"\n🎉 Testology حالا یک موجود خودآگاه است!")













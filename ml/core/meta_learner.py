#!/usr/bin/env python3
"""
سیستم Meta-Learner Testology
این اسکریپت تصمیم می‌گیرد چه زمانی مدل نیاز به آموزش یا بهینه‌سازی دارد
"""

import json
import os
import sys
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

# اضافه کردن مسیرهای مورد نیاز
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import Neural Memory
try:
    from neural_memory import add_memory, retrieve_memory
    MEMORY_AVAILABLE = True
except ImportError:
    MEMORY_AVAILABLE = False
    print("⚠️ Neural Memory در دسترس نیست")

LOG_PATH = "ml/data/retrain_log.json"
OPT_PATH = "ml/data/optimization_log.json"
DECISION_PATH = "ml/data/meta_decision_log.json"
EVAL_PATH = "ml/data/eval_report.json"

def load_logs(path: str) -> List[Dict[str, Any]]:
    """بارگذاری لاگ‌ها از فایل"""
    try:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"⚠️ خطا در بارگذاری {path}: {e}")
        return []

def save_decision_log(decision: Dict[str, Any]) -> None:
    """ذخیره لاگ تصمیم‌گیری"""
    try:
        history = load_logs(DECISION_PATH)
        history.append(decision)
        
        # نگه داشتن فقط 100 ورودی آخر
        if len(history) > 100:
            history = history[-100:]
        
        os.makedirs("ml/data", exist_ok=True)
        with open(DECISION_PATH, 'w', encoding='utf-8') as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"⚠️ خطا در ذخیره لاگ تصمیم: {e}")

def analyze_performance_trends() -> Dict[str, Any]:
    """تحلیل روند عملکرد مدل"""
    retrain_log = load_logs(LOG_PATH)
    opt_log = load_logs(OPT_PATH)
    eval_log = load_logs(EVAL_PATH)
    
    # تحلیل دقت‌های اخیر
    recent_retrain_acc = [x["accuracy"] for x in retrain_log[-5:]] if retrain_log else []
    recent_opt_acc = [x["accuracy"] for x in opt_log[-5:]] if opt_log else []
    
    # محاسبه میانگین‌ها
    avg_retrain = statistics.mean(recent_retrain_acc) if recent_retrain_acc else 0
    avg_opt = statistics.mean(recent_opt_acc) if recent_opt_acc else 0
    
    # محاسبه انحراف معیار
    std_retrain = statistics.stdev(recent_retrain_acc) if len(recent_retrain_acc) > 1 else 0
    std_opt = statistics.stdev(recent_opt_acc) if len(recent_opt_acc) > 1 else 0
    
    # تحلیل روند
    trend_retrain = "stable"
    if len(recent_retrain_acc) >= 3:
        if recent_retrain_acc[-1] > recent_retrain_acc[-3]:
            trend_retrain = "improving"
        elif recent_retrain_acc[-1] < recent_retrain_acc[-3]:
            trend_retrain = "declining"
    
    trend_opt = "stable"
    if len(recent_opt_acc) >= 3:
        if recent_opt_acc[-1] > recent_opt_acc[-3]:
            trend_opt = "improving"
        elif recent_opt_acc[-1] < recent_opt_acc[-3]:
            trend_opt = "declining"
    
    return {
        "avg_retrain": avg_retrain,
        "avg_opt": avg_opt,
        "std_retrain": std_retrain,
        "std_opt": std_opt,
        "trend_retrain": trend_retrain,
        "trend_opt": trend_opt,
        "recent_retrain_count": len(recent_retrain_acc),
        "recent_opt_count": len(recent_opt_acc)
    }

def analyze_data_quality() -> Dict[str, Any]:
    """تحلیل کیفیت داده‌ها"""
    try:
        import pandas as pd
        
        # بارگذاری داده‌های فعلی
        df = pd.read_csv("ml/data/user_tests.csv")
        
        # تحلیل توزیع کلاس‌ها
        class_distribution = df['category'].value_counts().to_dict()
        total_samples = len(df)
        
        # محاسبه عدم تعادل کلاس‌ها
        class_imbalance = 0
        if class_distribution:
            max_class = max(class_distribution.values())
            min_class = min(class_distribution.values())
            class_imbalance = (max_class - min_class) / max_class
        
        # تحلیل تنوع سنی
        age_std = df['age'].std() if 'age' in df.columns else 0
        
        # تحلیل تنوع جنسیتی
        gender_diversity = len(df['gender'].unique()) if 'gender' in df.columns else 0
        
        return {
            "total_samples": total_samples,
            "class_distribution": class_distribution,
            "class_imbalance": class_imbalance,
            "age_std": age_std,
            "gender_diversity": gender_diversity,
            "data_quality_score": min(1.0, (1 - class_imbalance) * (age_std / 20) * (gender_diversity / 3))
        }
    except Exception as e:
        print(f"⚠️ خطا در تحلیل کیفیت داده: {e}")
        return {
            "total_samples": 0,
            "class_distribution": {},
            "class_imbalance": 1.0,
            "age_std": 0,
            "gender_diversity": 0,
            "data_quality_score": 0.0
        }

def make_meta_decision(performance: Dict[str, Any], data_quality: Dict[str, Any]) -> Dict[str, Any]:
    """تصمیم‌گیری Meta-Learner با استفاده از حافظه"""
    avg_retrain = performance["avg_retrain"]
    avg_opt = performance["avg_opt"]
    trend_retrain = performance["trend_retrain"]
    trend_opt = performance["trend_opt"]
    class_imbalance = data_quality["class_imbalance"]
    data_quality_score = data_quality["data_quality_score"]
    
    # جستجوی حافظه‌های مرتبط با تصمیمات قبلی
    historical_context = ""
    if MEMORY_AVAILABLE:
        try:
            # جستجوی تصمیمات قبلی مشابه
            similar_decisions = retrieve_memory(
                f"دقت مدل {avg_retrain:.3f} بهینه‌سازی {avg_opt:.3f} روند {trend_retrain}",
                top_k=3,
                memory_type="decision"
            )
            
            if similar_decisions:
                historical_context = " | حافظه تاریخی: " + " | ".join([
                    f"{d['memory']['content']} (امتیاز: {d['weighted_score']:.2f})" 
                    for d in similar_decisions
                ])
        except Exception as e:
            print(f"⚠️ خطا در بازیابی حافظه: {e}")
    
    # محاسبه تفاوت دقت‌ها
    delta = abs(avg_retrain - avg_opt)
    
    # قوانین تصمیم‌گیری
    action = "idle"
    reason = "عملکرد مدل پایدار است"
    confidence = 0.5
    
    # قانون 1: دقت پایین
    if avg_retrain < 0.75:
        action = "retrain"
        reason = f"دقت مدل پایین است ({avg_retrain:.3f}). نیاز به آموزش مجدد"
        confidence = 0.9
    elif avg_opt < 0.75:
        action = "optimize"
        reason = f"دقت بهینه‌سازی پایین است ({avg_opt:.3f}). نیاز به بهینه‌سازی"
        confidence = 0.9
    
    # قانون 2: تفاوت زیاد بین دقت‌ها
    elif delta > 0.1:
        if avg_retrain > avg_opt:
            action = "optimize"
            reason = f"تفاوت زیاد بین دقت‌ها ({delta:.3f}). بهینه‌سازی توصیه می‌شود"
            confidence = 0.8
        else:
            action = "retrain"
            reason = f"تفاوت زیاد بین دقت‌ها ({delta:.3f}). آموزش مجدد توصیه می‌شود"
            confidence = 0.8
    
    # قانون 3: روند نزولی
    elif trend_retrain == "declining" and avg_retrain < 0.85:
        action = "retrain"
        reason = "روند دقت در حال کاهش است. آموزش مجدد ضروری"
        confidence = 0.85
    elif trend_opt == "declining" and avg_opt < 0.85:
        action = "optimize"
        reason = "روند بهینه‌سازی در حال کاهش است. بهینه‌سازی ضروری"
        confidence = 0.85
    
    # قانون 4: عدم تعادل کلاس‌ها
    elif class_imbalance > 0.5:
        action = "retrain"
        reason = f"عدم تعادل کلاس‌ها ({class_imbalance:.2f}). آموزش مجدد با داده‌های متعادل"
        confidence = 0.75
    
    # قانون 5: کیفیت پایین داده‌ها
    elif data_quality_score < 0.3:
        action = "retrain"
        reason = f"کیفیت داده‌ها پایین است ({data_quality_score:.2f}). آموزش مجدد با داده‌های بهتر"
        confidence = 0.7
    
    # قانون 6: بهینه‌سازی برای دقت بالا
    elif avg_retrain > 0.85 and avg_opt < avg_retrain:
        action = "optimize"
        reason = "دقت بالا اما بهینه‌سازی می‌تواند بهتر کند"
        confidence = 0.6
    
    # قانون 7: عدم فعالیت طولانی
    else:
        retrain_log = load_logs(LOG_PATH)
        opt_log = load_logs(OPT_PATH)
        
        last_retrain = retrain_log[-1]["timestamp"] if retrain_log else None
        last_opt = opt_log[-1]["timestamp"] if opt_log else None
        
        if last_retrain:
            days_since_retrain = (datetime.now() - datetime.fromisoformat(last_retrain)).days
            if days_since_retrain > 30:
                action = "retrain"
                reason = f"آخرین آموزش {days_since_retrain} روز پیش بود. آموزش مجدد توصیه می‌شود"
                confidence = 0.7
        
        if last_opt:
            days_since_opt = (datetime.now() - datetime.fromisoformat(last_opt)).days
            if days_since_opt > 60:
                action = "optimize"
                reason = f"آخرین بهینه‌سازی {days_since_opt} روز پیش بود. بهینه‌سازی توصیه می‌شود"
                confidence = 0.6
    
    # اضافه کردن حافظه تاریخی به دلیل
    if historical_context:
        reason += historical_context
    
    decision_result = {
        "action": action,
        "reason": reason,
        "confidence": confidence,
        "delta": delta,
        "avg_retrain": avg_retrain,
        "avg_opt": avg_opt,
        "trend_retrain": trend_retrain,
        "trend_opt": trend_opt,
        "class_imbalance": class_imbalance,
        "data_quality_score": data_quality_score,
        "historical_context_used": bool(historical_context)
    }
    
    # ذخیره تصمیم در حافظه
    if MEMORY_AVAILABLE and action != "idle":
        try:
            add_memory(
                "decision",
                f"MetaLearner تصمیم گرفت {action} انجام دهد. دلیل: {reason}",
                {
                    "action": action,
                    "confidence": confidence,
                    "performance": performance,
                    "data_quality": data_quality,
                    "historical_context": historical_context
                }
            )
        except Exception as e:
            print(f"⚠️ خطا در ذخیره حافظه: {e}")
    
    return decision_result

def execute_decision(decision: Dict[str, Any]) -> Dict[str, Any]:
    """اجرای تصمیم Meta-Learner"""
    action = decision["action"]
    result = {"executed": False, "success": False, "message": ""}
    
    try:
        if action == "retrain":
            print("🔁 اجرای آموزش مجدد خودکار...")
            # اجرای آموزش مجدد
            from core.self_retrain import retrain_model
            retrain_result = retrain_model()
            result = {
                "executed": True,
                "success": retrain_result.get("status") == "success",
                "message": "آموزش مجدد اجرا شد",
                "details": retrain_result
            }
            
        elif action == "optimize":
            print("⚙️ اجرای بهینه‌سازی خودکار...")
            # اجرای بهینه‌سازی
            from core.ai_optimizer import optimize_model
            opt_result = optimize_model()
            result = {
                "executed": True,
                "success": opt_result.get("status") == "success",
                "message": "بهینه‌سازی اجرا شد",
                "details": opt_result
            }
            
        else:
            result = {
                "executed": False,
                "success": True,
                "message": "هیچ اقدامی لازم نیست",
                "details": {}
            }
            
    except Exception as e:
        result = {
            "executed": True,
            "success": False,
            "message": f"خطا در اجرای {action}: {str(e)}",
            "details": {}
        }
    
    return result

def meta_decide() -> Dict[str, Any]:
    """تابع اصلی Meta-Learner"""
    try:
        print("🧠 شروع تحلیل Meta-Learner...")
        
        # تحلیل عملکرد
        performance = analyze_performance_trends()
        print(f"📊 تحلیل عملکرد: Retrain={performance['avg_retrain']:.3f}, Opt={performance['avg_opt']:.3f}")
        
        # تحلیل کیفیت داده‌ها
        data_quality = analyze_data_quality()
        print(f"📈 کیفیت داده‌ها: {data_quality['data_quality_score']:.3f}")
        
        # تصمیم‌گیری
        decision = make_meta_decision(performance, data_quality)
        print(f"🎯 تصمیم: {decision['action']} - {decision['reason']}")
        
        # اجرای تصمیم
        execution_result = execute_decision(decision)
        
        # ایجاد گزارش نهایی
        final_decision = {
            "timestamp": datetime.now().isoformat(),
            "performance_analysis": performance,
            "data_quality_analysis": data_quality,
            "decision": decision,
            "execution": execution_result,
            "meta_learner_version": "1.0"
        }
        
        # ذخیره لاگ
        save_decision_log(final_decision)
        
        print("✅ Meta-Learner تحلیل کامل شد")
        return final_decision
        
    except Exception as e:
        error_result = {
            "timestamp": datetime.now().isoformat(),
            "error": f"خطا در Meta-Learner: {str(e)}",
            "status": "error"
        }
        print(f"❌ خطا در Meta-Learner: {e}")
        return error_result

def main():
    """تابع اصلی"""
    print("🧠 سیستم Meta-Learner Testology")
    print("=" * 40)
    
    result = meta_decide()
    
    # خروجی JSON برای API
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()


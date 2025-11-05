import json
import pandas as pd
from datetime import datetime, timedelta
from collections import Counter
import os

# Import Neural Memory
try:
    from neural_memory import add_memory, retrieve_memory
    MEMORY_AVAILABLE = True
except ImportError:
    MEMORY_AVAILABLE = False
    print("⚠️ Neural Memory در دسترس نیست")

# Import AI Ethics
try:
    from ai_ethics import evaluate_ethics
    ETHICS_AVAILABLE = True
except ImportError:
    ETHICS_AVAILABLE = False
    print("⚠️ AI Ethics در دسترس نیست")

def adjust_confidence_based_on_ethics(answer: str) -> float:
    """تنظیم سطح اعتماد بر اساس ارزیابی اخلاقی"""
    if not ETHICS_AVAILABLE:
        return 1.0
    
    try:
        ethics = evaluate_ethics(answer)
        
        if ethics["level"] == "critical":
            return 0.5  # کاهش شدید اعتماد
        elif ethics["level"] == "warning":
            return 0.75  # کاهش متوسط اعتماد
        elif ethics["level"] == "neutral":
            return 0.9  # کاهش جزئی اعتماد
        else:
            return 1.0  # اعتماد کامل
    except Exception as e:
        print(f"⚠️ خطا در ارزیابی اخلاقی: {e}")
        return 1.0

def analyze_trends():
    """تحلیل ترندها و ارائه پیشنهادات برای بهبود پلتفرم"""
    try:
        # خواندن داده‌های توصیه‌ها
        log_path = "ml/data/recommendations.json"
        
        if not os.path.exists(log_path):
            # اگر فایل لاگ وجود نداشت، داده‌های نمونه بساز
            create_sample_recommendations()
        
        with open(log_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        
        # تحلیل ترندها
        top_categories = Counter(df["category"]).most_common(5)
        avg_scores = df.groupby("category")["score"].mean().to_dict()
        
        # تحلیل تغییرات زمانی (آخرین 7 روز)
        df['date'] = pd.to_datetime(df['date'])
        recent_data = df[df['date'] >= datetime.now() - timedelta(days=7)]
        recent_trends = Counter(recent_data["category"]).most_common(3)
        
        # تحلیل احساسات کاربران
        sentiment_analysis = analyze_user_sentiments(df)
        
        # جستجوی حافظه‌های مرتبط با تحلیل‌های قبلی
        historical_insights = ""
        if MEMORY_AVAILABLE:
            try:
                # جستجوی تحلیل‌های قبلی مشابه
                similar_analyses = retrieve_memory(
                    f"تحلیل ترندها دسته‌های پرتکرار {[cat[0] for cat in top_categories[:3]]}",
                    top_k=2,
                    memory_type="supervisor_analysis"
                )
                
                if similar_analyses:
                    historical_insights = " | تحلیل‌های قبلی: " + " | ".join([
                        f"{d['memory']['content']} (امتیاز: {d['weighted_score']:.2f})" 
                        for d in similar_analyses
                    ])
            except Exception as e:
                print(f"⚠️ خطا در بازیابی حافظه: {e}")
        
        # پیشنهادات عملی
        actions = suggest_platform_improvements(top_categories, recent_trends, sentiment_analysis)
        
        # تحلیل عملکرد محتوا
        content_performance = analyze_content_performance(df)
        
        # تحلیل عملکرد مدل
        model_analysis = analyze_model_performance()
        
        # پیشنهادات بهبود داده‌ها
        data_improvements = suggest_data_improvements()
        
        insights = {
            "date": datetime.now().isoformat(),
            "trending_categories": top_categories,
            "recent_trends": recent_trends,
            "average_scores": avg_scores,
            "sentiment_analysis": sentiment_analysis,
            "content_performance": content_performance,
            "model_analysis": model_analysis,
            "data_improvements": data_improvements,
            "recommended_actions": actions,
            "platform_health_score": calculate_platform_health(df),
            "historical_insights": historical_insights
        }
        
        # ذخیره تحلیل در حافظه
        if MEMORY_AVAILABLE:
            try:
                add_memory(
                    "supervisor_analysis",
                    f"AI Supervisor تحلیل جدید انجام داد. دسته‌های پرتکرار: {[cat[0] for cat in top_categories[:3]]}. پیشنهادات: {len(actions)} مورد",
                    {
                        "trending_categories": top_categories,
                        "recommended_actions_count": len(actions),
                        "platform_health": calculate_platform_health(df),
                        "historical_insights": historical_insights
                    }
                )
            except Exception as e:
                print(f"⚠️ خطا در ذخیره حافظه: {e}")
        
        print(json.dumps(insights, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "status": "error",
            "message": f"خطا در تحلیل: {str(e)}"
        }
        print(json.dumps(error_result, ensure_ascii=False))

def create_sample_recommendations():
    """ایجاد داده‌های نمونه برای تست"""
    import random
    
    categories = ['anxiety', 'depression', 'focus', 'confidence', 'stress']
    sample_data = []
    
    for i in range(100):
        sample_data.append({
            "date": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
            "category": random.choice(categories),
            "score": random.randint(20, 80),
            "user_satisfaction": random.choice(['high', 'medium', 'low']),
            "content_type": random.choice(['test', 'article', 'exercise'])
        })
    
    os.makedirs("ml/data", exist_ok=True)
    with open("ml/data/recommendations.json", 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, ensure_ascii=False, indent=2)

def analyze_user_sentiments(df):
    """تحلیل احساسات کاربران"""
    sentiment_scores = {
        'positive': len(df[df['score'] >= 70]),
        'neutral': len(df[(df['score'] >= 40) & (df['score'] < 70)]),
        'negative': len(df[df['score'] < 40])
    }
    
    return {
        "sentiment_distribution": sentiment_scores,
        "overall_sentiment": "positive" if sentiment_scores['positive'] > sentiment_scores['negative'] else "negative"
    }

def suggest_platform_improvements(top_categories, recent_trends, sentiment_analysis):
    """پیشنهاد بهبودهای پلتفرم"""
    actions = []
    
    # تحلیل دسته‌های پرتکرار
    for category, count in top_categories[:3]:
        if category == 'anxiety':
            actions.append("افزودن مقاله تخصصی درباره اضطراب اجتماعی و راه‌های مقابله")
            actions.append("ساخت تست کوتاه‌تر برای تشخیص اضطراب")
        elif category == 'depression':
            actions.append("ایجاد بخش 'روزهای سخت' با تمرینات ساده")
            actions.append("افزودن محتوای انگیزشی روزانه")
        elif category == 'focus':
            actions.append("ساخت اپلیکیشن تمرکز با تایمر پومودورو")
            actions.append("مقاله: تکنیک‌های تمرکز در محیط کار")
    
    # تحلیل ترندهای اخیر
    if recent_trends:
        trending_category = recent_trends[0][0]
        actions.append(f"افزایش محتوای {trending_category} به دلیل تقاضای بالا")
    
    # تحلیل احساسات
    if sentiment_analysis['overall_sentiment'] == 'negative':
        actions.append("بررسی و بهبود تجربه کاربری")
        actions.append("افزودن محتوای انگیزشی بیشتر")
    
    return actions

def analyze_model_performance():
    """تحلیل عملکرد مدل و شناسایی مشکلات"""
    try:
        import json
        import os
        
        # خواندن گزارش ارزیابی
        eval_path = "ml/data/eval_report.json"
        if not os.path.exists(eval_path):
            return ["گزارش ارزیابی مدل موجود نیست. ابتدا ارزیابی انجام دهید."]
        
        with open(eval_path, 'r', encoding='utf-8') as f:
            eval_data = json.load(f)
        
        if eval_data.get('status') != 'success':
            return ["خطا در گزارش ارزیابی مدل"]
        
        metrics = eval_data.get('metrics', {})
        suggestions = eval_data.get('suggestions', [])
        
        # تحلیل دقت مدل
        accuracy = metrics.get('accuracy', 0)
        model_issues = []
        
        if accuracy < 0.7:
            model_issues.append("دقت مدل پایین است. پیشنهاد: بازآموزی با داده‌های بیشتر")
        elif accuracy < 0.8:
            model_issues.append("دقت مدل متوسط است. پیشنهاد: تنظیم پارامترهای مدل")
        
        # تحلیل F1-score برای هر کلاس
        f1_scores = metrics.get('f1_scores', [])
        labels = metrics.get('labels', [])
        
        for i, (label, f1) in enumerate(zip(labels, f1_scores)):
            if f1 < 0.6:
                model_issues.append(f"دقت مدل در دسته '{label}' پایین است. پیشنهاد: افزودن داده‌های بیشتر برای این دسته")
            elif f1 < 0.8:
                model_issues.append(f"دقت مدل در دسته '{label}' متوسط است. پیشنهاد: بررسی ویژگی‌های مربوط به این دسته")
        
        # تحلیل ماتریس سردرگمی
        conf_matrix = metrics.get('confusion_matrix', [])
        if conf_matrix:
            import numpy as np
            conf_array = np.array(conf_matrix)
            
            # شناسایی کلاس‌های مشکل‌دار
            for i, label in enumerate(labels):
                class_errors = np.sum(conf_array[i]) - conf_array[i, i]
                class_total = np.sum(conf_array[i])
                if class_total > 0:
                    class_error_rate = class_errors / class_total
                    if class_error_rate > 0.3:
                        model_issues.append(f"دسته '{label}' خطای بالایی دارد ({class_error_rate:.1%})")
        
        # ترکیب پیشنهادات
        all_suggestions = model_issues + suggestions
        
        return all_suggestions
        
    except Exception as e:
        return [f"خطا در تحلیل عملکرد مدل: {str(e)}"]

def suggest_data_improvements():
    """پیشنهاد بهبود داده‌ها"""
    try:
        import pandas as pd
        
        # خواندن داده‌های موجود
        df = pd.read_csv("ml/data/user_tests.csv")
        
        suggestions = []
        
        # تحلیل توزیع کلاس‌ها
        class_counts = df['category'].value_counts()
        total_samples = len(df)
        
        for category, count in class_counts.items():
            percentage = (count / total_samples) * 100
            if percentage < 10:
                suggestions.append(f"دسته '{category}' داده کمی دارد ({percentage:.1f}%). پیشنهاد: جمع‌آوری داده‌های بیشتر")
            elif percentage > 40:
                suggestions.append(f"دسته '{category}' داده زیادی دارد ({percentage:.1f}%). پیشنهاد: تعادل داده‌ها")
        
        # تحلیل توزیع سنی
        age_stats = df['age'].describe()
        if age_stats['std'] < 10:
            suggestions.append("تنوع سنی کاربران کم است. پیشنهاد: جذب کاربران از گروه‌های سنی مختلف")
        
        # تحلیل توزیع جنسیتی
        gender_counts = df['gender'].value_counts()
        if len(gender_counts) < 3:
            suggestions.append("تنوع جنسیتی کاربران کم است. پیشنهاد: جذب کاربران از گروه‌های مختلف")
        
        return suggestions
        
    except Exception as e:
        return [f"خطا در تحلیل داده‌ها: {str(e)}"]

def analyze_content_performance(df):
    """تحلیل عملکرد محتوا"""
    content_stats = df.groupby('content_type').agg({
        'score': 'mean',
        'user_satisfaction': lambda x: (x == 'high').sum() / len(x)
    }).to_dict()
    
    return {
        "best_performing_content": max(content_stats['score'], key=content_stats['score'].get),
        "user_satisfaction_rate": content_stats['user_satisfaction']
    }

def calculate_platform_health(df):
    """محاسبه نمره سلامت پلتفرم"""
    avg_score = df['score'].mean()
    satisfaction_rate = (df['user_satisfaction'] == 'high').sum() / len(df)
    
    health_score = (avg_score / 100) * 0.6 + satisfaction_rate * 0.4
    
    if health_score >= 0.8:
        return {"score": health_score, "status": "عالی", "color": "green"}
    elif health_score >= 0.6:
        return {"score": health_score, "status": "خوب", "color": "yellow"}
    else:
        return {"score": health_score, "status": "نیاز به بهبود", "color": "red"}

if __name__ == "__main__":
    analyze_trends()

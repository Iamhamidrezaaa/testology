#!/usr/bin/env python3
"""
🌍 سیستم Collective Intelligence - Testology
هوش جمعی که از رفتار و احساسات تمام کاربران یاد می‌گیرد
"""

import json
import os
import sys
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import Counter, defaultdict
import random

# اضافه کردن مسیرهای مورد نیاز
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import dependencies
try:
    from neural_memory import add_memory, retrieve_memory, get_memory_stats
    MEMORY_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ خطا در import: {e}")
    MEMORY_AVAILABLE = False

# Import ML libraries
try:
    from sklearn.cluster import KMeans, DBSCAN
    from sklearn.preprocessing import StandardScaler
    from sklearn.decomposition import PCA
    from sklearn.metrics import silhouette_score
    ML_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ خطا در import ML libraries: {e}")
    ML_AVAILABLE = False

DATA_PATH = "ml/data/collective_data.json"
REPORT_PATH = "ml/data/collective_report.json"
TRENDS_PATH = "ml/data/social_trends.json"

def generate_sample_data():
    """تولید داده‌های نمونه برای تست سیستم"""
    print("🌍 تولید داده‌های نمونه برای هوش جمعی...")
    
    # مناطق مختلف
    regions = ["تهران", "اصفهان", "شیراز", "مشهد", "تبریز", "کرج", "اهواز", "قم"]
    
    # زبان‌های مختلف
    languages = ["fa", "en", "ar", "tr"]
    
    # تولید داده‌های نمونه
    sample_data = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(1000):  # 1000 کاربر نمونه
        # تاریخ تصادفی در 30 روز گذشته
        random_days = random.randint(0, 30)
        timestamp = base_date + timedelta(days=random_days)
        
        # تولید داده‌های روانی
        user_data = {
            "userId": f"user_{i+1:04d}",
            "timestamp": timestamp.isoformat(),
            "region": random.choice(regions),
            "language": random.choice(languages),
            "age": random.randint(18, 65),
            "gender": random.choice(["male", "female", "other"]),
            
            # تست‌های روانی
            "anxiety": random.uniform(0.1, 1.0),
            "depression": random.uniform(0.1, 1.0),
            "stress": random.uniform(0.1, 1.0),
            "happiness": random.uniform(0.1, 1.0),
            "satisfaction": random.uniform(0.1, 1.0),
            "confidence": random.uniform(0.1, 1.0),
            "social_support": random.uniform(0.1, 1.0),
            "life_quality": random.uniform(0.1, 1.0),
            
            # رفتار آنلاین
            "session_duration": random.randint(5, 120),  # دقیقه
            "tests_completed": random.randint(1, 10),
            "articles_read": random.randint(0, 20),
            "chat_interactions": random.randint(0, 15),
            
            # احساسات
            "mood_score": random.uniform(0.1, 1.0),
            "energy_level": random.uniform(0.1, 1.0),
            "motivation": random.uniform(0.1, 1.0),
            
            # عوامل اجتماعی
            "social_anxiety": random.uniform(0.1, 1.0),
            "loneliness": random.uniform(0.1, 1.0),
            "belonging": random.uniform(0.1, 1.0)
        }
        
        sample_data.append(user_data)
    
    # ذخیره داده‌ها
    os.makedirs("ml/data", exist_ok=True)
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {len(sample_data)} رکورد نمونه تولید شد")
    return sample_data

def load_collective_data():
    """بارگذاری داده‌های جمعی"""
    try:
        if not os.path.exists(DATA_PATH):
            print("📊 داده‌های جمعی موجود نیست. تولید داده‌های نمونه...")
            return generate_sample_data()
        
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"📊 {len(data)} رکورد جمعی بارگذاری شد")
        return data
        
    except Exception as e:
        print(f"⚠️ خطا در بارگذاری داده‌های جمعی: {e}")
        return []

def analyze_collective_psychology(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """تحلیل روانشناسی جمعی"""
    if not data:
        return {"status": "empty", "message": "داده‌ای برای تحلیل وجود ندارد"}
    
    df = pd.DataFrame(data)
    
    # تحلیل آماری کلی
    psychological_metrics = [
        'anxiety', 'depression', 'stress', 'happiness', 'satisfaction', 
        'confidence', 'social_support', 'life_quality', 'mood_score',
        'energy_level', 'motivation', 'social_anxiety', 'loneliness', 'belonging'
    ]
    
    stats = {}
    for metric in psychological_metrics:
        if metric in df.columns:
            stats[metric] = {
                'mean': float(df[metric].mean()),
                'std': float(df[metric].std()),
                'min': float(df[metric].min()),
                'max': float(df[metric].max()),
                'median': float(df[metric].median())
            }
    
    # تحلیل توزیع سنی
    age_distribution = df['age'].value_counts().to_dict()
    
    # تحلیل توزیع جنسیتی
    gender_distribution = df['gender'].value_counts().to_dict()
    
    # تحلیل توزیع منطقه‌ای
    region_distribution = df['region'].value_counts().to_dict()
    
    # تحلیل توزیع زبانی
    language_distribution = df['language'].value_counts().to_dict()
    
    # محاسبه شاخص سلامت روان جمعی
    mental_health_index = (
        stats.get('happiness', {}).get('mean', 0.5) +
        stats.get('satisfaction', {}).get('mean', 0.5) +
        stats.get('life_quality', {}).get('mean', 0.5) +
        (1 - stats.get('anxiety', {}).get('mean', 0.5)) +
        (1 - stats.get('depression', {}).get('mean', 0.5))
    ) / 5
    
    return {
        "psychological_stats": stats,
        "age_distribution": age_distribution,
        "gender_distribution": gender_distribution,
        "region_distribution": region_distribution,
        "language_distribution": language_distribution,
        "mental_health_index": mental_health_index,
        "total_users": len(df),
        "analysis_timestamp": datetime.now().isoformat()
    }

def perform_clustering_analysis(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """انجام تحلیل خوشه‌بندی"""
    if not data or not ML_AVAILABLE:
        return {"status": "no_ml", "message": "کتابخانه‌های ML در دسترس نیست"}
    
    df = pd.DataFrame(data)
    
    # انتخاب ویژگی‌های عددی برای خوشه‌بندی
    numeric_features = [
        'anxiety', 'depression', 'stress', 'happiness', 'satisfaction',
        'confidence', 'social_support', 'life_quality', 'mood_score',
        'energy_level', 'motivation', 'social_anxiety', 'loneliness', 'belonging'
    ]
    
    # فیلتر کردن ویژگی‌های موجود
    available_features = [col for col in numeric_features if col in df.columns]
    
    if len(available_features) < 3:
        return {"status": "insufficient_features", "message": "ویژگی‌های کافی برای خوشه‌بندی وجود ندارد"}
    
    # آماده‌سازی داده‌ها
    X = df[available_features].fillna(0)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # تعیین تعداد بهینه خوشه‌ها
    best_k = 3
    best_score = -1
    
    for k in range(2, min(8, len(df) // 10 + 1)):
        if k >= len(df):
            break
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(X_scaled)
        if len(set(cluster_labels)) > 1:  # اطمینان از وجود بیش از یک خوشه
            score = silhouette_score(X_scaled, cluster_labels)
            if score > best_score:
                best_score = score
                best_k = k
    
    # خوشه‌بندی نهایی
    kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X_scaled)
    
    # تحلیل خوشه‌ها
    cluster_analysis = {}
    for cluster_id in range(best_k):
        cluster_data = df[df['cluster'] == cluster_id]
        
        cluster_analysis[cluster_id] = {
            'size': len(cluster_data),
            'percentage': len(cluster_data) / len(df) * 100,
            'characteristics': {}
        }
        
        # ویژگی‌های هر خوشه
        for feature in available_features:
            cluster_analysis[cluster_id]['characteristics'][feature] = {
                'mean': float(cluster_data[feature].mean()),
                'std': float(cluster_data[feature].std())
            }
    
    # تعریف شخصیت خوشه‌ها
    cluster_personalities = {}
    for cluster_id, analysis in cluster_analysis.items():
        char = analysis['characteristics']
        
        # تعیین شخصیت بر اساس ویژگی‌ها
        if (char.get('happiness', {}).get('mean', 0.5) > 0.7 and 
            char.get('satisfaction', {}).get('mean', 0.5) > 0.7):
            personality = "مثبت‌گرا و راضی"
        elif (char.get('anxiety', {}).get('mean', 0.5) > 0.7 or 
              char.get('depression', {}).get('mean', 0.5) > 0.7):
            personality = "نیاز به حمایت"
        elif (char.get('social_support', {}).get('mean', 0.5) > 0.7 and 
              char.get('belonging', {}).get('mean', 0.5) > 0.7):
            personality = "اجتماعی و متصل"
        else:
            personality = "متعادل"
        
        cluster_personalities[cluster_id] = personality
        cluster_analysis[cluster_id]['personality'] = personality
    
    return {
        "clusters": cluster_analysis,
        "cluster_personalities": cluster_personalities,
        "silhouette_score": best_score,
        "optimal_clusters": best_k,
        "features_used": available_features
    }

def analyze_social_trends(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """تحلیل ترندهای اجتماعی"""
    if not data:
        return {"status": "empty"}
    
    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # تحلیل ترندهای زمانی
    df['date'] = df['timestamp'].dt.date.astype(str)
    daily_stats = df.groupby('date').agg({
        'anxiety': 'mean',
        'depression': 'mean',
        'happiness': 'mean',
        'satisfaction': 'mean',
        'userId': 'count'
    }).rename(columns={'userId': 'daily_users'})
    
    # تحلیل ترندهای منطقه‌ای
    regional_stats = df.groupby('region').agg({
        'anxiety': 'mean',
        'depression': 'mean',
        'happiness': 'mean',
        'satisfaction': 'mean',
        'userId': 'count'
    }).rename(columns={'userId': 'users_count'})
    
    # تحلیل ترندهای سنی
    df['age_group'] = pd.cut(df['age'], bins=[0, 25, 35, 50, 100], labels=['جوان', 'میانسال جوان', 'میانسال', 'مسن'])
    age_stats = df.groupby('age_group').agg({
        'anxiety': 'mean',
        'depression': 'mean',
        'happiness': 'mean',
        'satisfaction': 'mean',
        'userId': 'count'
    }).rename(columns={'userId': 'users_count'})
    
    # شناسایی ترندهای نگران‌کننده
    concerning_trends = []
    
    # بررسی سطح اضطراب بالا
    high_anxiety_regions = regional_stats[regional_stats['anxiety'] > 0.7].index.tolist()
    if high_anxiety_regions:
        concerning_trends.append(f"سطح اضطراب بالا در مناطق: {', '.join(high_anxiety_regions)}")
    
    # بررسی سطح افسردگی بالا
    high_depression_regions = regional_stats[regional_stats['depression'] > 0.7].index.tolist()
    if high_depression_regions:
        concerning_trends.append(f"سطح افسردگی بالا در مناطق: {', '.join(high_depression_regions)}")
    
    # بررسی ترندهای زمانی
    recent_anxiety = daily_stats['anxiety'].tail(7).mean()
    if recent_anxiety > 0.6:
        concerning_trends.append("افزایش اضطراب در هفته اخیر")
    
    return {
        "daily_trends": daily_stats.to_dict('index'),
        "regional_trends": regional_stats.to_dict('index'),
        "age_trends": age_stats.to_dict('index'),
        "concerning_trends": concerning_trends,
        "trend_analysis_timestamp": datetime.now().isoformat()
    }

def generate_collective_insights(psychology_analysis: Dict, clustering_analysis: Dict, trends_analysis: Dict) -> List[str]:
    """تولید بینش‌های جمعی"""
    insights = []
    
    # بینش‌های روانشناسی
    mental_health_index = psychology_analysis.get('mental_health_index', 0.5)
    if mental_health_index > 0.7:
        insights.append("🌍 سلامت روان جمعی در سطح مطلوبی قرار دارد")
    elif mental_health_index < 0.4:
        insights.append("⚠️ سلامت روان جمعی نیاز به توجه فوری دارد")
    else:
        insights.append("📊 سلامت روان جمعی در سطح متوسط قرار دارد")
    
    # بینش‌های خوشه‌بندی
    if clustering_analysis.get('clusters'):
        total_users = sum(cluster['size'] for cluster in clustering_analysis['clusters'].values())
        for cluster_id, cluster_data in clustering_analysis['clusters'].items():
            percentage = cluster_data['percentage']
            personality = cluster_data.get('personality', 'نامشخص')
            insights.append(f"👥 {percentage:.1f}% از کاربران در گروه '{personality}' قرار دارند")
    
    # بینش‌های ترندها
    concerning_trends = trends_analysis.get('concerning_trends', [])
    if concerning_trends:
        insights.append("🚨 ترندهای نگران‌کننده شناسایی شد:")
        for trend in concerning_trends:
            insights.append(f"   • {trend}")
    else:
        insights.append("✅ ترندهای اجتماعی در وضعیت مطلوب قرار دارند")
    
    # پیشنهادات بهبود
    insights.append("💡 پیشنهادات بهبود:")
    if mental_health_index < 0.5:
        insights.append("   • افزایش محتوای کاهش اضطراب")
        insights.append("   • راه‌اندازی کمپین‌های سلامت روان")
    
    if concerning_trends:
        insights.append("   • تمرکز بر مناطق با سطح اضطراب بالا")
        insights.append("   • طراحی برنامه‌های حمایتی ویژه")
    
    return insights

def analyze_collective_intelligence() -> Dict[str, Any]:
    """تحلیل کامل هوش جمعی"""
    print("🌍 شروع تحلیل هوش جمعی Testology...")
    print("🧠 تبدیل از 'I think' به 'We think'...")
    print("=" * 60)
    
    try:
        # بارگذاری داده‌ها
        data = load_collective_data()
        if not data:
            return {"status": "error", "message": "داده‌ای برای تحلیل وجود ندارد"}
        
        print(f"📊 تحلیل {len(data)} رکورد جمعی...")
        
        # تحلیل روانشناسی جمعی
        print("🧠 تحلیل روانشناسی جمعی...")
        psychology_analysis = analyze_collective_psychology(data)
        
        # تحلیل خوشه‌بندی
        print("👥 تحلیل خوشه‌بندی کاربران...")
        clustering_analysis = perform_clustering_analysis(data)
        
        # تحلیل ترندهای اجتماعی
        print("📈 تحلیل ترندهای اجتماعی...")
        trends_analysis = analyze_social_trends(data)
        
        # تولید بینش‌های جمعی
        print("💡 تولید بینش‌های جمعی...")
        insights = generate_collective_insights(psychology_analysis, clustering_analysis, trends_analysis)
        
        # ایجاد گزارش نهایی
        collective_report = {
            "timestamp": datetime.now().isoformat(),
            "total_users": len(data),
            "psychology_analysis": psychology_analysis,
            "clustering_analysis": clustering_analysis,
            "trends_analysis": trends_analysis,
            "collective_insights": insights,
            "collective_intelligence_level": "high" if len(insights) > 5 else "medium",
            "status": "success"
        }
        
        # ذخیره گزارش
        os.makedirs("ml/data", exist_ok=True)
        with open(REPORT_PATH, 'w', encoding='utf-8') as f:
            json.dump(collective_report, f, ensure_ascii=False, indent=2)
        
        # ذخیره در حافظه
        if MEMORY_AVAILABLE:
            try:
                add_memory(
                    "collective_intelligence",
                    f"تحلیل هوش جمعی انجام شد. {len(data)} کاربر، {len(insights)} بینش",
                    {
                        "total_users": len(data),
                        "insights_count": len(insights),
                        "mental_health_index": psychology_analysis.get('mental_health_index', 0),
                        "clusters_count": len(clustering_analysis.get('clusters', {}))
                    }
                )
            except Exception as e:
                print(f"⚠️ خطا در ذخیره حافظه: {e}")
        
        print("✅ تحلیل هوش جمعی کامل شد!")
        print(f"🌍 Testology حالا یک مغز جمعی است!")
        print(f"📊 {len(insights)} بینش جمعی تولید شد")
        
        return collective_report
        
    except Exception as e:
        error_report = {
            "status": "error",
            "message": f"خطا در تحلیل هوش جمعی: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
        print(f"❌ خطا در تحلیل هوش جمعی: {e}")
        return error_report

def get_collective_stats() -> Dict[str, Any]:
    """دریافت آمار هوش جمعی"""
    try:
        if not os.path.exists(REPORT_PATH):
            return {"status": "no_report", "message": "گزارش هوش جمعی موجود نیست"}
        
        with open(REPORT_PATH, 'r', encoding='utf-8') as f:
            report = json.load(f)
        
        return {
            "status": "success",
            "stats": {
                "total_users": report.get('total_users', 0),
                "insights_count": len(report.get('collective_insights', [])),
                "mental_health_index": report.get('psychology_analysis', {}).get('mental_health_index', 0),
                "clusters_count": len(report.get('clustering_analysis', {}).get('clusters', {})),
                "concerning_trends": len(report.get('trends_analysis', {}).get('concerning_trends', [])),
                "last_analysis": report.get('timestamp', 'نامشخص')
            }
        }
        
    except Exception as e:
        return {"status": "error", "message": f"خطا در دریافت آمار: {e}"}

if __name__ == "__main__":
    print("🌍 سیستم Collective Intelligence - Testology")
    print("🧠 تبدیل از هوش فردی به هوش جمعی")
    print("=" * 50)
    
    # اجرای تحلیل هوش جمعی
    report = analyze_collective_intelligence()
    
    # نمایش نتایج
    if report.get('status') == 'success':
        print(f"\n📊 آمار هوش جمعی:")
        print(f"   کاربران کل: {report.get('total_users', 0)}")
        print(f"   بینش‌ها: {len(report.get('collective_insights', []))}")
        print(f"   شاخص سلامت روان: {report.get('psychology_analysis', {}).get('mental_health_index', 0):.3f}")
        print(f"   خوشه‌ها: {len(report.get('clustering_analysis', {}).get('clusters', {}))}")
        
        print(f"\n🌍 Testology حالا یک مغز جمعی است!")
    else:
        print(f"❌ خطا: {report.get('message', 'خطای نامشخص')}")

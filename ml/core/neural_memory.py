import json
import os
from datetime import datetime
from sentence_transformers import SentenceTransformer, util
import torch
import numpy as np

# مسیر ذخیره حافظه
MEMORY_PATH = "ml/data/neural_memory.json"

# مدل Sentence Transformer برای ایجاد Embedding
model = SentenceTransformer("all-MiniLM-L6-v2")

def load_memory():
    """بارگذاری حافظه از فایل JSON"""
    if os.path.exists(MEMORY_PATH):
        with open(MEMORY_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_memory(memories):
    """ذخیره حافظه در فایل JSON"""
    os.makedirs(os.path.dirname(MEMORY_PATH), exist_ok=True)
    with open(MEMORY_PATH, 'w', encoding='utf-8') as f:
        json.dump(memories, f, ensure_ascii=False, indent=2)

def add_memory(event_type, content, metadata=None):
    """اضافه کردن تجربه جدید به حافظه"""
    # ایجاد Embedding برای محتوا
    embeddings = model.encode(content, convert_to_tensor=True).tolist()
    
    # بارگذاری حافظه‌های موجود
    memories = load_memory()
    
    # ایجاد ورودی جدید
    entry = {
        "id": len(memories) + 1,
        "timestamp": datetime.now().isoformat(),
        "type": event_type,
        "content": content,
        "metadata": metadata or {},
        "embedding": embeddings,
        "importance": calculate_importance(content, event_type),
        "emotion": extract_emotion(content)
    }
    
    # اضافه کردن به حافظه
    memories.append(entry)
    save_memory(memories)
    
    print(f"🧠 حافظه جدید ثبت شد: {event_type} - {content[:50]}...")
    return entry

def retrieve_memory(query, top_k=3, memory_type=None):
    """بازیابی حافظه‌های مرتبط بر اساس شباهت معنایی"""
    memories = load_memory()
    if not memories:
        return []
    
    # فیلتر بر اساس نوع حافظه اگر مشخص شده باشد
    if memory_type:
        memories = [m for m in memories if m.get("type") == memory_type]
    
    if not memories:
        return []
    
    # ایجاد Embedding برای کوئری
    query_emb = model.encode(query, convert_to_tensor=True)
    
    # محاسبه شباهت کسینوس
    similarities = []
    for memory in memories:
        memory_emb = torch.tensor(memory["embedding"])
        similarity = util.pytorch_cos_sim(query_emb, memory_emb).item()
        
        # ترکیب شباهت با اهمیت حافظه
        weighted_score = similarity * (1 + memory.get("importance", 0.5))
        
        similarities.append({
            "memory": memory,
            "similarity": round(similarity, 3),
            "weighted_score": round(weighted_score, 3)
        })
    
    # مرتب‌سازی بر اساس امتیاز وزنی
    similarities.sort(key=lambda x: x["weighted_score"], reverse=True)
    
    return similarities[:top_k]

def calculate_importance(content, event_type):
    """محاسبه اهمیت حافظه بر اساس محتوا و نوع رویداد"""
    importance_weights = {
        "decision": 0.9,
        "emotion": 0.8,
        "test_result": 0.7,
        "chat": 0.6,
        "feedback": 0.8,
        "supervisor_analysis": 0.9
    }
    
    base_importance = importance_weights.get(event_type, 0.5)
    
    # افزایش اهمیت بر اساس کلمات کلیدی
    important_keywords = ["مهم", "حیاتی", "تغییر", "تصمیم", "احساس", "نتیجه"]
    keyword_boost = sum(1 for keyword in important_keywords if keyword in content) * 0.1
    
    return min(base_importance + keyword_boost, 1.0)

def extract_emotion(content):
    """استخراج احساس از محتوا"""
    emotion_keywords = {
        "خوشحالی": ["خوشحال", "شاد", "راضی", "مثبت"],
        "غم": ["غمگین", "ناراحت", "غم", "اندوه"],
        "اضطراب": ["اضطراب", "نگران", "استرس", "ترس"],
        "عصبانیت": ["عصبانی", "خشم", "ناراضی", "عصبانی"],
        "آرامش": ["آرام", "راحت", "سکون", "آسوده"]
    }
    
    content_lower = content.lower()
    emotions = []
    
    for emotion, keywords in emotion_keywords.items():
        if any(keyword in content_lower for keyword in keywords):
            emotions.append(emotion)
    
    return emotions if emotions else ["خنثی"]

def get_memory_stats():
    """آمار حافظه"""
    memories = load_memory()
    if not memories:
        return {"total": 0}
    
    stats = {
        "total": len(memories),
        "by_type": {},
        "by_emotion": {},
        "recent": len([m for m in memories if 
                      (datetime.now() - datetime.fromisoformat(m["timestamp"])).days <= 7])
    }
    
    for memory in memories:
        # آمار بر اساس نوع
        memory_type = memory.get("type", "unknown")
        stats["by_type"][memory_type] = stats["by_type"].get(memory_type, 0) + 1
        
        # آمار بر اساس احساس
        emotions = memory.get("emotion", ["خنثی"])
        for emotion in emotions:
            stats["by_emotion"][emotion] = stats["by_emotion"].get(emotion, 0) + 1
    
    return stats

def clear_old_memories(days=30):
    """پاک کردن حافظه‌های قدیمی"""
    memories = load_memory()
    cutoff_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
    
    filtered_memories = []
    removed_count = 0
    
    for memory in memories:
        memory_date = datetime.fromisoformat(memory["timestamp"]).timestamp()
        if memory_date > cutoff_date or memory.get("importance", 0) > 0.8:
            filtered_memories.append(memory)
        else:
            removed_count += 1
    
    save_memory(filtered_memories)
    print(f"🧹 {removed_count} حافظه قدیمی پاک شد")
    return removed_count

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("🧠 تست سیستم Neural Memory...")
        
        # اضافه کردن حافظه‌های نمونه
        add_memory("chat", "کاربر احساس غم و اضطراب دارد و نیاز به حمایت دارد", 
                   {"user_id": 1, "session_id": "sess_001"})
        
        add_memory("test_result", "نتیجه تست اضطراب: 75/100 - سطح بالا", 
                   {"test_type": "anxiety", "score": 75})
        
        add_memory("decision", "MetaLearner تصمیم گرفت تمرینات تنفسی پیشنهاد دهد", 
                   {"action": "breathing_exercises", "confidence": 0.85})
        
        # جستجوی حافظه
        print("\n🔍 جستجوی حافظه برای 'احساس غم و اضطراب':")
        results = retrieve_memory("احساس غم و اضطراب")
        for result in results:
            print(f"- {result['memory']['content']} (امتیاز: {result['weighted_score']})")
        
        # آمار حافظه
        print("\n📊 آمار حافظه:")
        stats = get_memory_stats()
        print(f"تعداد کل: {stats['total']}")
        print(f"بر اساس نوع: {stats['by_type']}")
        print(f"بر اساس احساس: {stats['by_emotion']}")
    
    else:
        # API Mode
        command = sys.argv[1]
        
        if command == "add_memory":
            event_type = sys.argv[2]
            content = sys.argv[3]
            metadata = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
            
            result = add_memory(event_type, content, metadata)
            print(json.dumps(result, ensure_ascii=False))
            
        elif command == "retrieve_memory":
            query = sys.argv[2]
            top_k = int(sys.argv[3]) if len(sys.argv) > 3 else 3
            memory_type = sys.argv[4] if len(sys.argv) > 4 else None
            
            results = retrieve_memory(query, top_k, memory_type)
            print(json.dumps(results, ensure_ascii=False))
            
        elif command == "get_memory_stats":
            stats = get_memory_stats()
            print(json.dumps(stats, ensure_ascii=False))
            
        elif command == "clear_old_memories":
            days = int(sys.argv[2]) if len(sys.argv) > 2 else 30
            removed_count = clear_old_memories(days)
            print(json.dumps({"removed_count": removed_count}, ensure_ascii=False))

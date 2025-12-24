"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [retURL, setRetURL] = useState("");

  useEffect(() => {
    // Set return URL to the current origin + /thanks
    if (typeof window !== "undefined") {
      setRetURL(`${window.location.origin}/thanks`);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Basic Validation
    if (!data.company || !data.last_name || !data.first_name || !data.email) {
      setError("必須項目を入力してください。");
      setIsSubmitting(false);
      return;
    }

    // Construct Description from non-mapped fields
    const description = `
【お問い合わせ内容】
${data.message || "なし"}

【詳細情報】
電話番号: ${data.tel || "-"}
用途: ${getUsageLabel(data.usage as string)}
実施時期: ${data.date || "-"}
想定人数: ${getSizeLabel(data.size as string)}
会場/配信: ${getTypeLabel(data.type as string)}
LINE連携: ${data.line === "yes" ? "あり/検討中" : "なし"}
    `.trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          description,
          retURL,
        }),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました。時間をおいて再度お試しください。");
      }

      // Save summary - minimal privacy friendly
      localStorage.setItem("shachihata_lp_contact_summary", JSON.stringify({
          sentAt: new Date().toISOString(),
          name: `${data.last_name} ${data.first_name}`,
          type: data.usage
      }));

      router.push("/thanks");

    } catch (err) {
      console.error(err);
      setError("送信中にエラーが発生しました。");
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-surface border-t border-white/5">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12">
           <span className="text-accent text-sm font-bold tracking-widest uppercase mb-2 block">Contact</span>
           <h2 className="text-3xl font-bold mb-4">お問い合わせ</h2>
           <p className="text-muted text-sm">
             導入のご相談、お見積りなど、お気軽にお問い合わせください。<br/>
             通常1営業日以内に担当者よりご連絡いたします。
           </p>
        </div>

        <form 
            onSubmit={handleSubmit} 
            className="space-y-6 bg-bg p-8 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="space-y-2">
            <label className="text-sm font-bold block">会社名 <span className="text-accent">*</span></label>
            <input name="company" type="text" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="シヤチハタ株式会社" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block">姓 <span className="text-accent">*</span></label>
              <input name="last_name" type="text" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="山田" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">名 <span className="text-accent">*</span></label>
              <input name="first_name" type="text" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="太郎" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block">メールアドレス <span className="text-accent">*</span></label>
              <input name="email" type="email" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="taro@shachihata.co.jp" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">電話番号</label>
              <input name="tel" type="tel" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="052-123-4567" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block">都道府県</label>
              <input name="state" type="text" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="愛知県" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">市区郡</label>
              <input name="city" type="text" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="名古屋市西区" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-sm font-bold block">用途</label>
               <select name="usage" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors">
                 <option value="">選択してください</option>
                 <option value="music">音楽ライブ・コンサート</option>
                 <option value="sports">スポーツイベント</option>
                 <option value="conference">カンファレンス・式典</option>
                 <option value="other">その他</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-sm font-bold block">実施時期（予定）</label>
               <input name="date" type="text" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="2024年10月頃" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
               <label className="text-sm font-bold block">想定人数</label>
               <select name="size" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors">
                 <option value="unknown">未定</option>
                 <option value="small">~500名</option>
                 <option value="medium">~5,000名</option>
                 <option value="large">5,000名~</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-sm font-bold block">会場/配信</label>
               <select name="type" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors">
                 <option value="both">両方</option>
                 <option value="venue">会場のみ</option>
                 <option value="stream">配信のみ</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-sm font-bold block">LINE連携</label>
               <select name="line" className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors">
                 <option value="no">なし</option>
                 <option value="yes">あり / 検討中</option>
               </select>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold block">お問い合わせ内容</label>
             <textarea name="message" rows={4} className="w-full bg-surface2 border border-white/10 rounded-md p-3 focus:border-accent focus:outline-none transition-colors" placeholder="ご自由にご記入ください"></textarea>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-md">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-center">
            <button
               type="submit"
               disabled={isSubmitting}
               className="w-full md:w-auto px-12 py-4 bg-white text-bg font-bold rounded-md hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> 送信中...
                </>
              ) : (
                "送信する"
              )}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

// Helpers for email/description formatting
function getUsageLabel(value: string) {
  switch(value) {
    case "music": return "音楽ライブ・コンサート";
    case "sports": return "スポーツイベント";
    case "conference": return "カンファレンス・式典";
    case "other": return "その他";
    default: return value || "未選択";
  }
}

function getSizeLabel(value: string) {
  switch(value) {
    case "unknown": return "未定";
    case "small": return "~500名";
    case "medium": return "~5,000名";
    case "large": return "5,000名~";
    default: return value || "未定";
  }
}

function getTypeLabel(value: string) {
  switch(value) {
    case "both": return "両方";
    case "venue": return "会場のみ";
    case "stream": return "配信のみ";
    default: return value || "未選択";
  }
}

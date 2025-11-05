"use client";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface TranslatedTextProps {
  textKey: string;
  fallback?: string;
  params?: Record<string, string | number>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function TranslatedText({ 
  textKey, 
  fallback, 
  params, 
  className,
  as: Component = 'span'
}: TranslatedTextProps) {
  const { t, tWithParams } = useTranslation();
  
  const text = params ? tWithParams(textKey, params) : t(textKey, fallback);
  
  return (
    <Component className={className}>
      {text}
    </Component>
  );
}

// کامپوننت‌های کمکی برای استفاده آسان‌تر
export function T({ textKey, fallback, params, className }: Omit<TranslatedTextProps, 'as'>) {
  return <TranslatedText textKey={textKey} fallback={fallback} params={params} className={className} />;
}

export function TranslatedHeading({ textKey, fallback, params, className, level = 1 }: TranslatedTextProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const { t, tWithParams } = useTranslation();
  const text = params ? tWithParams(textKey, params) : t(textKey, fallback);
  
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag className={className}>
      {text}
    </HeadingTag>
  );
}

export function TranslatedButton({ textKey, fallback, params, className, ...props }: TranslatedTextProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { t, tWithParams } = useTranslation();
  const text = params ? tWithParams(textKey, params) : t(textKey, fallback);
  
  return (
    <button className={className} {...props}>
      {text}
    </button>
  );
}

export function TranslatedLink({ textKey, fallback, params, className, href, ...props }: TranslatedTextProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { t, tWithParams } = useTranslation();
  const text = params ? tWithParams(textKey, params) : t(textKey, fallback);
  
  return (
    <a href={href} className={className} {...props}>
      {text}
    </a>
  );
}















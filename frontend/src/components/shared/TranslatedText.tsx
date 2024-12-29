import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  context?: string;
  debounce?: number;
}

export function TranslatedText({
  text,
  as: Component = 'span',
  className,
  context,
  debounce = 300,
}: TranslatedTextProps) {
  const { translatedText, isLoading } = useTranslation(text, { context, debounce });

  if (isLoading) {
    return (
      <Skeleton className={`h-4 inline-block ${className}`} style={{ width: `${text.length * 8}px` }} />
    );
  }

  return (
    <Component className={className}>
      {translatedText}
    </Component>
  );
}
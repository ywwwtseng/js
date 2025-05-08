import { useMemo, createElement, PropsWithChildren } from 'react';
import { useTMA } from './useTMA';

const size_config = {
  '12': { fontSize: '8rem', lineHeight: '1' },
  '11': { fontSize: '6rem', lineHeight: '1' },
  '10': { fontSize: '4.5rem', lineHeight: '1' },
  '9': { fontSize: '3.75rem', lineHeight: '1' },
  '8': { fontSize: '2.25rem', lineHeight: '2.5rem' },
  '7': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  '6': { fontSize: '1.5rem', lineHeight: '2rem' },
  '5': { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '4': { fontSize: '1.125rem', lineHeight: '1.75rem' },
  '3': { fontSize: '1rem', lineHeight: '1.5rem' },
  '2': { fontSize: '0.875rem', lineHeight: '1.25rem' },
  '1': { fontSize: '0.75rem', lineHeight: '1rem' },
};

export interface TypographyProps extends PropsWithChildren {
  variant?: 'heading' | 'text' | 'caption';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'p' | 'b';
  color?: 'currentColor' | 'text.primary' | 'text.secondary' | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: number;
  size?: 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;
  className?: string;
  ellipsis?: boolean;
  lineClamp?: number;
  capitalize?: boolean;
  whitespacePreWrap?: boolean;
  noWrap?: boolean;
  dangerouslySetInnerHTML?: boolean;
  fontFamily?: string;
  i18n: string;
  params?: Record<string, string | number>;
}

const variant_config = {
  heading: {
    as: 'h3',
    weight: 700,
    size: 3,
  },
  text: {
    as: 'p',
    weight: 400,
    size: 3,
  },
  caption: {
    as: 'p',
    weight: 400,
    size: 1,
  },
}

export function Typography({
  variant = 'text',
  as,
  color = 'currentColor',
  align = 'center',
  weight,
  size,
  className,
  ellipsis = false,
  lineClamp,
  capitalize = false,
  whitespacePreWrap = false,
  noWrap = false,
  dangerouslySetInnerHTML,
  i18n,
  params,
  children,
}: TypographyProps) {
  const config = variant_config[variant];
  const { t } = useTMA();
  const text = useMemo(() => {
    if (i18n) {
      return t(i18n, params);
    }

    return children;
  }, [i18n, params, children]);

  return (
    createElement(
      as || config.as,
      {
        className,
        style: {
          textAlign: align,
          color,
          fontWeight: weight || config.weight,
          ...size_config[String(size || config.size) as keyof typeof size_config],
          ...(ellipsis ? { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' } : {}),
          ...(lineClamp ? { WebkitLineClamp: lineClamp, display: '-webkit-box', WebkitBoxOrient: 'vertical',  overflow: 'hidden' } : {}),
          ...(capitalize ? { textTransform: 'capitalize' } : {}),
          ...(whitespacePreWrap ? { whiteSpace: 'pre-wrap' } : {}),
          ...(noWrap ? { whiteSpace: 'nowrap' } : {}),
        },
        ...(dangerouslySetInnerHTML
            ? {
                dangerouslySetInnerHTML: {
                  __html: text,
                }
              }
            : { children: text }
          )
        
      },
    )
  );
}

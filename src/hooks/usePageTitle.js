import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · Zach Waltman Foundation`
      : 'Zach Waltman Foundation';
  }, [title]);
}

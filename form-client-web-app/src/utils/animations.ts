export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: FillMode;
}

export function fadeIn(element: HTMLElement, options: AnimationOptions = {}): Animation {
  const { duration = 300, easing = 'ease-out', delay = 0, fill = 'forwards' } = options;

  return element.animate(
    [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    {
      duration,
      easing,
      delay,
      fill
    }
  );
}

export function slideDown(element: HTMLElement, options: AnimationOptions = {}): Animation {
  const { duration = 300, easing = 'ease-out', delay = 0, fill = 'forwards' } = options;

  const startHeight = 0;
  const endHeight = element.scrollHeight;

  return element.animate(
    [
      {
        height: `${startHeight}px`,
        opacity: 0,
        transform: 'translateY(-10px)'
      },
      { height: `${endHeight}px`, opacity: 1, transform: 'translateY(0)' }
    ],
    {
      duration,
      easing,
      delay,
      fill
    }
  );
}

export function slideUp(element: HTMLElement, options: AnimationOptions = {}): Animation {
  const { duration = 300, easing = 'ease-in', delay = 0, fill = 'forwards' } = options;

  const startHeight = element.scrollHeight;
  const endHeight = 0;

  return element.animate(
    [
      { height: `${startHeight}px`, opacity: 1, transform: 'translateY(0)' },
      {
        height: `${endHeight}px`,
        opacity: 0,
        transform: 'translateY(-10px)'
      }
    ],
    {
      duration,
      easing,
      delay,
      fill
    }
  );
}

export function scaleIn(element: HTMLElement, options: AnimationOptions = {}): Animation {
  const { duration = 200, easing = 'ease-out', delay = 0, fill = 'forwards' } = options;

  return element.animate(
    [
      { opacity: 0, transform: 'scale(0.95)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    {
      duration,
      easing,
      delay,
      fill
    }
  );
}

export function checkPop(element: HTMLElement, options: AnimationOptions = {}): Animation {
  const { duration = 200, easing = 'ease-out', delay = 0, fill = 'forwards' } = options;

  return element.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }],
    {
      duration,
      easing,
      delay,
      fill
    }
  );
}

export function fadeOut(element: HTMLElement, options: AnimationOptions = {}): Animation {
  const { duration = 300, easing = 'ease-in', delay = 0, fill = 'forwards' } = options;

  return element.animate(
    [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-20px)' }
    ],
    {
      duration,
      easing,
      delay,
      fill
    }
  );
}

export function observeIntersection(
  elements: NodeListOf<Element> | Element[],
  callback: (element: Element, isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      callback(entry.target, entry.isIntersecting);
    }
  }, options);

  for (const el of elements) observer.observe(el);

  return observer;
}

export function animateOnScroll(
  selector: string,
  animationFn: (el: HTMLElement) => Animation,
  threshold = 0.1
): IntersectionObserver {
  const elements = document.querySelectorAll(selector);

  return observeIntersection(
    elements,
    (element, isIntersecting) => {
      if (isIntersecting) {
        animationFn(element as HTMLElement);
      }
    },
    { threshold }
  );
}

export function staggeredFadeIn(
  elements: NodeListOf<Element> | Element[],
  staggerDelay = 100,
  options: AnimationOptions = {}
): Animation[] {
  return Array.from(elements).map((el, index) => {
    return fadeIn(el as HTMLElement, {
      ...options,
      delay: index * staggerDelay
    });
  });
}

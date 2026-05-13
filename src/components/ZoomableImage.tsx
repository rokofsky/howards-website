import { useRef } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

type Props = {
  src: string;
  alt: string;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
};

const SWIPE_THRESHOLD = 60;
const EDGE_TOLERANCE = 4;

const ZoomableImage = ({ src, alt, onSwipeNext, onSwipePrev }: Props) => {
  const wrapperRef = useRef<ReactZoomPanPinchRef | null>(null);
  const touchStart = useRef<{ x: number; y: number; t: number; pointers: number } | null>(null);
  const swipedRef = useRef(false);

  const isAtLeftEdge = () => {
    const s = wrapperRef.current?.instance?.transformState;
    if (!s) return true;
    return s.positionX >= -EDGE_TOLERANCE;
  };
  const isAtRightEdge = () => {
    const inst = wrapperRef.current?.instance;
    const s = inst?.transformState;
    const wrap = inst?.wrapperComponent;
    const content = inst?.contentComponent;
    if (!s || !wrap || !content) return true;
    const scaledW = content.offsetWidth * s.scale;
    const minX = wrap.offsetWidth - scaledW;
    return s.positionX <= minX + EDGE_TOLERANCE;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        t: Date.now(),
        pointers: 1,
      };
      swipedRef.current = false;
    } else {
      touchStart.current = null;
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || swipedRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    const scale = wrapperRef.current?.instance?.transformState?.scale ?? 1;
    if (scale <= 1.02) {
      dx < 0 ? onSwipeNext() : onSwipePrev();
      swipedRef.current = true;
      return;
    }
    if (dx < 0 && isAtRightEdge()) {
      onSwipeNext();
      swipedRef.current = true;
    } else if (dx > 0 && isAtLeftEdge()) {
      onSwipePrev();
      swipedRef.current = true;
    }
  };

  return (
    <div
      className="w-full h-[88vh] flex items-center justify-center touch-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <TransformWrapper
        ref={wrapperRef}
        initialScale={1}
        minScale={1}
        maxScale={5}
        doubleClick={{ mode: "toggle", step: 1.8 }}
        wheel={{ step: 0.15 }}
        pinch={{ step: 5 }}
        panning={{ velocityDisabled: false }}
        centerOnInit
        limitToBounds
      >
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!w-full !h-full flex items-center justify-center"
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-w-full max-h-[88vh] object-contain select-none"
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ZoomableImage;

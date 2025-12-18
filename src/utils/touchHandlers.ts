// Utility for handling long-press on mobile devices
import React, { useRef } from 'react';

export function useLongPress(
  onLongPress: (e: React.TouchEvent | React.MouseEvent) => void,
  onClick?: (e: React.TouchEvent | React.MouseEvent) => void,
  { delay = 500 } = {}
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetRef = useRef<EventTarget | null>(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);

  const start = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === 'mousedown' && (e as React.MouseEvent).button !== 0) {
      return; // Only handle left mouse button
    }
    
    // Reset state
    isLongPressRef.current = false;
    hasMovedRef.current = false;
    targetRef.current = e.target;
    
    // Store initial touch position to detect scrolling
    if ('touches' in e && e.touches.length > 0) {
      startPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if ('clientX' in e) {
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!hasMovedRef.current && targetRef.current === e.target) {
        isLongPressRef.current = true;
        onLongPress(e);
        targetRef.current = null;
      }
    }, delay);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startPosRef.current) return;
    
    let currentX: number, currentY: number;
    if ('touches' in e && e.touches.length > 0) {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      currentX = e.clientX;
      currentY = e.clientY;
    } else {
      return;
    }
    
    // If moved more than 10px, consider it a scroll/pan gesture
    const deltaX = Math.abs(currentX - startPosRef.current.x);
    const deltaY = Math.abs(currentY - startPosRef.current.y);
    
    if (deltaX > 10 || deltaY > 10) {
      hasMovedRef.current = true;
      clear();
    }
  };

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    startPosRef.current = null;
  };

  const handleClick = (e: React.TouchEvent | React.MouseEvent) => {
    clear();
    // Only trigger click if:
    // 1. It wasn't a long press
    // 2. The target is still the same
    // 3. User didn't scroll/pan (hasMovedRef is false)
    // 4. onClick is provided
    if (!isLongPressRef.current && !hasMovedRef.current && targetRef.current === e.target && onClick) {
      onClick(e);
    }
    isLongPressRef.current = false;
    hasMovedRef.current = false;
    targetRef.current = null;
  };

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseMove: handleMove,
    onTouchMove: handleMove,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: handleClick,
    onTouchCancel: clear,
  };
}


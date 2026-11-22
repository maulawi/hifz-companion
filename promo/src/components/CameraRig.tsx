import React from 'react';
import {AbsoluteFill} from 'remotion';

type Props = {
  /** 1 = no zoom. */
  zoom?: number;
  /** Point (px) the camera pushes towards; it stays fixed on screen while zooming. */
  focusX?: number;
  focusY?: number;
  /** Additional pan (px, screen space). */
  panX?: number;
  panY?: number;
  /** Slight camera roll (deg). */
  roll?: number;
  children: React.ReactNode;
};

/**
 * 2D camera for a scene: push-ins around a focus point, pans and roll. Pure 2D
 * transforms (no 3D context), so content can safely extend past the frame.
 */
export const CameraRig: React.FC<Props> = ({zoom = 1, focusX = 960, focusY = 540, panX = 0, panY = 0, roll = 0, children}) => (
  <AbsoluteFill
    style={{
      transformOrigin: `${focusX}px ${focusY}px`,
      transform: `translate(${panX}px, ${panY}px) rotate(${roll}deg) scale(${zoom})`,
    }}
  >
    {children}
  </AbsoluteFill>
);

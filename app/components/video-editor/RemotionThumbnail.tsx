'use client'

import { Player } from '@remotion/player'
import { AbsoluteFill, Video } from 'remotion'

const ThumbnailComposition: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill className="bg-black">
    <Video src={src} muted />
  </AbsoluteFill>
)

type RemotionThumbnailProps = {
  src: string
  frame: number
  width: number
  height: number
  durationInFrames: number
  fps: number
}

export function RemotionThumbnail({ src, frame, width, height, durationInFrames, fps }: RemotionThumbnailProps) {
  const clampedFrame = Math.max(0, Math.min(durationInFrames - 1, Math.round(frame)))
  return (
    <Player
      component={ThumbnailComposition}
      inputProps={{ src }}
      durationInFrames={durationInFrames}
      compositionWidth={width}
      compositionHeight={height}
      fps={fps}
      controls={false}
      loop={false}
      showVolumeControls={false}
      autoPlay={false}
      clickToPlay={false}
      allowFullscreen={false}
      doubleClickToFullscreen={false}
      style={{ width: '100%', height: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}
      initialFrame={clampedFrame}
      acknowledgeRemotionLicense
    />
  )
}

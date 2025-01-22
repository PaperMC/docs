export default function FullWidthVideo({ src }: FullWidthVideoProps) {
  return (
    <div>
      <video width="100%" muted loop controls={true}>
        <source src={src} type="video/mp4" />
        Your device does not support video playback
      </video>
    </div>
  );
}

interface FullWidthVideoProps {
  src: string;
}

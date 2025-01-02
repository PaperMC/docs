export default function CenteredImage({ src, width = 0 }: CenteredImageProps) {
  if (width <= 0) {
    return (
      <div
        style={{
          margin: "0 auto",
        }}
      >
        <img src={src}></img>
      </div>
    );
  }

  return (
    <div
      style={{
        width: width + "px",
        margin: "0 auto",
      }}
    >
      <img src={src}></img>
    </div>
  );
}

interface CenteredImageProps {
  src: string;
  width: number;
}

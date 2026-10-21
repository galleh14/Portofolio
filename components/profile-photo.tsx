import Image from "next/image";

type ProfilePhotoProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function ProfilePhoto({ src, alt, priority = false }: ProfilePhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={800}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className="mx-auto aspect-[4/5] w-full max-w-xs rounded-2xl object-cover md:mx-0"
    />
  );
}

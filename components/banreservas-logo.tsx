type Props = {
  className?: string; // Tamaño del contenedor SVG
  imageSrc: string; // Ruta o URL de la imagen (SVG, PNG, etc.)
  title?: string; // Etiqueta accesible
  bgColor?: string; // Color de fondo (default: currentColor)
  rounded?: number; // Radio del borde
};

export default function BanreservasLogo({
  className = "h-10 w-10",
  imageSrc,
  title = "Banreservas Logo",
  bgColor = "currentColor",
  rounded = 8,
}: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Fondo cuadrado redondeado */}
      <rect x="0" y="0" width="100" height="100" rx={rounded} fill={bgColor} />

      {/* Imagen en el centro */}
      <image
        href={imageSrc}
        x="20"
        y="20"
        width="60"
        height="60"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

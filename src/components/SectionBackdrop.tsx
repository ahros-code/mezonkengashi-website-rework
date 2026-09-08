import Image from "next/image";
import { GirihField } from "./Girih";
import s from "./SectionBackdrop.module.css";

type Placement = "right" | "left" | "band";

/**
 * Gives an otherwise plain section something to sit on: a faint khatam lattice,
 * a soft wash in the brand colours, an arch echoing the logo, and optionally a
 * photograph pushed almost all the way back.
 *
 * `placement` varies where the weight falls so no two sections look alike, and
 * `id` must be unique per page because it names the SVG pattern.
 */
export default function SectionBackdrop({
  id,
  placement = "right",
  dark = false,
  photo,
  arc = true,
  tile = 132,
}: {
  id: string;
  placement?: Placement;
  dark?: boolean;
  photo?: string;
  arc?: boolean;
  tile?: number;
}) {
  return (
    <div
      className={`${s.backdrop} ${s[placement]} ${dark ? s.dark : ""}`}
      aria-hidden="true"
    >
      <span className={s.wash} />
      {photo && (
        <span className={s.photo}>
          <Image src={photo} alt="" fill sizes="100vw" quality={45} />
        </span>
      )}
      {arc && <span className={s.arc} />}
      <span className={s.lattice}>
        <GirihField id={`bg-${id}`} tile={tile} strokeWidth={0.9} />
      </span>
    </div>
  );
}

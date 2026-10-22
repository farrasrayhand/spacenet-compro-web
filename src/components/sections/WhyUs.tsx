import type { WhyPoint } from "@/data/company";

type WhyUsProps = {
  points: WhyPoint[];
};

export function WhyUs({ points }: WhyUsProps) {
  return (
    <section aria-labelledby="kenapa-spacenet" className="border-b border-line">
      <div className="wrap py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-bluetext">Kenapa SpaceNet</p>
          <h2 id="kenapa-spacenet" className="mt-3 text-2xl sm:text-3xl">
            Infrastruktur dan layanan yang bisa Anda andalkan
          </h2>
          <p className="measure mt-4 text-base leading-relaxed text-muted">
            Poin di bawah ini sesuai keterangan layanan yang kami sampaikan ke pelanggan. Angka yang
            disebut berasal dari informasi resmi perusahaan.
          </p>
        </div>

        <ul className="mt-10 divide-y divide-line border-t border-line">
          {points.map((point, index) => (
            <li key={point.id} className="grid gap-2 py-5 sm:grid-cols-[3rem_16rem_1fr] sm:gap-6">
              <span className="font-heading text-sm font-bold italic text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold not-italic text-ink">{point.title}</h3>
              <p className="measure text-sm leading-relaxed text-muted">{point.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

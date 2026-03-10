import { EVENT } from "@/lib/constants";

const GOOGLE_STREET_VIEW_URL =
  "https://maps.google.com/maps?q=&layer=c&cbll=48.815411,2.3629773&cbp=12,133.1,0,-2.26,0&z=18&output=svembed";

const GOOGLE_STREET_VIEW_DIRECT_URL =
  "https://www.google.com/maps/place/%C3%89cole+informatique+Paris+-+Epitech/@48.815411,2.3629773,3a,90y,133.1h,92.26t/data=!3m7!1e1!3m5!1stEQy45gPOfOs3sH8eSqUGw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-2.2641509433962312%26panoid%3DtEQy45gPOfOs3sH8eSqUGw%26yaw%3D133.09896517520212!7i16384!8i8192!4m14!1m7!3m6!1s0x47e6717ff972ae09:0x692326b123aa4d9b!2s%C3%89cole+informatique+Paris+-+Epitech!8m2!3d48.8153585!4d2.3630638!16s%2Fm%2F0j3g76j!3m5!1s0x47e6717ff972ae09:0x692326b123aa4d9b!8m2!3d48.8153585!4d2.3630638!16s%2Fm%2F0j3g76j?entry=ttu&g_ep=EgoyMDI2MDMwOS4wIKXMDSoASAFQAw%3D%3D";

export function AccessPlan3D() {
  return (
    <div className="rounded-sm border border-border bg-cream p-4 sm:p-5">
      <div className="rounded-sm border border-purple/20 bg-purple/5 p-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-purple sm:text-sm">
        Google Maps — vue Street View
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border bg-cream-dark px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple">Entrée principale</p>
            <p className="mt-1 text-sm text-heading sm:text-base">Vue Google Maps orientée vers le hall d&apos;accueil</p>
          </div>
          <a
            href={GOOGLE_STREET_VIEW_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full border border-purple/30 bg-surface px-4 py-2 text-sm font-semibold text-purple transition-colors hover:bg-purple/5 sm:w-auto sm:text-xs"
          >
            Ouvrir en plein écran
          </a>
        </div>

        <div className="grid gap-2 border-b border-border bg-surface px-4 py-3 sm:hidden">
          <a
            href={GOOGLE_STREET_VIEW_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-purple px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-light"
          >
            Voir l&apos;entrée en 3D
          </a>
          <a
            href={EVENT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-cream px-4 py-3 text-sm font-semibold text-heading transition-colors hover:border-purple/30 hover:text-purple"
          >
            Ouvrir l&apos;itinéraire
          </a>
          <p className="text-center text-xs text-body">
            Astuce mobile : ouvre en plein écran pour zoomer et repérer plus facilement l&apos;entrée.
          </p>
        </div>

        <iframe
          title="Vue Google Maps Street View de l'entrée principale d'Epitech Paris"
          src={GOOGLE_STREET_VIEW_URL}
          className="h-[320px] w-full sm:h-[460px] xl:h-[560px]"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

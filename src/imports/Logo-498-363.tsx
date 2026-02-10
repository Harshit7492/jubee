import imgWhatsAppImage20260202At104922Photoroom3 from "@/assets/jubee-logo-photoroom-1.png";
import imgWhatsAppImage20260202At104922Photoroom1 from "@/assets/jubee-logo-photoroom-2.png";

function MaskGroup() {
  return (
    <div className="absolute contents left-[38.94px] top-[23.26px]" data-name="Mask group">
      <div className="absolute bg-[#f5f5f5] h-[33.48px] left-[38.94px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[117.063px_33.48px] top-[23.26px] w-[117.062px]" data-name="WhatsApp Image 2026-02-02 at 10.49.22-Photoroom 3" style={{ maskImage: `url('${imgWhatsAppImage20260202At104922Photoroom3}')` }} />
    </div>
  );
}

export default function Logo() {
  return (
    <div className="relative size-full" data-name="Logo">
      <div className="absolute flex h-[54.19px] items-center justify-center left-0 top-0 w-[44.755px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[-0.17deg]">
          <div className="h-[54.059px] relative w-[44.596px]" data-name="WhatsApp Image 2026-02-02 at 10.49.22-Photoroom 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[209.41%] left-[-87.41%] max-w-none top-[-20.86%] w-[253.84%]" src={imgWhatsAppImage20260202At104922Photoroom1} />
            </div>
          </div>
        </div>
      </div>
      <MaskGroup />
    </div>
  );
}
import svgPaths from "./svg-ldervclsq9";

function LineRoundedGift() {
  return (
    <div className="relative shrink-0 size-[22.857px]" data-name="Line Rounded/Gift">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.8571 22.8571">
        <g clipPath="url(#clip0_523_524)" id="Line Rounded/Gift">
          <g id="Vector" />
          <path d={svgPaths.p38140ac0} id="Vector_2" stroke="var(--stroke-0, #897FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.42857" />
          <path d={svgPaths.p3c6a8d80} id="Vector_3" stroke="var(--stroke-0, #897FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.42857" />
          <path d="M11.4286 7.14286V18.5714" id="Vector_4" stroke="var(--stroke-0, #897FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.42857" />
          <path d={svgPaths.p2396980} id="Vector_5" stroke="var(--stroke-0, #897FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.42857" />
          <path d={svgPaths.pc33900} id="Vector_6" stroke="var(--stroke-0, #897FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.42857" />
        </g>
        <defs>
          <clipPath id="clip0_523_524">
            <rect fill="white" height="22.8571" width="22.8571" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper() {
  return (
    <div className="bg-[#edecff] content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]" data-name="Icon Wrapper">
      <LineRoundedGift />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35),inset_0px_4.286px_5.714px_0px_rgba(223,229,255,0.3)]" />
    </div>
  );
}

function TextWrapper() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative whitespace-pre-wrap" data-name="Text Wrapper">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.15] relative shrink-0 text-[#170f49] text-[20px] w-full">Gifts available</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#6f6c8f] text-[14px] w-full">Just enter your email and get instant access.</p>
    </div>
  );
}

function Texts() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Texts">
      <IconWrapper />
      <TextWrapper />
    </div>
  );
}

function PaddingBottom() {
  return <div className="h-[20px] shrink-0 w-full" data-name="Padding bottom" />;
}

function DividerWrap() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Divider-wrap">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 352 1">
        <g id="Divider-wrap">
          <path clipRule="evenodd" d="M352 1H0V0H352V1Z" fill="var(--fill-0, #F1F2F9)" fillRule="evenodd" id="Divider" />
        </g>
      </svg>
    </div>
  );
}

function LineRoundedClose() {
  return (
    <div className="relative shrink-0 size-[15.059px]" data-name="Line Rounded/Close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0588 15.0588">
        <g id="Line Rounded/Close">
          <path d={svgPaths.p3d2f1600} id="Element" stroke="var(--stroke-0, #6F6C8F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27059" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[7.529px] items-center justify-center overflow-clip p-[6.588px] relative rounded-[7.529px] shrink-0 size-[32px]" data-name="Button">
      <div className="-translate-x-1/2 absolute bg-[#fbfbfe] h-[32.941px] left-[calc(50%+0.47px)] opacity-30 top-[-0.47px] w-[34.824px]" data-name="BG" />
      <LineRoundedClose />
    </div>
  );
}

function CloseFloating() {
  return (
    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]" data-name="Close Floating">
      <Button />
    </div>
  );
}

function TopContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="Top Content">
      <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
        <Texts />
        <PaddingBottom />
        <DividerWrap />
        <CloseFloating />
      </div>
    </div>
  );
}

function LineRoundedTag() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Line Rounded/Tag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Line Rounded/Tag">
          <path d={svgPaths.p395b000} fill="var(--stroke-0, #6F6C8F)" id="Element" />
        </g>
      </svg>
    </div>
  );
}

function TextWrapper1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Text Wrapper">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#6f6c8f] text-[14px] text-ellipsis whitespace-nowrap">
        <p className="leading-[1.15] overflow-hidden">CodeBRIX2026</p>
      </div>
    </div>
  );
}

function InputLeft() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative z-[2]" data-name="Input Left">
      <LineRoundedTag />
      <TextWrapper1 />
    </div>
  );
}

function InputRight() {
  return <div className="content-stretch flex gap-[12px] items-center justify-end shrink-0 z-[1]" data-name="Input Right" />;
}

function InputField() {
  return (
    <div className="bg-[#fbfbfe] h-[44px] min-h-[44px] relative rounded-[14px] shrink-0 w-full" data-name="Input Field">
      <div aria-hidden="true" className="absolute border border-[#f1f2f9] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0.5px_1px_0px_rgba(25,33,61,0.04)]" />
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex isolate items-center justify-between min-h-[inherit] px-[16px] py-[8px] relative size-full">
          <InputLeft />
          <InputRight />
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#170f49] text-[14px] w-full">
        <p className="leading-[1.15] whitespace-pre-wrap">Cuppon code:</p>
      </div>
      <InputField />
    </div>
  );
}

function Inputs1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Inputs">
      <Input />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_523_521)" id="Icon">
          <path d={svgPaths.p22dacb00} id="Icon_2" stroke="var(--stroke-0, #A0A3BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_523_521">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip p-[10px] relative rounded-[8px] shrink-0" data-name="Button">
      <Icon />
    </div>
  );
}

function Inputs() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Inputs">
      <Inputs1 />
      <Button1 />
    </div>
  );
}

function BotContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="Bot Content">
      <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative w-full">
        <Inputs />
      </div>
    </div>
  );
}

function SocialMediaIconSquare() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Social Media Icon Square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Social Media Icon Square">
          <path d={svgPaths.p1f388228} fill="var(--fill-0, white)" id="Apple TV+ Logotype" />
        </g>
      </svg>
    </div>
  );
}

function Buttons() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#897fff] gap-[6px] h-[40px] items-center justify-center min-h-[32px] px-[14px] py-[12px] relative rounded-[12px] shrink-0 to-[#4a3aff] w-[170px]" data-name="Buttons">
      <div aria-hidden="true" className="absolute border-[#897fff] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px] shadow-[0px_2px_3px_0px_rgba(55,52,209,0.21)]" />
      <SocialMediaIconSquare />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[1.15]">Apple iOS</p>
      </div>
      <div className="absolute inset-[-0.5px] pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_2px_0px_rgba(80,70,189,0.6),inset_0px_1px_1px_0px_rgba(255,255,255,0.35),inset_0px_3px_4px_0px_rgba(223,229,255,0.3)]" />
    </div>
  );
}

function ButtonsRow() {
  return (
    <div className="relative shrink-0 w-full" data-name="Buttons Row">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pb-[24px] px-[24px] relative w-full">
          <Buttons />
        </div>
      </div>
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Actions">
      <ButtonsRow />
    </div>
  );
}

function LineRoundedClose1() {
  return (
    <div className="relative shrink-0 size-[15.059px]" data-name="Line Rounded/Close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0588 15.0588">
        <g id="Line Rounded/Close">
          <path d={svgPaths.p3d2f1600} id="Element" stroke="var(--stroke-0, #6F6C8F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27059" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[7.529px] items-center justify-center overflow-clip p-[6.588px] relative rounded-[7.529px] shrink-0 size-[32px]" data-name="Button">
      <div className="-translate-x-1/2 absolute bg-[#fbfbfe] h-[32.941px] left-[calc(50%+0.47px)] opacity-30 top-[-0.47px] w-[34.824px]" data-name="BG" />
      <LineRoundedClose1 />
    </div>
  );
}

function CloseFloating1() {
  return (
    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-0" data-name="Close Floating">
      <Button2 />
    </div>
  );
}

export default function PopupV() {
  return (
    <div className="bg-white relative rounded-[20px] size-full" data-name="Popup/V9">
      <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
        <TopContent />
        <BotContent />
        <Actions />
        <CloseFloating1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f1f2f9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(111,108,143,0.12),0px_3px_12px_-2px_rgba(170,170,190,0.06)]" />
    </div>
  );
}
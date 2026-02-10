import svgPaths from "./svg-g7zwvmf5q4";
import imgJubeeLogo3 from "@/assets/jubee-logo-alt.png";
import imgJubeeLogo1 from "@/assets/jubee-logo-main.png";
import imgAvatar from "@/assets/avatar-placeholder.png";

function CasesDashboard() {
  return <div className="absolute bg-[#f9fafb] h-[985px] left-[168px] top-0 w-[1272px]" data-name="CasesDashboard" />;
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-[56.25%_0_0_8.05%]" data-name="Mask group">
      <div className="absolute inset-[55.36%_0_0_8.05%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0.572px] mask-size-[78.156px_28px]" data-name="Jubee Logo 3" style={{ maskImage: `url('${imgJubeeLogo3}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 78.1544 28.5714">
          <path d={svgPaths.p3e0c5700} fill="var(--fill-0, white)" id="Jubee Logo 3" />
        </svg>
      </div>
    </div>
  );
}

function JubeeLogo() {
  return (
    <div className="h-[64px] overflow-clip relative shrink-0 w-[85px]" data-name="Jubee Logo 1">
      <div className="absolute inset-[0_63.76%_41.07%_0]" data-name="Jubee Logo 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[252.57%] left-[-14.19%] max-w-none top-[-41.93%] w-[309.13%]" src={imgJubeeLogo1} />
        </div>
      </div>
      <MaskGroup />
    </div>
  );
}

function Collapse() {
  return (
    <div className="h-[16px] relative shrink-0 w-[24px]" data-name="Collapse">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16">
        <g id="Collapse">
          <rect height="15" id="Rectangle 40402" rx="3.5" stroke="var(--stroke-0, white)" width="23" x="0.5" y="0.5" />
          <line id="Line 556" stroke="var(--stroke-0, white)" x1="7.5" x2="7.5" y2="15" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[88px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#555] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[12px] relative size-full">
          <JubeeLogo />
          <Collapse />
        </div>
      </div>
    </div>
  );
}

function SideMenuSection() {
  return (
    <div className="bg-black h-[40px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name=".Side menu section">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[4px] relative size-full">
          <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[#f8c020] text-[12px] tracking-[-0.1px]">CS(COMM) - 706/2025</p>
        </div>
      </div>
    </div>
  );
}

function DotsThreeOutline() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="DotsThreeOutline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="DotsThreeOutline" opacity="0">
          <path d={svgPaths.p15f66b80} fill="var(--fill-0, #94A3B8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[4px] relative w-full">
          <p className="css-ew64yg font-['Figtree:Regular',sans-serif] font-normal leading-[14px] overflow-hidden relative shrink-0 text-[#ababab] text-[14px] text-ellipsis tracking-[0.28px] uppercase">Folders</p>
          <DotsThreeOutline />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Frame">
      <Frame />
    </div>
  );
}

function Component() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g clipPath="url(#clip0_149_10368)" id="fi-rr-folder">
          <path d={svgPaths.pa907e80} fill="var(--fill-0, #BBBBBB)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_149_10368">
            <rect fill="white" height="22" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SideMenuSection1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[16px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[164px]" data-name=".Side menu section">
      <Component />
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[14px] min-h-px min-w-px not-italic relative text-[#bbb] text-[12px]">Petition</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g clipPath="url(#clip0_149_10368)" id="fi-rr-folder">
          <path d={svgPaths.pa907e80} fill="var(--fill-0, #BBBBBB)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_149_10368">
            <rect fill="white" height="22" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SideMenuSection2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[16px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[164px]" data-name=".Side menu section">
      <Component1 />
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[14px] min-h-px min-w-px not-italic relative text-[#bbb] text-[12px]">Applications</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g clipPath="url(#clip0_149_10368)" id="fi-rr-folder">
          <path d={svgPaths.pa907e80} fill="var(--fill-0, #BBBBBB)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_149_10368">
            <rect fill="white" height="22" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SideMenuSection3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[16px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[164px]" data-name=".Side menu section">
      <Component2 />
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[14px] min-h-px min-w-px not-italic relative text-[#bbb] text-[12px]">Orders/Judgements</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g clipPath="url(#clip0_149_10368)" id="fi-rr-folder">
          <path d={svgPaths.pa907e80} fill="var(--fill-0, #BBBBBB)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_149_10368">
            <rect fill="white" height="22" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SideMenuSection4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[16px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[164px]" data-name=".Side menu section">
      <Component3 />
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[14px] min-h-px min-w-px not-italic relative text-[#bbb] text-[12px]">Miscellaneous</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <SideMenuSection1 />
      <SideMenuSection2 />
      <SideMenuSection3 />
      <SideMenuSection4 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame22 />
    </div>
  );
}

function DotsThreeOutline1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="DotsThreeOutline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="DotsThreeOutline" opacity="0">
          <path d={svgPaths.p15f66b80} fill="var(--fill-0, #94A3B8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[4px] relative w-full">
          <p className="css-ew64yg font-['Figtree:Regular',sans-serif] font-normal leading-[14px] overflow-hidden relative shrink-0 text-[#ababab] text-[14px] text-ellipsis tracking-[0.28px] uppercase">Recent Actions</p>
          <DotsThreeOutline1 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Frame">
      <Frame2 />
    </div>
  );
}

function SideMenuSection5() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[16px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[164px]" data-name=".Side menu section">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#bbb] text-[12px]">Translate a Docume..</p>
    </div>
  );
}

function SideMenuSection6() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[16px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[164px]" data-name=".Side menu section">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#bbb] text-[12px]">Summarise a Document...</p>
    </div>
  );
}

function SideMenuSection7() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[16px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[164px]" data-name=".Side menu section">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#bbb] text-[12px]">Pre-Check Court Filing</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <SideMenuSection5 />
      <SideMenuSection6 />
      <SideMenuSection7 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame3 />
      <Frame21 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Frame">
      <Frame23 />
    </div>
  );
}

function GroupSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center justify-center relative shrink-0 w-full" data-name="Group section">
      <SideMenuSection />
      <Frame20 />
      <Frame4 />
    </div>
  );
}

function Avatar() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[30px] shrink-0 size-[24px]" data-name="Avatar">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[30px] size-full" src={imgAvatar} />
    </div>
  );
}

function ParagraphContainer() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Medium',sans-serif] font-medium items-start not-italic pb-[4px] relative shrink-0 text-[12px] tracking-[-0.1px]" data-name="Paragraph container">
      <p className="css-ew64yg leading-[22px] relative shrink-0 text-white">Brian Ford</p>
      <p className="css-ew64yg leading-[20px] relative shrink-0 text-[#dcdcdc]">brianford@lok.com</p>
    </div>
  );
}

function AvatarDescription() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Avatar & description">
      <Avatar />
      <ParagraphContainer />
    </div>
  );
}

function SideMenuHeader() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] h-[46px] items-center px-[16px] relative shrink-0 w-[168px]" data-name=".Side menu header">
      <AvatarDescription />
    </div>
  );
}

function Sections() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Sections">
      <GroupSection />
      <SideMenuHeader />
    </div>
  );
}

function SideMenu() {
  return (
    <div className="absolute bg-[#1c2534] h-[1024px] left-0 top-0 w-[168px]" data-name="Side Menu">
      <div className="content-stretch flex flex-col gap-[24px] items-center overflow-clip py-[24px] relative rounded-[inherit] size-full">
        <Container />
        <Sections />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaebf0] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d="M19 12H5" id="Vector" stroke="var(--stroke-0, #02131C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 19L5 12L12 5" id="Vector_2" stroke="var(--stroke-0, #02131C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="css-ew64yg font-['Figtree:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#101828] text-[18px]">CS(COMM) - 706/2025</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame5 />
      <p className="css-ew64yg font-['Figtree:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#101828] text-[16px]">Property Dispute - Sharma vs Kumar</p>
      <p className="css-ew64yg font-['Figtree:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#444] text-[14px]">High Court of Delhi</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Icon />
      <Frame17 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#101828] h-[48px] relative rounded-[8px] shrink-0 w-[195px]" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[196px] py-[9px] relative size-full">
          <div className="css-g0mm18 flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white">
            <p className="css-ew64yg leading-[16px]">Recent Court Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[48px] relative rounded-[8px] shrink-0 w-[195px]" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[196px] py-[9px] relative size-full">
          <div className="css-g0mm18 flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#101828] text-[16px] text-center">
            <p className="css-ew64yg leading-[16px]">Auto Caveat</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#101828] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Button />
      <Button1 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame18 />
      <Frame19 />
    </div>
  );
}

function ChatBodyInner() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[420px] items-center relative shrink-0 w-full" data-name="Chat Body Inner">
      <Frame15 />
    </div>
  );
}

function FilePdf() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="file-pdf 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="file-pdf 1">
          <path d={svgPaths.p34837800} fill="var(--fill-0, #49454F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#efefef] content-stretch flex items-center p-[8px] relative rounded-[8px] shrink-0">
      <FilePdf />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <p className="css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#2f2f2f] text-[14px] w-full">Court Files-1.pdf</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <Frame8 />
    </div>
  );
}

function IconSet() {
  return (
    <button className="block cursor-pointer relative shrink-0 size-[16px]" data-name="Icon Set">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="fi-rr-cross-small">
          <path d={svgPaths.p2286c400} fill="var(--fill-0, #02131C)" id="Vector" />
        </g>
      </svg>
    </button>
  );
}

function SideMenuSection8() {
  return (
    <div className="bg-[rgba(212,212,212,0.49)] content-stretch flex gap-[16px] items-center justify-center px-[12px] py-[8px] relative rounded-[16px] shrink-0" data-name=".Side menu section">
      <Frame7 />
      <Frame13 />
      <IconSet />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center px-[24px] relative shrink-0">
      <SideMenuSection8 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Instrument_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#49454f] text-[16px] tracking-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="css-ew64yg leading-[24px]">Give me a summary</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plus() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="plus 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="plus 1">
          <rect fill="var(--fill-0, white)" height="32" rx="16" width="32" />
          <path d={svgPaths.p12c30f80} fill="var(--fill-0, #49454F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SettingsSliders() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="settings-sliders 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_149_10340)" id="settings-sliders 1">
          <path d={svgPaths.p2cfc3700} fill="var(--fill-0, #49454F)" id="Vector" />
          <path d={svgPaths.p58aac00} fill="var(--fill-0, #49454F)" id="Vector_2" />
          <path d={svgPaths.p12cde6c0} fill="var(--fill-0, #49454F)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_149_10340">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[24px] shrink-0">
      <SettingsSliders />
      <div className="css-g0mm18 flex flex-col font-['Instrument_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#49454f] text-[16px] tracking-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="css-ew64yg leading-[16px]">Tools</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[24px] items-center overflow-clip relative shrink-0">
      <Plus />
      <Frame11 />
    </div>
  );
}

function PaperPlaneRight() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="PaperPlaneRight">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="PaperPlaneRight">
          <path d={svgPaths.p306a4a00} fill="var(--fill-0, #444444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative w-full">
          <Frame12 />
          <PaperPlaneRight />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame16 />
      <Frame6 />
      <Frame14 />
    </div>
  );
}

function StateLayer() {
  return (
    <div className="bg-[#f4f4f4] content-stretch flex flex-col gap-[12px] items-start justify-center py-[16px] relative rounded-[24px] shrink-0 w-full" data-name="state-layer">
      <Frame9 />
    </div>
  );
}

function BottomInputArea() {
  return (
    <div className="min-w-[264px] relative shrink-0 w-full" data-name="Bottom Input Area">
      <div className="flex flex-col items-center justify-center min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-center justify-center min-w-[inherit] px-[24px] py-[10px] relative w-full">
          <StateLayer />
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#49454f] text-[0px] text-center tracking-[0.25px] w-full">
            <p className="css-4hzbpn text-[14px]">
              <span className="leading-[20px]">Jubee AI</span>
              <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[#49454f] tracking-[0.25px]">{` may display inaccurate info, including about people, so double-check its responses. `}</span>
              <span className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[#49454f] tracking-[0.25px] underline">{`Your privacy & Jubee AI Apps`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[915px] items-center justify-between left-[192px] top-[24px] w-[1224px]">
      <ChatBodyInner />
      <BottomInputArea />
    </div>
  );
}

export default function CaseMainPage() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Case Main Page">
      <CasesDashboard />
      <SideMenu />
      <Frame10 />
    </div>
  );
}